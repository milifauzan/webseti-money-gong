import React, { useState } from 'react';
import { UserRole, CashTransaction } from '../types';
import { formatRupiah, formatIndoDate } from '../lib/formatters';
import {
  TrendingUp,
  TrendingDown,
  Edit,
  Trash2,
  Search,
  Calendar,
  CheckCircle2,
  X,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react';
import { updateTransaction, deleteTransaction } from '../lib/api';

interface CashHistoryViewProps {
  role: UserRole;
  transactions: CashTransaction[];
  onTransactionsUpdated: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const CashHistoryView: React.FC<CashHistoryViewProps> = ({
  role,
  transactions,
  onTransactionsUpdated,
  onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  // Edit modal states
  const [editingTx, setEditingTx] = useState<CashTransaction | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editType, setEditType] = useState<'income' | 'expense'>('income');
  const [editError, setEditError] = useState<string | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Delete modal state
  const [deletingTx, setDeletingTx] = useState<CashTransaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filtered transactions (transactions are already passed sorted latest first)
  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.transaction_date.includes(searchTerm);
    const matchesType = filterType === 'all' || tx.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleOpenEdit = (tx: CashTransaction) => {
    setEditingTx(tx);
    setEditAmount(String(tx.amount));
    setEditDate(tx.transaction_date);
    setEditDescription(tx.description);
    setEditType(tx.type);
    setEditError(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTx) return;

    if (!editAmount || !editAmount.trim()) {
      setEditError('Jumlah uang wajib diisi.');
      return;
    }
    const num = Number(editAmount.replace(/[^0-9]/g, ''));
    if (isNaN(num) || num <= 0) {
      setEditError('Jumlah uang harus lebih dari Rp0.');
      return;
    }
    if (!editDate || !editDate.trim()) {
      setEditError('Tanggal wajib diisi.');
      return;
    }
    if (!editDescription || !editDescription.trim()) {
      setEditError('Penjelasan wajib diisi.');
      return;
    }

    try {
      setIsSavingEdit(true);
      await updateTransaction(editingTx.id, {
        type: editType,
        amount: num,
        transaction_date: editDate.trim(),
        description: editDescription.trim(),
      });
      setIsSavingEdit(false);
      setEditingTx(null);
      onTransactionsUpdated();
      onShowToast('success', '✅ Transaksi berhasil diperbarui.');
    } catch (err: any) {
      setIsSavingEdit(false);
      setEditError(err.message || 'Terjadi kesalahan saat menyimpan data.');
      onShowToast('error', err.message || 'Terjadi kesalahan saat menyimpan data.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingTx) return;
    try {
      setIsDeleting(true);
      await deleteTransaction(deletingTx.id);
      setIsDeleting(false);
      setDeletingTx(null);
      onTransactionsUpdated();
      onShowToast('success', '✅ Transaksi berhasil dihapus.');
    } catch (err: any) {
      setIsDeleting(false);
      onShowToast('error', err.message || 'Terjadi kesalahan saat menghapus data.');
    }
  };

  return (
    <div id="cash-history-view" className="space-y-6 pb-20 sm:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1b4332] flex items-center gap-2 font-serif">
            <span>📊</span> Riwayat Kas Money Gong
          </h1>
          <p className="text-xs sm:text-sm text-[#52796f] mt-1">
            Catatan seluruh transaksi masuk dan keluar, berurutan dari transaksi terbaru di bagian atas.
          </p>
        </div>

        {role === 'visitor' && (
          <div className="text-xs font-semibold text-[#3d5a45] bg-[#eeeae0] px-3 py-1.5 rounded-full border border-[#ded7c5] self-start sm:self-center">
            Mode Transparansi Publik
          </div>
        )}
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-[#fcfbf7] p-4 rounded-2xl border border-[#ded7c5] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#738e7c] absolute left-3.5 top-3" />
          <input
            id="input-search-history"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari keterangan atau tanggal..."
            className="w-full min-h-[42px] pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-[#cbd5cb] bg-white text-[#1b2b20] focus:outline-hidden focus:border-[#1b4332] focus:ring-2 focus:ring-[#1b4332]/20"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              filterType === 'all'
                ? 'bg-[#1b4332] text-[#f7f5ed] shadow-2xs'
                : 'bg-[#eeeae0] text-[#3d5a45] hover:bg-[#e4decb]'
            }`}
          >
            Semua ({transactions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('income')}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              filterType === 'income'
                ? 'bg-[#2d6a4f] text-[#f7f5ed] shadow-2xs'
                : 'bg-[#e2ece5] text-[#1b4332] hover:bg-[#d5e4d9]'
            }`}
          >
            💰 Masuk
          </button>
          <button
            type="button"
            onClick={() => setFilterType('expense')}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              filterType === 'expense'
                ? 'bg-[#8a3333] text-[#f7f5ed] shadow-2xs'
                : 'bg-[#fbebeb] text-[#8a3333] hover:bg-[#f5d9d9]'
            }`}
          >
            💸 Keluar
          </button>
        </div>
      </div>

      {/* Transactions Table & Mobile Cards */}
      <div className="bg-[#fcfbf7] rounded-3xl border border-[#ded7c5] shadow-2xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Calendar className="w-12 h-12 text-[#9bb3a2] mx-auto mb-3 opacity-60" />
            <h4 className="text-base font-bold text-[#1b4332] font-serif">Tidak Ada Riwayat Transaksi</h4>
            <p className="text-xs text-[#52796f] max-w-sm mx-auto mt-1 px-4">
              {searchTerm || filterType !== 'all'
                ? 'Tidak ada transaksi yang cocok dengan kata kunci atau filter ini.'
                : 'Belum ada mutasi uang kas yang dicatat di database.'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table (Visible on md+) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#f4efe4] border-b border-[#ded7c5] text-xs font-bold uppercase text-[#3d5a45] tracking-wider font-serif">
                  <tr>
                    <th className="py-3.5 px-5">Jenis</th>
                    <th className="py-3.5 px-5 text-right">Jumlah</th>
                    <th className="py-3.5 px-5">Tanggal</th>
                    <th className="py-3.5 px-5">Penjelasan</th>
                    <th className="py-3.5 px-5 text-right">Saldo Setelah Transaksi</th>
                    {role === 'owner' && <th className="py-3.5 px-5 text-center">Aksi</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ded7c5]/60 font-medium">
                  {filtered.map((tx) => {
                    const isIncome = tx.type === 'income';
                    return (
                      <tr key={tx.id} className="hover:bg-[#f7f5ed] transition-colors">
                        <td className="py-4 px-5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                              isIncome
                                ? 'bg-[#e2ece5] text-[#1b4332] border border-[#bed8c7]'
                                : 'bg-[#faecec] text-[#8a3333] border border-[#ecd3d3]'
                            }`}
                          >
                            <span>{isIncome ? '💰 Masuk' : '💸 Keluar'}</span>
                          </span>
                        </td>
                        <td
                          className={`py-4 px-5 text-right font-bold text-base font-serif ${
                            isIncome ? 'text-[#2d6a4f]' : 'text-[#8a3333]'
                          }`}
                        >
                          {isIncome ? `+${formatRupiah(tx.amount)}` : `-${formatRupiah(tx.amount)}`}
                        </td>
                        <td className="py-4 px-5 text-[#2c4234] whitespace-nowrap">
                          {formatIndoDate(tx.transaction_date)}
                        </td>
                        <td className="py-4 px-5 text-[#1b2b20] max-w-xs break-words">
                          {tx.description}
                        </td>
                        <td className="py-4 px-5 text-right font-extrabold text-[#1b4332] font-serif">
                          {formatRupiah(tx.balance_after)}
                        </td>
                        {role === 'owner' && (
                          <td className="py-4 px-5 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                id={`btn-edit-tx-${tx.id}`}
                                onClick={() => handleOpenEdit(tx)}
                                className="p-2 rounded-lg text-[#557861] hover:text-[#1b4332] hover:bg-[#e4decb] transition-colors cursor-pointer"
                                title="Edit Transaksi"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                id={`btn-delete-tx-${tx.id}`}
                                onClick={() => setDeletingTx(tx)}
                                className="p-2 rounded-lg text-[#8a3333] hover:bg-[#fbebeb] transition-colors cursor-pointer"
                                title="Hapus Transaksi"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List (Section 1: No horizontal blowouts, fits 320px-430px) */}
            <div className="md:hidden divide-y divide-[#ded7c5]/70">
              {filtered.map((tx) => {
                const isIncome = tx.type === 'income';
                return (
                  <div key={tx.id} className="p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          isIncome
                            ? 'bg-[#e2ece5] text-[#1b4332] border border-[#bed8c7]'
                            : 'bg-[#faecec] text-[#8a3333] border border-[#ecd3d3]'
                        }`}
                      >
                        {isIncome ? '💰 Masuk' : '💸 Keluar'}
                      </span>
                      <span
                        className={`text-base font-extrabold font-serif ${
                          isIncome ? 'text-[#2d6a4f]' : 'text-[#8a3333]'
                        }`}
                      >
                        {isIncome ? `+${formatRupiah(tx.amount)}` : `-${formatRupiah(tx.amount)}`}
                      </span>
                    </div>

                    <div className="text-xs text-[#52796f] font-medium">
                      📅 {formatIndoDate(tx.transaction_date)}
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-[#1b2b20] bg-[#f7f5ed] p-3 rounded-xl border border-[#ded7c5] leading-relaxed">
                      {tx.description}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-[#52796f]">Saldo setelah transaksi:</span>
                      <span className="font-extrabold text-[#1b4332] font-serif">{formatRupiah(tx.balance_after)}</span>
                    </div>

                    {role === 'owner' && (
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#ded7c5]/50">
                        <button
                          onClick={() => handleOpenEdit(tx)}
                          className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#1b4332] bg-[#e4efe8] border border-[#bed8c7] cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setDeletingTx(tx)}
                          className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#8a3333] bg-[#fbebeb] border border-[#e8c6c6] cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* EDIT MODAL FOR OWNER */}
      {editingTx && (
        <div
          id="modal-edit-transaction"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#13241b]/70 backdrop-blur-xs p-4 overflow-y-auto"
        >
          <div className="bg-[#fdfcf9] rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-[#cbd8cf] my-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#e3efe7] text-[#1b4332] flex items-center justify-center text-xl border border-[#c2ddcc]">
                  ✏️
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#1b4332] font-serif">
                    Edit Transaksi Kas
                  </h3>
                  <p className="text-xs text-[#557861]">Perbarui data dan saldo otomatis dihitung ulang</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingTx(null)}
                className="text-[#557861] hover:text-[#1b4332] p-1.5 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="mb-4 p-3 bg-[#fdf2f2] border border-[#f5c6cb] text-[#842029] rounded-xl text-xs font-medium flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#842029] shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1b4332] mb-1.5 uppercase tracking-wider">
                  Jenis Transaksi
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setEditType('income')}
                    className={`min-h-[44px] py-2 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      editType === 'income'
                        ? 'bg-[#1b4332] text-white border-[#1b4332]'
                        : 'bg-white text-[#3d5a45] border-[#cbd5cb]'
                    }`}
                  >
                    💰 Uang Masuk
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditType('expense')}
                    className={`min-h-[44px] py-2 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      editType === 'expense'
                        ? 'bg-[#8a3333] text-white border-[#8a3333]'
                        : 'bg-white text-[#3d5a45] border-[#cbd5cb]'
                    }`}
                  >
                    💸 Uang Keluar
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1b4332] mb-1.5 uppercase tracking-wider">
                  Jumlah Uang (Rp)
                </label>
                <input
                  type="number"
                  min="1"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#cbd5cb] text-sm text-[#1b2b20] font-semibold focus:outline-hidden focus:border-[#1b4332]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1b4332] mb-1.5 uppercase tracking-wider">
                  Tanggal
                </label>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#cbd5cb] text-sm text-[#1b2b20] focus:outline-hidden focus:border-[#1b4332]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1b4332] mb-1.5 uppercase tracking-wider">
                  Penjelasan / Keterangan
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#cbd5cb] text-sm text-[#1b2b20] focus:outline-hidden focus:border-[#1b4332]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTx(null)}
                  className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl border border-[#cbd5cb] bg-[#f7f5ed] text-[#3d5a45] text-xs sm:text-sm font-semibold hover:bg-[#eeeae0] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#143225] text-white text-xs sm:text-sm font-bold shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isSavingEdit ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingTx && (
        <div
          id="modal-delete-transaction"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#13241b]/70 backdrop-blur-xs p-4 overflow-y-auto"
        >
          <div className="bg-[#fdfcf9] rounded-3xl max-w-md w-full p-5 sm:p-7 shadow-2xl border border-[#cbd8cf] text-center my-auto">
            <div className="w-14 h-14 rounded-2xl bg-[#fbebeb] text-[#8a3333] flex items-center justify-center text-2xl mx-auto mb-4 border border-[#e8c6c6]">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[#1b4332] font-serif mb-2">Hapus Transaksi?</h3>
            <p className="text-xs text-[#52796f] mb-4">
              Apakah Anda yakin ingin menghapus transaksi ini? Saldo seluruh transaksi setelahnya akan dihitung ulang secara otomatis.
            </p>

            <div className="p-3 bg-[#f7f5ed] rounded-xl border border-[#ded7c5] text-xs text-[#1b2b20] mb-5 text-left space-y-1">
              <div>
                <span className="font-bold text-[#3d5a45]">Nominal:</span>{' '}
                {deletingTx.type === 'income' ? `+${formatRupiah(deletingTx.amount)}` : `-${formatRupiah(deletingTx.amount)}`}
              </div>
              <div>
                <span className="font-bold text-[#3d5a45]">Tanggal:</span> {formatIndoDate(deletingTx.transaction_date)}
              </div>
              <div>
                <span className="font-bold text-[#3d5a45]">Penjelasan:</span> {deletingTx.description}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingTx(null)}
                disabled={isDeleting}
                className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl border border-[#cbd5cb] text-[#3d5a45] bg-[#f7f5ed] text-xs sm:text-sm font-semibold hover:bg-[#eeeae0] cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#8a3333] hover:bg-[#722929] text-white text-xs sm:text-sm font-bold shadow-md disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
