/**
 * admin-store.ts
 * ─────────────────────────────────────────────────────────────
 * Central store for admin session + all editable CMS content.
 * Data is persisted to localStorage so changes survive page refreshes.
 * React hooks subscribe via a custom event ("koni-store-change").
 * ─────────────────────────────────────────────────────────────
 */

// ─── Types ────────────────────────────────────────────────────

export interface NewsItem {
  slug: string;
  title: string;
  date: string;
  category: string;
  image: string;    // URL string
  position: string;
  excerpt: string;
  content?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  image: string;    // URL string
  position: string;
}

export interface VideoItem {
  id: string;         // unique local id
  youtubeId: string;  // YouTube video id
  title: string;
  description: string;
  category: string;
}

export interface HeaderSettings {
  heroImageUrl: string;
  tickerItems: string[];
}

export interface SiteSettings {
  address: string;
  email: string;
  phone: string;
  youtubeChannelUrl: string;
  mapEmbedUrl: string;
}

export interface AdminStore {
  news: NewsItem[];
  gallery: GalleryItem[];
  videos: VideoItem[];
  header: HeaderSettings;
  settings: SiteSettings;
}

// ─── Default content (mirrors content.ts originals) ──────────

const DEFAULT_HEADER: HeaderSettings = {
  heroImageUrl: "", // empty = use bundled asset
  tickerItems: [
    "Selamat Datang di Portal Resmi KONI Kabupaten Nganjuk",
    "Pemusatan Latihan 30+ Cabang Olahraga Aktif",
    "Semangat Sportivitas Generasi Muda Nganjuk",
    "Sekretariat: Stadion Anjuk Ladang Nganjuk",
  ],
};

const DEFAULT_SETTINGS: SiteSettings = {
  address: "Kabupaten Nganjuk, Jawa Timur",
  email: "Informasi resmi segera diperbarui",
  phone: "Informasi resmi segera diperbarui",
  youtubeChannelUrl: "https://www.youtube.com/",
  mapEmbedUrl: "",
};

const DEFAULT_VIDEOS: VideoItem[] = [
  {
    id: "v1",
    youtubeId: "ScMzIvxBSi4",
    title: "Semangat Olahraga Kabupaten Nganjuk",
    description:
      "Dokumentasi kebersamaan atlet, pelatih, dan pengurus cabang olahraga dalam membangun prestasi olahraga daerah.",
    category: "Liputan Kegiatan",
  },
  {
    id: "v2",
    youtubeId: "M7lc1UVf-VE",
    title: "Pembinaan Atlet Menuju Prestasi Provinsi & Nasional",
    description:
      "Program pelatihan terpusat serta dedikasi atlet muda Nganjuk dalam mengasah fisik, teknik, dan mental juara.",
    category: "Pembinaan Atlet",
  },
];

// ─── Storage key ──────────────────────────────────────────────

const STORE_KEY = "koni_admin_store";
const SESSION_KEY = "koni_admin_session";

// ─── Auth credential (hardcoded per requirements) ─────────────

const ADMIN_USERNAME = "admin_koni";
const ADMIN_PASSWORD = "koni@nganjuk";

// ─── Backend API Connection ──────────────────────────────────
export const API_BASE = 
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) || "http://localhost:5000/api";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function emit(): void {
  if (isBrowser()) {
    window.dispatchEvent(new Event("koni-store-change"));
  }
}

// ─── Auto-sync from Node.js Backend (MySQL Laragon) ───────────
let isSyncing = false;

export async function syncFromBackend(): Promise<boolean> {
  if (!isBrowser() || isSyncing) return false;
  isSyncing = true;
  try {
    const res = await fetch(`${API_BASE}/all`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Backend not OK");
    const data = await res.json();
    if (data && (Array.isArray(data.news) || Array.isArray(data.gallery) || Array.isArray(data.videos))) {
      const merged: AdminStore = {
        news: data.news ?? [],
        gallery: data.gallery ?? [],
        videos: data.videos ?? DEFAULT_VIDEOS,
        header: data.header ?? DEFAULT_HEADER,
        settings: data.settings ?? DEFAULT_SETTINGS,
      };
      localStorage.setItem(STORE_KEY, JSON.stringify(merged));
      emit();
      return true;
    }
  } catch {
    // Backend offline / not yet started -> seamlessly uses localStorage
  } finally {
    isSyncing = false;
  }
  return false;
}

// Trigger initial sync on client
if (isBrowser()) {
  setTimeout(() => {
    syncFromBackend();
  }, 100);
}

// ─── Store read/write ─────────────────────────────────────────

export function readStore(): AdminStore | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as AdminStore) : null;
  } catch {
    return null;
  }
}

export function writeStore(data: AdminStore): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
  emit();

  // Async sync to Node.js backend (MySQL Laragon)
  fetch(`${API_BASE}/all`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).catch(() => {
    // If backend isn't running, data remains saved in localStorage
  });
}

/** Returns current store, initialising defaults if not yet stored. */
export function getStore(): AdminStore {
  const existing = readStore();
  if (existing) return existing;
  const initial: AdminStore = {
    news: [],
    gallery: [],
    videos: DEFAULT_VIDEOS,
    header: DEFAULT_HEADER,
    settings: DEFAULT_SETTINGS,
  };
  writeStore(initial);
  return initial;
}

// ─── Individual section getters / setters ─────────────────────

export function getNews(): NewsItem[] {
  return getStore().news;
}
export function setNews(items: NewsItem[]): void {
  writeStore({ ...getStore(), news: items });
}

export function getGallery(): GalleryItem[] {
  return getStore().gallery;
}
export function setGallery(items: GalleryItem[]): void {
  writeStore({ ...getStore(), gallery: items });
}

export function getVideos(): VideoItem[] {
  return getStore().videos;
}
export function setVideos(items: VideoItem[]): void {
  writeStore({ ...getStore(), videos: items });
}

export function getHeader(): HeaderSettings {
  return getStore().header;
}
export function setHeader(data: HeaderSettings): void {
  writeStore({ ...getStore(), header: data });
}

export function getSiteSettings(): SiteSettings {
  return getStore().settings;
}
export function setSiteSettings(data: SiteSettings): void {
  writeStore({ ...getStore(), settings: data });
}

// ─── Auth ─────────────────────────────────────────────────────

export function adminLogin(username: string, password: string): boolean {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    if (isBrowser()) sessionStorage.setItem(SESSION_KEY, "1");
    return true;
  }
  return false;
}

export function adminLogout(): void {
  if (isBrowser()) sessionStorage.removeItem(SESSION_KEY);
}

export function isAdminLoggedIn(): boolean {
  if (!isBrowser()) return false;
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

// ─── Slug helper ──────────────────────────────────────────────

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function uniqueId(): string {
  return Math.random().toString(36).slice(2, 10);
}
