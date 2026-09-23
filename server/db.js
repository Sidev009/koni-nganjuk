import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const {
  DB_HOST = "localhost",
  DB_PORT = 3307,
  DB_USER = "root",
  DB_PASSWORD = "",
  DB_NAME = "koni_nganjuk",
} = process.env;

// Connection pool configuration
export const pool = mysql.createPool({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/**
 * Initializes database and tables automatically if they don't exist.
 */
export async function initDb() {
  try {
    // 1. Create database if it does not exist
    const rootConnection = await mysql.createConnection({
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD,
    });
    await rootConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await rootConnection.end();

    // 2. Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        nama VARCHAR(100) NOT NULL DEFAULT 'Administrator KONI',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS berita (
        id INT AUTO_INCREMENT PRIMARY KEY,
        slug VARCHAR(150) NOT NULL UNIQUE,
        title VARCHAR(255) NOT NULL,
        date VARCHAR(50) NOT NULL,
        category VARCHAR(50) NOT NULL,
        image TEXT NOT NULL,
        position VARCHAR(30) DEFAULT 'center',
        excerpt TEXT NOT NULL,
        content LONGTEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS galeri (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        image TEXT NOT NULL,
        position VARCHAR(30) DEFAULT 'center',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS video (
        id VARCHAR(50) PRIMARY KEY,
        youtube_id VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(50) DEFAULT 'Umum',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS pengaturan (
        id INT PRIMARY KEY DEFAULT 1,
        hero_image_url TEXT,
        ticker_items JSON,
        address TEXT,
        email VARCHAR(100),
        phone VARCHAR(50),
        youtube_channel_url TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 3. Ensure default admin user exists
    await pool.query(`
      INSERT INTO users (username, password, nama)
      VALUES ('admin_koni', 'koni@nganjuk', 'Administrator KONI')
      ON DUPLICATE KEY UPDATE username = username;
    `);

    // 4. Ensure default settings exist
    const [settingsRows] = await pool.query(`SELECT id FROM pengaturan WHERE id = 1;`);
    if (settingsRows.length === 0) {
      await pool.query(`
        INSERT INTO pengaturan (id, hero_image_url, ticker_items, address, email, phone, youtube_channel_url)
        VALUES (
          1,
          '',
          ?,
          'Stadion Anjuk Ladang / Kompleks Olahraga Kabupaten Nganjuk, Jawa Timur 64419',
          'sekretariat@koni-nganjuk.or.id',
          '(0358) 321xxx / WhatsApp Layanan Resmi',
          'https://www.youtube.com/'
        );
      `, [JSON.stringify([
        "Selamat Datang di Portal Resmi KONI Kabupaten Nganjuk",
        "Pemusatan Latihan 30+ Cabang Olahraga Aktif",
        "Semangat Sportivitas Generasi Muda Nganjuk",
        "Sekretariat: Stadion Anjuk Ladang Nganjuk",
      ])]);
    }

    // 5. Seed initial news if empty
    const [newsRows] = await pool.query(`SELECT COUNT(*) as count FROM berita;`);
    if (newsRows[0]?.count === 0) {
      await pool.query(`
        INSERT INTO berita (slug, title, date, category, image, position, excerpt, content) VALUES
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
        );
      `);
    }

    // 6. Seed initial gallery if empty
    const [galleryRows] = await pool.query(`SELECT COUNT(*) as count FROM galeri;`);
    if (galleryRows[0]?.count === 0) {
      await pool.query(`
        INSERT INTO galeri (id, title, image, position) VALUES
        ('g1', 'Cabang Bulu Tangkis', '/koni-sports-grid.jpg', '0% 0%'),
        ('g2', 'Lintasan Atletik', '/koni-sports-grid.jpg', '100% 0%'),
        ('g3', 'Pertandingan Bola Voli', '/koni-sports-grid.jpg', '0% 100%'),
        ('g4', 'Pencak Silat', '/koni-sports-grid.jpg', '100% 100%'),
        ('g5', 'Defile Atlet Pembukaan', '/koni-hero.jpg', 'center'),
        ('g6', 'Perayaan Prestasi Atlet', '/koni-athletes.jpg', 'center');
      `);
    }

    // 7. Seed initial videos if empty
    const [videoRows] = await pool.query(`SELECT COUNT(*) as count FROM video;`);
    if (videoRows[0]?.count === 0) {
      await pool.query(`
        INSERT INTO video (id, youtube_id, title, description, category) VALUES
        ('v1', 'ScMzIvxBSi4', 'Semangat Olahraga Kabupaten Nganjuk', 'Dokumentasi kebersamaan atlet, pelatih, dan pengurus cabang olahraga dalam membangun prestasi olahraga daerah.', 'Liputan Kegiatan'),
        ('v2', 'M7lc1UVf-VE', 'Pembinaan Atlet Menuju Prestasi Provinsi & Nasional', 'Program pelatihan terpusat serta dedikasi atlet muda Nganjuk dalam mengasah fisik, teknik, dan mental juara.', 'Pembinaan Atlet');
      `);
    }

    console.log("✅ Database MySQL 'koni_nganjuk' di Laragon berhasil terhubung dan siap digunakan!");
  } catch (err) {
    console.error("❌ Gagal inisialisasi database MySQL Laragon:", err.message);
    console.error("👉 Pastikan Laragon sudah 'Start All' dan MySQL aktif di port 3307.");
  }
}
