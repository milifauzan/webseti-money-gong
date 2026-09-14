import React from 'react';
import { ActiveTab, DashboardStats, UserRole, CashTransaction, Schedule } from '../types';
import { formatRupiah, formatIndoDate } from '../lib/formatters';
import { getDailyQuote } from '../lib/quotes';
import {
  Coins,
  Users,
  Calendar,
  History,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Clock,
  MapPin,
  Sparkles,
  Quote,
  PlusCircle,
  MinusCircle,
} from 'lucide-react';

interface DashboardViewProps {
  role: UserRole;
  stats: DashboardStats;
  transactions: CashTransaction[];
  schedules: Schedule[];
  onNavigate: (tab: ActiveTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  role,
  stats,
  transactions,
  schedules,
  onNavigate,
}) => {
  const { quote, formattedDate } = getDailyQuote();
  const recentTransactions = transactions.slice(0, 3);
  const upcomingSchedules = schedules
    .filter((s) => s.status === 'Direncanakan' || s.status === 'Berlangsung')
    .slice(0, 2);

  return (
    <div id="dashboard-view-container" className="space-y-6 pb-20 sm:pb-12">
      {/* 1. Hero Section - Classic Dark Forest Green */}
      <section className="relative overflow-hidden rounded-3xl bg-[#1b4332] text-[#f7f5ed] p-6 sm:p-9 shadow-md border border-[#143225]">
        <div className="relative z-10 max-w-3xl">
          {/* Role badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2d5a44] text-[#d8ebd9] text-xs font-semibold mb-3 border border-[#40745a]">
            {role === 'owner' ? (
              <>
                <span>👑</span>
                <span>Mode Pemilik (Akses Penuh)</span>
              </>
            ) : (
              <>
                <span>👤</span>
                <span>Mode Pengunjung (Transparansi Terbuka)</span>
              </>
            )}
          </div>

          <h1
            id="dashboard-hero-title"
            className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight mb-2 font-serif text-[#fdfcf9]"
          >
            💰 MONEY GONG
          </h1>
          <p
            id="dashboard-hero-subtitle"
            className="text-[#cadfcb] text-sm sm:text-lg font-medium mb-6 leading-relaxed max-w-xl"
          >
            “Kelola Kas, Kenali Kami, dan Rencanakan Kegiatan.”
          </p>

          {/* Quick Action Buttons (Touch Friendly) */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <button
              id="btn-quick-lihat-kas"
              type="button"
              onClick={() => onNavigate('uang_kas')}
              className="min-h-[44px] inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-[#f7f5ed] text-[#1b4332] hover:bg-[#eae6d8] active:scale-[0.98] font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
            >
              <Coins className="w-4 h-4 text-[#2d6a4f]" />
              <span>💰 Lihat Uang Kas</span>
            </button>

            <button
              id="btn-quick-kenali-kami"
              type="button"
              onClick={() => onNavigate('kenali_kami')}
              className="min-h-[44px] inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-[#285741] hover:bg-[#346a50] text-[#f7f5ed] font-bold text-xs sm:text-sm border border-[#3e785c] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Users className="w-4 h-4 text-[#98c5a4]" />
              <span>👥 Kenali Kami</span>
            </button>

            <button
              id="btn-quick-lihat-jadwal"
              type="button"
              onClick={() => onNavigate('rencana_jadwal')}
              className="min-h-[44px] inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-[#285741] hover:bg-[#346a50] text-[#f7f5ed] font-bold text-xs sm:text-sm border border-[#3e785c] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#98c5a4]" />
              <span>📅 Jadwal</span>
            </button>
          </div>
        </div>

        {/* Vintage watermarked pattern overlay */}
        <div className="absolute right-4 -bottom-6 text-8xl font-black text-white/5 select-none pointer-events-none font-serif">
          MG
        </div>
      </section>

      {/* 2. QUOTES HARI INI CARD (Section 6, 7, 8, 9) */}
      <section
        id="card-quotes-hari-ini"
        className="relative overflow-hidden bg-[#f4efe4] rounded-2xl p-4 sm:p-5 border border-[#ded7c5] shadow-2xs text-left"
      >
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#e2dcce] text-[#1b4332] flex items-center justify-center shrink-0 border border-[#cfc8b6] mt-0.5">
            <Quote className="w-4 h-4 fill-current opacity-80" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#3d5a45] flex items-center gap-1 font-serif">
                <span>💬</span> QUOTES HARI INI
              </span>
              <span className="text-[11px] font-semibold text-[#5d7363] whitespace-nowrap bg-[#ece6d8] px-2.5 py-0.5 rounded-full border border-[#ded7c5]">
                {formattedDate}
              </span>
            </div>

            <blockquote className="text-sm sm:text-base font-semibold text-[#1b2b20] leading-relaxed italic font-serif">
              “{quote.text}”
            </blockquote>

            <div className="mt-1.5 text-[11px] font-medium text-[#5a7663] flex items-center gap-1.5">
              <span>— {quote.author}</span>
              <span>•</span>
              <span className="capitalize">{quote.theme}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DASHBOARD MOBILE ORDER (Section 5)
          Urutan mobile (1 kolom vertikal):
          1. 💰 Total Kas (Card paling menonjol)
          2. 👥 Anggota (Menampilkan jumlah anggota)
          3. 📅 Jadwal (Menampilkan jadwal terdekat)
          4. 📊 Transaksi (Menampilkan jumlah transaksi)
          Desktop: 4-card horizontal atau 2x2
      */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* 1. Card: Total Kas (Paling Menonjol) */}
        <div
          id="stat-card-total-kas"
          onClick={() => onNavigate('uang_kas')}
          className="order-1 bg-[#fcfbf7] rounded-2xl p-5 sm:p-6 border-2 border-[#1b4332] shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e3efe7] text-[#1b4332] text-[10px] font-extrabold uppercase tracking-wider border border-[#b8dbc2]">
                <span>💰</span> Kas Kelompok
              </div>
              <div className="w-8 h-8 rounded-xl bg-[#1b4332] text-white flex items-center justify-center text-sm font-bold shadow-2xs group-hover:scale-105 transition-transform">
                💵
              </div>
            </div>

            <div className="text-xs font-semibold text-[#52796f]">TOTAL UANG KAS</div>
            <div
              id="stat-total-kas-amount"
              className="text-2xl sm:text-3xl font-black text-[#1b4332] tracking-tight mt-0.5 font-serif"
            >
              {formatRupiah(stats.total_balance)}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-[#ded7c5] flex items-center justify-between text-xs">
            <span className="text-[#2d6a4f] font-semibold">+{formatRupiah(stats.total_income)}</span>
            <span className="text-[#963c3c] font-semibold">-{formatRupiah(stats.total_expense)}</span>
          </div>
        </div>

        {/* 2. Card: Anggota */}
        <div
          id="stat-card-jumlah-anggota"
          onClick={() => onNavigate('kenali_kami')}
          className="order-2 bg-[#fcfbf7] rounded-2xl p-5 sm:p-6 border border-[#ded7c5] hover:border-[#3a5a40] shadow-2xs hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#52796f]">
                👥 Anggota Kelompok
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#e9f1ec] text-[#2d6a4f] flex items-center justify-center text-sm font-bold group-hover:scale-105 transition-transform">
                👥
              </div>
            </div>

            <div className="text-xs font-semibold text-[#52796f]">JUMLAH ANGGOTA</div>
            <div className="text-2xl sm:text-3xl font-black text-[#1b4332] tracking-tight mt-0.5 font-serif">
              {stats.member_count} Orang
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-[#ded7c5] text-xs text-[#52796f] flex items-center justify-between">
            <span>Den Bau (Ketua)</span>
            <span className="font-semibold text-[#2d6a4f] flex items-center gap-0.5">
              Lihat Profil <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* 3. Card: Jadwal Terdekat */}
        <div
          id="stat-card-jadwal-mendatang"
          onClick={() => onNavigate('rencana_jadwal')}
          className="order-3 bg-[#fcfbf7] rounded-2xl p-5 sm:p-6 border border-[#ded7c5] hover:border-[#3a5a40] shadow-2xs hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#52796f]">
                📅 Agenda Kegiatan
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#e9f1ec] text-[#2d6a4f] flex items-center justify-center text-sm font-bold group-hover:scale-105 transition-transform">
                📅
              </div>
            </div>

            <div className="text-xs font-semibold text-[#52796f]">JADWAL TERDEKAT</div>
            <div className="text-2xl sm:text-3xl font-black text-[#1b4332] tracking-tight mt-0.5 font-serif">
              {stats.upcoming_schedule_count} Kegiatan
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-[#ded7c5] text-xs text-[#52796f] flex items-center justify-between">
            <span className="truncate max-w-[140px]">
              {upcomingSchedules[0] ? upcomingSchedules[0].title : 'Belum ada agenda'}
            </span>
            <span className="font-semibold text-[#2d6a4f] flex items-center gap-0.5 shrink-0">
              Lihat <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* 4. Card: Total Transaksi */}
        <div
          id="stat-card-total-transaksi"
          onClick={() => onNavigate('riwayat_kas')}
          className="order-4 bg-[#fcfbf7] rounded-2xl p-5 sm:p-6 border border-[#ded7c5] hover:border-[#3a5a40] shadow-2xs hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#52796f]">
                📊 Riwayat Pembukuan
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#e9f1ec] text-[#2d6a4f] flex items-center justify-center text-sm font-bold group-hover:scale-105 transition-transform">
                📊
              </div>
            </div>

            <div className="text-xs font-semibold text-[#52796f]">TOTAL TRANSAKSI</div>
            <div className="text-2xl sm:text-3xl font-black text-[#1b4332] tracking-tight mt-0.5 font-serif">
              {stats.total_transactions} Catatan
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-[#ded7c5] text-xs text-[#52796f] flex items-center justify-between">
            <span>Database Persisten</span>
            <span className="font-semibold text-[#2d6a4f] flex items-center gap-0.5">
              Mutasi <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </section>

      {/* 4. Dual Section: Riwayat Kas Terkini & Agenda Jadwal */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* Recent Transactions Box */}
        <div className="bg-[#fcfbf7] rounded-2xl p-5 sm:p-6 border border-[#ded7c5] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#ded7c5]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#e9f1ec] text-[#1b4332] flex items-center justify-center text-sm font-bold border border-[#bed8c7]">
                  💰
                </div>
                <div>
                  <h3 className="font-bold text-[#1b4332] text-sm sm:text-base font-serif">
                    Transaksi Kas Terkini
                  </h3>
                  <p className="text-[11px] text-[#52796f]">3 mutasi paling baru</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('riwayat_kas')}
                className="text-xs font-bold text-[#2d6a4f] hover:text-[#1b4332] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {recentTransactions.length === 0 ? (
              <div className="py-8 text-center bg-[#f7f5ed] rounded-xl border border-dashed border-[#ded7c5]">
                <p className="text-xs text-[#52796f]">Belum ada transaksi kas yang dicatat.</p>
                {role === 'owner' && (
                  <button
                    onClick={() => onNavigate('uang_kas')}
                    className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1b4332] text-[#f7f5ed] text-xs font-semibold cursor-pointer"
                  >
                    + Catat Kas Masuk
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentTransactions.map((tx) => {
                  const isIncome = tx.type === 'income';
                  return (
                    <div
                      key={tx.id}
                      className="p-3 rounded-xl border border-[#ded7c5] bg-[#f7f5ed]/80 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-start gap-2.5 min-w-0 pr-2">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                            isIncome
                              ? 'bg-[#e2ece5] text-[#1b4332]'
                              : 'bg-[#faecec] text-[#8a3333]'
                          }`}
                        >
                          {isIncome ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-[#1b2b20] text-xs sm:text-sm truncate">
                            {tx.description}
                          </div>
                          <div className="text-[11px] text-[#52796f] mt-0.5">
                            📅 {formatIndoDate(tx.transaction_date)} • Saldo: {formatRupiah(tx.balance_after)}
                          </div>
                        </div>
                      </div>

                      <div
                        className={`text-xs sm:text-sm font-bold shrink-0 ${
                          isIncome ? 'text-[#2d6a4f]' : 'text-[#8a3333]'
                        }`}
                      >
                        {isIncome ? `+${formatRupiah(tx.amount)}` : `-${formatRupiah(tx.amount)}`}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-3 mt-4 border-t border-[#ded7c5] flex items-center justify-between text-xs text-[#52796f]">
            <span>Saldo Kas Saat Ini:</span>
            <span className="font-bold text-[#1b4332] text-sm font-serif">
              {formatRupiah(stats.total_balance)}
            </span>
          </div>
        </div>

        {/* Upcoming Schedules Box */}
        <div className="bg-[#fcfbf7] rounded-2xl p-5 sm:p-6 border border-[#ded7c5] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#ded7c5]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#e9f1ec] text-[#1b4332] flex items-center justify-center text-sm font-bold border border-[#bed8c7]">
                  📅
                </div>
                <div>
                  <h3 className="font-bold text-[#1b4332] text-sm sm:text-base font-serif">
                    Agenda Jadwal Kelompok
                  </h3>
                  <p className="text-[11px] text-[#52796f]">Kegiatan terdekat</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('rencana_jadwal')}
                className="text-xs font-bold text-[#2d6a4f] hover:text-[#1b4332] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {upcomingSchedules.length === 0 ? (
              <div className="py-8 text-center bg-[#f7f5ed] rounded-xl border border-dashed border-[#ded7c5]">
                <p className="text-xs text-[#52796f]">Belum ada agenda jadwal aktif.</p>
                {role === 'owner' && (
                  <button
                    onClick={() => onNavigate('rencana_jadwal')}
                    className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1b4332] text-[#f7f5ed] text-xs font-semibold cursor-pointer"
                  >
                    + Buat Agenda Baru
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2.5">
                {upcomingSchedules.map((sch) => (
                  <div
                    key={sch.id}
                    className="p-3 rounded-xl border border-[#ded7c5] bg-[#f7f5ed]/80 space-y-1.5 hover:border-[#b8dbc2] transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-[#1b2b20] text-xs sm:text-sm truncate">
                        {sch.title}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e1eee5] text-[#1b4332] border border-[#bed8c7] shrink-0">
                        {sch.status}
                      </span>
                    </div>

                    <p className="text-xs text-[#4b6354] line-clamp-1">{sch.description}</p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#52796f] pt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#2d6a4f]" />
                        {formatIndoDate(sch.date)} • {sch.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#2d6a4f]" />
                        {sch.location}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 mt-4 border-t border-[#ded7c5] flex items-center justify-between text-xs text-[#52796f]">
            <span>Total Agenda Terjadwal:</span>
            <span className="font-bold text-[#1b4332] text-sm font-serif">
              {schedules.length} Agenda
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
