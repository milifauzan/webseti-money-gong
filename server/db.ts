import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface CashTransaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  transaction_date: string;
  description: string;
  balance_after: number;
  created_at: string;
  updated_at: string;
}

export interface Member {
  id: string;
  name: string;
  position: string;
  description: string;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Schedule {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  status: 'Direncanakan' | 'Berlangsung' | 'Selesai' | 'Dibatalkan';
  created_at: string;
  updated_at: string;
}

export interface DatabaseSchema {
  owner: {
    username: string;
    passwordHash: string;
    salt: string;
  };
  sessions: { [token: string]: { username: string; expiresAt: number } };
  cash_transactions: CashTransaction[];
  members: Member[];
  schedules: Schedule[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data and uploads directory exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export { UPLOADS_DIR };

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

const INITIAL_MEMBERS: Member[] = [
  {
    id: 'member-1',
    name: 'Den Bau',
    position: 'Ketua',
    description: 'Ketua kelompok Money Gong yang bertanggung jawab memimpin koordinasi dan keterbukaan kas.',
    photo_url: null,
    created_at: '2026-09-01T08:00:00.000Z',
    updated_at: '2026-09-01T08:00:00.000Z',
  },
  {
    id: 'member-2',
    name: 'Dika Bau',
    position: 'Anggota',
    description: 'Anggota aktif pengelola keuangan kas dan administrasi kelompok.',
    photo_url: null,
    created_at: '2026-09-01T08:00:00.000Z',
    updated_at: '2026-09-01T08:00:00.000Z',
  },
  {
    id: 'member-3',
    name: 'Mi Bau',
    position: 'Anggota',
    description: 'Anggota pendukung perencanaan kegiatan dan operasional.',
    photo_url: null,
    created_at: '2026-09-01T08:00:00.000Z',
    updated_at: '2026-09-01T08:00:00.000Z',
  },
  {
    id: 'member-4',
    name: 'Gen Bau',
    position: 'Anggota',
    description: 'Anggota divisi perlengkapan dan logistik acara kelompok.',
    photo_url: null,
    created_at: '2026-09-01T08:00:00.000Z',
    updated_at: '2026-09-01T08:00:00.000Z',
  },
  {
    id: 'member-5',
    name: 'Fid Bau',
    position: 'Anggota',
    description: 'Anggota dokumentasi dan pengawasan kegiatan.',
    photo_url: null,
    created_at: '2026-09-01T08:00:00.000Z',
    updated_at: '2026-09-01T08:00:00.000Z',
  },
  {
    id: 'member-6',
    name: 'Ras Bau',
    position: 'Anggota',
    description: 'Anggota pendukung komunikasi dan hubungan antar anggota.',
    photo_url: null,
    created_at: '2026-09-01T08:00:00.000Z',
    updated_at: '2026-09-01T08:00:00.000Z',
  },
  {
    id: 'member-7',
    name: 'Raf Bau',
    position: 'Anggota',
    description: 'Anggota operasional dan pendamping kegiatan lapangan.',
    photo_url: null,
    created_at: '2026-09-01T08:00:00.000Z',
    updated_at: '2026-09-01T08:00:00.000Z',
  },
  {
    id: 'member-8',
    name: 'Apr Bau',
    position: 'Anggota',
    description: 'Anggota perencana konsumsi dan rekreasi kelompok.',
    photo_url: null,
    created_at: '2026-09-01T08:00:00.000Z',
    updated_at: '2026-09-01T08:00:00.000Z',
  },
];

const INITIAL_SCHEDULES: Schedule[] = [
  {
    id: 'sch-1',
    title: 'Rapat Kelompok',
    date: '2026-09-20',
    time: '15:00',
    location: 'Rumah Dika',
    description: 'Membahas rencana kegiatan kelompok dan evaluasi kas bulanan.',
    status: 'Direncanakan',
    created_at: '2026-09-10T10:00:00.000Z',
    updated_at: '2026-09-10T10:00:00.000Z',
  },
  {
    id: 'sch-2',
    title: 'Kerja Bakti & Olahraga Bersama',
    date: '2026-09-27',
    time: '07:30',
    location: 'Lapangan Komunitas',
    description: 'Kegiatan kebersamaan anggota kelompok untuk mempererat silaturahmi.',
    status: 'Direncanakan',
    created_at: '2026-09-11T09:00:00.000Z',
    updated_at: '2026-09-11T09:00:00.000Z',
  },
];

function getInitialDb(): DatabaseSchema {
  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword('amanah', salt);

  return {
    owner: {
      username: 'dika',
      passwordHash,
      salt,
    },
    sessions: {},
    cash_transactions: [],
    members: INITIAL_MEMBERS,
    schedules: INITIAL_SCHEDULES,
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (!parsed.members || parsed.members.length === 0) {
          parsed.members = INITIAL_MEMBERS;
        }
        if (!parsed.schedules) {
          parsed.schedules = INITIAL_SCHEDULES;
        }
        if (!parsed.cash_transactions) {
          parsed.cash_transactions = [];
        }
        if (!parsed.sessions) {
          parsed.sessions = {};
        }
        return parsed;
      } catch (err) {
        console.error('Error reading db.json, initializing fresh database:', err);
      }
    }
    const fresh = getInitialDb();
    this.saveImmediate(fresh);
    return fresh;
  }

