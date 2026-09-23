-- ========================================================
-- DATABASE SCHEMA: KONI KABUPATEN NGANJUK (LARAGON MYSQL)
-- ========================================================

CREATE DATABASE IF NOT EXISTS `koni_nganjuk` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `koni_nganjuk`;

-- 1. TABEL ADMIN USERS
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `nama` VARCHAR(100) NOT NULL DEFAULT 'Administrator KONI',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Kredensial default admin:
INSERT INTO `users` (`username`, `password`, `nama`)
VALUES ('admin_koni', 'koni@nganjuk', 'Administrator KONI')
ON DUPLICATE KEY UPDATE `username` = `username`;

-- 2. TABEL BERITA
CREATE TABLE IF NOT EXISTS `berita` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(150) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `date` VARCHAR(50) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `image` TEXT NOT NULL,
  `position` VARCHAR(30) DEFAULT 'center',
  `excerpt` TEXT NOT NULL,
  `content` LONGTEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data Awal Berita:
INSERT INTO `berita` (`slug`, `title`, `date`, `category`, `image`, `position`, `excerpt`, `content`) VALUES
(
  'pembinaan-atlet-muda',
  'Pembinaan Atlet Muda Menuju Prestasi Berkelanjutan',
  '12 September 2026',
  'Pembinaan',
  '/koni-athletes.jpg',
  'center',
  'KONI Kabupaten Nganjuk memperkuat pembinaan berjenjang untuk menyiapkan atlet muda yang tangguh dan berprestasi.',
  'Komite Olahraga Nasional Indonesia (KONI) Kabupaten Nganjuk terus berkomitmen mendorong peningkatan kualitas pembinaan cabang olahraga secara berkelanjutan. Melalui kolaborasi antara pengurus cabang, pelatih, dan atlet, seluruh program diarahkan untuk menciptakan iklim olahraga yang kompetitif, sehat, dan menjunjung tinggi nilai sportivitas.\n\nDukungan fasilitas, pembinaan usia dini, serta penguatan kompetensi pelatih dan wasit menjadi pilar penting agar atlet daerah mampu bersaing tidak hanya di tingkat karesidenan dan provinsi, tetapi juga di ajang kejuaraan nasional.'
),
(
  'koordinasi-cabang-olahraga',
  'Koordinasi Cabang Olahraga Jelang Kompetisi Daerah',
  '8 September 2026',
  'Organisasi',
  '/koni-hero.jpg',
  'center',
  'Pengurus cabang olahraga menyelaraskan program latihan, kebutuhan atlet, dan agenda kompetisi mendatang.',
  'Rapat koordinasi rutin diselenggarakan untuk mengevaluasi program kerja setiap cabang olahraga di bawah naungan KONI Kabupaten Nganjuk. Sinergi yang solid antar-pengurus diharapkan mempermudah pemetaan potensi medali dan pembagian sarana latihan secara optimal.'
),
(
  'semangat-atlet-nganjuk',
  'Semangat Atlet Nganjuk di Arena Regional',
  '3 September 2026',
  'Prestasi',
  '/koni-sports-grid.jpg',
  '50% 25%',
  'Atlet-atlet Nganjuk menunjukkan disiplin, sportivitas, dan semangat juang dalam berbagai cabang olahraga.',
  'Berbagai kejuaraan tingkat regional Jawa Timur menjadi ajang pembuktian hasil latihan intensif para atlet Nganjuk. Dengan semangat juang pantang menyerah, perolehan prestasi membanggakan terus dipersembahkan untuk daerah tercinta.'
)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- 3. TABEL GALERI FOTO
CREATE TABLE IF NOT EXISTS `galeri` (
  `id` VARCHAR(50) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `image` TEXT NOT NULL,
  `position` VARCHAR(30) DEFAULT 'center',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data Awal Galeri:
INSERT INTO `galeri` (`id`, `title`, `image`, `position`) VALUES
('g1', 'Cabang Bulu Tangkis', '/koni-sports-grid.jpg', '0% 0%'),
('g2', 'Lintasan Atletik', '/koni-sports-grid.jpg', '100% 0%'),
('g3', 'Pertandingan Bola Voli', '/koni-sports-grid.jpg', '0% 100%'),
('g4', 'Pencak Silat', '/koni-sports-grid.jpg', '100% 100%'),
('g5', 'Defile Atlet Pembukaan', '/koni-hero.jpg', 'center'),
('g6', 'Perayaan Prestasi Atlet', '/koni-athletes.jpg', 'center')
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- 4. TABEL VIDEO YOUTUBE
CREATE TABLE IF NOT EXISTS `video` (
  `id` VARCHAR(50) PRIMARY KEY,
  `youtube_id` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `category` VARCHAR(50) DEFAULT 'Umum',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data Awal Video:
INSERT INTO `video` (`id`, `youtube_id`, `title`, `description`, `category`) VALUES
('v1', 'ScMzIvxBSi4', 'Semangat Olahraga Kabupaten Nganjuk', 'Dokumentasi kebersamaan atlet, pelatih, dan pengurus cabang olahraga dalam membangun prestasi olahraga daerah.', 'Liputan Kegiatan'),
('v2', 'M7lc1UVf-VE', 'Pembinaan Atlet Menuju Prestasi Provinsi & Nasional', 'Program pelatihan terpusat serta dedikasi atlet muda Nganjuk dalam mengasah fisik, teknik, dan mental juara.', 'Pembinaan Atlet')
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- 5. TABEL PENGATURAN & HEADER WEBSITE
CREATE TABLE IF NOT EXISTS `pengaturan` (
  `id` INT PRIMARY KEY DEFAULT 1,
  `hero_image_url` TEXT,
  `ticker_items` JSON,
  `address` TEXT,
  `email` VARCHAR(100),
  `phone` VARCHAR(50),
  `youtube_channel_url` TEXT,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data Awal Pengaturan:
INSERT INTO `pengaturan` (`id`, `hero_image_url`, `ticker_items`, `address`, `email`, `phone`, `youtube_channel_url`)
VALUES (
  1,
  '',
  JSON_ARRAY(
    'Selamat Datang di Portal Resmi KONI Kabupaten Nganjuk',
    'Pemusatan Latihan 30+ Cabang Olahraga Aktif',
    'Semangat Sportivitas Generasi Muda Nganjuk',
    'Sekretariat: Stadion Anjuk Ladang Nganjuk'
  ),
  'Stadion Anjuk Ladang / Kompleks Olahraga Kabupaten Nganjuk, Jawa Timur 64419',
  'sekretariat@koni-nganjuk.or.id',
  '(0358) 321xxx / WhatsApp Layanan Resmi',
  'https://www.youtube.com/'
)
ON DUPLICATE KEY UPDATE `id` = 1;
