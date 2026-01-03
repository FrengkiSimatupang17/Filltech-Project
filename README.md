# 📡 FILLTECH PROJECT DOCUMENTATION

![Laravel](https://img.shields.io/badge/Backend-Laravel_10-FF2D20?style=for-the-badge&logo=laravel)
![React](https://img.shields.io/badge/Frontend-React_Inertia-61DAFB?style=for-the-badge&logo=react)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql)
![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)
![Tests](https://img.shields.io/badge/Tests-35_Passed-brightgreen?style=for-the-badge)

**Project Owner:** Frengki Simatupang  
**Last Updated:** Januari 2026  
**Version:** 1.1.0 (Stable)

---

## 📋 Daftar Isi
1. [Tech Stack](#1-tech-stack)
2. [Arsitektur Sistem](#2-arsitektur-sistem)
3. [Fitur & Logika Bisnis Utama](#3-fitur--logika-bisnis-utama-core-logic)
4. [Instalasi & Setup Lokal](#4-instalasi--setup-lokal)
5. [Testing & Quality Assurance](#5-testing--quality-assurance)
6. [Panduan Import Data Pelanggan](#6-panduan-import-data-pelanggan)
7. [Deployment](#7-deployment)

---

## 1. 🛠️ Tech Stack
Project ini dibangun dengan arsitektur **Monolith Modern** menggunakan Inertia.js untuk pengalaman SPA (Single Page Application).

| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Framework** | Laravel 10.x | Core Backend Framework |
| **Frontend** | React 18 + Inertia.js | Tanpa API terpisah, routing via Laravel |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Database** | PostgreSQL | Support JSON column & advanced indexing |
| **Auth** | Laravel Breeze + Socialite | Login biasa & Google Login |
| **PDF Engine** | barryvdh/laravel-dompdf | Generate Invoice/Laporan |
| **Logging** | spatie/laravel-activitylog | Audit Trail aktivitas user |

---

## 2. 🏗️ Arsitektur Sistem

Struktur folder controller dipisahkan berdasarkan **Role** untuk keamanan dan kerapian kode.

### 📂 Peta Controller (`app/Http/Controllers/`)
* **`Admin/`**: Akses penuh (Master Data, Stok Barang, Verifikasi Pembayaran).
* **`Client/`**: Area pelanggan (Cek Tagihan, Upload Bukti Bayar, Update Profil).
* **`Teknisi/`**: Area pekerja lapangan (Tugas Instalasi, Absensi, Log Alat).
* **`Auth/`**: `RegisteredUserController` (Handle pendaftaran user baru).
* **`ProfileController.php`**: Handle update profil & **Generator ID Unik**.

### 🛡️ Middleware Khusus
1. **`role:admin|teknisi|client`**: Membatasi akses URL berdasarkan tipe user.
2. **`clock_in`**: Middleware khusus Teknisi. Teknisi **TIDAK BISA** akses menu tugas/alat sebelum melakukan absensi masuk (Clock-In) pada hari tersebut.
3. **`profile.complete`**: User tidak bisa masuk dashboard jika alamat belum lengkap.

---

## 3. 🧠 Fitur & Logika Bisnis Utama (Core Logic)

Bagian ini menjelaskan logika kompleks yang berjalan di belakang layar.

### A. 🆔 Smart ID Generation (ID Pelanggan)
Fitur unggulan untuk menangani pendaftaran via Google maupun Manual.
* **Masalah Awal:** User daftar via Google tidak punya alamat -> ID jadi cacat (`RW--RT--`).
* **Solusi (Current Logic):**
    1. **Saat Register:** ID Unik dibiarkan `NULL` jika alamat kosong.
    2. **Saat Update Profil:** Sistem mengecek:
       * Jika `id_unik` kosong **ATAU**
       * Jika `id_unik` cacat (mengandung string `RW-` atau `RT-`).
       * **DAN** User mengisi alamat lengkap.
       * -> **Maka ID Baru digenerate otomatis.**
* **Format ID:** `ddmmyy-RW[rw]-RT[rt]-[blok].[no_rumah]` (Contoh: `030126-RW05-RT002-A.10`).

### B. 📦 Manajemen Stok (Inventory Safety)
Mencegah korupsi data stok oleh human error atau sistem error.
* **Validasi Ketat:** Admin tidak bisa input stok negatif (misal: `-5`). Minimal input adalah `1`.
* **Atomic Transaction:** Menggunakan `DB::beginTransaction()`. Jika log gagal disimpan, stok barang batal bertambah.
* **Audit Trail:** Setiap perubahan stok dicatat di tabel `equipment_logs` (stok fisik) dan `activity_logs` (siapa yang mengubah).

### C. 🔧 Keamanan Operasional Teknisi
* **Task Isolation:** Teknisi A tidak bisa mengedit/menyelesaikan tugas milik Teknisi B (dicek via Policy/Controller).
* **Evidence Upload:** Bukti foto wajib diupload saat menyelesaikan tugas. Foto lama otomatis dihapus dari server saat direvisi (Hemat Storage).

### D. 💸 Alur Pembayaran Otomatis
1. Admin klik **"Verifikasi Pembayaran"**.
2. Sistem update status Invoice -> `PAID`.
3. Sistem membuat **Task Instalasi Baru** untuk teknisi secara otomatis.
4. Notifikasi dikirim ke Dashboard Client.

---

## 4. 💻 Instalasi & Setup Lokal

Ikuti langkah ini untuk menjalankan project di komputer Anda.

1. **Clone Repository**
   ```bash
   git clone [https://github.com/FrengkiSimatupang17/Filltech-Project.git](https://github.com/FrengkiSimatupang17/Filltech-Project.git)
   cd Filltech-Project
Install DependenciesBashcomposer install
npm install
Environment SetupCopy file .env.example menjadi .env dan sesuaikan database:Bashcp .env.example .env
php artisan key:generate
Pastikan setting DB_DATABASE, DB_USERNAME, DB_PASSWORD sesuai PostgreSQL lokal Anda.Database MigrationBashphp artisan migrate --seed
Run AppBuka 2 terminal berbeda:Terminal 1: php artisan serveTerminal 2: npm run dev5. ✅ Testing & Quality AssuranceProject ini dilengkapi dengan 35 Automated Tests untuk menjamin kestabilan. Test mencakup Unit Test dan Feature Test.Cara Menjalankan TestBashphp artisan test
Cakupan Test UtamaModulDeskripsi TestStatusUser ProfileCek logika ID Unik (Register Null -> Update Generate).✅ PASSEquipmentCek validasi stok negatif & pencatatan log admin.✅ PASSTechnicianCek keamanan akses tugas & upload foto bukti.✅ PASSAuthCek Login, Register, & Reset Password.✅ PASS6. 📂 Panduan Import Data PelangganJika Anda memiliki data pelanggan lama (Excel/CSV), gunakan fitur Seeder khusus yang sudah disiapkan.Siapkan File CSVPastikan format CSV sesuai (ID, Nama, Alamat, dll).Simpan FileLetakkan file di storage/app/clients.csv.Jalankan CommandBashphp artisan db:seed --class=ImportClientSeeder
Note: Script ini aman dijalankan karena menggunakan updateOrCreate dan tidak akan merusak ID Unik yang sudah ada.7. 🚀 Deployment (Railway/VPS)Environment Variables Wajib (Production)Pastikan variabel ini diset di server:Code snippetAPP_ENV=production
APP_DEBUG=false
APP_URL=[https://filltech.up.railway.app](https://filltech.up.railway.app)
DB_CONNECTION=pgsql
# ... Credential Database ...
Build CommandSaat deploy, pastikan perintah ini dijalankan:Bashcomposer install --no-dev --optimize-autoloader
php artisan migrate --force
npm run build
php artisan config:cache
php artisan route:cache
Filltech Project Internal Documentation Dilarang menyebarkan source code ini tanpa izin Project Owner.