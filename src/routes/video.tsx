import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Play, Youtube } from "lucide-react";
import { PageIntro } from "@/components/page-intro";

export const Route = createFileRoute("/video")({
  head: () => ({
    meta: [
      { title: "Video — KONI Kabupaten Nganjuk" },
      {
        name: "description",
        content: "Video kegiatan, liputan pertandingan, dan dokumentasi pembinaan atlet KONI Kabupaten Nganjuk.",
      },
      { property: "og:title", content: "Video KONI Kabupaten Nganjuk" },
      {
        property: "og:description",
        content: "Saksikan kegiatan olahraga Kabupaten Nganjuk.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VideoPage,
});

const videoList = [
  {
    id: "ScMzIvxBSi4",
    title: "Semangat Olahraga Kabupaten Nganjuk",
    description: "Dokumentasi kebersamaan atlet, pelatih, dan pengurus cabang olahraga dalam membangun prestasi olahraga daerah.",
    category: "Liputan Kegiatan",
  },
  {
    id: "M7lc1UVf-VE",
    title: "Pembinaan Atlet Menuju Prestasi Provinsi & Nasional",
    description: "Program pelatihan terpusat serta dedikasi atlet muda Nganjuk dalam mengasah fisik, teknik, dan mental juara.",
    category: "Pembinaan Atlet",
  },
];

function VideoPage() {
  return (
    <>
      <PageIntro
        eyebrow="Kanal olahraga"
        title="Video Kegiatan & Dokumentasi"
        description="Saksikan rekaman liputan pembinaan, pertandingan cabang olahraga, serta momen perjuangan atlet Kabupaten Nganjuk."
      />

      <section className="section-space">
        <div className="site-container">
          <div className="grid gap-8 md:grid-cols-2">
            {videoList.map((video) => (
              <article
                key={video.id}
                className="soft-card group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="aspect-video bg-neutral-900">
                  <iframe
                    className="size-full"
                    src={`https://www.youtube-nocookie.com/embed/${video.id}`}
                    title={video.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-6">
                  <span className="inline-flex items-center gap-1 text-xs font-bold uppercase text-brand-red">
                    <Play className="size-3 fill-current" />
                    {video.category}
                  </span>
                  <h2 className="mt-2 font-display text-xl font-bold text-foreground">
                    {video.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {video.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-xl bg-primary p-8 text-center text-primary-foreground sm:p-10">
            <Youtube className="mx-auto size-12 text-accent" />
            <h3 className="mt-4 font-display text-2xl font-bold">
              Kanal YouTube Resmi KONI Nganjuk
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-primary-foreground/80">
              Dapatkan update video pertandingan, profil atlet berprestasi, dan sorotan kegiatan olahraga terkini di kanal YouTube kami.
            </p>
            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-bold text-accent-foreground shadow-md transition-transform hover:-translate-y-0.5"
            >
              Kunjungi YouTube KONI Nganjuk
              <ExternalLink className="size-4" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}