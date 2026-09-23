import { createFileRoute } from "@tanstack/react-router";
import { Edit2, Newspaper, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useAdminStore } from "@/lib/admin-hooks";
import { getNews, setNews, slugify, uniqueId, type NewsItem } from "@/lib/admin-store";
import { defaultNews } from "@/lib/content";

export const Route = createFileRoute("/admin/berita")({
  component: AdminBerita,
});

const EMPTY_FORM: Omit<NewsItem, "slug"> = {
  title: "",
  date: "",
  category: "",
  image: "",
  position: "center",
  excerpt: "",
  content: "",
};

function AdminBerita() {
  const store = useAdminStore();
  const articles = store.news.length > 0 ? store.news : defaultNews;

  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [form, setForm] = useState<typeof EMPTY_FORM>(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditing(null);
    setModal("add");
  };

  const openEdit = (item: NewsItem) => {
    setEditing(item);
    setForm({
      title: item.title,
      date: item.date,
      category: item.category,
      image: item.image as string,
      position: item.position,
      excerpt: item.excerpt,
      content: item.content ?? "",
    });
    setModal("edit");
  };

  const closeModal = () => {
    setModal(null);
    setEditing(null);
    setForm(EMPTY_FORM);
  };

  const handleSave = () => {
    const existing = getNews().length > 0 ? getNews() : [...defaultNews] as NewsItem[];
    if (modal === "add") {
      const newItem: NewsItem = {
        ...form,
        slug: slugify(form.title) || uniqueId(),
      };
      setNews([newItem, ...existing]);
    } else if (modal === "edit" && editing) {
      setNews(existing.map((item) => (item.slug === editing.slug ? { ...item, ...form } : item)));
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    closeModal();
  };

  const handleDelete = (slug: string) => {
    const existing = getNews().length > 0 ? getNews() : [...defaultNews] as NewsItem[];
    setNews(existing.filter((item) => item.slug !== slug));
    setDeleteConfirm(null);
  };

  const field = (key: keyof typeof form, label: string, type = "text", placeholder = "") => (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">{label}</label>
      {key === "excerpt" || key === "content" ? (
        <textarea
          value={form[key] as string}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          rows={key === "content" ? 5 : 3}
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      ) : (
        <input
          type={type}
          value={form[key] as string}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      )}
    </div>
  );

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Manajemen Berita</h1>
          <p className="mt-1 text-sm text-slate-400">{articles.length} artikel</p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-900/30 transition-all hover:-translate-y-0.5 hover:bg-blue-500"
        >
          <Plus className="size-4" />
          Tambah Berita
        </button>
      </div>

      {saved && (
        <div className="mb-5 rounded-lg border border-emerald-800 bg-emerald-900/20 px-4 py-3 text-sm font-medium text-emerald-400">
          ✓ Berita berhasil disimpan!
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        {articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500">
            <Newspaper className="size-12 mb-4 opacity-40" />
            <p className="font-medium">Belum ada berita</p>
            <p className="mt-1 text-sm">Klik "Tambah Berita" untuk mulai</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-left">
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Gambar</th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Judul</th>
                  <th className="hidden px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 md:table-cell">Kategori</th>
                  <th className="hidden px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 lg:table-cell">Tanggal</th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {articles.map((item) => (
                  <tr key={item.slug} className="transition-colors hover:bg-slate-800/50">
                    <td className="px-5 py-3">
                      <img
                        src={item.image as string}
                        alt={item.title}
                        className="size-12 rounded-lg object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%23334155'/%3E%3C/svg%3E"; }}
                      />
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-white line-clamp-2">{item.title}</p>
                      <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">{item.excerpt}</p>
                    </td>
                    <td className="hidden px-5 py-3 md:table-cell">
                      <span className="rounded-full bg-purple-900/40 px-2.5 py-1 text-xs font-semibold text-purple-300">{item.category}</span>
                    </td>
                    <td className="hidden px-5 py-3 text-slate-400 lg:table-cell">{item.date}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(item)}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-blue-900/30 hover:text-blue-400"
                          title="Edit"
                        >
                          <Edit2 className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirm(item.slug)}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-900/30 hover:text-red-400"
                          title="Hapus"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <h3 className="font-bold text-white">Hapus berita?</h3>
            <p className="mt-2 text-sm text-slate-400">Tindakan ini tidak dapat dibatalkan.</p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 rounded-lg bg-red-700 py-2.5 text-sm font-bold text-white hover:bg-red-600"
              >
                Hapus
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-lg border border-slate-700 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 pt-10">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
              <h2 className="font-bold text-white">{modal === "add" ? "Tambah Berita" : "Edit Berita"}</h2>
              <button type="button" onClick={closeModal} className="rounded-lg p-1 text-slate-400 hover:text-white">
                <X className="size-5" />
              </button>
            </div>
            <div className="space-y-4 px-6 py-5">
              {field("title", "Judul Berita *", "text", "Judul berita...")}
              <div className="grid gap-4 sm:grid-cols-2">
                {field("date", "Tanggal", "text", "cth: 12 September 2026")}
                {field("category", "Kategori", "text", "cth: Pembinaan")}
              </div>
              {field("image", "URL Gambar", "url", "https://...")}
              {form.image && (
                <div className="overflow-hidden rounded-lg">
                  <img src={form.image} alt="preview" className="aspect-video w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
              )}
              {field("position", "Posisi Gambar", "text", "center / top / 50% 25%")}
              {field("excerpt", "Ringkasan *", "text", "Deskripsi singkat berita...")}
              {field("content", "Isi Berita (opsional)", "text", "Tulis isi lengkap berita di sini...")}
            </div>
            <div className="flex gap-3 border-t border-slate-800 px-6 py-4">
              <button
                type="button"
                onClick={handleSave}
                disabled={!form.title || !form.excerpt}
                className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-bold text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 rounded-lg border border-slate-700 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
