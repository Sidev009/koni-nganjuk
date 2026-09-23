import { createFileRoute } from "@tanstack/react-router";
import { Monitor, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAdminStore } from "@/lib/admin-hooks";
import { getHeader, setHeader } from "@/lib/admin-store";
import { heroImage as defaultHeroImage } from "@/lib/content";

export const Route = createFileRoute("/admin/header")({
  component: AdminHeader,
});

function AdminHeader() {
  const store = useAdminStore();
  const header = store.header;

  const [heroUrl, setHeroUrl] = useState(header.heroImageUrl);
  const [ticker, setTicker] = useState<string[]>(header.tickerItems);
  const [newTicker, setNewTicker] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setHeader({ heroImageUrl: heroUrl, tickerItems: ticker });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const addTicker = () => {
    if (newTicker.trim()) {
      setTicker((t) => [...t, newTicker.trim()]);
      setNewTicker("");
    }
  };

  const removeTicker = (idx: number) => {
    setTicker((t) => t.filter((_, i) => i !== idx));
  };

  const moveTicker = (idx: number, dir: -1 | 1) => {
    setTicker((t) => {
      const next = [...t];
      const swapIdx = idx + dir;
      if (swapIdx < 0 || swapIdx >= next.length) return next;
      [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
      return next;
    });
  };

  const previewSrc = heroUrl || defaultHeroImage;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Atur Header Website</h1>
        <p className="mt-1 text-sm text-slate-400">Ubah gambar hero dan teks ticker pengumuman</p>
      </div>

      {saved && (
        <div className="mb-5 rounded-lg border border-emerald-800 bg-emerald-900/20 px-4 py-3 text-sm font-medium text-emerald-400">
          ✓ Header berhasil diperbarui!
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Hero Image */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-4 flex items-center gap-3">
            <Monitor className="size-5 text-amber-400" />
            <h2 className="font-bold text-white">Gambar Hero (Header)</h2>
          </div>

          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">URL Gambar</label>
          <input
            type="url"
            value={heroUrl}
            onChange={(e) => setHeroUrl(e.target.value)}
            placeholder="https://... (kosongkan untuk pakai gambar default)"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
          />
          <p className="mt-1.5 text-xs text-slate-500">
            Kosongkan untuk menggunakan gambar bawaan. Gunakan gambar resolusi tinggi (min. 1920×800px).
          </p>

          {/* Preview */}
          <div className="mt-4 overflow-hidden rounded-lg">
            <div className="relative aspect-video overflow-hidden">
              <img
                src={previewSrc as string}
                alt="Hero preview"
                className="size-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = defaultHeroImage; }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
              <div className="absolute inset-0 flex items-center px-6">
                <div>
                  <p className="text-xs font-bold uppercase text-amber-300">Preview</p>
                  <p className="mt-1 text-lg font-extrabold text-white">KONI Kabupaten Nganjuk</p>
                </div>
              </div>
            </div>
          </div>

          {heroUrl && (
            <button
              type="button"
              onClick={() => setHeroUrl("")}
              className="mt-3 text-xs text-slate-500 hover:text-red-400"
            >
              Reset ke gambar default
            </button>
          )}
        </div>

        {/* Ticker */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex size-5 items-center justify-center">📢</span>
            <h2 className="font-bold text-white">Teks Ticker Pengumuman</h2>
          </div>

          {/* Ticker items list */}
          <div className="space-y-2 mb-4">
            {ticker.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2">
                <div className="flex flex-col gap-0.5">
                  <button type="button" onClick={() => moveTicker(idx, -1)} disabled={idx === 0} className="text-slate-500 hover:text-slate-300 disabled:opacity-30 text-xs leading-none">▲</button>
                  <button type="button" onClick={() => moveTicker(idx, 1)} disabled={idx === ticker.length - 1} className="text-slate-500 hover:text-slate-300 disabled:opacity-30 text-xs leading-none">▼</button>
                </div>
                <p className="flex-1 truncate text-sm text-white">{item}</p>
                <button type="button" onClick={() => removeTicker(idx)} className="shrink-0 rounded p-1 text-slate-500 hover:bg-red-900/30 hover:text-red-400">
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add new ticker item */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newTicker}
              onChange={(e) => setNewTicker(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTicker(); } }}
              placeholder="Tambah pengumuman baru..."
              className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-500"
            />
            <button
              type="button"
              onClick={addTicker}
              disabled={!newTicker.trim()}
              className="rounded-lg bg-amber-700 px-3 py-2.5 text-white hover:bg-amber-600 disabled:opacity-50"
            >
              <Plus className="size-4" />
            </button>
          </div>

          {/* Preview ticker */}
          <div className="mt-4 overflow-hidden rounded-lg bg-gradient-to-r from-blue-950 to-slate-800 py-2 text-xs font-semibold text-white">
            <div className="flex gap-6 px-3">
              <span className="shrink-0 font-bold uppercase text-amber-300">PENGUMUMAN RESMI:</span>
              {ticker.map((item, i) => (
                <span key={i} className="shrink-0">{item} •</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg bg-amber-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-amber-900/30 transition-all hover:-translate-y-0.5 hover:bg-amber-500"
        >
          Simpan Perubahan Header
        </button>
      </div>
    </div>
  );
}
