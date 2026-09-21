import { createFileRoute } from "@tanstack/react-router";
import { Building2, CheckCircle2, Network, Shield, Target, Trophy, Users } from "lucide-react";
import { PageIntro } from "@/components/page-intro";
import { athletesImage } from "@/lib/content";

export const Route = createFileRoute("/profil")({
  head: () => ({
    meta: [
      { title: "Profil — KONI Kabupaten Nganjuk" },
      {
        name: "description",
        content: "Tentang, visi misi, dan struktur KONI Kabupaten Nganjuk.",
      },
      { property: "og:title", content: "Profil KONI Kabupaten Nganjuk" },
      {
        property: "og:description",
        content: "Mengenal organisasi olahraga Kabupaten Nganjuk.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilPage,
});

function ProfilPage() {
  return (
    <>
      <PageIntro
        eyebrow="Tentang kami"
        title="KONI Kabupaten Nganjuk"
        description="Mitra strategis dalam membina organisasi, atlet, dan prestasi olahraga daerah menuju panggung nasional."
      />

      <section className="section-space">
        <div className="site-container">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="overflow-hidden rounded-xl shadow-xl">
              <img
                src={athletesImage}
                width={1200}
                height={800}
                alt="Atlet berprestasi KONI Kabupaten Nganjuk"
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div>
              <div className="inline-flex size-12 items-center justify-center rounded-lg bg-brand-blue-soft text-primary">
                <Building2 className="size-6" />
              </div>
              <h2 className="section-heading mt-4">Tentang KONI Nganjuk</h2>
              <p className="mt-5 leading-8 text-muted-foreground">
                Komite Olahraga Nasional Indonesia (KONI) Kabupaten Nganjuk
                adalah satu-satunya organisasi keolahragaan yang berwenang
                mengoordinasikan dan membina setiap dan seluruh cabang olahraga
                prestasi di wilayah Kabupaten Nganjuk.
              </p>
              <p className="mt-4 leading-8 text-muted-foreground">
                KONI Nganjuk hadir sebagai jembatan sinergi antara pemerintah
                daerah, induk cabang olahraga, pelatih, atlet, serta masyarakat
                olahraga untuk melahirkan generasi atlet berdaya saing tinggi dan
                bermental juara.
              </p>
            </div>
          </div>

          {/* Visi & Misi Cards */}
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            <div className="soft-card p-8 transition-shadow duration-300 hover:shadow-xl">
              <div className="inline-flex size-12 items-center justify-center rounded-lg bg-red-100 text-brand-red">
                <Target className="size-6" />
              </div>
              <h3 className="mt-5 font-display text-2xl font-bold text-foreground">
                Visi
              </h3>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                "Mewujudkan Kabupaten Nganjuk yang berprestasi dalam bidang
                olahraga di tingkat regional, nasional, dan internasional dengan
                menjunjung tinggi sportivitas dan nilai-nilai luhur olahraga."
              </p>
            </div>

            <div className="soft-card p-8 transition-shadow duration-300 hover:shadow-xl">
              <div className="inline-flex size-12 items-center justify-center rounded-lg bg-brand-blue-soft text-primary">
                <Trophy className="size-6" />
              </div>
              <h3 className="mt-5 font-display text-2xl font-bold text-foreground">
                Misi
              </h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>
                    Meningkatkan tata kelola organisasi cabang olahraga yang
                    akuntabel, solid, dan transparan.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>
                    Menyelenggarakan pembinaan usia dini dan jenjang kompetisi yang
                    berkesinambungan.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>
                    Meningkatkan kualitas sumber daya manusia melalui sertifikasi
                    pelatih, wasit, dan tenaga keolahragaan.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>
                    Mengoptimalkan sarana, prasarana, dan pemanfaatan sport science
                    dalam peningkatan performa atlet.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Struktur & Fungsi */}
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="soft-card p-6">
              <Users className="size-8 text-primary" />
              <h4 className="mt-4 font-display text-lg font-bold text-foreground">
                Pembinaan Prestasi
              </h4>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Fokus pada pemusatan latihan atlet, monitoring kebugaran fisik,
                serta evaluasi berkala capaian target medali.
              </p>
            </div>
            <div className="soft-card p-6">
              <Network className="size-8 text-brand-red" />
              <h4 className="mt-4 font-display text-lg font-bold text-foreground">
                Organisasi & Hukum
              </h4>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Mengawal legalitas, administrasi keanggotaan cabang olahraga,
                dan kepatuhan regulasi keolahragaan daerah.
              </p>
            </div>
            <div className="soft-card p-6">
              <Shield className="size-8 text-accent" />
              <h4 className="mt-4 font-display text-lg font-bold text-foreground">
                Perencanaan & Anggaran
              </h4>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Memastikan alokasi dana pembinaan atlet dan penyelenggaraan event
                berjalan efektif, tepat sasaran, dan akuntabel.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}