import React, { useState } from 'react';
import { UserRole, Schedule, ScheduleStatus } from '../types';
import { formatIndoDate, getTodayDateString } from '../lib/formatters';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  PlusCircle,
  Edit,
  Trash2,
  X,
  AlertTriangle,
  List,
  LayoutGrid,
  ShieldAlert,
} from 'lucide-react';
import { createSchedule, updateSchedule, deleteSchedule } from '../lib/api';

interface SchedulesViewProps {
  role: UserRole;
  schedules: Schedule[];
  onSchedulesUpdated: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const SchedulesView: React.FC<SchedulesViewProps> = ({
  role,
  schedules,
  onSchedulesUpdated,
  onShowToast,
}) => {
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar'>('timeline');

  // Add / Edit Modal
  const [modalSchedule, setModalSchedule] = useState<{
    isOpen: boolean;
    isEditing: boolean;
    id?: string;
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    status: ScheduleStatus;
  }>({
    isOpen: false,
    isEditing: false,
    title: '',
    date: getTodayDateString(),
    time: '15:00',
    location: '',
    description: '',
    status: 'Direncanakan',
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete modal
  const [deletingSchedule, setDeletingSchedule] = useState<Schedule | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenAdd = () => {
    setFormError(null);
    setModalSchedule({
      isOpen: true,
      isEditing: false,
      title: '',
      date: getTodayDateString(),
      time: '15:00',
      location: '',
      description: '',
      status: 'Direncanakan',
    });
  };

  const handleOpenEdit = (s: Schedule) => {
    setFormError(null);
    setModalSchedule({
      isOpen: true,
      isEditing: true,
      id: s.id,
      title: s.title,
      date: s.date,
      time: s.time,
      location: s.location,
      description: s.description || '',
      status: s.status,
    });
  };

  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!modalSchedule.title.trim()) {
      setFormError('Nama kegiatan wajib diisi.');
      return;
    }
    if (!modalSchedule.date.trim()) {
      setFormError('Tanggal wajib diisi.');
      return;
    }
    if (!modalSchedule.time.trim()) {
      setFormError('Waktu wajib diisi.');
      return;
    }
    if (!modalSchedule.location.trim()) {
      setFormError('Lokasi wajib diisi.');
      return;
    }

    try {
      setIsSaving(true);
      if (modalSchedule.isEditing && modalSchedule.id) {
        await updateSchedule(modalSchedule.id, {
          title: modalSchedule.title.trim(),
          date: modalSchedule.date.trim(),
          time: modalSchedule.time.trim(),
          location: modalSchedule.location.trim(),
          description: modalSchedule.description.trim(),
          status: modalSchedule.status,
        });
        onShowToast('success', '✅ Jadwal berhasil diperbarui.');
      } else {
        await createSchedule({
          title: modalSchedule.title.trim(),
          date: modalSchedule.date.trim(),
          time: modalSchedule.time.trim(),
          location: modalSchedule.location.trim(),
          description: modalSchedule.description.trim(),
          status: modalSchedule.status,
        });
        onShowToast('success', '✅ Jadwal berhasil ditambahkan.');
      }

      setIsSaving(false);
      setModalSchedule((prev) => ({ ...prev, isOpen: false }));
      onSchedulesUpdated();
    } catch (err: any) {
      setIsSaving(false);
      setFormError(err.message || 'Terjadi kesalahan saat menyimpan data.');
      onShowToast('error', err.message || 'Terjadi kesalahan saat menyimpan data.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingSchedule) return;
    try {
      setIsDeleting(true);
      await deleteSchedule(deletingSchedule.id);
      setIsDeleting(false);
      setDeletingSchedule(null);
      onSchedulesUpdated();
      onShowToast('success', '✅ Jadwal berhasil dihapus.');
    } catch (err: any) {
      setIsDeleting(false);
      onShowToast('error', err.message || 'Terjadi kesalahan saat menghapus data.');
    }
  };

  const getStatusBadge = (status: ScheduleStatus) => {
    switch (status) {
      case 'Direncanakan':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#e1eee5] text-[#1b4332] border border-[#bed8c7]">
            🔵 Direncanakan
          </span>
        );
      case 'Berlangsung':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#fef5e6] text-[#8a5d1b] border border-[#f5dfb8]">
            🟡 Berlangsung
          </span>
        );
      case 'Selesai':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#e3efe7] text-[#1b4332] border border-[#b8dbc2]">
            🟢 Selesai
          </span>
        );
      case 'Dibatalkan':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#faecec] text-[#8a3333] border border-[#ecd3d3]">
            🔴 Dibatalkan
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div id="schedules-view" className="space-y-6 pb-20 sm:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1b4332] flex items-center gap-2 font-serif">
            <span>📅</span> RENCANA JADWAL
          </h1>
          <p className="text-xs sm:text-sm text-[#52796f] mt-1">
            Agenda rencana kegiatan kelompok, waktu, tempat berkumpul, dan status pelaksanaan.
          </p>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* View Mode Toggle */}
          <div className="bg-[#eeeae0] p-1 rounded-xl flex items-center gap-1 border border-[#ded7c5]">
            <button
              type="button"
              onClick={() => setViewMode('timeline')}
              className={`min-h-[36px] flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'timeline'
                  ? 'bg-[#1b4332] text-[#f7f5ed] shadow-2xs'
                  : 'text-[#3d5a45] hover:text-[#1b4332]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Daftar Card</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('calendar')}
              className={`min-h-[36px] flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-[#1b4332] text-[#f7f5ed] shadow-2xs'
                  : 'text-[#3d5a45] hover:text-[#1b4332]'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Kalender</span>
            </button>
          </div>

          {/* Khusus Pemilik: Tambah Jadwal / Pengunjung: Mode Transparansi */}
          {role === 'owner' ? (
            <button
              id="btn-tambah-jadwal"
              type="button"
              onClick={handleOpenAdd}
              className="min-h-[42px] inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-[#1b4332] hover:bg-[#143225] active:scale-[0.98] text-[#f7f5ed] font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-[#84a98c]" />
              <span>➕ Buat Jadwal</span>
            </button>
          ) : (
            <div
              id="badge-transparansi-jadwal-pengunjung"
              className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#eeeae0] text-[#3d5a45] text-xs font-semibold border border-[#ded7c5] shadow-2xs"
            >
              <span>👁️</span>
              <span>Mode Transparansi</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'timeline' ? (
        /* CARD VIEW: SECTION 4 MOBILE FOCUS */
        <div className="space-y-4">
          {schedules.length === 0 ? (
            <div className="py-16 text-center bg-[#fcfbf7] rounded-3xl border border-dashed border-[#ded7c5]">
              <CalendarIcon className="w-12 h-12 text-[#9bb3a2] mx-auto mb-3 opacity-60" />
              <h4 className="text-base font-bold text-[#1b4332] font-serif">Belum Ada Rencana Jadwal</h4>
              <p className="text-xs text-[#52796f] max-w-sm mx-auto mt-1 px-4">
                Jadwal kegiatan kelompok yang dibuat pemilik akan ditampilkan di sini untuk semua anggota dan pengunjung.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {schedules.map((sch) => (
                <div
                  key={sch.id}
                  id={`card-schedule-${sch.id}`}
                  className="bg-[#fcfbf7] rounded-3xl border border-[#ded7c5] p-5 sm:p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2.5 mb-3">
                      <h3 className="text-base sm:text-lg font-bold text-[#1b4332] leading-snug font-serif">
                        {sch.title}
                      </h3>
                      <div className="shrink-0">{getStatusBadge(sch.status)}</div>
                    </div>

                    {/* Metadata Items: Clear & Legible on mobile */}
                    <div className="space-y-2 text-xs text-[#364f3d] mb-4">
                      <div className="flex items-center gap-2 font-medium text-[#1b2b20]">
                        <span className="w-5 text-center text-sm">📅</span>
                        <span>{formatIndoDate(sch.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 font-medium text-[#1b2b20]">
                        <span className="w-5 text-center text-sm">⏰</span>
                        <span>{sch.time} WIB</span>
                      </div>
                      <div className="flex items-center gap-2 font-medium text-[#1b2b20]">
                        <span className="w-5 text-center text-sm">📍</span>
                        <span>{sch.location}</span>
                      </div>
                    </div>

                    {/* Description / Notes */}
                    {sch.description && (
                      <div className="p-3 bg-[#f7f5ed] rounded-xl border border-[#ded7c5] text-xs text-[#2c4234] leading-relaxed mb-4">
                        <span className="font-semibold text-[#1b4332] block mb-1">📝 Catatan Kegiatan:</span>
                        {sch.description}
                      </div>
                    )}
                  </div>

                  {/* Khusus Pemilik: Action controls */}
                  {role === 'owner' && (
                    <div className="pt-3 border-t border-[#ded7c5]/60 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(sch)}
                        className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#1b4332] bg-[#e4efe8] hover:bg-[#d5e7dc] border border-[#bed8c7] transition-colors cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setDeletingSchedule(sch)}
                        className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#8a3333] bg-[#fbebeb] hover:bg-[#f6d7d7] border border-[#e8c6c6] transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* CALENDAR MONTH VIEW */
        <div className="bg-[#fcfbf7] rounded-3xl border border-[#ded7c5] p-5 sm:p-7 shadow-2xs">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#ded7c5]">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#1b4332] font-serif">Agenda Kalender Kelompok</h3>
              <p className="text-xs text-[#52796f]">Daftar kegiatan yang telah dijadwalkan</p>
            </div>
            <div className="text-xs font-bold text-[#1b4332] bg-[#e4efe8] px-3 py-1 rounded-full border border-[#bed8c7]">
              {schedules.length} Kegiatan Terjadwal
            </div>
          </div>

          <div className="space-y-3">
            {schedules.map((sch) => (
              <div
                key={sch.id}
                className="p-4 rounded-2xl border border-[#ded7c5] bg-[#f7f5ed] hover:border-[#2d6a4f] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  {/* Date badge box */}
                  <div className="w-13 h-13 rounded-2xl bg-[#e3efe7] text-[#1b4332] flex flex-col items-center justify-center font-black shrink-0 border border-[#b8dbc2] font-serif">
                    <span className="text-[10px] font-bold leading-none">
                      {sch.date.split('-')[1] || '09'}
                    </span>
                    <span className="text-lg leading-none mt-1">
                      {sch.date.split('-')[2] || '20'}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-[#1b2b20] text-sm sm:text-base font-serif">{sch.title}</h4>
                      {getStatusBadge(sch.status)}
                    </div>
                    <div className="text-xs text-[#52796f] mt-1 flex flex-wrap items-center gap-3">
                      <span>⏰ {sch.time} WIB</span>
                      <span>📍 {sch.location}</span>
                    </div>
                    {sch.description && (
                      <p className="text-xs text-[#364f3d] mt-1 line-clamp-1">{sch.description}</p>
                    )}
                  </div>
                </div>

                {role === 'owner' && (
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleOpenEdit(sch)}
                      className="min-h-[38px] p-2 rounded-lg text-[#3d5a45] hover:bg-[#eeeae0] border border-[#ded7c5] cursor-pointer"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingSchedule(sch)}
                      className="min-h-[38px] p-2 rounded-lg text-[#8a3333] hover:bg-[#fbebeb] border border-[#ded7c5] cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD / EDIT SCHEDULE MODAL */}
      {modalSchedule.isOpen && (
        <div
          id="modal-add-edit-schedule"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#13241b]/70 backdrop-blur-xs p-4 overflow-y-auto"
        >
          <div className="bg-[#fdfcf9] rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-[#cbd8cf] my-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#e3efe7] text-[#1b4332] flex items-center justify-center text-xl border border-[#c2ddcc]">
                  {modalSchedule.isEditing ? '✏️' : '📅'}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#1b4332] font-serif">
                    {modalSchedule.isEditing ? 'Edit Jadwal Kegiatan' : 'Buat Jadwal Baru'}
                  </h3>
                  <p className="text-xs text-[#557861]">
                    {modalSchedule.isEditing
                      ? 'Perbarui rincian kegiatan kelompok'
                      : 'Rencanakan kegiatan baru untuk kelompok Money Gong'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalSchedule((prev) => ({ ...prev, isOpen: false }))}
                className="text-[#557861] hover:text-[#1b4332] p-1.5 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-[#fdf2f2] border border-[#f5c6cb] text-[#842029] rounded-xl text-xs font-medium flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#842029] shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveSchedule} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1b4332] mb-1.5 uppercase tracking-wider">
                  Nama Kegiatan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={modalSchedule.title}
                  onChange={(e) => setModalSchedule((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Contoh: Rapat Kas & Silaturahmi"
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#cbd5cb] bg-white text-[#1b2b20] focus:outline-hidden focus:border-[#1b4332] text-sm"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1b4332] mb-1.5 uppercase tracking-wider">
                    Tanggal <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={modalSchedule.date}
                    onChange={(e) => setModalSchedule((prev) => ({ ...prev, date: e.target.value }))}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#cbd5cb] bg-white text-[#1b2b20] focus:outline-hidden focus:border-[#1b4332] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1b4332] mb-1.5 uppercase tracking-wider">
                    Waktu <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={modalSchedule.time}
                    onChange={(e) => setModalSchedule((prev) => ({ ...prev, time: e.target.value }))}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#cbd5cb] bg-white text-[#1b2b20] focus:outline-hidden focus:border-[#1b4332] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1b4332] mb-1.5 uppercase tracking-wider">
                  Lokasi <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={modalSchedule.location}
                  onChange={(e) => setModalSchedule((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="Contoh: Rumah Dika / Balai Warga"
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#cbd5cb] bg-white text-[#1b2b20] focus:outline-hidden focus:border-[#1b4332] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1b4332] mb-1.5 uppercase tracking-wider">
                  Status Kegiatan
                </label>
                <select
                  value={modalSchedule.status}
                  onChange={(e) =>
                    setModalSchedule((prev) => ({
                      ...prev,
                      status: e.target.value as ScheduleStatus,
                    }))
                  }
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#cbd5cb] bg-white text-[#1b2b20] focus:outline-hidden focus:border-[#1b4332] text-sm"
                >
                  <option value="Direncanakan">🔵 Direncanakan</option>
                  <option value="Berlangsung">🟡 Berlangsung</option>
                  <option value="Selesai">🟢 Selesai</option>
                  <option value="Dibatalkan">🔴 Dibatalkan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1b4332] mb-1.5 uppercase tracking-wider">
                  Deskripsi / Catatan Kegiatan
                </label>
                <textarea
                  rows={3}
                  value={modalSchedule.description}
                  onChange={(e) => setModalSchedule((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Contoh: Membahas pembukuan kas dan persiapan acara kelompok..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#cbd5cb] bg-white text-[#1b2b20] focus:outline-hidden focus:border-[#1b4332] text-sm"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalSchedule((prev) => ({ ...prev, isOpen: false }))}
                  className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl border border-[#cbd5cb] bg-[#f7f5ed] text-[#3d5a45] text-xs sm:text-sm font-semibold hover:bg-[#eeeae0] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#143225] text-white text-xs sm:text-sm font-bold shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Jadwal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE SCHEDULE MODAL */}
      {deletingSchedule && (
        <div
          id="modal-delete-schedule"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#13241b]/70 backdrop-blur-xs p-4 overflow-y-auto"
        >
          <div className="bg-[#fdfcf9] rounded-3xl max-w-md w-full p-5 sm:p-7 shadow-2xl border border-[#cbd8cf] text-center my-auto">
            <div className="w-14 h-14 rounded-2xl bg-[#fbebeb] text-[#8a3333] flex items-center justify-center text-2xl mx-auto mb-4 border border-[#e8c6c6]">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[#1b4332] font-serif mb-2">Hapus Jadwal?</h3>
            <p className="text-xs text-[#52796f] mb-4">
              Apakah Anda yakin ingin menghapus agenda kegiatan <strong>{deletingSchedule.title}</strong>?
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingSchedule(null)}
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
