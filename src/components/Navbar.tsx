import React, { useState } from 'react';
import { ActiveTab, UserRole } from '../types';
import {
  Home,
  Coins,
  Users,
  Calendar,
  History,
  Settings,
  LogOut,
  Menu,
  X,
  Crown,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  role: UserRole;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onLogout: () => void;
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  role,
  activeTab,
  onSelectTab,
  onLogout,
  onOpenLogin,
}) => {
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);

  // Desktop navigation items - All 6 tabs visible to both Pemilik and Pengunjung
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'beranda', label: 'Beranda', icon: <Home className="w-4 h-4" /> },
    { id: 'uang_kas', label: 'Uang Kas', icon: <Coins className="w-4 h-4" /> },
    { id: 'kenali_kami', label: 'Kenali Kami', icon: <Users className="w-4 h-4" /> },
    { id: 'rencana_jadwal', label: 'Rencana Jadwal', icon: <Calendar className="w-4 h-4" /> },
    { id: 'riwayat_kas', label: 'Riwayat Kas', icon: <History className="w-4 h-4" /> },
    { id: 'kelola_data', label: role === 'owner' ? 'Kelola Data' : 'Pusat Data', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    onSelectTab(tab);
    setMobileMoreOpen(false);
  };

  return (
    <>
      {/* Top Header Navigation (Both Mobile & Desktop) */}
      <header
        id="main-navigation-header"
        className="sticky top-0 z-40 bg-[#fbf9f4]/95 backdrop-blur-md border-b border-[#ded7c5] shadow-2xs"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Brand Logo & Name */}
            <div
              className="flex items-center gap-2.5 cursor-pointer select-none"
              onClick={() => handleNavClick('beranda')}
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1b4332] text-[#f7f5ed] flex items-center justify-center text-lg sm:text-xl font-bold shadow-xs border border-[#132c21]">
                💰
              </div>
              <div>
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#1b4332] flex items-center gap-1.5 font-serif leading-none">
                  MONEY GONG
                </span>
                <p className="text-[10px] text-[#52796f] hidden sm:block leading-none mt-1 font-medium">
                  Kelola Kas & Rencana Kegiatan
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links (All 6 tabs visible) */}
            <nav className="hidden lg:flex items-center gap-1.5">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#1b4332] text-[#f7f5ed] shadow-sm'
                        : 'text-[#2e4737] hover:text-[#1b4332] hover:bg-[#ede9dc]'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Role Badge & Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {role === 'owner' ? (
                <>
                  <span
                    id="badge-role-owner"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-[#e1eee5] text-[#1b4332] border border-[#bed8c7]"
                  >
                    <span>👑</span>
                    <span>Pemilik</span>
                  </span>

                  <button
                    id="btn-nav-logout"
                    onClick={onLogout}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#8a3333] hover:bg-[#fbebeb] border border-[#e8c6c6] transition-colors cursor-pointer"
                    title="Keluar"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Keluar</span>
                  </button>
                </>
              ) : (
                <>
                  <span
                    id="badge-role-visitor"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-[#eeeae0] text-[#3d5a45] border border-[#d6cfbe]"
                    title="Mode Transparansi: Akses Penuh Melihat Data"
                  >
                    <span>👤</span>
                    <span>Pengunjung</span>
                  </span>

                  <button
                    id="btn-nav-open-login"
                    onClick={onOpenLogin}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#1b4332] bg-[#e4efe8] hover:bg-[#d5e7dc] border border-[#bed8c7] shadow-2xs transition-all cursor-pointer"
                    title="Masuk sebagai Pemilik (bau)"
                  >
                    <Crown className="w-3.5 h-3.5 text-[#2d6a4f]" />
                    <span>Login Pemilik</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE BOTTOM NAVIGATION BAR (Fixed at bottom on mobile/tablet) */}
      <nav
        id="mobile-bottom-navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#fbf9f4]/95 backdrop-blur-md border-t border-[#ded7c5] shadow-lg px-2 pb-[env(safe-area-inset-bottom,0px)]"
      >
        <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto text-center">
          {/* 1. Beranda */}
          <button
            type="button"
            id="mobile-bottom-beranda"
            onClick={() => handleNavClick('beranda')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
              activeTab === 'beranda'
                ? 'text-[#1b4332] font-bold'
                : 'text-[#6c8273] hover:text-[#1b4332]'
            }`}
          >
            <Home className={`w-5 h-5 mb-0.5 ${activeTab === 'beranda' ? 'scale-110 stroke-[2.5]' : ''}`} />
            <span className="text-[10px] leading-tight">Beranda</span>
          </button>

          {/* 2. Kas */}
          <button
            type="button"
            id="mobile-bottom-uang-kas"
            onClick={() => handleNavClick('uang_kas')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
              activeTab === 'uang_kas'
                ? 'text-[#1b4332] font-bold'
                : 'text-[#6c8273] hover:text-[#1b4332]'
            }`}
          >
            <Coins className={`w-5 h-5 mb-0.5 ${activeTab === 'uang_kas' ? 'scale-110 stroke-[2.5]' : ''}`} />
            <span className="text-[10px] leading-tight">Kas</span>
          </button>

          {/* 3. Kami */}
          <button
            type="button"
            id="mobile-bottom-kenali-kami"
            onClick={() => handleNavClick('kenali_kami')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
              activeTab === 'kenali_kami'
                ? 'text-[#1b4332] font-bold'
                : 'text-[#6c8273] hover:text-[#1b4332]'
            }`}
          >
            <Users className={`w-5 h-5 mb-0.5 ${activeTab === 'kenali_kami' ? 'scale-110 stroke-[2.5]' : ''}`} />
            <span className="text-[10px] leading-tight">Kami</span>
          </button>

          {/* 4. Jadwal */}
          <button
            type="button"
            id="mobile-bottom-rencana-jadwal"
            onClick={() => handleNavClick('rencana_jadwal')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
              activeTab === 'rencana_jadwal'
                ? 'text-[#1b4332] font-bold'
                : 'text-[#6c8273] hover:text-[#1b4332]'
            }`}
          >
            <Calendar className={`w-5 h-5 mb-0.5 ${activeTab === 'rencana_jadwal' ? 'scale-110 stroke-[2.5]' : ''}`} />
            <span className="text-[10px] leading-tight">Jadwal</span>
          </button>

          {/* 5. Menu Lainnya */}
          <button
            type="button"
            id="mobile-bottom-more-menu"
            onClick={() => setMobileMoreOpen(true)}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
              activeTab === 'riwayat_kas' || activeTab === 'kelola_data'
                ? 'text-[#1b4332] font-bold'
                : 'text-[#6c8273] hover:text-[#1b4332]'
            }`}
          >
            <Menu className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Lainnya</span>
          </button>
        </div>
      </nav>

      {/* MOBILE "LAINNYA" BOTTOM SHEET MODAL */}
      {mobileMoreOpen && (
        <div
          id="mobile-more-backdrop"
          className="fixed inset-0 z-50 bg-[#13241b]/60 backdrop-blur-xs flex flex-col justify-end p-3 animate-in fade-in duration-150"
          onClick={() => setMobileMoreOpen(false)}
        >
          <div
            id="mobile-more-sheet"
            className="bg-[#fcfbf7] rounded-3xl p-5 border border-[#ded7c5] shadow-2xl max-w-sm w-full mx-auto space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#ded7c5]">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base text-[#1b4332]">Menu Tambahan</span>
                <span className="text-[11px] text-[#52796f] font-medium">Money Gong</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMoreOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#557861] hover:bg-[#eeeae0]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 pt-1">
              {/* Riwayat Kas */}
              <button
                type="button"
                onClick={() => handleNavClick('riwayat_kas')}
                className={`w-full min-h-[46px] flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  activeTab === 'riwayat_kas'
                    ? 'bg-[#1b4332] text-white'
                    : 'bg-[#f4efe4] text-[#1b4332] hover:bg-[#ebe4d5]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <History className="w-4 h-4" />
                  <span>📊 Riwayat Kas Lengkap</span>
                </div>
                <span className="text-xs text-[#84a98c]">Buka</span>
              </button>

              {/* Pusat Data / Kelola Data (Available for all) */}
              <button
                type="button"
                id="mobile-drawer-kelola-data"
                onClick={() => handleNavClick('kelola_data')}
                className={`w-full min-h-[46px] flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  activeTab === 'kelola_data'
                    ? 'bg-[#1b4332] text-white'
                    : 'bg-[#e4efe8] text-[#1b4332] hover:bg-[#d5e7dc]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4" />
                  <span>{role === 'owner' ? '⚙️ Kelola Data (Pemilik)' : '⚙️ Pusat Data & Transparansi'}</span>
                </div>
                <span className="text-xs text-[#2d6a4f] font-bold">{role === 'owner' ? '👑 Hub' : '👁️ Lihat'}</span>
              </button>

              {/* Action Button: Login for Visitor or Logout for Owner */}
              {role === 'visitor' ? (
                <button
                  type="button"
                  id="mobile-drawer-btn-login"
                  onClick={() => {
                    setMobileMoreOpen(false);
                    onOpenLogin();
                  }}
                  className="w-full min-h-[46px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-[#1b4332] bg-[#e4efe8] hover:bg-[#d5e7dc] border border-[#bed8c7] transition-colors mt-2 cursor-pointer shadow-2xs"
                >
                  <Crown className="w-4 h-4 text-[#2d6a4f]" />
                  <span>👑 Masuk Akun Pemilik (bau)</span>
                </button>
              ) : (
                <button
                  type="button"
                  id="mobile-drawer-btn-logout"
                  onClick={() => {
                    setMobileMoreOpen(false);
                    onLogout();
                  }}
                  className="w-full min-h-[46px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-[#8a3333] bg-[#fbebeb] hover:bg-[#f6d7d7] border border-[#e8c6c6] transition-colors mt-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>🚪 Keluar dari Akun Pemilik</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
