import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { db, UPLOADS_DIR } from './server/db.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// API health route
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', app: 'Money Gong' });
});

// Serve uploaded member photos
app.use('/uploads', express.static(UPLOADS_DIR));

// Configure multer for persistent member photo uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `member-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/i;
    const isMimeValid = allowed.test(file.mimetype);
    const isExtValid = allowed.test(path.extname(file.originalname).toLowerCase());
    if (isMimeValid || isExtValid) {
      cb(null, true);
    } else {
      cb(new Error('Format file harus berupa gambar (JPG, PNG, WEBP).'));
    }
  },
});

// Middleware to verify owner authorization
function requireOwner(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Akses ditolak. Tindakan ini hanya diizinkan untuk Pemilik.' });
    return;
  }
  const token = authHeader.split(' ')[1];
  if (!db.validateSession(token)) {
    res.status(401).json({ success: false, message: 'Sesi pemilik telah berakhir atau tidak valid.' });
    return;
  }
  next();
}

// ----------------------------------------------------
// 1. AUTHENTICATION API
// ----------------------------------------------------

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ success: false, message: 'Username dan password wajib diisi.' });
    return;
  }

  const isValid = db.verifyOwner(String(username).trim(), String(password).trim());
  if (!isValid) {
    res.status(401).json({ success: false, message: 'Username atau password salah.' });
    return;
  }

  const token = db.createSession(username);
  res.json({
    success: true,
    message: 'Login berhasil.',
    token,
    role: 'owner',
    user: { username: 'dika', role: 'owner' },
  });
});

app.post('/api/auth/verify', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.json({ valid: false });
    return;
  }
  const token = authHeader.split(' ')[1];
  const isValid = db.validateSession(token);
  res.json({ valid: isValid, role: isValid ? 'owner' : 'visitor' });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    db.removeSession(token);
  }
  res.json({ success: true, message: 'Berhasil keluar.' });
});

// ----------------------------------------------------
// 2. STATS & DASHBOARD API
// ----------------------------------------------------

app.get('/api/stats', (_req: Request, res: Response) => {
  try {
    const stats = db.getStats();
    res.json({ success: true, data: stats });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal memuat ringkasan data.' });
  }
});

// ----------------------------------------------------
// 3. CASH TRANSACTIONS API
// ----------------------------------------------------

app.get('/api/cash/summary', (_req: Request, res: Response) => {
  try {
    const summary = db.getCashSummary();
    res.json({ success: true, data: summary });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan saat memuat ringkasan kas.' });
  }
});

app.get('/api/cash/transactions', (_req: Request, res: Response) => {
  try {
    const transactions = db.getTransactions();
    res.json({ success: true, data: transactions });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan saat memuat riwayat kas.' });
  }
});

app.post('/api/cash/transactions', requireOwner, (req: Request, res: Response) => {
  try {
    const { type, amount, transaction_date, description } = req.body;

    // Field validations
    if (amount === undefined || amount === null || amount === '') {
      res.status(400).json({ success: false, message: 'Jumlah uang wajib diisi.' });
      return;
    }
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      res.status(400).json({ success: false, message: 'Jumlah uang harus lebih dari Rp0.' });
      return;
    }
    if (!transaction_date || !String(transaction_date).trim()) {
      res.status(400).json({ success: false, message: 'Tanggal wajib diisi.' });
      return;
    }
    if (!description || !String(description).trim()) {
      res.status(400).json({ success: false, message: 'Penjelasan wajib diisi.' });
      return;
    }
    if (type !== 'income' && type !== 'expense') {
      res.status(400).json({ success: false, message: 'Jenis transaksi harus berupa pemasukan atau pengeluaran.' });
      return;
    }

    const created = db.addTransaction(type, numAmount, String(transaction_date).trim(), String(description).trim());
    res.status(201).json({
      success: true,
      message: 'Transaksi berhasil disimpan.',
      data: created,
      summary: db.getCashSummary(),
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Terjadi kesalahan saat menyimpan data.' });
  }
});

app.put('/api/cash/transactions/:id', requireOwner, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { type, amount, transaction_date, description } = req.body;

    if (amount === undefined || amount === null || amount === '') {
      res.status(400).json({ success: false, message: 'Jumlah uang wajib diisi.' });
      return;
    }
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      res.status(400).json({ success: false, message: 'Jumlah uang harus lebih dari Rp0.' });
      return;
    }
    if (!transaction_date || !String(transaction_date).trim()) {
      res.status(400).json({ success: false, message: 'Tanggal wajib diisi.' });
      return;
    }
    if (!description || !String(description).trim()) {
      res.status(400).json({ success: false, message: 'Penjelasan wajib diisi.' });
      return;
    }
    if (type !== 'income' && type !== 'expense') {
      res.status(400).json({ success: false, message: 'Jenis transaksi tidak valid.' });
      return;
    }

    const updated = db.updateTransaction(id, {
      type,
      amount: numAmount,
      transaction_date: String(transaction_date).trim(),
      description: String(description).trim(),
    });

    res.json({
      success: true,
      message: 'Transaksi berhasil diperbarui.',
      data: updated,
      summary: db.getCashSummary(),
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Terjadi kesalahan saat menyimpan data.' });
  }
});

