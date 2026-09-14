import React, { useState, useEffect, useCallback } from 'react';
import { UserRole, ActiveTab, DashboardStats, CashTransaction, Member, Schedule } from './types';
import {
  getStoredRole,
  setStoredRole,
  getStoredToken,
  verifyAuth,
  logoutApi,
  fetchStats,
  fetchTransactions,
  fetchMembers,
  fetchSchedules,
} from './lib/api';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { CashFundView } from './components/CashFundView';
import { CashHistoryView } from './components/CashHistoryView';
import { MembersView } from './components/MembersView';
import { SchedulesView } from './components/SchedulesView';
import { ManageDataView } from './components/ManageDataView';
import { ToastContainer, ToastMessage } from './components/Toast';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('beranda');
  const [isInitializing, setIsInitializing] = useState(true);

  // Data states
  const [stats, setStats] = useState<DashboardStats>({
    total_balance: 0,
    total_income: 0,
    total_expense: 0,
    member_count: 8,
    upcoming_schedule_count: 0,
    total_transactions: 0,
  });
  const [transactions, setTransactions] = useState<CashTransaction[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load all core data from database
  const loadAppData = useCallback(async () => {
    try {
      setIsLoadingData(true);
      const [statsData, txData, membersData, schedulesData] = await Promise.all([
        fetchStats(),
        fetchTransactions(),
        fetchMembers(),
        fetchSchedules(),
      ]);

      setStats(statsData);
      setTransactions(txData);
      setMembers(membersData);
      setSchedules(schedulesData);
      setIsLoadingData(false);
    } catch (err: any) {
      setIsLoadingData(false);
      console.error('Error loading app data:', err);
    }
  }, []);

  // Check existing session on boot
  useEffect(() => {
    async function checkInitialSession() {
      const storedRole = getStoredRole();
      const token = getStoredToken();

      if (storedRole === 'owner' && token) {
        const isValid = await verifyAuth();
        if (isValid) {
          setRole('owner');
        } else {
          setStoredRole(null);
          setRole(null);
        }
      } else if (storedRole === 'visitor') {
        setRole('visitor');
      } else {
        setRole(null);
      }

      await loadAppData();
      setIsInitializing(false);
    }

    checkInitialSession();
  }, [loadAppData]);

  // Periodic polling for real-time synchronization between visitor and owner
  useEffect(() => {
    if (!role) return;
    const interval = setInterval(() => {
      loadAppData();
    }, 15000); // 15 seconds auto sync
    return () => clearInterval(interval);
  }, [role, loadAppData]);

  // User Actions
  const handleLoginOwnerSuccess = () => {
    setRole('owner');
    setActiveTab('beranda');
    loadAppData();
    showToast('success', 'Selamat datang, Pemilik! Mode pengelolaan aktif.');
  };

  const handleEnterVisitor = () => {
    setStoredRole('visitor');
    setRole('visitor');
    setActiveTab('beranda');
    loadAppData();
    showToast('info', 'Masuk sebagai Pengunjung. Mode transparansi aktif.');
  };

  const handleLogout = async () => {
    await logoutApi();
    setRole(null);
    setActiveTab('beranda');
    showToast('info', 'Anda telah keluar. Silakan pilih peran.');
  };

  const handleTransactionCreated = (newTx: CashTransaction, summary: any) => {
    setTransactions((prev) => [newTx, ...prev]);
    if (summary) {
      setStats((prev) => ({
        ...prev,
        total_balance: summary.total_balance,
        total_income: summary.total_income,
        total_expense: summary.total_expense,
        total_transactions: summary.transaction_count,
      }));
    } else {
      loadAppData();
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#f7f5ed] flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 rounded-2xl bg-[#1b4332] text-[#f7f5ed] flex items-center justify-center text-2xl font-bold mb-4 shadow-lg shadow-[#1b4332]/20 border border-[#143225]">
          💰
        </div>
        <div className="flex items-center gap-2 text-[#1b4332] font-bold text-base font-serif">
          <Loader2 className="w-5 h-5 animate-spin text-[#2d6a4f]" />
          <span>Memuat Money Gong...</span>
        </div>
        <p className="text-xs text-[#52796f] mt-1 font-mono">Menghubungkan ke database persisten...</p>
      </div>
    );
  }

  // 1. If not logged in as owner or entered as visitor: show Landing Page
  if (!role) {
    return (
      <>
        <LandingPage
          onLoginOwnerSuccess={handleLoginOwnerSuccess}
          onEnterVisitor={handleEnterVisitor}
        />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  // 2. Active Dashboard View
  return (
    <div className="min-h-screen bg-[#f7f5ed] text-[#1b2b20] flex flex-col justify-between selection:bg-[#c2ddcc] selection:text-[#1b4332]">
      <div>
        {/* Top Sticky Navigation */}
        <Navbar
          role={role}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onLogout={handleLogout}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-5 sm:pt-8 pb-10">
          {activeTab === 'beranda' && (
            <DashboardView
              role={role}
              stats={stats}
              transactions={transactions}
              schedules={schedules}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'uang_kas' && (
            <CashFundView
              role={role}
              totalBalance={stats.total_balance}
              totalIncome={stats.total_income}
              totalExpense={stats.total_expense}
              transactions={transactions}
              onTransactionCreated={handleTransactionCreated}
              onNavigateToHistory={() => setActiveTab('riwayat_kas')}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'kenali_kami' && (
            <MembersView
              role={role}
              members={members}
              onMembersUpdated={loadAppData}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'rencana_jadwal' && (
            <SchedulesView
              role={role}
              schedules={schedules}
              onSchedulesUpdated={loadAppData}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'riwayat_kas' && (
            <CashHistoryView
              role={role}
              transactions={transactions}
              onTransactionsUpdated={loadAppData}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'kelola_data' && role === 'owner' && (
            <ManageDataView
              stats={stats}
              transactions={transactions}
              members={members}
              schedules={schedules}
              onNavigate={setActiveTab}
              onRefreshAll={loadAppData}
            />
          )}
        </main>
      </div>

      {/* Global Footer (pb-20 on mobile to clear bottom navigation bar) */}
      <footer className="w-full bg-[#eeeae0] border-t border-[#ded7c5] py-5 mb-16 sm:mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#52796f]">
          <div className="flex items-center gap-2 text-center sm:text-left flex-wrap justify-center">
            <span className="font-extrabold text-[#1b4332] font-serif">💰 MONEY GONG</span>
            <span>—</span>
            <span>Kelola Kas, Kenali Kami, dan Rencanakan Kegiatan.</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Status: <span className="font-semibold text-[#1b4332]">● Database Online</span></span>
            <span>Peran: <span className="font-semibold text-[#1b4332]">{role === 'owner' ? '👑 Pemilik' : '👤 Pengunjung'}</span></span>
          </div>
        </div>
      </footer>

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
