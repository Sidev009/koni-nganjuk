import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { KoniLogo } from "./koni-logo";

const navigation = [
  { label: "Beranda", to: "/" },
  { label: "Berita", to: "/berita" },
  { label: "Galeri", to: "/galeri" },
  { label: "Video", to: "/video" },
  { label: "Profil", to: "/profil" },
  { label: "Kontak", to: "/kontak" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur-md">
      <div className="site-container grid h-20 grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <Link to="/" aria-label="KONI Kabupaten Nganjuk — Beranda" onClick={() => setOpen(false)}>
          <KoniLogo />
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigasi utama">
          {navigation.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <Link key={item.to} to={item.to} className={`nav-link ${active ? "nav-link-active" : ""}`}>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          className="icon-button lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? "Tutup menu" : "Buka menu"}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open && (
        <nav className="site-container grid gap-1 border-t border-border py-3 lg:hidden" aria-label="Navigasi seluler">
          {navigation.map((item) => (
            <Link key={item.to} to={item.to} className="rounded-md px-3 py-3 text-sm font-semibold text-foreground hover:bg-muted" onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}