  private saveImmediate(dataToSave: DatabaseSchema) {
    const tempFile = `${DB_FILE}.${Date.now()}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(dataToSave, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  }

  public save() {
    this.saveImmediate(this.data);
  }

  // --- AUTH ---
  public verifyOwner(username: string, password: string):boolean {
    if (username !== this.data.owner.username) return false;
    const computed = hashPassword(password, this.data.owner.salt);
    return computed === this.data.owner.passwordHash;
  }

  public createSession(username: string): string {
    const token = crypto.randomBytes(32).toString('hex');
    // Valid for 7 days
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
    this.data.sessions[token] = { username, expiresAt };
    this.save();
    return token;
  }

  public validateSession(token: string | undefined): boolean {
    if (!token) return false;
    const session = this.data.sessions[token];
    if (!session) return false;
    if (Date.now() > session.expiresAt) {
      delete this.data.sessions[token];
      this.save();
      return false;
    }
    return true;
  }

  public removeSession(token: string) {
    if (this.data.sessions[token]) {
      delete this.data.sessions[token];
      this.save();
    }
  }

  // --- CASH TRANSACTIONS ---
  public recalculateBalances() {
    // Sort transactions by date ascending, then created_at ascending
    const sorted = [...this.data.cash_transactions].sort((a, b) => {
      const dateDiff = new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime();
      if (dateDiff !== 0) return dateDiff;
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

    let runningBalance = 0;
    for (const tx of sorted) {
      if (tx.type === 'income') {
        runningBalance += tx.amount;
      } else {
        runningBalance -= tx.amount;
      }
      tx.balance_after = runningBalance;
    }

    // Update in memory
    const map = new Map<string, CashTransaction>();
    sorted.forEach((t) => map.set(t.id, t));
    this.data.cash_transactions = this.data.cash_transactions.map((t) => map.get(t.id) || t);
  }

  public getTotalBalance(): number {
    return this.data.cash_transactions.reduce((acc, tx) => {
      return tx.type === 'income' ? acc + tx.amount : acc - tx.amount;
    }, 0);
  }

  public getCashSummary() {
    let income = 0;
    let expense = 0;
    for (const tx of this.data.cash_transactions) {
      if (tx.type === 'income') income += tx.amount;
      else expense += tx.amount;
    }
    return {
      total_balance: income - expense,
      total_income: income,
      total_expense: expense,
      transaction_count: this.data.cash_transactions.length,
    };
  }

  public getTransactions(): CashTransaction[] {
    // Return sorted newest first (by date desc, then created_at desc)
    return [...this.data.cash_transactions].sort((a, b) => {
      const dateDiff = new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime();
      if (dateDiff !== 0) return dateDiff;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }

  public addTransaction(type: 'income' | 'expense', amount: number, transaction_date: string, description: string): CashTransaction {
    const currentBalance = this.getTotalBalance();
    if (type === 'expense' && currentBalance < amount) {
      throw new Error('Saldo kas tidak mencukupi.');
    }

    const now = new Date().toISOString();
    const newTx: CashTransaction = {
      id: `tx-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      type,
      amount,
      transaction_date,
      description,
      balance_after: 0,
      created_at: now,
      updated_at: now,
    };

    this.data.cash_transactions.push(newTx);
    this.recalculateBalances();
    this.save();

    return this.data.cash_transactions.find((t) => t.id === newTx.id)!;
  }

  public updateTransaction(
    id: string,
    updates: { type: 'income' | 'expense'; amount: number; transaction_date: string; description: string }
  ): CashTransaction {
    const index = this.data.cash_transactions.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error('Transaksi tidak ditemukan.');
    }

