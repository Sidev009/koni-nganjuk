import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { PageIntro } from "@/components/page-intro";

export const Route = createFileRoute("/kontak")({
  head: () => ({
    meta: [
      { title: "Kontak — KONI Kabupaten Nganjuk" },
      {
        name: "description",
        content: "Informasi kontak, alamat sekretariat, dan layanan koordinasi KONI Kabupaten Nganjuk.",
      },
      { property: "og:title", content: "Kontak KONI Kabupaten Nganjuk" },
      { property: "og:description", content: "Hubungi KONI Kabupaten Nganjuk." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: KontakPage,
});

function KontakPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return;
    }
    setSubmitted(true);
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", subject: "", message: "" });
    setSubmitted(false);
  };

  return (
    <>
      <PageIntro
        eyebrow="Hubungi kami"
        title="Kontak & Layanan Informasi"
        description="Sampaikan pertanyaan, koordinasi cabang olahraga, atau permohonan informasi melalui kanal resmi KONI Kabupaten Nganjuk."
      />

      <section className="section-space">
        <div className="site-container grid gap-10 lg:grid-cols-[.85fr_1.15fr]">
          {/* Contact Details */}
          <div className="space-y-5">
            <div className="soft-card flex items-start gap-4 p-6">
              <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-brand-blue-soft text-primary">
                <MapPin className="size-6" />
              </span>
              <div>
                <h3 className="font-display font-bold text-foreground">Sekretariat</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Stadion Anjuk Ladang / Kompleks Olahraga Kabupaten Nganjuk
                  <br />
                  Jawa Timur 64419
                </p>
              </div>
            </div>

            <div className="soft-card flex items-start gap-4 p-6">
              <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-brand-blue-soft text-primary">
                <Clock className="size-6" />
              </span>
              <div>
                <h3 className="font-display font-bold text-foreground">Jam Operasional</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Senin – Jumat: 08.00 – 16.00 WIB
                  <br />
                  Sabtu, Minggu & Hari Libur: Tutup
                </p>
              </div>
            </div>

            <div className="soft-card flex items-start gap-4 p-6">
              <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-brand-blue-soft text-primary">
                <Mail className="size-6" />
              </span>
              <div>
                <h3 className="font-display font-bold text-foreground">Surat Elektronik</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  sekretariat@koni-nganjuk.or.id
                  <br />
                  <span className="text-xs text-muted-foreground/80">Respons dalam 1–2 hari kerja</span>
                </p>
              </div>
            </div>

            <div className="soft-card flex items-start gap-4 p-6">
              <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-brand-blue-soft text-primary">
                <Phone className="size-6" />
              </span>
              <div>
                <h3 className="font-display font-bold text-foreground">Telepon / WhatsApp</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  (0358) 321xxx / WhatsApp Layanan Resmi
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="soft-card p-6 sm:p-8">
            <h2 className="font-display text-2xl font-bold text-foreground">Kirim Pesan</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Silakan isi formulir di bawah ini untuk terhubung dengan pengurus KONI Nganjuk.
            </p>

            {submitted ? (
              <div className="mt-8 rounded-lg bg-green-50 p-6 text-center dark:bg-green-950/30">
                <CheckCircle2 className="mx-auto size-12 text-green-600 dark:text-green-400" />
                <h3 className="mt-4 font-display text-lg font-bold text-foreground">Pesan Berhasil Terkirim!</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Terima kasih atas pesan Anda. Pengurus sekretariat KONI Nganjuk akan menindaklanjuti pesan Anda secepatnya.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="outline-button mt-6"
                >
                  Kirim Pesan Lain
                </button>
              </div>
            ) : (
              <form className="mt-6 grid gap-5" onSubmit={handleSubmit}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-foreground" htmlFor="name">
                      Nama Lengkap *
                    </label>
                    <input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-2 w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="Contoh: Budi Santoso"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground" htmlFor="email">
                      Alamat Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-2 w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="nama@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground" htmlFor="subject">
                    Subjek / Perihal
                  </label>
                  <input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="mt-2 w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Contoh: Koordinasi Cabang Olahraga Atletik"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground" htmlFor="message">
                    Isi Pesan *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="mt-2 w-full resize-none rounded-md border border-input bg-background px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Tuliskan detail pertanyaan atau keperluan Anda..."
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button type="submit" className="primary-button">
                    <Send className="size-4" />
                    Kirim Pesan
                  </button>
                  <span className="text-xs text-muted-foreground">* Kolom wajib diisi</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}