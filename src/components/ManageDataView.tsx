import React, { useState } from 'react';
import { UserRole, DashboardStats, CashTransaction, Member, Schedule, ActiveTab } from '../types';
import { formatRupiah } from '../lib/formatters';
import {
  HardDrive,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface ManageDataViewProps {
  stats: DashboardStats;
  transactions: CashTransaction[];
  members: Member[];
  schedules: Schedule[];
  onNavigate: (tab: ActiveTab) => void;
  onRefreshAll: () => void;
}

export const ManageDataView: React.FC<ManageDataViewProps> = ({
  stats,
  transactions,
  members,
  schedules,
  onNavigate,
  onRefreshAll,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefreshAll();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const membersWithPhotos = members.filter((m) => !!m.photo_url).length;

  return (
    <div id="manage-data-view" className="space-y-6 pb-20 sm:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e3efe7] text-[#1b4332] text-xs font-bold uppercase tracking-wider mb-2 border border-[#bed8c7]">
            <span>👑</span>
            <span>Khusus Pemilik (Control Hub)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1b4332] flex items-center gap-2 font-serif">
            <span>⚙️</span> KELOLA DATA SISTEM
          </h1>
          <p className="text-xs sm:text-sm text-[#52796f] mt-1">
            Pusat kendali dan status tabel database persisten (transaksi kas, anggota, dan jadwal kegiatan).
          </p>
        </div>

        <button
          id="btn-refresh-database"
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="min-h-[42px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#143225] active:scale-[0.98] text-[#f7f5ed] font-bold text-xs shadow-xs transition-all self-start sm:self-center cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''} text-[#84a98c]`} />
          <span>{isRefreshing ? 'Menyinkronkan...' : 'Sinkronkan Database'}</span>
        </button>
      </div>

      {/* Persistence Banner Status */}
      <div className="bg-[#f0f7f3] border border-[#bed8c7] rounded-3xl p-5 sm:p-6 flex items-start gap-4 shadow-2xs">
        <div className="w-12 h-12 rounded-2xl bg-[#d5e7dc] text-[#1b4332] flex items-center justify-center shrink-0 text-xl font-bold border border-[#bed8c7]">
          <HardDrive className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-[#1b4332] text-sm sm:text-base flex items-center gap-2 font-serif flex-wrap">
            <span>Database & Storage Persisten Aktif</span>
            <span className="text-[10px] font-extrabold bg-[#1b4332] text-[#f7f5ed] px-2.5 py-0.5 rounded-full">
              TERVERIFIKASI
            </span>
          </h3>
          <p className="text-xs text-[#364f3d] leading-relaxed">
            Semua mutasi kas (pemasukan & pengeluaran), data profil anggota, foto tersimpan di server storage, dan agenda kegiatan tersimpan di database persisten server. Data tidak akan hilang saat browser di-refresh, dibuka dari perangkat lain, ataupun setelah logout.
          </p>
        </div>
      </div>

      {/* 3 Core Tables Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Table: cash_transactions */}
        <div className="bg-[#fcfbf7] rounded-3xl border border-[#ded7c5] p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#e3efe7] text-[#1b4332] flex items-center justify-center text-lg font-bold border border-[#b8dbc2]">
                  💰
                </div>
                <div>
                  <h4 className="font-bold text-[#1b4332] text-sm font-serif">cash_transactions</h4>
                  <p className="text-[11px] text-[#52796f]">Tabel Transaksi Kas</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#eeeae0] text-[#3d5a45] border border-[#ded7c5]">
                {transactions.length} baris
              </span>
            </div>

            <div className="space-y-2 text-xs text-[#364f3d] bg-[#f7f5ed] p-3.5 rounded-2xl border border-[#ded7c5] mb-4">
              <div className="flex justify-between">
                <span>Total Saldo:</span>
                <span className="font-bold text-[#1b4332]">{formatRupiah(stats.total_balance)}</span>
              </div>
              <div className="flex justify-between">
                <span>Pemasukan:</span>
                <span className="font-semibold text-[#1b4332]">+{formatRupiah(stats.total_income)}</span>
              </div>
              <div className="flex justify-between">
                <span>Pengeluaran:</span>
                <span className="font-semibold text-[#8a3333]">-{formatRupiah(stats.total_expense)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('uang_kas')}
            className="w-full min-h-[42px] inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-[#e4efe8] hover:bg-[#d5e7dc] text-[#1b4332] font-bold text-xs transition-colors cursor-pointer border border-[#bed8c7]"
          >
            <span>Kelola Uang Kas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Table: members */}
        <div className="bg-[#fcfbf7] rounded-3xl border border-[#ded7c5] p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#e3efe7] text-[#1b4332] flex items-center justify-center text-lg font-bold border border-[#b8dbc2]">
                  👥
                </div>
                <div>
                  <h4 className="font-bold text-[#1b4332] text-sm font-serif">members</h4>
                  <p className="text-[11px] text-[#52796f]">Tabel Data Anggota</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#eeeae0] text-[#3d5a45] border border-[#ded7c5]">
                {members.length} profil
              </span>
            </div>

            <div className="space-y-2 text-xs text-[#364f3d] bg-[#f7f5ed] p-3.5 rounded-2xl border border-[#ded7c5] mb-4">
              <div className="flex justify-between">
                <span>Total Anggota:</span>
                <span className="font-bold text-[#1b4332]">{members.length} Orang</span>
              </div>
              <div className="flex justify-between">
                <span>Foto Terunggah:</span>
                <span className="font-semibold text-[#1b4332]">{membersWithPhotos} Foto</span>
              </div>
              <div className="flex justify-between">
                <span>Foto Placeholder:</span>
                <span className="font-semibold text-[#52796f]">{members.length - membersWithPhotos} Orang</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('kenali_kami')}
            className="w-full min-h-[42px] inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-[#e4efe8] hover:bg-[#d5e7dc] text-[#1b4332] font-bold text-xs transition-colors cursor-pointer border border-[#bed8c7]"
          >
            <span>Kelola Anggota & Foto</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Table: schedules */}
        <div className="bg-[#fcfbf7] rounded-3xl border border-[#ded7c5] p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#e3efe7] text-[#1b4332] flex items-center justify-center text-lg font-bold border border-[#b8dbc2]">
                  📅
                </div>
                <div>
                  <h4 className="font-bold text-[#1b4332] text-sm font-serif">schedules</h4>
                  <p className="text-[11px] text-[#52796f]">Tabel Rencana Jadwal</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#eeeae0] text-[#3d5a45] border border-[#ded7c5]">
                {schedules.length} agenda
              </span>
            </div>

            <div className="space-y-2 text-xs text-[#364f3d] bg-[#f7f5ed] p-3.5 rounded-2xl border border-[#ded7c5] mb-4">
              <div className="flex justify-between">
                <span>Jadwal Mendatang:</span>
                <span className="font-bold text-[#1b4332]">{stats.upcoming_schedule_count} Kegiatan</span>
              </div>
              <div className="flex justify-between">
                <span>Total Agenda:</span>
                <span className="font-semibold text-[#1b2b20]">{schedules.length} Kegiatan</span>
              </div>
              <div className="flex justify-between">
                <span>Tampilan:</span>
                <span className="font-semibold text-[#52796f]">Card & Kalender</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('rencana_jadwal')}
            className="w-full min-h-[42px] inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-[#e4efe8] hover:bg-[#d5e7dc] text-[#1b4332] font-bold text-xs transition-colors cursor-pointer border border-[#bed8c7]"
          >
            <span>Kelola Rencana Jadwal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Security & Access Rights Matrix */}
      <div className="bg-[#fcfbf7] rounded-3xl border border-[#ded7c5] p-5 sm:p-7 shadow-2xs">
        <h3 className="text-base sm:text-lg font-bold text-[#1b4332] mb-1.5 flex items-center gap-2 font-serif">
          <span>🛡️</span> Matriks Hak Akses & Keamanan Sistem
        </h3>
        <p className="text-xs text-[#52796f] mb-4">
          Backend memvalidasi token otorisasi secara ketat pada setiap request mutasi (POST, PUT, DELETE, UPLOAD).
        </p>

        {/* Mobile View: Card List */}
        <div className="block sm:hidden space-y-3">
          {[
            { feature: 'Lihat Saldo Kas & Statistik', owner: 'Diizinkan', visitor: 'Diizinkan', note: 'Transparansi publik' },
            { feature: 'Lihat Tanggal & Riwayat Kas', owner: 'Diizinkan', visitor: 'Diizinkan', note: 'Detail kas terbaca jelas' },
            { feature: 'Tambah & Kurangi Kas', owner: 'Diizinkan', visitor: 'Diblokir', note: 'Token pemilik; validasi saldo > 0' },
            { feature: 'Edit & Hapus Transaksi', owner: 'Diizinkan', visitor: 'Diblokir', note: 'Hitung ulang saldo otomatis' },
            { feature: 'Upload / Hapus Foto Anggota', owner: 'Diizinkan', visitor: 'Diblokir', note: 'Storage server lokal persisten' },
            { feature: 'Buat & Edit Jadwal Kegiatan', owner: 'Diizinkan', visitor: 'Diblokir', note: 'Agenda kelompok Money Gong' },
          ].map((item, idx) => (
            <div key={idx} className="p-3 bg-[#f7f5ed] rounded-2xl border border-[#ded7c5] text-xs">
              <div className="font-bold text-[#1b4332] font-serif mb-1">{item.feature}</div>
              <div className="flex items-center justify-between text-[11px] py-1 border-t border-[#ded7c5]/50">
                <span className="text-[#52796f]">👑 Pemilik:</span>
                <span className="font-bold text-[#1b4332]">✅ {item.owner}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] py-1 border-t border-[#ded7c5]/50">
                <span className="text-[#52796f]">👤 Pengunjung:</span>
                <span className={`font-bold ${item.visitor === 'Diizinkan' ? 'text-[#1b4332]' : 'text-[#8a3333]'}`}>
                  {item.visitor === 'Diizinkan' ? '✅' : '❌'} {item.visitor}
                </span>
              </div>
              <div className="text-[10px] text-[#52796f] mt-1 pt-1 border-t border-[#ded7c5]/50 italic">
                {item.note}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f7f5ed] border-b border-[#ded7c5] text-[#1b4332] font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Fitur Aplikasi</th>
                <th className="py-3 px-4 text-center">👑 Pemilik (dika)</th>
                <th className="py-3 px-4 text-center">👤 Pengunjung (Publik)</th>
                <th className="py-3 px-4">Keterangan Keamanan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ded7c5] font-medium">
              <tr>
                <td className="py-3 px-4 font-semibold text-[#1b2b20]">Melihat Saldo Kas & Statistik</td>
                <td className="py-3 px-4 text-center text-[#1b4332] font-bold">✅ Diizinkan</td>
                <td className="py-3 px-4 text-center text-[#1b4332] font-bold">✅ Diizinkan</td>
                <td className="py-3 px-4 text-[#52796f]">Transparansi publik untuk semua pihak</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-[#1b2b20]">Melihat Tanggal & Penjelasan Transaksi</td>
                <td className="py-3 px-4 text-center text-[#1b4332] font-bold">✅ Diizinkan</td>
                <td className="py-3 px-4 text-center text-[#1b4332] font-bold">✅ Diizinkan</td>
                <td className="py-3 px-4 text-[#52796f]">Informasi detail kas terbaca jelas</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-[#1b2b20]">Tambah & Kurangi Kas</td>
                <td className="py-3 px-4 text-center text-[#1b4332] font-bold">✅ Diizinkan</td>
                <td className="py-3 px-4 text-center text-[#8a3333] font-bold">❌ Diblokir Backend</td>
                <td className="py-3 px-4 text-[#52796f]">Memerlukan token pemilik; validasi saldo &gt; 0</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-[#1b2b20]">Edit & Hapus Transaksi</td>
                <td className="py-3 px-4 text-center text-[#1b4332] font-bold">✅ Diizinkan</td>
                <td className="py-3 px-4 text-center text-[#8a3333] font-bold">❌ Diblokir Backend</td>
                <td className="py-3 px-4 text-[#52796f]">Hitung ulang saldo otomatis</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-[#1b2b20]">Upload, Ganti, Hapus Foto Anggota</td>
                <td className="py-3 px-4 text-center text-[#1b4332] font-bold">✅ Diizinkan</td>
                <td className="py-3 px-4 text-center text-[#8a3333] font-bold">❌ Diblokir Backend</td>
                <td className="py-3 px-4 text-[#52796f]">Tersimpan di persistent storage server</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-[#1b2b20]">Buat, Edit, Hapus Jadwal Kegiatan</td>
                <td className="py-3 px-4 text-center text-[#1b4332] font-bold">✅ Diizinkan</td>
                <td className="py-3 px-4 text-center text-[#8a3333] font-bold">❌ Diblokir Backend</td>
                <td className="py-3 px-4 text-[#52796f]">Direncanakan / Berlangsung / Selesai</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
