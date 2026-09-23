import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool, initDb } from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Inisialisasi DB saat server menyala
initDb();

// ─── 1. Health Check ──────────────────────────────────────────
app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1;");
    res.json({ status: "ok", database: "connected", timestamp: new Date() });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// ─── 2. Auth Login ────────────────────────────────────────────
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query(
      "SELECT id, username, nama FROM users WHERE username = ? AND password = ?;",
      [username, password]
    );
    if (rows.length > 0) {
      res.json({ success: true, user: rows[0] });
    } else {
      res.status(401).json({ success: false, message: "Username atau password salah" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── 3. Get All Data (untuk sync web utama & dashboard) ───────
app.get("/api/all", async (req, res) => {
  try {
    const [news] = await pool.query("SELECT * FROM berita ORDER BY created_at DESC;");
    const [gallery] = await pool.query("SELECT * FROM galeri ORDER BY created_at DESC;");
    const [videos] = await pool.query("SELECT * FROM video ORDER BY created_at DESC;");
    const [settingsRows] = await pool.query("SELECT * FROM pengaturan WHERE id = 1;");
    const settings = settingsRows[0] || {};

    const header = {
      heroImageUrl: settings.hero_image_url || "",
      tickerItems: typeof settings.ticker_items === "string" 
        ? JSON.parse(settings.ticker_items) 
        : settings.ticker_items || [],
    };

    const siteSettings = {
      address: settings.address || "",
      email: settings.email || "",
      phone: settings.phone || "",
      youtubeChannelUrl: settings.youtube_channel_url || "",
    };

    // Format videos to match frontend interface
    const formattedVideos = videos.map((v) => ({
      id: v.id,
      youtubeId: v.youtube_id,
      title: v.title,
      description: v.description,
      category: v.category,
    }));

    res.json({
      news,
      gallery,
      videos: formattedVideos,
      header,
      settings: siteSettings,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk sync dari frontend ke database
app.post("/api/all", async (req, res) => {
  const { news, gallery, videos, header, settings } = req.body;
  try {
    if (Array.isArray(news)) {
      await pool.query("DELETE FROM berita;");
      for (const item of news) {
        await pool.query(
          "INSERT INTO berita (slug, title, date, category, image, position, excerpt, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
          [item.slug, item.title, item.date, item.category, item.image, item.position || "center", item.excerpt, item.content || ""]
        );
      }
    }
    if (Array.isArray(gallery)) {
      await pool.query("DELETE FROM galeri;");
      for (const item of gallery) {
        await pool.query(
          "INSERT INTO galeri (id, title, image, position) VALUES (?, ?, ?, ?);",
          [item.id, item.title, item.image, item.position || "center"]
        );
      }
    }
    if (Array.isArray(videos)) {
      await pool.query("DELETE FROM video;");
      for (const item of videos) {
        await pool.query(
          "INSERT INTO video (id, youtube_id, title, description, category) VALUES (?, ?, ?, ?, ?);",
          [item.id, item.youtubeId, item.title, item.description || "", item.category || "Umum"]
        );
      }
    }
    if (header || settings) {
      await pool.query(
        "UPDATE pengaturan SET hero_image_url = ?, ticker_items = ?, address = ?, email = ?, phone = ?, youtube_channel_url = ? WHERE id = 1;",
        [
          header?.heroImageUrl || "",
          JSON.stringify(header?.tickerItems || []),
          settings?.address || "",
          settings?.email || "",
          settings?.phone || "",
          settings?.youtubeChannelUrl || "",
        ]
      );
    }
    res.json({ success: true, message: "Sinkronisasi database berhasil" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── 4. Berita (News) CRUD ────────────────────────────────────
app.get("/api/berita", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM berita ORDER BY created_at DESC;");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/berita", async (req, res) => {
  const { slug, title, date, category, image, position = "center", excerpt, content = "" } = req.body;
  try {
    await pool.query(
      `INSERT INTO berita (slug, title, date, category, image, position, excerpt, content)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [slug, title, date, category, image, position, excerpt, content]
    );
    res.json({ success: true, message: "Berita berhasil ditambahkan" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/berita/:slug", async (req, res) => {
  const { slug } = req.params;
  const { title, date, category, image, position = "center", excerpt, content = "" } = req.body;
  try {
    await pool.query(
      `UPDATE berita 
       SET title = ?, date = ?, category = ?, image = ?, position = ?, excerpt = ?, content = ?
       WHERE slug = ?;`,
      [title, date, category, image, position, excerpt, content, slug]
    );
    res.json({ success: true, message: "Berita berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/berita/:slug", async (req, res) => {
  const { slug } = req.params;
  try {
    await pool.query("DELETE FROM berita WHERE slug = ?;", [slug]);
    res.json({ success: true, message: "Berita berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── 5. Galeri CRUD ───────────────────────────────────────────
app.get("/api/galeri", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM galeri ORDER BY created_at DESC;");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/galeri", async (req, res) => {
  const { id, title, image, position = "center" } = req.body;
  try {
    await pool.query(
      "INSERT INTO galeri (id, title, image, position) VALUES (?, ?, ?, ?);",
      [id, title, image, position]
    );
    res.json({ success: true, message: "Foto galeri berhasil ditambahkan" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/galeri/:id", async (req, res) => {
  const { id } = req.params;
  const { title, image, position = "center" } = req.body;
  try {
    await pool.query(
      "UPDATE galeri SET title = ?, image = ?, position = ? WHERE id = ?;",
      [title, image, position, id]
    );
    res.json({ success: true, message: "Foto galeri berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/galeri/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM galeri WHERE id = ?;", [id]);
    res.json({ success: true, message: "Foto galeri berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── 6. Video CRUD ────────────────────────────────────────────
app.get("/api/video", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM video ORDER BY created_at DESC;");
    const formatted = rows.map((v) => ({
      id: v.id,
      youtubeId: v.youtube_id,
      title: v.title,
      description: v.description,
      category: v.category,
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/video", async (req, res) => {
  const { id, youtubeId, title, description = "", category = "Umum" } = req.body;
  try {
    await pool.query(
      "INSERT INTO video (id, youtube_id, title, description, category) VALUES (?, ?, ?, ?, ?);",
      [id, youtubeId, title, description, category]
    );
    res.json({ success: true, message: "Video berhasil ditambahkan" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/video/:id", async (req, res) => {
  const { id } = req.params;
  const { youtubeId, title, description = "", category = "Umum" } = req.body;
  try {
    await pool.query(
      "UPDATE video SET youtube_id = ?, title = ?, description = ?, category = ? WHERE id = ?;",
      [youtubeId, title, description, category, id]
    );
    res.json({ success: true, message: "Video berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/video/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM video WHERE id = ?;", [id]);
    res.json({ success: true, message: "Video berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── 7. Header (Hero Image & Ticker) ──────────────────────────
app.get("/api/header", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT hero_image_url, ticker_items FROM pengaturan WHERE id = 1;");
    const item = rows[0] || {};
    res.json({
      heroImageUrl: item.hero_image_url || "",
      tickerItems: typeof item.ticker_items === "string" ? JSON.parse(item.ticker_items) : item.ticker_items || [],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/header", async (req, res) => {
  const { heroImageUrl = "", tickerItems = [] } = req.body;
  try {
    await pool.query(
      "UPDATE pengaturan SET hero_image_url = ?, ticker_items = ? WHERE id = 1;",
      [heroImageUrl, JSON.stringify(tickerItems)]
    );
    res.json({ success: true, message: "Header & Ticker berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── 8. Pengaturan Umum ───────────────────────────────────────
app.get("/api/pengaturan", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT address, email, phone, youtube_channel_url FROM pengaturan WHERE id = 1;");
    const item = rows[0] || {};
    res.json({
      address: item.address || "",
      email: item.email || "",
      phone: item.phone || "",
      youtubeChannelUrl: item.youtube_channel_url || "",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/pengaturan", async (req, res) => {
  const { address = "", email = "", phone = "", youtubeChannelUrl = "" } = req.body;
  try {
    await pool.query(
      "UPDATE pengaturan SET address = ?, email = ?, phone = ?, youtube_channel_url = ? WHERE id = 1;",
      [address, email, phone, youtubeChannelUrl]
    );
    res.json({ success: true, message: "Pengaturan berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── 9. Reset ke Data Bawaan ──────────────────────────────────
app.post("/api/reset", async (req, res) => {
  try {
    await pool.query("DELETE FROM berita;");
    await pool.query("DELETE FROM galeri;");
    await pool.query("DELETE FROM video;");
    await pool.query("DELETE FROM pengaturan;");
    await initDb();
    res.json({ success: true, message: "Database berhasil direset ke data default" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mulai Server
app.listen(PORT, () => {
  console.log(`🚀 Node.js API KONI Nganjuk berjalan di: http://localhost:${PORT}`);
  console.log(`📡 Endpoint Utama: http://localhost:${PORT}/api/all`);
});
