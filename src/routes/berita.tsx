import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { CalendarDays, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PageIntro } from "@/components/page-intro";
import { Reveal } from "@/components/reveal";
import { getDynamicNews } from "@/lib/content";

function BeritaRouteComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // If navigating to /berita or /berita/, render the news listing page.
  // Otherwise render child routes (e.g. /berita/$slug).
  if (pathname === "/berita" || pathname === "/berita/") {
    return <BeritaPage />;
  }
  return <Outlet />;
}

export const Route = createFileRoute("/berita")({
  validateSearch: (search: Record<string, unknown>): { q?: string } => {
    const q = search["q"];
    return typeof q === "string" && q.trim().length > 0 ? { q: q.trim() } : {};
  },
  head: () => ({
    meta: [
      { title: "Berita — KONI Kabupaten Nganjuk" },
      { name: "description", content: "Berita terbaru pembinaan, organisasi, dan prestasi olahraga KONI Kabupaten Nganjuk." },
      { property: "og:title", content: "Berita KONI Kabupaten Nganjuk" },
      { property: "og:description", content: "Kabar terbaru olahraga Kabupaten Nganjuk." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BeritaRouteComponent,
});

function BeritaPage() {
  const { q } = Route.useSearch();
  const [news, setNews] = useState(() => getDynamicNews());
  const [query, setQuery] = useState(q ?? "");
  const [category, setCategory] = useState("Semua");
  const categories = useMemo(() => ["Semua", ...Array.from(new Set(news.map((item) => item.category)))], [news]);

  useEffect(() => {
    const refresh = () => setNews(getDynamicNews());
    window.addEventListener("koni-store-change", refresh);
    return () => window.removeEventListener("koni-store-change", refresh);
  }, []);

  useEffect(() => {
    if (q !== undefined) {
      setQuery(q);
    }
  }, [q]);

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return news.filter((item) => {
      const matchCategory = category === "Semua" || item.category === category;
      const matchKeyword = !keyword || `${item.title} ${item.excerpt} ${item.category}`.toLowerCase().includes(keyword);
      return matchCategory && matchKeyword;
    });
  }, [query, category]);

  return (
    <>
      <PageIntro eyebrow="Pusat informasi" title="Berita KONI Nganjuk" description="Ikuti perkembangan pembinaan, agenda organisasi, dan capaian atlet Kabupaten Nganjuk." />
      <section className="section-space">
        <div className="site-container">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full items-center rounded-md border border-input bg-background px-3 transition-shadow duration-200 focus-within:border-primary focus-within:shadow-[0_0_0_3px_var(--brand-blue-soft)] md:max-w-sm">
              <Search className="size-4 text-muted-foreground" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Cari berita" placeholder="Cari berita..." className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none" />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button key={item} type="button" onClick={() => setCategory(item)} className={`rounded-full border px-4 py-2 text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 ${category === item ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground hover:border-primary hover:text-primary"}`}>
                  {item}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-5 text-sm text-muted-foreground">{filtered.length} berita ditemukan</p>

          {filtered.length === 0 ? (
            <div className="soft-card mt-8 p-10 text-center">
              <p className="font-display text-lg font-bold">Berita tidak ditemukan</p>
              <p className="mt-2 text-sm text-muted-foreground">Coba kata kunci lain atau pilih kategori berbeda.</p>
              <button type="button" className="outline-button mt-5" onClick={() => { setQuery(""); setCategory("Semua"); }}>Atur ulang pencarian</button>
            </div>
          ) : (
            <div className="mt-8 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item, index) => (
                <Reveal key={item.slug} delay={index * 80}>
                  <article className="soft-card group h-full overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                    <Link to="/berita/$slug" params={{ slug: item.slug }}>
                      <div className="overflow-hidden">
                        <img src={item.image} loading="lazy" width={800} height={500} alt={item.title} className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-110" style={{ objectPosition: item.position }} />
                      </div>
                      <div className="p-6">
                        <p className="flex items-center gap-2 text-xs font-semibold text-muted-foreground"><CalendarDays className="size-4 text-brand-red" />{item.date}</p>
                        <h2 className="mt-3 font-display text-xl font-bold group-hover:text-primary">{item.title}</h2>
                        <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.excerpt}</p>
                      </div>
                    </Link>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
