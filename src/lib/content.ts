import heroImage from "@/assets/koni-hero.jpg";
import sportsImage from "@/assets/koni-sports-grid.jpg";
import athletesImage from "@/assets/koni-athletes.jpg";

export { heroImage, sportsImage, athletesImage };

// ─── Static fallback data (used when admin hasn't added content yet) ──────────

export const defaultNews = [
  { slug: "pembinaan-atlet-muda", title: "Pembinaan Atlet Muda Menuju Prestasi Berkelanjutan", date: "12 September 2026", category: "Pembinaan", image: athletesImage, position: "center", excerpt: "KONI Kabupaten Nganjuk memperkuat pembinaan berjenjang untuk menyiapkan atlet muda yang tangguh dan berprestasi." },
  { slug: "koordinasi-cabang-olahraga", title: "Koordinasi Cabang Olahraga Jelang Kompetisi Daerah", date: "8 September 2026", category: "Organisasi", image: heroImage, position: "center", excerpt: "Pengurus cabang olahraga menyelaraskan program latihan, kebutuhan atlet, dan agenda kompetisi mendatang." },
  { slug: "semangat-atlet-nganjuk", title: "Semangat Atlet Nganjuk di Arena Regional", date: "3 September 2026", category: "Prestasi", image: sportsImage, position: "50% 25%", excerpt: "Atlet-atlet Nganjuk menunjukkan disiplin, sportivitas, dan semangat juang dalam berbagai cabang olahraga." },
];

export const defaultGallery = [
  { id: "g1", title: "Cabang Bulu Tangkis", image: sportsImage, position: "0% 0%" },
  { id: "g2", title: "Lintasan Atletik", image: sportsImage, position: "100% 0%" },
  { id: "g3", title: "Pertandingan Bola Voli", image: sportsImage, position: "0% 100%" },
  { id: "g4", title: "Pencak Silat", image: sportsImage, position: "100% 100%" },
  { id: "g5", title: "Defile Atlet", image: heroImage, position: "center" },
  { id: "g6", title: "Perayaan Prestasi", image: athletesImage, position: "center" },
];

// ─── Dynamic getters (read from localStorage admin store if available) ────────

function tryReadStore() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("koni_admin_store");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Returns news list: from admin store if populated, else defaults. */
export function getDynamicNews() {
  const store = tryReadStore();
  if (store?.news && store.news.length > 0) return store.news as typeof defaultNews;
  return defaultNews;
}

/** Returns gallery: from admin store if populated, else defaults. */
export function getDynamicGallery() {
  const store = tryReadStore();
  if (store?.gallery && store.gallery.length > 0) return store.gallery as typeof defaultGallery;
  return defaultGallery;
}

/** Returns videos list: from admin store. */
export function getDynamicVideos() {
  const store = tryReadStore();
  if (store?.videos && store.videos.length > 0) return store.videos as Array<{ id: string; youtubeId: string; title: string; description: string; category: string }>;
  return [
    { id: "v1", youtubeId: "ScMzIvxBSi4", title: "Semangat Olahraga Kabupaten Nganjuk", description: "Dokumentasi kebersamaan atlet, pelatih, dan pengurus cabang olahraga.", category: "Liputan Kegiatan" },
    { id: "v2", youtubeId: "M7lc1UVf-VE", title: "Pembinaan Atlet Menuju Prestasi Provinsi & Nasional", description: "Program pelatihan terpusat serta dedikasi atlet muda Nganjuk.", category: "Pembinaan Atlet" },
  ];
}

/** Returns hero image URL: from admin store if set, else bundled asset. */
export function getDynamicHeroImage(): string {
  const store = tryReadStore();
  if (store?.header?.heroImageUrl) return store.header.heroImageUrl as string;
  return heroImage;
}

/** Returns ticker items array from admin store or defaults. */
export function getDynamicTicker(): string[] {
  const store = tryReadStore();
  if (store?.header?.tickerItems?.length > 0) return store.header.tickerItems as string[];
  return [
    "Selamat Datang di Portal Resmi KONI Kabupaten Nganjuk",
    "Pemusatan Latihan 30+ Cabang Olahraga Aktif",
    "Semangat Sportivitas Generasi Muda Nganjuk",
    "Sekretariat: Stadion Anjuk Ladang Nganjuk",
  ];
}

/** Returns site settings from admin store or defaults. */
export function getDynamicSettings() {
  const store = tryReadStore();
  return {
    address: store?.settings?.address || "Stadion Anjuk Ladang / Kompleks Olahraga Kabupaten Nganjuk, Jawa Timur 64419",
    email: store?.settings?.email || "sekretariat@koni-nganjuk.or.id",
    phone: store?.settings?.phone || "(0358) 321xxx / WhatsApp Layanan Resmi",
    youtubeChannelUrl: store?.settings?.youtubeChannelUrl || "https://www.youtube.com/",
    mapEmbedUrl: store?.settings?.mapEmbedUrl || "",
  };
}

// Legacy named exports for backward compat (used in berita.$slug.tsx loader which runs on server)
export const news = defaultNews;
export const gallery = defaultGallery;