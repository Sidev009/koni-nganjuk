import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { PageIntro } from "@/components/page-intro";
import { Reveal } from "@/components/reveal";
import { getDynamicGallery } from "@/lib/content";


export const Route = createFileRoute("/galeri")({
  head: () => ({ meta: [{ title: "Galeri — KONI Kabupaten Nganjuk" }, { name: "description", content: "Dokumentasi kegiatan dan prestasi olahraga KONI Kabupaten Nganjuk." }, { property: "og:title", content: "Galeri KONI Kabupaten Nganjuk" }, { property: "og:description", content: "Dokumentasi kegiatan olahraga Kabupaten Nganjuk." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: GaleriPage,
});

function GaleriPage() {
  const [gallery, setGallery] = useState(() => getDynamicGallery());
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const refresh = () => setGallery(getDynamicGallery());
    window.addEventListener("koni-store-change", refresh);
    return () => window.removeEventListener("koni-store-change", refresh);
  }, []);



  const move = useCallback((step: number) => {
    setActive((current) => (current === null ? current : (current + step + gallery.length) % gallery.length));
  }, []);

  useEffect(() => {
    if (active === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowRight") move(1);
      if (event.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, move]);

  const current = active === null ? null : gallery[active];

  return (
    <>
      <PageIntro eyebrow="Dokumentasi" title="Galeri kegiatan olahraga" description="Momen latihan, kompetisi, kebersamaan, dan prestasi atlet Kabupaten Nganjuk. Klik foto untuk memperbesar." />
      <section className="section-space">
        <div className="site-container grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.map((item, index) => (
            <Reveal key={item.title} delay={index * 70}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Perbesar foto ${item.title}`}
                className="group relative block w-full overflow-hidden rounded-lg text-left transition-transform duration-300 hover:-translate-y-1"
              >
                <img src={item.image} loading="lazy" width={800} height={600} alt={item.title} className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-110" style={{ objectPosition: item.position }} />
                <span className="absolute inset-0 grid place-items-center bg-primary/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <ZoomIn className="size-9 text-primary-foreground" />
                </span>
                <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/80 to-transparent p-5 pt-14 font-display font-bold text-background">{item.title}</figcaption>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {current && (
        <div role="dialog" aria-modal="true" aria-label={current.title} className="fixed inset-0 z-[70] grid place-items-center bg-foreground/90 p-4 animate-fade-in" onClick={() => setActive(null)}>
          <button type="button" aria-label="Tutup" className="absolute right-5 top-5 grid size-11 place-items-center rounded-full bg-background/15 text-background hover:bg-background/30" onClick={() => setActive(null)}>
            <X className="size-5" />
          </button>
          <button type="button" aria-label="Foto sebelumnya" className="absolute left-3 grid size-11 place-items-center rounded-full bg-background/15 text-background hover:bg-background/30 sm:left-8" onClick={(event) => { event.stopPropagation(); move(-1); }}>
            <ChevronLeft className="size-6" />
          </button>
          <button type="button" aria-label="Foto berikutnya" className="absolute right-3 grid size-11 place-items-center rounded-full bg-background/15 text-background hover:bg-background/30 sm:right-8" onClick={(event) => { event.stopPropagation(); move(1); }}>
            <ChevronRight className="size-6" />
          </button>
          <figure className="max-w-3xl animate-scale-in" onClick={(event) => event.stopPropagation()}>
            <img src={current.image} alt={current.title} className="max-h-[75vh] w-full rounded-lg object-cover" style={{ objectPosition: current.position }} />
            <figcaption className="mt-4 text-center font-display font-bold text-background">{current.title}</figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
