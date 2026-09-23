# Panduan Backend Node.js & Database MySQL Laragon — KONI Nganjuk

Backend API ini bertugas menghubungkan website KONI Kabupaten Nganjuk dengan database MySQL di Laragon.

---

## 1. Persiapan Laragon (MySQL)
1. Buka aplikasi **Laragon** di komputer Anda.
2. Klik tombol **Start All** (pastikan modul MySQL berjalan pada port `3306`).
3. *(Opsional)* Jika ingin import database secara manual:
   - Buka **Database** (HeidiSQL atau phpMyAdmin) di Laragon.
   - Buat database bernama: `koni_nganjuk`.
   - Jalankan script SQL yang ada di file [`server/koni_nganjuk.sql`](file:///c:/Users/LENOVO/Downloads/KONI/server/koni_nganjuk.sql).
   > **Catatan:** Script `index.js` juga sudah dilengkapi **Auto-Init & Auto-Seed**, jadi saat server Node.js dijalankan, tabel & data awal akan otomatis dibuat jika belum ada!

---

## 2. Cara Menjalankan Backend Node.js
Buka terminal baru di folder proyek ini (`c:\Users\LENOVO\Downloads\KONI`), lalu jalankan:

```bash
# 1. Install dependensi (cukup sekali di awal)
npm install

# 2. Jalankan server backend API
npm run server
```

Server API akan berjalan di:  
🔗 **`http://localhost:5000`**

---

## 3. Menjalankan Website (Frontend)
Di terminal terpisah, jalankan website seperti biasa:

```bash
npm run dev
```

Website akan otomatis membaca data dari MySQL melalui API Node.js di `http://localhost:5000/api`.

---

## 4. Akses Dashboard Admin (Terpisah & Tersembunyi)
Sesuai permintaan, **tidak ada tombol/link di web publik** untuk masuk ke portal admin.

Untuk mengakses dashboard admin:
1. Buka browser langsung ke alamat:  
   🔗 **`http://localhost:3000/admin/login`** (atau sesuai port web Anda, misal `:5173/admin/login`).
2. Masukkan akun:
   - **Username:** `admin_koni`
   - **Password:** `koni@nganjuk`
3. Setelah login, Anda bebas mengelola berita, galeri foto, video YouTube, gambar header, pengumuman running ticker, dan informasi kontak.
4. Setiap perubahan yang Anda simpan di admin akan langsung tersimpan di **MySQL Laragon** dan otomatis terhubung/ter-update ke web utama!
