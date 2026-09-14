import React, { useState } from 'react';
import { Crown, Eye, EyeOff, X, ShieldAlert, Sparkles, Loader2 } from 'lucide-react';
import { loginOwner } from '../lib/api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setUsername('');
    setPassword('');
    setShowPassword(false);
    setErrorMessage(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      handleClose();
      onLoginSuccess();
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage('Username atau password salah.');
    }
  };

  return (
    <div
      id="modal-owner-login-wrapper"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#13241b]/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="modal-owner-login-card"
        className="bg-[#fcfbf7] rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#cbd8cf] my-auto relative space-y-5"
      >
        {/* Close Button */}
        <button
          type="button"
          id="btn-close-owner-login"
          onClick={handleClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-[#52796f] hover:text-[#1b2b20] hover:bg-[#ede8db] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#1b4332] text-[#f7f5ed] flex items-center justify-center text-xl shrink-0 shadow-xs border border-[#143225]">
            <Crown className="w-6 h-6 text-[#98c5a4]" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg sm:text-xl text-[#1b4332] font-serif leading-snug">
              Masuk Akun Pemilik
            </h3>
            <p className="text-xs text-[#52796f] mt-0.5">
              Kelola kas, ubah anggota, dan buat rencana kegiatan.
            </p>
          </div>
        </div>

        {/* Form error notification */}
        {errorMessage && (
          <div
            id="login-error-alert"
            className="flex items-start gap-2.5 p-3 rounded-xl bg-[#faecec] border border-[#ecd3d3] text-xs text-[#8a3333] font-medium"
          >
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1b4332] mb-1.5 uppercase tracking-wider font-serif">
              Username Pemilik
            </label>
            <input
              type="text"
              id="input-owner-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-[#cbd5cb] bg-white text-[#1b2b20] focus:outline-hidden focus:border-[#1b4332] focus:ring-2 focus:ring-[#1b4332]/20 text-sm font-medium"
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1b4332] mb-1.5 uppercase tracking-wider font-serif">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="input-owner-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full min-h-[44px] pl-3.5 pr-12 py-2.5 rounded-xl border border-[#cbd5cb] bg-white text-[#1b2b20] focus:outline-hidden focus:border-[#1b4332] focus:ring-2 focus:ring-[#1b4332]/20 text-sm font-medium"
                autoComplete="current-password"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
              />
              <button
                type="button"
                id="btn-toggle-show-password"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52796f] hover:text-[#1b4332] p-1.5 rounded-lg cursor-pointer transition-colors"
                title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-[#8a3333]" />
                ) : (
                  <Eye className="w-4 h-4 text-[#2d6a4f]" />
                )}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              id="btn-submit-owner-login"
              disabled={isLoading}
              className="w-full min-h-[46px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#1b4332] hover:bg-[#143225] active:scale-[0.99] text-[#f7f5ed] font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#84a98c]" />
                  <span>Memverifikasi Akun...</span>
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4 text-[#98c5a4]" />
                  <span>Masuk sebagai Pemilik</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="pt-2 text-center text-[11px] text-[#52796f]">
          <span>Mode pengunjung tetap dapat melihat seluruh data secara bebas tanpa harus login.</span>
        </div>
      </div>
    </div>
  );
};
