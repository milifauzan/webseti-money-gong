import React, { useState } from 'react';
import { Crown, User, ArrowRight, Eye, EyeOff, ShieldAlert, Sparkles } from 'lucide-react';
import { loginOwner } from '../lib/api';

interface LandingPageProps {
  onLoginOwnerSuccess: () => void;
  onEnterVisitor: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLoginOwnerSuccess,
  onEnterVisitor,
}) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  // Form HARUS KOSONG saat dibuka - Tidak boleh ada auto-fill
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // Password default tersembunyi
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenLogin = () => {
    setUsername('');
    setPassword('');
    setShowPassword(false);
    setErrorMessage(null);
    setShowLoginModal(true);
  };

  const handleCloseLogin = () => {
    setShowLoginModal(false);
    setUsername('');
    setPassword('');
    setShowPassword(false);
    setErrorMessage(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    if (!trimmedUser || !trimmedPass) {
      setErrorMessage('Username atau password salah.');
      return;
    }

    try {
      setIsLoading(true);
      await loginOwner(trimmedUser, trimmedPass);
      setIsLoading(false);
      onLoginOwnerSuccess();
    } catch (err: any) {
      setIsLoading(false);
      // Selalu tampilkan pesan umum agar tidak membocorkan informasi kredensial
      setErrorMessage('Username atau password salah.');
    }
  };

  return (
    <div
      id="landing-page-wrapper"
      className="min-h-screen bg-[#f7f5ed] text-[#1b2b20] flex flex-col justify-between selection:bg-[#406851]/20 overflow-x-hidden"
    >
      {/* Top Header - Classic Green Retro Style */}
      <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between border-b border-[#ded7c5]">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#1b4332] text-[#f7f5ed] flex items-center justify-center text-xl shadow-xs border border-[#143225]">
            💰
          </div>
          <div>
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#1b4332] block leading-tight font-serif">
              MONEY GONG
            </span>
            <span className="text-[10px] sm:text-xs text-[#52796f] font-medium tracking-wide">
              Kelola Kas Kelompok
            </span>
          </div>
        </div>

        <div className="text-[11px] sm:text-xs font-semibold text-[#2d6a4f] bg-[#e9f1ec] px-3 py-1.5 rounded-full border border-[#c3dcce] shadow-2xs">
          🌿 Klasik & Terbuka
        </div>
      </header>

      {/* Main Hero Section - Mobile First Layout */}
      <main className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center text-center">
        {/* Retro Stamp Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#eef4f0] border border-[#c8ded1] text-[#1b4332] text-xs font-semibold mb-5 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#2d6a4f]" />
          <span>Amanah • Transparan • Terpercaya</span>
        </div>

        {/* Hero Title */}
        <h1
          id="landing-hero-title"
          className="text-3xl sm:text-5xl md:text-6xl font-black text-[#1b4332] tracking-tight leading-tight mb-3 font-serif"
        >
          💰 MONEY GONG
        </h1>

        {/* Tagline */}
        <p
          id="landing-hero-tagline"
          className="text-base sm:text-xl text-[#3d5a45] font-medium max-w-xl leading-relaxed mb-8 sm:mb-10 px-2"
        >
          “Kelola Kas, Kenali Kami, dan Rencanakan Kegiatan.”
        </p>

        {/* Two Main Choice Cards (Responsive Stack on Mobile) */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-3xl mb-10 text-left">
          {/* Choice 1: PEMILIK */}
          <div
            id="card-choice-pemilik"
            className="group relative bg-[#fcfbf7] rounded-2xl p-6 sm:p-7 border-2 border-[#c5d8cb] hover:border-[#1b4332] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="absolute -top-3 right-5 bg-[#1b4332] text-[#f7f5ed] text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider border border-[#143225]">
              👑 Akses Penuh
            </div>

            <div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#e3efe7] text-[#1b4332] flex items-center justify-center text-2xl mb-4 border border-[#c2ddcc] group-hover:scale-105 transition-transform">
                👑
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1b4332] mb-2 flex items-center gap-2 font-serif">
                PEMILIK
              </h2>
              <p className="text-[#415a49] text-xs sm:text-sm leading-relaxed mb-6">
                Masuk untuk mengelola pembukuan uang kas kelompok, input transaksi, mengatur foto dan profil anggota, serta merencanakan jadwal kegiatan.
              </p>
            </div>

            <button
              id="btn-choice-pemilik"
              type="button"
              onClick={handleOpenLogin}
              className="w-full min-h-[46px] inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-[#1b4332] hover:bg-[#143225] active:scale-[0.98] text-[#f7f5ed] font-bold text-sm shadow-md shadow-[#1b4332]/20 transition-all cursor-pointer"
            >
              <Crown className="w-4 h-4 text-[#84a98c]" />
              <span>Masuk Sebagai Pemilik</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Choice 2: PENGUNJUNG */}
          <div
            id="card-choice-pengunjung"
            className="group relative bg-[#fcfbf7] rounded-2xl p-6 sm:p-7 border-2 border-[#dcd6c5] hover:border-[#52796f] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="absolute -top-3 right-5 bg-[#3a5a40] text-[#f7f5ed] text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider border border-[#2d4632]">
              👤 Mode Publik
            </div>

            <div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#eeebe2] text-[#3a5a40] flex items-center justify-center text-2xl mb-4 border border-[#dad3c2] group-hover:scale-105 transition-transform">
                👤
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1b4332] mb-2 flex items-center gap-2 font-serif">
                PENGUNJUNG
              </h2>
              <p className="text-[#415a49] text-xs sm:text-sm leading-relaxed mb-6">
                Langsung masuk tanpa kata sandi untuk melihat transparansi saldo kas, tanggal & penjelasan mutasi kas, profil 8 anggota, dan agenda kegiatan kelompok.
              </p>
            </div>

            <button
              id="btn-choice-pengunjung"
              type="button"
              onClick={onEnterVisitor}
              className="w-full min-h-[46px] inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-[#344e41] hover:bg-[#283e33] active:scale-[0.98] text-[#f7f5ed] font-bold text-sm shadow-md shadow-[#344e41]/20 transition-all cursor-pointer"
            >
              <User className="w-4 h-4 text-[#a3b18a]" />
              <span>Masuk Sebagai Pengunjung</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3 Pillars Summary Highlight (Classic Green Card Strip) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full max-w-3xl text-left">
          <div className="bg-[#f2efe6] p-4 rounded-xl border border-[#ded7c5] shadow-2xs">
            <div className="text-[#1b4332] font-bold text-sm mb-1 flex items-center gap-1.5 font-serif">
              <span>💰</span> Kas Terbuka & Rapi
            </div>
            <p className="text-xs text-[#526f59] leading-relaxed">
              Saldo otomatis dihitung dari mutasi masuk dan keluar yang tercatat terperinci.
            </p>
          </div>

          <div className="bg-[#f2efe6] p-4 rounded-xl border border-[#ded7c5] shadow-2xs">
            <div className="text-[#1b4332] font-bold text-sm mb-1 flex items-center gap-1.5 font-serif">
              <span>👥</span> Kenali 8 Anggota
            </div>
            <p className="text-xs text-[#526f59] leading-relaxed">
              Profil teratur lengkap dengan foto profil tersimpan di persistent storage server.
            </p>
          </div>

          <div className="bg-[#f2efe6] p-4 rounded-xl border border-[#ded7c5] shadow-2xs">
            <div className="text-[#1b4332] font-bold text-sm mb-1 flex items-center gap-1.5 font-serif">
              <span>📅</span> Agenda Kegiatan
            </div>
            <p className="text-xs text-[#526f59] leading-relaxed">
              Rencana kegiatan terjadwal dengan lokasi, jam berkumpul, dan status pelaksanaan.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-5 text-center text-xs text-[#5f7363] border-t border-[#ded7c5]">
        Money Gong &copy; 2026 — Kelola Kas, Kenali Kami, dan Rencanakan Kegiatan.
      </footer>

      {/* MODAL LOGIN PEMILIK (SESUAI ATURAN PRIVASI STRICT SECTION 10-17) */}
      {showLoginModal && (
        <div
          id="modal-login-pemilik"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#13241b]/70 backdrop-blur-xs p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#fdfcf9] rounded-2xl max-w-sm w-full p-6 sm:p-7 shadow-2xl border border-[#cbd8cf] my-auto">
            {/* Header Modal */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#e3efe7] text-[#1b4332] flex items-center justify-center text-xl border border-[#c2ddcc]">
                  👑
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1b4332] font-serif leading-snug">
                    Login Pemilik
                  </h3>
                  <p className="text-xs text-[#557861]">Masukkan kredensial pemilik</p>
                </div>
              </div>
              <button
                id="btn-close-login-modal"
                type="button"
                onClick={handleCloseLogin}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#557861] hover:text-[#1b4332] hover:bg-[#eeeae0] transition-colors"
                aria-label="Tutup modal"
              >
                ✕
              </button>
            </div>

            {/* Error Message Box (Tanpa membocorkan informasi spesifik) */}
            {errorMessage && (
              <div
                id="login-error-message"
                className="mb-4 p-3 bg-[#fdf2f2] border border-[#f5c6cb] text-[#842029] rounded-xl text-xs sm:text-sm flex items-center gap-2.5 font-medium"
              >
                <ShieldAlert className="w-4 h-4 text-[#842029] shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form Login Pemilik: Bersih, Tanpa Petunjuk Username/Password, Tanpa Auto-Fill */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1b4332] mb-1.5 uppercase tracking-wider">
                  Username
                </label>
                <input
                  id="input-login-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-[#cbd5cb] bg-white text-[#1b2b20] focus:outline-hidden focus:border-[#1b4332] focus:ring-2 focus:ring-[#1b4332]/20 text-sm font-medium"
                  autoComplete="username"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1b4332] mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="input-login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    className="w-full min-h-[44px] pl-3.5 pr-12 py-2.5 rounded-xl border border-[#cbd5cb] bg-white text-[#1b2b20] focus:outline-hidden focus:border-[#1b4332] focus:ring-2 focus:ring-[#1b4332]/20 text-sm font-medium"
                    autoComplete="current-password"
                  />
                  {/* Icon toggle visibility 👁️ / 🙈 */}
                  <button
                    id="btn-toggle-password-visibility"
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2 top-1.5 w-9 h-9 flex items-center justify-center text-[#557861] hover:text-[#1b4332] rounded-lg cursor-pointer"
                    title={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  id="btn-cancel-login"
                  type="button"
                  onClick={handleCloseLogin}
                  className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl border border-[#cbd5cb] bg-[#f7f5ed] text-[#3d5a45] hover:bg-[#ede9db] font-semibold text-sm transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  id="btn-submit-login"
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#143225] active:scale-[0.98] text-[#f7f5ed] font-bold text-sm shadow-md shadow-[#1b4332]/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? 'Memeriksa...' : 'Masuk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
