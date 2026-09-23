import { Link } from "@tanstack/react-router";
import { Instagram, Youtube } from "lucide-react";
import { useEffect, useState } from "react";
import { KoniLogo } from "./koni-logo";
import { getDynamicSettings } from "@/lib/content";

export function SiteFooter() {
  const [settings, setSettings] = useState(() => getDynamicSettings());

  useEffect(() => {
    const refresh = () => setSettings(getDynamicSettings());
    window.addEventListener("koni-store-change", refresh);
    return () => window.removeEventListener("koni-store-change", refresh);
  }, []);

  return (
    <footer className="mt-20 bg-primary text-primary-foreground">
      <div className="site-container grid gap-10 py-12 md:grid-cols-[1.2fr_1fr_auto] md:items-start">
        <div className="max-w-sm [&_strong]:text-primary-foreground [&_span]:text-primary-foreground/70">
          <KoniLogo />
          <p className="mt-4 text-sm leading-6 text-primary-foreground/70">Bersama membina atlet, menguatkan organisasi, dan mengharumkan Kabupaten Nganjuk melalui prestasi olahraga.</p>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase text-accent">Navigasi</h2>
          <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <Link to="/berita">Berita</Link><Link to="/galeri">Galeri</Link>
            <Link to="/video">Video</Link><Link to="/profil">Profil</Link>
            <Link to="/kontak">Kontak</Link><Link to="/">Beranda</Link>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase text-accent">Ikuti Kami</h2>
          <div className="mt-4 flex gap-2">
            <a className="footer-icon" href="https://www.instagram.com/koninganjuk/" target="_blank" rel="noreferrer" aria-label="Instagram KONI Nganjuk"><Instagram className="size-5" /></a>
            <a className="footer-icon" href={settings.youtubeChannelUrl || "https://www.youtube.com/"} target="_blank" rel="noreferrer" aria-label="YouTube KONI Nganjuk"><Youtube className="size-5" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15">
        <div className="site-container py-5 text-xs text-primary-foreground/60">
          © 2026 KONI Kabupaten Nganjuk. Seluruh hak cipta dilindungi.
        </div>
      </div>
    </footer>
  );
}