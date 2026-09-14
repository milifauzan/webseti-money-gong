import React, { useState, useRef } from 'react';
import { UserRole, Member } from '../types';
import {
  UserPlus,
  Edit,
  Trash2,
  Camera,
  ImageOff,
  AlertTriangle,
  X,
  ShieldAlert,
} from 'lucide-react';
import {
  createMember,
  updateMember,
  deleteMember,
  uploadMemberPhoto,
  deleteMemberPhoto,
} from '../lib/api';

interface MembersViewProps {
  role: UserRole;
  members: Member[];
  onMembersUpdated: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const MembersView: React.FC<MembersViewProps> = ({
  role,
  members,
  onMembersUpdated,
  onShowToast,
}) => {
  // Add / Edit Member modal
  const [modalMember, setModalMember] = useState<{
    isOpen: boolean;
    isEditing: boolean;
    id?: string;
    name: string;
    position: string;
    description: string;
  }>({
    isOpen: false,
    isEditing: false,
    name: '',
    position: 'Anggota',
    description: '',
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete Member modal
  const [deletingMember, setDeletingMember] = useState<Member | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Photo Upload State
  const [uploadingMemberId, setUploadingMemberId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [activePhotoMember, setActivePhotoMember] = useState<Member | null>(null);

  const handleOpenAdd = () => {
    setFormError(null);
    setModalMember({
      isOpen: true,
      isEditing: false,
      name: '',
      position: 'Anggota',
      description: '',
    });
  };

  const handleOpenEdit = (m: Member) => {
    setFormError(null);
    setModalMember({
      isOpen: true,
      isEditing: true,
      id: m.id,
      name: m.name,
      position: m.position,
      description: m.description || '',
    });
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!modalMember.name.trim()) {
      setFormError('Nama anggota wajib diisi.');
      return;
    }
    if (!modalMember.position.trim()) {
      setFormError('Jabatan anggota wajib diisi.');
      return;
    }

    try {
      setIsSaving(true);
      if (modalMember.isEditing && modalMember.id) {
        await updateMember(modalMember.id, {
          name: modalMember.name.trim(),
          position: modalMember.position.trim(),
          description: modalMember.description.trim(),
        });
        onShowToast('success', '✅ Data anggota berhasil diperbarui.');
      } else {
        await createMember({
          name: modalMember.name.trim(),
          position: modalMember.position.trim(),
          description: modalMember.description.trim(),
        });
        onShowToast('success', '✅ Anggota berhasil ditambahkan.');
      }

      setIsSaving(false);
      setModalMember((prev) => ({ ...prev, isOpen: false }));
      onMembersUpdated();
    } catch (err: any) {
      setIsSaving(false);
      setFormError(err.message || 'Terjadi kesalahan saat menyimpan data.');
      onShowToast('error', err.message || 'Terjadi kesalahan saat menyimpan data.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingMember) return;
    try {
      setIsDeleting(true);
      await deleteMember(deletingMember.id);
      setIsDeleting(false);
      setDeletingMember(null);
      onMembersUpdated();
      onShowToast('success', '✅ Anggota berhasil dihapus.');
    } catch (err: any) {
      setIsDeleting(false);
      onShowToast('error', err.message || 'Terjadi kesalahan saat menghapus data.');
    }
  };

  // Trigger file picker for photo upload / replace
  const triggerPhotoUpload = (member: Member) => {
    setActivePhotoMember(member);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activePhotoMember) return;

    try {
      setUploadingMemberId(activePhotoMember.id);
      await uploadMemberPhoto(activePhotoMember.id, file);
      setUploadingMemberId(null);
      setActivePhotoMember(null);
      onMembersUpdated();
      onShowToast('success', '✅ Foto anggota berhasil diupload.');
    } catch (err: any) {
      setUploadingMemberId(null);
      setActivePhotoMember(null);
      onShowToast('error', err.message || 'Foto gagal diupload. Silakan coba lagi.');
    }
  };

  const handleDeletePhoto = async (member: Member) => {
    try {
      setUploadingMemberId(member.id);
      await deleteMemberPhoto(member.id);
      setUploadingMemberId(null);
      onMembersUpdated();
      onShowToast('success', '✅ Foto anggota berhasil dihapus.');
    } catch (err: any) {
      setUploadingMemberId(null);
      onShowToast('error', err.message || 'Terjadi kesalahan saat menghapus foto.');
    }
  };

  return (
    <div id="members-view" className="space-y-6 pb-20 sm:pb-12">
      {/* Hidden file input for photo upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png,image/jpeg,image/webp,image/jpg"
        className="hidden"
      />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1b4332] flex items-center gap-2 font-serif">
            <span>👥</span> KENALI KAMI
          </h1>
          <p className="text-xs sm:text-sm text-[#52796f] mt-1">
            Mengenal seluruh anggota kelompok penggerak dan pengelola kas Money Gong.
          </p>
        </div>

        {/* Khusus Pemilik: Tambah Anggota */}
        {role === 'owner' ? (
          <button
            id="btn-tambah-anggota"
            type="button"
            onClick={handleOpenAdd}
            className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#143225] active:scale-[0.98] text-[#f7f5ed] font-bold text-xs sm:text-sm shadow-xs transition-all self-start sm:self-center cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-[#84a98c]" />
            <span>➕ Tambah Anggota</span>
          </button>
        ) : (
          <div
            id="badge-transparansi-anggota-pengunjung"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#3d5a45] bg-[#eeeae0] px-3.5 py-2 rounded-xl border border-[#ded7c5] self-start sm:self-center shadow-2xs"
          >
            <span>👁️</span>
            <span>{members.length} Anggota Terdaftar (Mode Transparansi)</span>
          </div>
        )}
      </div>

      {/* Members Grid (1-col on mobile, 2-col on small tablet, 4-col on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {members.map((member, index) => {
          const isLeader = member.position.toLowerCase().includes('ketua');
          const isUploading = uploadingMemberId === member.id;

          return (
            <div
              key={member.id}
              id={`card-member-${member.id}`}
              className="bg-[#fcfbf7] rounded-3xl border border-[#ded7c5] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Photo Header Container - 1:1 or 4:3 with object-cover and loading="lazy" */}
                <div className="relative aspect-4/3 w-full bg-[#eee9dc] flex items-center justify-center overflow-hidden border-b border-[#ded7c5]">
                  {member.photo_url ? (
                    <img
                      src={member.photo_url}
                      alt={member.name}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-[#84a08e]">
                      <div className="w-16 h-16 rounded-2xl bg-[#dfd9cb] flex items-center justify-center text-2xl font-black text-[#1b4332] mb-1 font-serif">
                        {member.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-[11px] font-medium text-[#52796f]">Foto belum diunggah</span>
                    </div>
                  )}

                  {/* Position Badge Overlay */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold shadow-xs ${
                        isLeader
                          ? 'bg-[#1b4332] text-[#f7f5ed] border border-[#143225]'
                          : 'bg-[#344e41]/90 backdrop-blur-xs text-[#f7f5ed]'
                      }`}
                    >
                      {isLeader ? '👑' : '👤'} {member.position}
                    </span>
                  </div>

                  {/* Number order indicator */}
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#fcfbf7]/90 backdrop-blur-xs text-[11px] font-bold text-[#1b4332] flex items-center justify-center shadow-xs border border-[#ded7c5]">
                    #{index + 1}
                  </div>

                  {/* Loading indicator for photo upload */}
                  {isUploading && (
                    <div className="absolute inset-0 bg-[#13241b]/70 backdrop-blur-xs flex items-center justify-center text-white text-xs font-semibold">
                      <div className="animate-spin mr-2">⏳</div> Memproses Foto...
                    </div>
                  )}
                </div>

                {/* Body Details */}
                <div className="p-4 sm:p-5">
                  <h3 className="font-extrabold text-base sm:text-lg text-[#1b4332] leading-snug font-serif">
                    {member.name}
                  </h3>
                  <div className="text-xs font-semibold text-[#52796f] mt-0.5 mb-2">
                    {member.position}
                  </div>
                  <p className="text-xs text-[#3d5a45] leading-relaxed line-clamp-3">
                    {member.description || 'Anggota kelompok Money Gong.'}
                  </p>
                </div>
              </div>

              {/* Khusus Pemilik: Management Controls */}
              {role === 'owner' && (
                <div className="p-3 sm:p-4 bg-[#f4efe4] border-t border-[#ded7c5] flex flex-col gap-2">
                  {/* Photo Actions Row */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => triggerPhotoUpload(member)}
                      disabled={isUploading}
                      className="flex-1 min-h-[38px] inline-flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-bold text-[#1b4332] bg-[#e4efe8] hover:bg-[#d5e7dc] border border-[#bed8c7] transition-colors cursor-pointer"
                      title={member.photo_url ? 'Ganti Foto Anggota' : 'Upload Foto Anggota'}
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{member.photo_url ? '🔄 Ganti Foto' : '📷 Upload Foto'}</span>
                    </button>

                    {member.photo_url && (
                      <button
                        type="button"
                        onClick={() => handleDeletePhoto(member)}
                        disabled={isUploading}
                        className="min-h-[38px] px-2.5 rounded-xl text-[#8a3333] bg-[#fbebeb] hover:bg-[#f6d7d7] border border-[#e8c6c6] transition-colors cursor-pointer"
                        title="Hapus Foto"
                      >
                        <ImageOff className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Edit & Delete Member Info Row */}
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(member)}
                      className="flex-1 min-h-[38px] inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-xs font-bold text-[#3d5a45] bg-[#fcfbf7] hover:bg-[#eeeae0] border border-[#ded7c5] transition-colors cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Data</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingMember(member)}
                      className="min-h-[38px] px-2.5 rounded-xl text-[#8a3333] bg-[#fcfbf7] hover:bg-[#fbebeb] border border-[#ded7c5] hover:border-[#e8c6c6] transition-colors cursor-pointer"
                      title="Hapus Anggota"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ADD / EDIT MEMBER MODAL */}
      {modalMember.isOpen && (
        <div
          id="modal-add-edit-member"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#13241b]/70 backdrop-blur-xs p-4 overflow-y-auto"
        >
          <div className="bg-[#fdfcf9] rounded-3xl max-w-md w-full p-5 sm:p-7 shadow-2xl border border-[#cbd8cf] my-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#e3efe7] text-[#1b4332] flex items-center justify-center text-xl border border-[#c2ddcc]">
                  {modalMember.isEditing ? '✏️' : '➕'}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#1b4332] font-serif">
                    {modalMember.isEditing ? 'Edit Data Anggota' : 'Tambah Anggota Baru'}
                  </h3>
                  <p className="text-xs text-[#557861]">
                    {modalMember.isEditing
                      ? 'Perbarui nama, jabatan, atau keterangan'
                      : 'Tambahkan anggota baru ke kelompok'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalMember((prev) => ({ ...prev, isOpen: false }))}
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

            <form onSubmit={handleSaveMember} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1b4332] mb-1.5 uppercase tracking-wider">
                  Nama Anggota <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={modalMember.name}
                  onChange={(e) => setModalMember((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Contoh: Den Bau"
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#cbd5cb] bg-white text-[#1b2b20] focus:outline-hidden focus:border-[#1b4332] text-sm"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1b4332] mb-1.5 uppercase tracking-wider">
                  Jabatan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={modalMember.position}
                  onChange={(e) => setModalMember((prev) => ({ ...prev, position: e.target.value }))}
                  placeholder="Contoh: Ketua / Anggota"
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#cbd5cb] bg-white text-[#1b2b20] focus:outline-hidden focus:border-[#1b4332] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1b4332] mb-1.5 uppercase tracking-wider">
                  Deskripsi / Tugas
                </label>
                <textarea
                  rows={3}
                  value={modalMember.description}
                  onChange={(e) => setModalMember((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Tuliskan tugas atau peran anggota..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#cbd5cb] bg-white text-[#1b2b20] focus:outline-hidden focus:border-[#1b4332] text-sm"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalMember((prev) => ({ ...prev, isOpen: false }))}
                  className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl border border-[#cbd5cb] bg-[#f7f5ed] text-[#3d5a45] text-xs sm:text-sm font-semibold hover:bg-[#eeeae0] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#143225] text-white text-xs sm:text-sm font-bold shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Anggota'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MEMBER MODAL */}
      {deletingMember && (
        <div
          id="modal-delete-member"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#13241b]/70 backdrop-blur-xs p-4 overflow-y-auto"
        >
          <div className="bg-[#fdfcf9] rounded-3xl max-w-md w-full p-5 sm:p-7 shadow-2xl border border-[#cbd8cf] text-center my-auto">
            <div className="w-14 h-14 rounded-2xl bg-[#fbebeb] text-[#8a3333] flex items-center justify-center text-2xl mx-auto mb-4 border border-[#e8c6c6]">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[#1b4332] font-serif mb-2">Hapus Anggota?</h3>
            <p className="text-xs text-[#52796f] mb-4">
              Apakah Anda yakin ingin menghapus data <strong>{deletingMember.name}</strong>? File foto yang tersimpan juga akan dibersihkan dari server.
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingMember(null)}
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
