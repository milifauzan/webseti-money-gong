import React, { useState } from 'react';
import { UserRole, CashTransaction } from '../types';
import { formatRupiah, formatIndoDate, getTodayDateString } from '../lib/formatters';
import {
  PlusCircle,
  MinusCircle,
  Coins,
  TrendingUp,
  TrendingDown,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle2,
  X,
  History,
  ShieldAlert,
} from 'lucide-react';
import { createTransaction } from '../lib/api';

interface CashFundViewProps {
  role: UserRole;
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  transactions: CashTransaction[];
  onTransactionCreated: (newTx: CashTransaction, summary: any) => void;
  onNavigateToHistory: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const CashFundView: React.FC<CashFundViewProps> = ({
  role,
  totalBalance,
  totalIncome,
  totalExpense,
  transactions,
  onTransactionCreated,
  onNavigateToHistory,
  onShowToast,
}) => {
  // Modal states
  const [modalType, setModalType] = useState<'income' | 'expense' | null>(null);
  const [amountStr, setAmountStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>(getTodayDateString());
  const [description, setDescription] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Confirmation stage
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  const openFormModal = (type: 'income' | 'expense') => {
    setModalType(type);
    setAmountStr('');
    setDateStr(getTodayDateString());
    setDescription('');
    setFormError(null);
    setIsConfirming(false);
  };

  const closeModal = () => {
    setModalType(null);
    setIsConfirming(false);
    setFormError(null);
  };

  // Validation
  const handleProceedToConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation 1: Empty amount
    if (!amountStr || !amountStr.trim()) {
      setFormError('Jumlah uang wajib diisi.');
      return;
    }

    const numericAmount = Number(amountStr.replace(/[^0-9]/g, ''));
    // Validation 2: Amount <= 0
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setFormError('Jumlah uang harus lebih dari Rp0.');
      return;
    }

    // Validation 3: Empty date
    if (!dateStr || !dateStr.trim()) {
      setFormError('Tanggal wajib diisi.');
      return;
    }

    // Validation 4: Empty description
    if (!description || !description.trim()) {
      setFormError('Penjelasan wajib diisi.');
      return;
    }

    // Validation 5: Expense exceeding balance
    if (modalType === 'expense' && numericAmount > totalBalance) {
      setFormError('Saldo kas tidak mencukupi.');
      return;
    }

    // Pass to confirmation step
    setIsConfirming(true);
  };

  // Submission to API
  const handleConfirmSubmit = async () => {
    if (!modalType) return;
    const numericAmount = Number(amountStr.replace(/[^0-9]/g, ''));

    setIsSubmitting(true);
    setFormError(null);

    try {
      const res = await createTransaction({
        type: modalType,
        amount: numericAmount,
        transaction_date: dateStr,
        description: description.trim(),
      });

      setIsSubmitting(false);
      closeModal();
      onTransactionCreated(res.transaction, res.summary);
      onShowToast('success', '✅ Transaksi berhasil disimpan.');
    } catch (err: any) {
      setIsSubmitting(false);
      setFormError(err.message || 'Terjadi kesalahan saat menyimpan data.');
      onShowToast('error', err.message || 'Terjadi kesalahan saat menyimpan data.');
    }
  };

