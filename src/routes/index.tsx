import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Mail, MapPin, Medal, Phone, Search, Target, Users, Youtube } from "lucide-react";
import { useEffect, useState } from "react";
import { Counter } from "@/components/counter";
import { Reveal } from "@/components/reveal";
import { athletesImage, getDynamicGallery, getDynamicHeroImage, getDynamicNews, getDynamicSettings } from "@/lib/content";


// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "KONI Kabupaten Nganjuk — Pembinaan & Prestasi" },
    { name: "description", content: "Informasi pembinaan atlet, berita, galeri, dan kegiatan olahraga KONI Kabupaten Nganjuk." },
    { property: "og:title", content: "KONI Kabupaten Nganjuk" },
    { property: "og:description", content: "Pembinaan dan prestasi olahraga daerah Kabupaten Nganjuk." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [heroImage, setHeroImage] = useState(() => getDynamicHeroImage());
  const [news, setNews] = useState(() => getDynamicNews());
  const [gallery, setGallery] = useState(() => getDynamicGallery());
  const [settings, setSettings] = useState(() => getDynamicSettings());

  useEffect(() => {
    const refresh = () => {
      setHeroImage(getDynamicHeroImage());
      setNews(getDynamicNews());
      setGallery(getDynamicGallery());
      setSettings(getDynamicSettings());
    };
    window.addEventListener("koni-store-change", refresh);
    return () => window.removeEventListener("koni-store-change", refresh);
  }, []);

  return (
    <>
      <section className="relative min-h-[650px] overflow-hidden bg-primary sm:min-h-[700px]">
        <img src={heroImage} width={1920} height={1088} alt="Defile atlet pada pembukaan pesta olahraga daerah" className="absolute inset-0 size-full object-cover object-center" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,color-mix(in_oklab,var(--primary)_92%,transparent)_0%,color-mix(in_oklab,var(--primary)_68%,transparent)_48%,color-mix(in_oklab,var(--primary)_10%,transparent)_100%)]" />
        <div className="site-container relative flex min-h-[650px] items-end pb-20 sm:min-h-[700px] sm:items-center sm:pb-0">
          <div className="max-w-2xl text-primary-foreground">
            <div className="mb-6 inline-flex items-center gap-2 border-l-4 border-accent bg-primary-foreground/10 px-4 py-2 text-xs font-bold uppercase tracking-widest backdrop-blur-sm">Mengabdi untuk prestasi</div>
            <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-6xl lg:text-7xl">KONI Kabupaten Nganjuk</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-primary-foreground/85 sm:text-xl">Pembinaan dan prestasi olahraga daerah untuk melahirkan atlet tangguh, berkarakter, dan berdaya saing.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link to="/profil" className="primary-button !bg-accent !text-accent-foreground">Kenali KONI <ArrowRight className="size-4" /></Link><Link to="/berita" className="outline-button !border-primary-foreground/40 !bg-primary-foreground/10 !text-primary-foreground">Berita terbaru</Link></div>
          </div>
        </div>
      </section>

      <Reveal><section className="section-space"><div className="site-container grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
        <div><p className="eyebrow">Profil organisasi</p><h2 className="section-heading mt-3">Bersama membangun ekosistem olahraga Nganjuk</h2><p className="mt-5 max-w-2xl leading-7 text-muted-foreground">KONI Kabupaten Nganjuk menjadi wadah koordinasi cabang olahraga dalam pembinaan atlet, peningkatan kualitas pelatih, serta penguatan prestasi olahraga daerah.</p><div className="mt-8 grid gap-4 sm:grid-cols-2"><div className="soft-card p-5"><Target className="size-7 text-brand-red"/><h3 className="mt-4 font-display font-bold">Visi</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Mewujudkan olahraga Nganjuk yang unggul, berprestasi, dan berkarakter.</p></div><div className="soft-card p-5"><Users className="size-7 text-primary"/><h3 className="mt-4 font-display font-bold">Misi</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Menguatkan pembinaan terukur, organisasi solid, dan kolaborasi berkelanjutan.</p></div></div><Link to="/profil" className="outline-button mt-6">Lihat profil lengkap <ArrowRight className="size-4"/></Link></div>
        <div className="relative"><img src={athletesImage} loading="lazy" width={1200} height={800} alt="Atlet muda merayakan prestasi" className="aspect-[4/3] w-full rounded-lg object-cover shadow-xl"/><div className="absolute -bottom-5 left-5 right-5 flex items-center gap-4 rounded-md bg-background p-4 shadow-xl sm:right-auto"><span className="grid size-12 place-items-center rounded-md bg-accent text-accent-foreground"><Medal className="size-6"/></span><div><strong className="block font-display text-lg">Prestasi bersama</strong><span className="text-xs text-muted-foreground">Dari Nganjuk untuk Indonesia</span></div></div></div>
      </div></section></Reveal>

      <section className="section-space bg-muted/60"><div className="site-container"><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Counter value={30} suffix="+" label="Cabang olahraga dibina" />
        <Counter value={250} suffix="+" label="Atlet mengikuti pembinaan" />
        <Counter value={45} suffix="+" label="Pelatih & official" />
        <Counter value={120} suffix="+" label="Prestasi daerah & nasional" />
      </div></div></section>

      <section className="bg-primary py-10 text-primary-foreground"><div className="site-container grid gap-6 sm:grid-cols-3">
        {[{icon:MapPin,label:"Alamat kantor",value:settings.address},{icon:Mail,label:"Email",value:settings.email},{icon:Phone,label:"Telepon",value:settings.phone}].map(({icon:Icon,label,value})=><div key={label} className="flex items-start gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-md bg-primary-foreground/10 text-accent"><Icon className="size-5"/></span><div><p className="text-xs font-bold uppercase text-primary-foreground/60">{label}</p><p className="mt-1 text-sm font-semibold">{value}</p></div></div>)}
      </div></section>

      <section className="section-space bg-muted/60"><div className="site-container"><div className="flex items-end justify-between gap-5"><div><p className="eyebrow">Kabar terkini</p><h2 className="section-heading mt-3">Berita terbaru</h2></div><Link to="/berita" className="hidden text-sm font-bold text-primary sm:flex">Semua berita <ArrowRight className="ml-2 size-4"/></Link></div><div className="mt-8 grid gap-6 md:grid-cols-3">{news.slice(0,3).map((item,index)=><Reveal key={item.slug} delay={index*80}><article className="soft-card group h-full overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"><Link to="/berita/$slug" params={{slug:item.slug}}><div className="overflow-hidden"><img src={item.image} loading="lazy" width={800} height={500} alt={item.title} className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-110" style={{objectPosition:item.position}}/></div><div className="p-5"><div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground"><span className="text-brand-red">{item.category}</span><span>{item.date}</span></div><h3 className="mt-3 font-display text-lg font-bold leading-snug group-hover:text-primary">{item.title}</h3><p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{item.excerpt}</p></div></Link></article></Reveal>)}</div></div></section>

      <section className="section-space"><div className="site-container grid gap-10 lg:grid-cols-[1fr_320px]"><div><p className="eyebrow">Dokumentasi</p><h2 className="section-heading mt-3">Galeri kegiatan</h2><div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">{gallery.slice(0,6).map((item,index)=><img key={item.title} src={item.image} loading="lazy" width={600} height={450} alt={item.title} className={`w-full rounded-md object-cover ${index===4 ? "col-span-2 aspect-[2/1] sm:col-span-1 sm:aspect-square" : "aspect-square"}`} style={{objectPosition:item.position}}/>)}</div><Link to="/galeri" className="outline-button mt-6">Buka galeri <ArrowRight className="size-4"/></Link></div><aside className="space-y-5"><div className="soft-card p-5"><h2 className="font-display font-bold">Cari informasi</h2><form className="mt-4 flex items-center rounded-md border border-input bg-background px-3 focus-within:border-primary" onSubmit={(event)=>{event.preventDefault();navigate({to:"/berita",search:keyword.trim()?{q:keyword.trim()}:{}});}}><Search className="size-4 text-muted-foreground"/><input value={keyword} onChange={(event)=>setKeyword(event.target.value)} aria-label="Cari informasi" placeholder="Ketik kata kunci..." className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none"/></form></div><div className="soft-card overflow-hidden"><div className="grid h-44 place-items-center bg-brand-blue-soft text-center"><div><MapPin className="mx-auto size-8 text-brand-red"/><p className="mt-2 font-display font-bold">Kabupaten Nganjuk</p><p className="text-xs text-muted-foreground">Jawa Timur</p></div></div><div className="p-5"><h2 className="font-display font-bold">Tautan terkait</h2><div className="mt-3 grid divide-y divide-border text-sm"><a className="py-3 hover:text-primary" href="https://nganjukkab.go.id" target="_blank" rel="noreferrer">Pemerintah Kabupaten Nganjuk</a><a className="py-3 hover:text-primary" href="https://koni.or.id" target="_blank" rel="noreferrer">KONI Pusat</a></div></div></div></aside></div></section>

      <section className="site-container"><div className="grid overflow-hidden rounded-lg bg-primary text-primary-foreground lg:grid-cols-[.9fr_1.1fr]"><div className="flex flex-col justify-center p-8 sm:p-12"><Youtube className="size-9 text-accent"/><p className="mt-6 text-xs font-bold uppercase text-primary-foreground/60">Video pilihan</p><h2 className="mt-2 font-display text-3xl font-extrabold">Semangat olahraga Nganjuk</h2><p className="mt-4 leading-7 text-primary-foreground/70">Saksikan dokumentasi kegiatan, pembinaan, dan perjuangan atlet daerah.</p><Link to="/video" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-accent">Lihat semua video <ArrowRight className="size-4"/></Link></div><div className="aspect-video bg-foreground"><iframe className="size-full" src="https://www.youtube-nocookie.com/embed/ScMzIvxBSi4" title="Video kegiatan KONI Kabupaten Nganjuk" loading="lazy" allowFullScreen /></div></div></section>
    </>
  );
}