app.delete('/api/cash/transactions/:id', requireOwner, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    db.deleteTransaction(id);
    res.json({
      success: true,
      message: 'Transaksi berhasil dihapus.',
      summary: db.getCashSummary(),
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Terjadi kesalahan saat menghapus transaksi.' });
  }
});

// ----------------------------------------------------
// 4. MEMBERS API
// ----------------------------------------------------

app.get('/api/members', (_req: Request, res: Response) => {
  try {
    const members = db.getMembers();
    res.json({ success: true, data: members });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan saat memuat data anggota.' });
  }
});

app.post('/api/members', requireOwner, (req: Request, res: Response) => {
  try {
    const { name, position, description } = req.body;
    if (!name || !String(name).trim()) {
      res.status(400).json({ success: false, message: 'Nama anggota wajib diisi.' });
      return;
    }
    if (!position || !String(position).trim()) {
      res.status(400).json({ success: false, message: 'Jabatan anggota wajib diisi.' });
      return;
    }

    const member = db.addMember(
      String(name).trim(),
      String(position).trim(),
      description ? String(description).trim() : ''
    );
    res.status(201).json({ success: true, message: 'Anggota berhasil ditambahkan.', data: member });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan saat menyimpan data.' });
  }
});

app.put('/api/members/:id', requireOwner, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, position, description } = req.body;

    if (!name || !String(name).trim()) {
      res.status(400).json({ success: false, message: 'Nama anggota wajib diisi.' });
      return;
    }
    if (!position || !String(position).trim()) {
      res.status(400).json({ success: false, message: 'Jabatan anggota wajib diisi.' });
      return;
    }

    const updated = db.updateMember(id, {
      name: String(name).trim(),
      position: String(position).trim(),
      description: description ? String(description).trim() : '',
    });
    res.json({ success: true, message: 'Data anggota berhasil diperbarui.', data: updated });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Terjadi kesalahan saat menyimpan data.' });
  }
});

app.delete('/api/members/:id', requireOwner, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    db.deleteMember(id);
    res.json({ success: true, message: 'Anggota berhasil dihapus.' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Terjadi kesalahan saat menghapus anggota.' });
  }
});

