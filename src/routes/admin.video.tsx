import { createFileRoute } from "@tanstack/react-router";
import { Edit2, Play, Plus, Trash2, Video, X } from "lucide-react";
import { useState } from "react";
import { useAdminStore } from "@/lib/admin-hooks";
import { getVideos, setVideos, uniqueId, type VideoItem } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/video")({
  component: AdminVideo,
});

const EMPTY_FORM = { youtubeId: "", title: "", description: "", category: "" };

/** Extract YouTube video ID from URL or ID string */
function extractYoutubeId(input: string): string {
  const match = input.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|embed\/)([^&?/\s]{11})/);
  return match ? match[1] : input.trim();
}

function AdminVideo() {
  const store = useAdminStore();
  const videos = store.videos;

  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<VideoItem | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [rawUrl, setRawUrl] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const openAdd = () => { setForm(EMPTY_FORM); setRawUrl(""); setEditing(null); setModal("add"); };
  const openEdit = (item: VideoItem) => {
    setEditing(item);
    setRawUrl(item.youtubeId);
    setForm({ youtubeId: item.youtubeId, title: item.title, description: item.description, category: item.category });
    setModal("edit");
  };
  const closeModal = () => { setModal(null); setEditing(null); setForm(EMPTY_FORM); setRawUrl(""); };

  const handleUrlChange = (val: string) => {
    setRawUrl(val);
    setForm((f) => ({ ...f, youtubeId: extractYoutubeId(val) }));
  };

  const handleSave = () => {
    const existing = getVideos();
    if (modal === "add") {
      setVideos([...existing, { ...form, id: uniqueId() }]);
    } else if (editing) {
      setVideos(existing.map((v) => (v.id === editing.id ? { ...v, ...form } : v)));
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    closeModal();
  };

  const handleDelete = (id: string) => {
    setVideos(getVideos().filter((v) => v.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Manajemen Video</h1>
          <p className="mt-1 text-sm text-slate-400">{videos.length} video</p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-900/30 transition-all hover:-translate-y-0.5 hover:bg-rose-500"
        >
          <Plus className="size-4" />
          Tambah Video
        </button>
      </div>

      {saved && (
        <div className="mb-5 rounded-lg border border-emerald-800 bg-emerald-900/20 px-4 py-3 text-sm font-medium text-emerald-400">
          ✓ Video berhasil disimpan!
        </div>
      )}

      {/* Grid */}
      {videos.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 py-16 text-center text-slate-500">
          <Video className="mx-auto size-12 mb-4 opacity-40" />
          <p className="font-medium">Belum ada video</p>
          <p className="mt-1 text-sm">Klik "Tambah Video" untuk mulai</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {videos.map((video) => (
            <div key={video.id} className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
              <div className="aspect-video bg-neutral-900">
                <iframe
                  className="size-full"
                  src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
                  title={video.title}
                  loading="lazy"
                  allowFullScreen
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="inline-flex items-center gap-1 text-xs font-bold uppercase text-rose-400">
                      <Play className="size-3 fill-current" />
                      {video.category}
                    </span>
                    <h3 className="mt-1 font-semibold text-white line-clamp-2">{video.title}</h3>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">{video.description}</p>
                    <p className="mt-2 rounded bg-slate-800 px-2 py-1 font-mono text-[10px] text-slate-400">ID: {video.youtubeId}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button type="button" onClick={() => openEdit(video)} className="rounded-lg p-2 text-slate-400 hover:bg-blue-900/30 hover:text-blue-400" title="Edit"><Edit2 className="size-4" /></button>
                    <button type="button" onClick={() => setDeleteConfirm(video.id)} className="rounded-lg p-2 text-slate-400 hover:bg-red-900/30 hover:text-red-400" title="Hapus"><Trash2 className="size-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <h3 className="font-bold text-white">Hapus video ini?</h3>
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
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
              <h2 className="font-bold text-white">{modal === "add" ? "Tambah Video" : "Edit Video"}</h2>
              <button type="button" onClick={closeModal} className="rounded-lg p-1 text-slate-400 hover:text-white"><X className="size-5" /></button>
            </div>
            <div className="space-y-4 px-6 py-5">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">URL atau ID YouTube *</label>
                <input
                  type="text"
                  value={rawUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://youtube.com/watch?v=... atau ScMzIvxBSi4"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                />
                {form.youtubeId && (
                  <p className="mt-1 text-xs text-slate-500">ID terdeteksi: <code className="text-rose-400">{form.youtubeId}</code></p>
                )}
              </div>
              {form.youtubeId && (
                <div className="overflow-hidden rounded-lg">
                  <iframe className="aspect-video w-full" src={`https://www.youtube-nocookie.com/embed/${form.youtubeId}`} title="preview" loading="lazy" allowFullScreen />
                </div>
              )}
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Judul Video *</label>
                <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Judul video..." className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-rose-500" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Kategori</label>
                <input type="text" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="cth: Liputan Kegiatan" className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-rose-500" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Deskripsi</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} placeholder="Deskripsi singkat video..." className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-rose-500" />
              </div>
            </div>
            <div className="flex gap-3 border-t border-slate-800 px-6 py-4">
              <button type="button" onClick={handleSave} disabled={!form.youtubeId || !form.title} className="flex-1 rounded-lg bg-rose-600 py-2.5 text-sm font-bold text-white hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed">Simpan</button>
              <button type="button" onClick={closeModal} className="flex-1 rounded-lg border border-slate-700 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800">Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
