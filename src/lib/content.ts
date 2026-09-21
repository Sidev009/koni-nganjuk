import heroImage from "@/assets/koni-hero.jpg";
import sportsImage from "@/assets/koni-sports-grid.jpg";
import athletesImage from "@/assets/koni-athletes.jpg";

export { heroImage, sportsImage, athletesImage };

export const news = [
  { slug: "pembinaan-atlet-muda", title: "Pembinaan Atlet Muda Menuju Prestasi Berkelanjutan", date: "12 September 2026", category: "Pembinaan", image: athletesImage, position: "center", excerpt: "KONI Kabupaten Nganjuk memperkuat pembinaan berjenjang untuk menyiapkan atlet muda yang tangguh dan berprestasi." },
  { slug: "koordinasi-cabang-olahraga", title: "Koordinasi Cabang Olahraga Jelang Kompetisi Daerah", date: "8 September 2026", category: "Organisasi", image: heroImage, position: "center", excerpt: "Pengurus cabang olahraga menyelaraskan program latihan, kebutuhan atlet, dan agenda kompetisi mendatang." },
  { slug: "semangat-atlet-nganjuk", title: "Semangat Atlet Nganjuk di Arena Regional", date: "3 September 2026", category: "Prestasi", image: sportsImage, position: "50% 25%", excerpt: "Atlet-atlet Nganjuk menunjukkan disiplin, sportivitas, dan semangat juang dalam berbagai cabang olahraga." },
];

export const gallery = [
  { title: "Cabang Bulu Tangkis", image: sportsImage, position: "0% 0%" },
  { title: "Lintasan Atletik", image: sportsImage, position: "100% 0%" },
  { title: "Pertandingan Bola Voli", image: sportsImage, position: "0% 100%" },
  { title: "Pencak Silat", image: sportsImage, position: "100% 100%" },
  { title: "Defile Atlet", image: heroImage, position: "center" },
  { title: "Perayaan Prestasi", image: athletesImage, position: "center" },
];