// Member photo upload
app.post('/api/members/:id/photo', requireOwner, (req: Request, res: Response) => {
  upload.single('photo')(req, res, (err: any) => {
    if (err) {
      res.status(400).json({ success: false, message: 'Foto gagal diupload. Silakan coba lagi.' });
      return;
    }

    try {
      const { id } = req.params;
      const member = db.getMemberById(id);
      if (!member) {
        // clean uploaded file
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(404).json({ success: false, message: 'Anggota tidak ditemukan.' });
        return;
      }

      if (!req.file) {
        res.status(400).json({ success: false, message: 'File foto tidak ditemukan.' });
        return;
      }

      // Remove previous photo if it was stored locally
      if (member.photo_url && member.photo_url.startsWith('/uploads/')) {
        const oldFile = path.join(UPLOADS_DIR, path.basename(member.photo_url));
        if (fs.existsSync(oldFile)) {
          try {
            fs.unlinkSync(oldFile);
          } catch (e) {
            console.error('Error removing old photo:', e);
          }
        }
      }

      const photoUrl = `/uploads/${req.file.filename}`;
      const updated = db.updateMember(id, { photo_url: photoUrl });

      res.json({
        success: true,
        message: 'Foto anggota berhasil diupload.',
        data: updated,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Foto gagal diupload. Silakan coba lagi.' });
    }
  });
});

// Member photo deletion
app.delete('/api/members/:id/photo', requireOwner, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const member = db.getMemberById(id);
    if (!member) {
      res.status(404).json({ success: false, message: 'Anggota tidak ditemukan.' });
      return;
    }

    if (member.photo_url && member.photo_url.startsWith('/uploads/')) {
      const oldFile = path.join(UPLOADS_DIR, path.basename(member.photo_url));
      if (fs.existsSync(oldFile)) {
        try {
          fs.unlinkSync(oldFile);
        } catch (e) {
          console.error('Error removing photo file:', e);
        }
      }
    }

    const updated = db.updateMember(id, { photo_url: null });
    res.json({ success: true, message: 'Foto anggota berhasil dihapus.', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan saat menghapus foto.' });
  }
});

// ----------------------------------------------------
// 5. SCHEDULES API
// ----------------------------------------------------

app.get('/api/schedules', (_req: Request, res: Response) => {
  try {
    const schedules = db.getSchedules();
    res.json({ success: true, data: schedules });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan saat memuat rencana jadwal.' });
  }
});

app.post('/api/schedules', requireOwner, (req: Request, res: Response) => {
  try {
    const { title, date, time, location, description, status } = req.body;
    if (!title || !String(title).trim()) {
      res.status(400).json({ success: false, message: 'Nama kegiatan wajib diisi.' });
      return;
    }
    if (!date || !String(date).trim()) {
      res.status(400).json({ success: false, message: 'Tanggal wajib diisi.' });
      return;
    }
    if (!time || !String(time).trim()) {
      res.status(400).json({ success: false, message: 'Waktu wajib diisi.' });
      return;
    }
    if (!location || !String(location).trim()) {
      res.status(400).json({ success: false, message: 'Lokasi wajib diisi.' });
      return;
    }

    const validStatuses = ['Direncanakan', 'Berlangsung', 'Selesai', 'Dibatalkan'];
    const chosenStatus = validStatuses.includes(status) ? status : 'Direncanakan';

    const schedule = db.addSchedule(
      String(title).trim(),
      String(date).trim(),
      String(time).trim(),
      String(location).trim(),
      description ? String(description).trim() : '',
      chosenStatus
    );
    res.status(201).json({ success: true, message: 'Jadwal berhasil ditambahkan.', data: schedule });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan saat menyimpan data.' });
  }
});

app.put('/api/schedules/:id', requireOwner, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, date, time, location, description, status } = req.body;

    if (!title || !String(title).trim()) {
      res.status(400).json({ success: false, message: 'Nama kegiatan wajib diisi.' });
      return;
    }
    if (!date || !String(date).trim()) {
      res.status(400).json({ success: false, message: 'Tanggal wajib diisi.' });
      return;
    }
    if (!time || !String(time).trim()) {
      res.status(400).json({ success: false, message: 'Waktu wajib diisi.' });
      return;
    }
    if (!location || !String(location).trim()) {
      res.status(400).json({ success: false, message: 'Lokasi wajib diisi.' });
      return;
    }

    const updated = db.updateSchedule(id, {
      title: String(title).trim(),
      date: String(date).trim(),
      time: String(time).trim(),
      location: String(location).trim(),
      description: description ? String(description).trim() : '',
      status: status || 'Direncanakan',
    });
    res.json({ success: true, message: 'Jadwal berhasil diperbarui.', data: updated });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Terjadi kesalahan saat menyimpan data.' });
  }
});

app.delete('/api/schedules/:id', requireOwner, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    db.deleteSchedule(id);
    res.json({ success: true, message: 'Jadwal berhasil dihapus.' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Terjadi kesalahan saat menghapus jadwal.' });
  }
});

// ----------------------------------------------------
// 6. VITE MIDDLEWARE & FRONTEND INTEGRATION
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Money Gong server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
