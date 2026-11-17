import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Image,
  Monitor,
  Newspaper,
  Settings,
  Video,
  TrendingUp,
  ExternalLink,
} from "lucide-react";
import { useAdminStore } from "@/lib/admin-hooks";
import { defaultNews, defaultGallery } from "@/lib/content";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className={`inline-flex size-11 items-center justify-center rounded-lg ${color}`}>
        <Icon className="size-5 text-white" />
      </div>
      <p className="mt-4 text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-sm text-slate-600">{label}</p>
    </div>
  );
}

const quickLinks = [
  { label: "Kelola Berita", to: "/admin/berita", icon: Newspaper, color: "bg-blue-600", desc: "Tambah & edit artikel" },
  { label: "Kelola Galeri", to: "/admin/galeri", icon: Image, color: "bg-blue-600", desc: "Atur foto kegiatan" },
  { label: "Kelola Video", to: "/admin/video", icon: Video, color: "bg-blue-600", desc: "Tambah link YouTube" },
  { label: "Atur Header", to: "/admin/header", icon: Monitor, color: "bg-blue-600", desc: "Gambar & ticker" },
  { label: "Pengaturan", to: "/admin/pengaturan", icon: Settings, color: "bg-blue-600", desc: "Info & kontak" },
];

function AdminDashboard() {
  const store = useAdminStore();

  const newsCount = store.news.length > 0 ? store.news.length : defaultNews.length;
  const galleryCount = store.gallery.length > 0 ? store.gallery.length : defaultGallery.length;
  const videoCount = store.videos.length;

  return (
    <div>
      {/* Page header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">Selamat datang kembali, Admin KONI Nganjuk</p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm transition-colors hover:bg-blue-50"
        >
          <ExternalLink className="size-4" />
          Lihat Website
        </a>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard icon={Newspaper} label="Total Berita" value={newsCount} color="bg-blue-600" />
        <StatCard icon={Image} label="Foto Galeri" value={galleryCount} color="bg-blue-600" />
        <StatCard icon={Video} label="Video" value={videoCount} color="bg-blue-600" />
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">Aksi Cepat</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-blue-300 hover:bg-blue-50"
              >
                <span className={`flex size-11 shrink-0 items-center justify-center rounded-lg ${item.color} transition-transform group-hover:scale-110`}>
                  <Icon className="size-5 text-white" />
                </span>
                <div>
                  <p className="font-semibold text-slate-900">{item.label}</p>
                  <p className="text-xs text-slate-600">{item.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Info card */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
        <div className="flex items-start gap-4">
          <TrendingUp className="mt-0.5 size-5 shrink-0 text-blue-600" />
          <div>
            <p className="font-semibold text-blue-900">Tips Penggunaan</p>
            <ul className="mt-2 space-y-1.5 text-sm text-blue-800">
              <li>• Perubahan konten akan langsung tampil di website tanpa reload.</li>
              <li>• Gunakan URL gambar dari internet untuk foto berita & galeri.</li>
              <li>• Video cukup masukkan ID YouTube (contoh: <code className="rounded bg-blue-100 px-1">ScMzIvxBSi4</code>).</li>
              <li>• Data tersimpan di browser — backup manual jika diperlukan.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
