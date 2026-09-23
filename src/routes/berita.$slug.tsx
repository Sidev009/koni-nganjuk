import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, Tag } from "lucide-react";
import { getDynamicNews } from "@/lib/content";

export const Route = createFileRoute("/berita/$slug")({
  loader: ({ params }) => {
    const allNews = getDynamicNews();
    const article = allNews.find((item) => item.slug === params.slug);
    if (!article) throw notFound();
    return { article, allNews };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.article
          ? `${loaderData.article.title} — KONI Nganjuk`
          : "Berita tidak ditemukan",
      },
      {
        name: "description",
        content: loaderData?.article?.excerpt ?? "Berita KONI Kabupaten Nganjuk.",
      },
      {
        property: "og:title",
        content: loaderData?.article?.title ?? "Berita KONI Nganjuk",
      },
      {
        property: "og:description",
        content: loaderData?.article?.excerpt ?? "Berita KONI Kabupaten Nganjuk.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DetailBerita,
});

function DetailBerita() {
  const { article, allNews } = Route.useLoaderData();
  const otherNews = allNews.filter((item) => item.slug !== article.slug);

  return (
    <div className="py-10 sm:py-14">
      <article className="site-container max-w-4xl">
        <Link
          to="/berita"
          className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-accent"
        >
          <ArrowLeft className="size-4" />
          Kembali ke semua berita
        </Link>

        <div className="mt-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-blue-soft px-3 py-1 text-xs font-bold text-primary">
            <Tag className="size-3 text-brand-red" />
            {article.category}
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground sm:text-sm">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-4 text-brand-red" />
              {article.date}
            </span>
            <span>•</span>
            <span>KONI Kabupaten Nganjuk</span>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-xl shadow-lg">
          <img
            src={article.image}
            width={1200}
            height={800}
            alt={article.title}
            className="aspect-[16/9] w-full object-cover"
            style={{ objectPosition: article.position }}
          />
        </div>

        <div className="mt-10 space-y-6 text-base leading-8 text-foreground/80 sm:text-lg">
          <p className="font-semibold text-foreground text-lg sm:text-xl leading-relaxed">{article.excerpt}</p>
          {(article as { content?: string }).content ? (
            <div className="space-y-4 whitespace-pre-line text-foreground/90">
              {(article as { content?: string }).content}
            </div>
          ) : (
            <>
              <p>
                Komite Olahraga Nasional Indonesia (KONI) Kabupaten Nganjuk terus
                berkomitmen mendorong peningkatan kualitas pembinaan cabang olahraga
                secara berkelanjutan. Melalui kolaborasi antara pengurus cabang,
                pelatih, dan atlet, seluruh program diarahkan untuk menciptakan iklim
                olahraga yang kompetitif, sehat, dan menjunjung tinggi nilai
                sportivitas.
              </p>
              <p>
                Dukungan fasilitas, pembinaan usia dini, serta penguatan kompetensi
                pelatih dan wasit menjadi pilar penting agar atlet daerah mampu
                bersaing tidak hanya di tingkat karesidenan dan provinsi, tetapi juga
                di ajang kejuaraan nasional.
              </p>
              <p>
                Masyarakat Kabupaten Nganjuk diharapkan terus memberikan doa serta
                dukungan moral bagi seluruh atlet yang tengah berjuang membawa nama
                harum daerah di kancah olahraga Indonesia.
              </p>
            </>
          )}
        </div>

        {/* Other news recommendation */}
        {otherNews.length > 0 && (
          <div className="mt-16 border-t border-border pt-12">
            <h2 className="font-display text-2xl font-bold text-foreground">
              Berita Lainnya
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {otherNews.map((item) => (
                <article
                  key={item.slug}
                  className="soft-card group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <Link to="/berita/$slug" params={{ slug: item.slug }}>
                    <div className="overflow-hidden">
                      <img
                        src={item.image}
                        loading="lazy"
                        width={600}
                        height={380}
                        alt={item.title}
                        className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        style={{ objectPosition: item.position }}
                      />
                    </div>
                    <div className="p-5">
                      <p className="text-xs font-semibold text-brand-red">
                        {item.category}
                      </p>
                      <h3 className="mt-2 font-display text-base font-bold text-foreground transition-colors group-hover:text-primary">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {item.date}
                      </p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}