import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  Home,
  Image as ImageIcon,
  Menu,
  Newspaper,
  PhoneCall,
  Search,
  Tv,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { KoniLogo } from "./koni-logo";
import { getDynamicTicker } from "@/lib/content";


const navigation = [
  { label: "Beranda", to: "/", icon: Home },
  { label: "Berita", to: "/berita", icon: Newspaper },
  { label: "Galeri", to: "/galeri", icon: ImageIcon },
  { label: "Video", to: "/video", icon: Tv },
  { label: "Profil", to: "/profil", icon: Users },
  { label: "Kontak", to: "/kontak", icon: PhoneCall },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [tickerItems, setTickerItems] = useState(() => getDynamicTicker());
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const navigate = useNavigate();

  // Update ticker when admin changes it
  useEffect(() => {
    const refresh = () => setTickerItems(getDynamicTicker());
    window.addEventListener("koni-store-change", refresh);
    return () => window.removeEventListener("koni-store-change", refresh);
  }, []);


  // Close search and mobile nav on route change
  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate({ to: "/berita", search: { q: searchKeyword.trim() } });
      setSearchOpen(false);
      setSearchKeyword("");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full shadow-sm">
      {/* Running Announcement Ticker */}
      <div className="overflow-hidden border-b border-primary/20 bg-gradient-to-r from-primary via-primary/95 to-slate-900 py-1.5 text-xs font-semibold text-primary-foreground">
        <div className="ticker-track">
          {[0, 1].map((copy) => (
            <span key={copy} className="inline-flex items-center gap-6 px-4" aria-hidden={copy === 1 ? "true" : undefined}>
              <span className="inline-flex items-center gap-1.5 font-bold uppercase text-accent">
                <span className="size-2 rounded-full bg-accent animate-pulse" />
                PENGUMUMAN RESMI:
              </span>
              {tickerItems.map((item, i) => (
                <span key={i} className="inline-flex items-center gap-6">
                  <span>{item}</span>
                  <span>•</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>


      {/* Main Navbar */}
      <div className="border-b border-border/70 bg-background/95 backdrop-blur-md">
        <div className="site-container flex h-20 items-center justify-between gap-4">
          <Link
            to="/"
            aria-label="KONI Kabupaten Nganjuk — Beranda"
            onClick={() => setOpen(false)}
            className="transition-transform duration-200 active:scale-95"
          >
            <KoniLogo />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-1.5 lg:flex" aria-label="Navigasi utama">
            {navigation.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`group relative flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-bold transition-all duration-200 ${
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-foreground/80 hover:bg-muted hover:text-primary"
                  }`}
                >
                  <Icon className={`size-4 transition-transform duration-200 group-hover:scale-110 ${active ? "text-accent" : "text-muted-foreground group-hover:text-primary"}`} />
                  <span>{item.label}</span>
                  {active && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-1 rounded-full bg-accent" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Quick Search Toggle Button */}
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex items-center gap-2 rounded-lg border border-input bg-muted/50 px-3 py-2 text-xs font-semibold text-muted-foreground transition-all hover:border-primary hover:bg-background hover:text-primary"
              aria-label="Buka pencarian"
              title="Cari berita & informasi"
            >
              <Search className="size-4 text-primary" />
              <span className="hidden sm:inline">Cari...</span>
            </button>

            {/* Direct CTA Button */}
            <Link
              to="/kontak"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-xs font-extrabold text-accent-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <PhoneCall className="size-3.5" />
              <span>Hubungi Kami</span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              className="grid size-11 place-items-center rounded-lg border border-border bg-background text-foreground transition-colors hover:bg-muted lg:hidden"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-label={open ? "Tutup menu" : "Buka menu"}
            >
              {open ? <X className="size-5 text-brand-red" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Search Overlay Popup */}
      {searchOpen && (
        <div className="border-b border-border bg-background/98 p-4 shadow-lg animate-fade-in backdrop-blur-md">
          <div className="site-container max-w-2xl">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <div className="flex flex-1 items-center rounded-lg border-2 border-primary bg-background px-3 py-1 shadow-sm focus-within:ring-2 focus-within:ring-primary/20">
                <Search className="size-5 text-primary" />
                <input
                  type="text"
                  autoFocus
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Ketik kata kunci berita, cabor, atau atlet..."
                  className="w-full bg-transparent px-3 py-2.5 text-sm font-medium outline-none text-foreground"
                />
              </div>
              <button
                type="submit"
                className="rounded-lg bg-primary px-5 py-3 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Cari
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="rounded-lg border border-input p-3 text-muted-foreground hover:bg-muted transition-colors"
                aria-label="Tutup pencarian"
              >
                <X className="size-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Drawer Navigation */}
      {open && (
        <nav
          className="border-t border-border bg-background/98 px-4 py-6 shadow-2xl lg:hidden animate-fade-in backdrop-blur-lg"
          aria-label="Navigasi seluler"
        >
          <div className="site-container grid gap-2">
            <p className="px-2 text-xs font-black uppercase tracking-wider text-muted-foreground">Menu Utama</p>
            {navigation.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-base font-bold transition-all ${
                    active
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-foreground hover:bg-muted hover:text-primary"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <Icon className={`size-5 ${active ? "text-accent" : "text-primary"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}