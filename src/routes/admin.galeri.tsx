import { createFileRoute } from "@tanstack/react-router";
import { Edit2, Image, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useAdminStore } from "@/lib/admin-hooks";
import { getGallery, setGallery, uniqueId, type GalleryItem } from "@/lib/admin-store";
import { defaultGallery } from "@/lib/content";

export const Route = createFileRoute("/admin/galeri")({
  component: AdminGaleri,
});

const EMPTY_FORM = { title: "", image: "", position: "center" };

function AdminGaleri() {
  const store = useAdminStore();
  const items = store.gallery.length > 0 ? store.gallery : (defaultGallery as GalleryItem[]);

  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const openAdd = () => { setForm(EMPTY_FORM); setEditing(null); setModal("add"); };
  const openEdit = (item: GalleryItem) => { setEditing(item); setForm({ title: item.title, image: item.image as string, position: item.position }); setModal("edit"); };
  const closeModal = () => { setModal(null); setEditing(null); setForm(EMPTY_FORM); };

  const handleSave = () => {
    const existing = getGallery().length > 0 ? getGallery() : (defaultGallery as GalleryItem[]);
    if (modal === "add") {
      setGallery([...existing, { ...form, id: uniqueId() }]);
    } else if (editing) {
      setGallery(existing.map((g) => (g.id === editing.id ? { ...g, ...form } : g)));
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    closeModal();
  };

  const handleDelete = (id: string) => {
    const existing = getGallery().length > 0 ? getGallery() : (defaultGallery as GalleryItem[]);
    setGallery(existing.filter((g) => g.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Manajemen Galeri</h1>
          <p className="mt-1 text-sm text-slate-400">{items.length} foto</p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/30 transition-all hover:-translate-y-0.5 hover:bg-emerald-500"
        >
          <Plus className="size-4" />
          Tambah Foto
        </button>
      </div>

      {saved && (
        <div className="mb-5 rounded-lg border border-emerald-800 bg-emerald-900/20 px-4 py-3 text-sm font-medium text-emerald-400">
          ✓ Galeri berhasil diperbarui!
        </div>
      )}

      {/* Photo grid */}
      {items.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 py-16 text-center text-slate-500">
          <Image className="mx-auto size-12 mb-4 opacity-40" />
          <p className="font-medium">Belum ada foto</p>
          <p className="mt-1 text-sm">Klik "Tambah Foto" untuk mulai</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
              <div className="aspect-square overflow-hidden">
                <img
                  src={item.image as string}
                  alt={item.title}
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  style={{ objectPosition: item.position }}
                  onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23334155'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='14' fill='%2394a3b8' text-anchor='middle' dominant-baseline='middle'%3EGambar%3C/text%3E%3C/svg%3E"; }}
                />
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-medium text-white">{item.title}</p>
                <p className="text-xs text-slate-500">{item.position}</p>
              </div>
              {/* Hover actions */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  className="rounded-lg bg-blue-600 p-2.5 text-white hover:bg-blue-500"
                  title="Edit"
                >
                  <Edit2 className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(item.id)}
                  className="rounded-lg bg-red-700 p-2.5 text-white hover:bg-red-600"
                  title="Hapus"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <h3 className="font-bold text-white">Hapus foto ini?</h3>
            <p className="mt-2 text-sm text-slate-400">Tindakan ini tidak dapat dibatalkan.</p>
            <div className="mt-5 flex gap-3">
              <button type="button" onClick={() => handleDelete(deleteConfirm)} className="flex-1 rounded-lg bg-red-700 py-2.5 text-sm font-bold text-white hover:bg-red-600">Hapus</button>
              <button type="button" onClick={() => setDeleteConfirm(null)} className="flex-1 rounded-lg border border-slate-700 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800">Batal</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 pt-10">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
              <h2 className="font-bold text-white">{modal === "add" ? "Tambah Foto" : "Edit Foto"}</h2>
              <button type="button" onClick={closeModal} className="rounded-lg p-1 text-slate-400 hover:text-white"><X className="size-5" /></button>
            </div>
            <div className="space-y-4 px-6 py-5">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Judul Foto *</label>
                <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="cth: Cabang Bulu Tangkis" className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">URL Gambar *</label>
                <input type="url" value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} placeholder="https://..." className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" />
              </div>
              {form.image && (
                <div className="overflow-hidden rounded-lg">
                  <img src={form.image} alt="preview" className="aspect-square w-full object-cover" style={{ objectPosition: form.position }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
              )}
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Posisi Gambar</label>
                <select value={form.position} onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))} className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500">
                  <option value="center">Center (tengah)</option>
                  <option value="top">Top (atas)</option>
                  <option value="bottom">Bottom (bawah)</option>
                  <option value="0% 0%">Kiri atas</option>
                  <option value="100% 0%">Kanan atas</option>
                  <option value="0% 100%">Kiri bawah</option>
                  <option value="100% 100%">Kanan bawah</option>
                  <option value="50% 25%">50% 25%</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 border-t border-slate-800 px-6 py-4">
              <button type="button" onClick={handleSave} disabled={!form.title || !form.image} className="flex-1 rounded-lg bg-emerald-600 py-2.5 text-sm font-bold text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed">Simpan</button>
              <button type="button" onClick={closeModal} className="flex-1 rounded-lg border border-slate-700 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800">Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