  return (
    <div id="cash-fund-view" className="space-y-6 pb-20 sm:pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1b4332] flex items-center gap-2 font-serif">
            <span>💰</span> Uang Kas Money Gong
          </h1>
          <p className="text-xs sm:text-sm text-[#52796f] mt-1">
            Transparansi pembukuan kas kelompok dihitung otomatis dari total pemasukan dikurangi pengeluaran.
          </p>
        </div>

        {/* Khusus Pemilik: Action Buttons */}
        {role === 'owner' && (
          <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            <button
              id="btn-open-tambah-kas"
              type="button"
              onClick={() => openFormModal('income')}
              className="flex-1 sm:flex-initial min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#143225] active:scale-[0.98] text-[#f7f5ed] font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-[#84a98c]" />
              <span>➕ Tambah Kas</span>
            </button>

            <button
              id="btn-open-kurangi-kas"
              type="button"
              onClick={() => openFormModal('expense')}
              className="flex-1 sm:flex-initial min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-xl bg-[#8a3333] hover:bg-[#722929] active:scale-[0.98] text-[#f7f5ed] font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
            >
              <MinusCircle className="w-4 h-4 text-[#e0a6a6]" />
              <span>➖ Kurangi Kas</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Big Balance Card (Classic Green Retro Paper) */}
      <div
        id="card-main-balance"
        className="relative overflow-hidden rounded-3xl bg-[#fcfbf7] border-2 border-[#1b4332] p-6 sm:p-9 shadow-sm text-center"
      >
        <div className="max-w-xl mx-auto space-y-3.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e3efe7] text-[#1b4332] text-xs font-bold uppercase tracking-wider border border-[#b8dbc2]">
            <span>💰</span>
            <span>TOTAL UANG KAS</span>
          </div>

          <div
            id="text-total-uang-kas"
            className="text-3xl sm:text-5xl md:text-6xl font-black text-[#1b4332] tracking-tight font-serif break-words"
          >
            {formatRupiah(totalBalance)}
          </div>

          <p className="text-xs sm:text-sm text-[#52796f] max-w-md mx-auto">
            Saldo kas dihitung dari seluruh transaksi terverifikasi: <span className="font-semibold text-[#1b4332]">Pemasukan - Pengeluaran</span> (dimulai dari Rp0).
          </p>

          {/* Income vs Expense Pill Breakdown */}
          <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto text-left">
            <div className="p-3.5 rounded-2xl bg-[#f2f7f4] border border-[#bed8c7] flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-[#2d6a4f] uppercase tracking-wider">
                  Total Pemasukan
                </div>
                <div className="text-base sm:text-lg font-extrabold text-[#1b4332]">
                  +{formatRupiah(totalIncome)}
                </div>
              </div>
              <div className="w-8 h-8 rounded-xl bg-[#d5e9dc] text-[#1b4332] flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#fcf2f2] border border-[#edd1d1] flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-[#8a3333] uppercase tracking-wider">
                  Total Pengeluaran
                </div>
                <div className="text-base sm:text-lg font-extrabold text-[#8a3333]">
                  -{formatRupiah(totalExpense)}
                </div>
              </div>
              <div className="w-8 h-8 rounded-xl bg-[#fae1e1] text-[#8a3333] flex items-center justify-center">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction List Showcase (Mobile-First Cards) */}
      <div className="bg-[#fcfbf7] rounded-3xl border border-[#ded7c5] p-5 sm:p-7 shadow-2xs">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#ded7c5]">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#1b4332] flex items-center gap-2 font-serif">
              <span>📋</span> Transaksi Kas Terkini
            </h3>
            <p className="text-[11px] sm:text-xs text-[#52796f] mt-0.5">
              Setiap transaksi wajib mencantumkan tanggal dan penjelasan.
            </p>
          </div>

          <button
            id="btn-goto-history"
            type="button"
            onClick={onNavigateToHistory}
            className="min-h-[36px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#eeeae0] hover:bg-[#e4decb] text-[#1b4332] font-semibold text-xs transition-colors cursor-pointer"
          >
            <History className="w-3.5 h-3.5" />
            <span>Riwayat ({transactions.length})</span>
          </button>
        </div>

        {transactions.length === 0 ? (
          <div className="py-12 text-center bg-[#f7f5ed] rounded-2xl border border-dashed border-[#ded7c5]">
            <Coins className="w-10 h-10 text-[#8ba392] mx-auto mb-2 opacity-60" />
            <p className="text-sm font-semibold text-[#1b4332]">Belum Ada Transaksi Kas</p>
            <p className="text-xs text-[#52796f] mt-1">Saldo saat ini adalah Rp0. Pemilik dapat menambahkan uang kas masuk.</p>
            {role === 'owner' && (
              <button
                onClick={() => openFormModal('income')}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1b4332] text-white text-xs font-bold shadow-xs hover:bg-[#143225] cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Tambah Uang Kas Pertama</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {transactions.slice(0, 6).map((tx) => {
              const isIncome = tx.type === 'income';
              return (
                <div
                  key={tx.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isIncome
                      ? 'bg-[#f4f8f5] border-[#bed8c7]'
                      : 'bg-[#faf3f3] border-[#ecd3d3]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{isIncome ? '💰' : '💸'}</span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#3d5a45]">
                        {isIncome ? 'Uang Masuk' : 'Uang Keluar'}
                      </span>
                    </div>
                    <div
                      className={`text-sm sm:text-base font-extrabold ${
                        isIncome ? 'text-[#2d6a4f]' : 'text-[#8a3333]'
                      }`}
                    >
                      {isIncome ? `+ ${formatRupiah(tx.amount)}` : `- ${formatRupiah(tx.amount)}`}
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-[#364f3d]">
                    <div className="flex items-center gap-1.5 font-medium text-[#52796f]">
                      <span>📅</span>
                      <span>{formatIndoDate(tx.transaction_date)}</span>
                    </div>
                    <div className="flex items-start gap-1.5 pt-0.5">
                      <span className="shrink-0">📝</span>
                      <span className="font-semibold text-[#1b2b20] leading-snug">{tx.description}</span>
                    </div>
                  </div>

                  <div className="pt-2.5 mt-2.5 border-t border-[#ded7c5]/60 flex items-center justify-between text-[11px] text-[#52796f]">
                    <span>Saldo setelah transaksi:</span>
                    <span className="font-bold text-[#1b4332] font-serif">{formatRupiah(tx.balance_after)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL: INPUT TRANSAKSI (FORM & KONFIRMASI) */}
      {modalType && (
        <div
          id="modal-transaction-flow"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#13241b]/70 backdrop-blur-xs p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#fdfcf9] rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-[#cbd8cf] my-auto">
            {/* Header Modal */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold ${
                    modalType === 'income'
                      ? 'bg-[#e3efe7] text-[#1b4332] border border-[#c2ddcc]'
                      : 'bg-[#faecec] text-[#8a3333] border border-[#ecd3d3]'
                  }`}
                >
                  {modalType === 'income' ? '➕' : '➖'}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#1b4332] font-serif">
                    {isConfirming
                      ? 'Konfirmasi Transaksi'
                      : modalType === 'income'
                      ? 'Tambah Uang Kas'
                      : 'Kurangi Uang Kas'}
                  </h3>
                  <p className="text-xs text-[#557861]">
                    {isConfirming
                      ? 'Periksa kembali rincian data sebelum disimpan ke database'
                      : modalType === 'income'
                      ? 'Catat pemasukan kas kelompok'
                      : 'Catat pengeluaran kas kelompok'}
                  </p>
                </div>
              </div>
              <button
                id="btn-close-transaction-modal"
                type="button"
                onClick={closeModal}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#557861] hover:text-[#1b4332] hover:bg-[#eeeae0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message Box */}
            {formError && (
              <div
                id="transaction-form-error"
                className="mb-4 p-3 bg-[#fdf2f2] border border-[#f5c6cb] text-[#842029] rounded-xl text-xs sm:text-sm flex items-start gap-2.5 font-medium"
              >
                <ShieldAlert className="w-4 h-4 text-[#842029] shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            {!isConfirming ? (
              /* FORM STEP */
              <form onSubmit={handleProceedToConfirm} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#1b4332] mb-1.5 uppercase tracking-wider">
                    Jumlah Uang (Rp) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-sm font-bold text-[#557861]">Rp</span>
                    <input
                      id="input-transaction-amount"
                      type="number"
                      min="1"
                      step="1"
                      value={amountStr}
                      onChange={(e) => setAmountStr(e.target.value)}
                      placeholder="Contoh: 50000"
                      className="w-full min-h-[44px] pl-11 pr-4 py-2 rounded-xl border border-[#cbd5cb] bg-white text-[#1b2b20] font-semibold focus:outline-hidden focus:border-[#1b4332] focus:ring-2 focus:ring-[#1b4332]/20 text-sm"
                      autoFocus
                    />
                  </div>
                  {modalType === 'expense' && (
                    <div className="text-[11px] text-[#557861] mt-1 flex justify-between">
                      <span>Saldo saat ini: {formatRupiah(totalBalance)}</span>
                      {Number(amountStr) > totalBalance && (
                        <span className="text-[#8a3333] font-bold">Melebihi saldo!</span>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1b4332] mb-1.5 uppercase tracking-wider">
                    Tanggal <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="input-transaction-date"
                    type="date"
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#cbd5cb] bg-white text-[#1b2b20] focus:outline-hidden focus:border-[#1b4332] focus:ring-2 focus:ring-[#1b4332]/20 text-sm"
                  />
                  {dateStr && (
                    <div className="text-[11px] text-[#557861] mt-1">
                      Format: <span className="font-semibold text-[#1b4332]">{formatIndoDate(dateStr)}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1b4332] mb-1.5 uppercase tracking-wider">
                    Penjelasan / Keterangan <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="input-transaction-description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={
                      modalType === 'income'
                        ? 'Contoh: Iuran kas mingguan anggota'
                        : 'Contoh: Membeli makanan untuk kegiatan kelompok'
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-[#cbd5cb] bg-white text-[#1b2b20] focus:outline-hidden focus:border-[#1b4332] focus:ring-2 focus:ring-[#1b4332]/20 text-sm"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    id="btn-cancel-form"
                    type="button"
                    onClick={closeModal}
                    className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl border border-[#cbd5cb] bg-[#f7f5ed] text-[#3d5a45] hover:bg-[#eeeae0] font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    id="btn-proceed-confirm"
                    type="submit"
                    className={`flex-1 min-h-[44px] px-4 py-2.5 rounded-xl text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-[0.98] cursor-pointer ${
                      modalType === 'income'
                        ? 'bg-[#1b4332] hover:bg-[#143225]'
                        : 'bg-[#8a3333] hover:bg-[#722929]'
                    }`}
                  >
                    Lanjutkan ke Konfirmasi
                  </button>
                </div>
              </form>
            ) : (
              /* CONFIRMATION STEP (Section 8) */
              <div id="section-confirm-transaction" className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#f4efe4] border border-[#ded7c5] text-sm space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-[#ded7c5]">
                    <span className="text-[#557861] text-xs">
                      {modalType === 'income' ? 'Tambah kas sebesar:' : 'Kurangi kas sebesar:'}
                    </span>
                    <span
                      className={`text-base sm:text-lg font-black font-serif ${
                        modalType === 'income' ? 'text-[#1b4332]' : 'text-[#8a3333]'
                      }`}
                    >
                      {formatRupiah(Number(amountStr))}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#557861]">📅 Tanggal:</span>
                    <span className="font-bold text-[#1b4332]">{formatIndoDate(dateStr)}</span>
                  </div>

                  <div className="text-xs space-y-1">
                    <span className="text-[#557861] block">📝 Penjelasan:</span>
                    <p className="font-semibold text-[#1b2b20] bg-white p-2.5 rounded-xl border border-[#ded7c5]">
                      {description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-[#ded7c5] text-xs text-[#557861]">
                    <span>Estimasi saldo setelah transaksi:</span>
                    <span className="font-bold text-[#1b4332] font-serif text-sm">
                      {formatRupiah(
                        modalType === 'income'
                          ? totalBalance + Number(amountStr)
                          : totalBalance - Number(amountStr)
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    id="btn-back-from-confirm"
                    type="button"
                    onClick={() => setIsConfirming(false)}
                    disabled={isSubmitting}
                    className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl border border-[#cbd5cb] bg-[#f7f5ed] text-[#3d5a45] hover:bg-[#eeeae0] font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
                  >
                    Kembali
                  </button>
                  <button
                    id="btn-submit-save-transaction"
                    type="button"
                    onClick={handleConfirmSubmit}
                    disabled={isSubmitting}
                    className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#143225] active:scale-[0.98] text-[#f7f5ed] font-bold text-xs sm:text-sm shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isSubmitting ? (
                      'Menyimpan...'
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-[#84a98c]" />
                        <span>Simpan Transaksi</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
