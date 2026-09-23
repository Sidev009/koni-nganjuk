import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, RotateCcw, Save, Settings, Shield, User } from "lucide-react";
import { useState } from "react";
import { useAdminStore } from "@/lib/admin-hooks";
import { getSiteSettings, setSiteSettings, type SiteSettings } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/pengaturan")({
  component: AdminPengaturan,
});

function AdminPengaturan() {
  const store = useAdminStore();
  const [form, setForm] = useState<SiteSettings>(() => getSiteSettings());
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSiteSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleResetDefaults = () => {
    localStorage.removeItem("koni_admin_store");
    window.dispatchEvent(new Event("koni-store-change"));
    setForm(getSiteSettings());
    setConfirmReset(false);
    setResetDone(true);
    setTimeout(() => setResetDone(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-slate-800 text-blue-400">
            <Settings className="size-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-white">Pengaturan Umum</h1>
            <p className="text-sm text-slate-400">
              Kelola informasi kontak, media sosial, dan data sistem website KONI Kabupaten Nganjuk
            </p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {saved && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-400">
          <CheckCircle2 className="size-5 shrink-0" />
          <span className="text-sm font-semibold">Pengaturan berhasil disimpan dan langsung diterapkan ke website!</span>
        </div>
      )}

      {resetDone && (
        <div className="flex items-center gap-3 rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 text-blue-400">
          <CheckCircle2 className="size-5 shrink-0" />
          <span className="text-sm font-semibold">Semua data berhasil dikembalikan ke pengaturan awal website.</span>
        </div>
      )}

      {/* Form Settings */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Contact Info Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm">
          <h2 className="text-lg font-bold text-white mb-1">Informasi Kontak & Sekretariat</h2>
          <p className="text-xs text-slate-400 mb-6">
            Informasi ini ditampilkan di halaman Kontak dan bagian footer website.
          </p>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                Alamat Sekretariat
              </label>
              <textarea
                rows={3}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Contoh: Stadion Anjuk Ladang, Jl. Anjuk Ladang, Nganjuk"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                  Email Resmi
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="sekretariat@koni-nganjuk.or.id"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                  Telepon / WhatsApp
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="0812-xxxx-xxxx / (0358) xxxxxx"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                Tautan Channel YouTube
              </label>
              <input
                type="url"
                value={form.youtubeChannelUrl}
                onChange={(e) => setForm({ ...form, youtubeChannelUrl: e.target.value })}
                placeholder="https://www.youtube.com/@koninganjuk"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 active:scale-[0.98]"
            >
              <Save className="size-4" />
              Simpan Pengaturan
            </button>
          </div>
        </div>
      </form>

      {/* Admin Account Info Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <span className="flex size-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
            <Shield className="size-5" />
          </span>
          <div>
            <h2 className="text-base font-bold text-white">Informasi Akun Admin</h2>
            <p className="text-xs text-slate-400">Kredensial akses dashboard admin website</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm border-b border-slate-800/80 pb-3">
            <span className="text-slate-400 flex items-center gap-2">
              <User className="size-4 text-slate-500" /> Username
            </span>
            <span className="font-mono font-bold text-white bg-slate-800 px-2.5 py-1 rounded-md text-xs">
              admin_koni
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm pt-1">
            <span className="text-slate-400 flex items-center gap-2">
              <Shield className="size-4 text-slate-500" /> Kata Sandi Default
            </span>
            <span className="font-mono font-bold text-emerald-400 bg-slate-800 px-2.5 py-1 rounded-md text-xs">
              koni@nganjuk
            </span>
          </div>
        </div>
      </div>

      {/* Danger Zone: Reset Data */}
      <div className="rounded-2xl border border-red-900/30 bg-red-950/20 p-6">
        <div className="flex items-start gap-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
            <AlertCircle className="size-5" />
          </span>
          <div className="flex-1">
            <h3 className="text-base font-bold text-red-200">Reset Semua Konten ke Awal</h3>
            <p className="mt-1 text-xs text-red-300/70 leading-relaxed">
              Tindakan ini akan mengosongkan perubahan lokal pada berita, galeri, video, dan header yang telah diubah di dashboard dan mengembalikannya ke data bawaan awal website.
            </p>

            {confirmReset ? (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-red-600/30 hover:bg-red-500 transition"
                >
                  <RotateCcw className="size-3.5" />
                  Ya, Reset Sekarang
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 transition"
                >
                  Batal
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-300 hover:bg-red-500/20 transition"
              >
                <RotateCcw className="size-3.5" />
                Kembalikan Konten ke Awal
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