    // Temporarily apply to check if overall balance remains >= 0
    const original = { ...this.data.cash_transactions[index] };
    this.data.cash_transactions[index] = {
      ...original,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    this.recalculateBalances();

    // Check if any balance dips below 0
    const hasNegative = this.data.cash_transactions.some((t) => t.balance_after < 0);
    if (hasNegative) {
      this.data.cash_transactions[index] = original;
      this.recalculateBalances();
      throw new Error('Perubahan gagal: Saldo kas tidak mencukupi untuk transaksi ini.');
    }

    this.save();
    return this.data.cash_transactions[index];
  }

  public deleteTransaction(id: string): boolean {
    const index = this.data.cash_transactions.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error('Transaksi tidak ditemukan.');
    }

    const removed = this.data.cash_transactions.splice(index, 1)[0];
    this.recalculateBalances();

    // Check if deleting an income causes future balances to go negative
    const hasNegative = this.data.cash_transactions.some((t) => t.balance_after < 0);
    if (hasNegative) {
      this.data.cash_transactions.splice(index, 0, removed);
      this.recalculateBalances();
      throw new Error('Transaksi tidak dapat dihapus karena menyebabkan saldo pengeluaran berikutnya menjadi minus.');
    }

    this.save();
    return true;
  }

  // --- MEMBERS ---
  public getMembers(): Member[] {
    return this.data.members;
  }

  public getMemberById(id: string): Member | undefined {
    return this.data.members.find((m) => m.id === id);
  }

  public addMember(name: string, position: string, description: string, photo_url: string | null = null): Member {
    const now = new Date().toISOString();
    const newMember: Member = {
      id: `member-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      name,
      position,
      description,
      photo_url,
      created_at: now,
      updated_at: now,
    };
    this.data.members.push(newMember);
    this.save();
    return newMember;
  }

  public updateMember(id: string, updates: Partial<Pick<Member, 'name' | 'position' | 'description' | 'photo_url'>>): Member {
    const member = this.getMemberById(id);
    if (!member) {
      throw new Error('Anggota tidak ditemukan.');
    }
    Object.assign(member, updates, { updated_at: new Date().toISOString() });
    this.save();
    return member;
  }

  public deleteMember(id: string): boolean {
    const index = this.data.members.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new Error('Anggota tidak ditemukan.');
    }
    const member = this.data.members[index];
    if (member.photo_url && member.photo_url.startsWith('/uploads/')) {
      const fileName = path.basename(member.photo_url);
      const filePath = path.join(UPLOADS_DIR, fileName);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.error('Error deleting photo file:', e);
        }
      }
    }
    this.data.members.splice(index, 1);
    this.save();
    return true;
  }

  // --- SCHEDULES ---
  public getSchedules(): Schedule[] {
    return [...this.data.schedules].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }

  public addSchedule(
    title: string,
    date: string,
    time: string,
    location: string,
    description: string,
    status: Schedule['status']
  ): Schedule {
    const now = new Date().toISOString();
    const newSchedule: Schedule = {
      id: `sch-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      title,
      date,
      time,
      location,
      description,
      status,
      created_at: now,
      updated_at: now,
    };
    this.data.schedules.push(newSchedule);
    this.save();
    return newSchedule;
  }

  public updateSchedule(id: string, updates: Partial<Omit<Schedule, 'id' | 'created_at' | 'updated_at'>>): Schedule {
    const schedule = this.data.schedules.find((s) => s.id === id);
    if (!schedule) {
      throw new Error('Jadwal tidak ditemukan.');
    }
    Object.assign(schedule, updates, { updated_at: new Date().toISOString() });
    this.save();
    return schedule;
  }

  public deleteSchedule(id: string): boolean {
    const index = this.data.schedules.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error('Jadwal tidak ditemukan.');
    }
    this.data.schedules.splice(index, 1);
    this.save();
    return true;
  }

  // --- STATS ---
  public getStats() {
    const cashSummary = this.getCashSummary();
    const memberCount = this.data.members.length;
    // upcoming schedules are those with status 'Direncanakan' or 'Berlangsung'
    const upcomingScheduleCount = this.data.schedules.filter(
      (s) => s.status === 'Direncanakan' || s.status === 'Berlangsung'
    ).length;

    return {
      total_balance: cashSummary.total_balance,
      total_income: cashSummary.total_income,
      total_expense: cashSummary.total_expense,
      member_count: memberCount,
      upcoming_schedule_count: upcomingScheduleCount,
      total_transactions: cashSummary.transaction_count,
    };
  }
}

export const db = new Database();
