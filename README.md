# FILLTECH BERKAH BERSAMA - SISTEM MANAJEMEN ISP

![Filltech Banner](public/logo.png)

**Filltech System** adalah aplikasi berbasis web modern untuk manajemen operasional Penyedia Layanan Internet (ISP). Aplikasi ini mengelola siklus hidup pelanggan mulai dari registrasi, berlangganan paket, penagihan otomatis, verifikasi pembayaran, hingga penugasan teknisi lapangan.

Dibangun dengan arsitektur **Monolith Modern** menggunakan **Laravel 10**, **Inertia.js**, dan **React**, aplikasi ini dirancang untuk performa tinggi, keamanan ketat, dan pengalaman pengguna (UX) yang responsif.

---

## 🚀 Fitur Utama

### 1. Multi-Role Dashboard
* **Administrator:** Mengelola paket, verifikasi pembayaran, pantau pendapatan (grafik), dan manajemen user.
* **Teknisi:** Menerima tugas lapangan, absen (clock-in/out), dan kelola logistik alat.
* **Klien:** Mendaftar, memilih paket, melihat tagihan, upload bukti bayar, dan mengajukan komplain.

### 2. Otomatisasi & Notifikasi
* **Tagihan Otomatis:** Command terjadwal (`app:generate-monthly-invoices`) untuk membuat invoice bulanan masal.
* **Notifikasi Cerdas:** Notifikasi via Database (Lonceng Dashboard) dan integrasi WhatsApp Channel untuk tagihan/pembayaran.

### 3. Keamanan & Integritas
* **Role-Based Access Control (RBAC):** Isolasi ketat antara data Admin, Teknisi, dan Klien.
* **Audit Log:** Mencatat setiap aktivitas penting admin (Spatie Activitylog).
* **Validasi Ketat:** Form Request terpisah, Rate Limiting pada login, dan proteksi Mass Assignment.

### 4. Reporting
* **PDF Export:** Laporan pendapatan keuangan bulanan siap cetak (DomPDF).
* **Grafik Real-time:** Visualisasi tren pendapatan tahunan.

---

## 🛠️ Teknologi (Tech Stack)

* **Backend:** Laravel 10 (PHP 8.1+)
* **Frontend:** React 18, Inertia.js 2.0
* **Styling:** Tailwind CSS, Headless UI
* **Database:** MySQL / PostgreSQL
* **Authentication:** Laravel Breeze, Laravel Sanctum, Socialite (Google Login)
* **Utilities:** Spatie Activitylog, DomPDF, Chart.js

---

## ⚙️ Panduan Instalasi (Local Development)

Ikuti langkah ini untuk menjalankan proyek di komputer lokal Anda.

### Prasyarat
* PHP >= 8.1
* Composer
* Node.js & NPM
* MySQL / MariaDB

### Langkah-langkah

1.  **Kloning Repositori**
    ```bash
    git clone [https://github.com/FrengkiSimatupang17/Filltech-Project.git](https://github.com/FrengkiSimatupang17/Filltech-Project.git)
    cd Filltech-Project
    ```

2.  **Instal Dependensi Backend**
    ```bash
    composer install
    ```

3.  **Konfigurasi Environment**
    Duplikasi file `.env.example` menjadi `.env`:
    ```bash
    cp .env.example .env
    php artisan key:generate
    ```
    *Buka file `.env` dan sesuaikan konfigurasi Database (`DB_DATABASE`, `DB_USERNAME`, dll).*

4.  **Migrasi & Seeding Database**
    Ini akan membuat tabel dan mengisi data akun default (Admin, Teknisi, Paket Internet).
    ```bash
    php artisan migrate --seed
    ```

5.  **Instal Dependensi Frontend**
    ```bash
    npm install
    npm run build
    ```

6.  **Jalankan Aplikasi**
    Buka dua terminal terpisah:
    * Terminal 1 (Laravel Server):
        ```bash
        php artisan serve
        ```
    * Terminal 2 (Vite Development - Opsional jika sudah build):
        ```bash
        npm run dev
        ```

Akses aplikasi di: `http://127.0.0.1:8000`

---

## 👤 Akun Default (Seeder)

Gunakan akun berikut untuk masuk dan menguji fitur:

| Role | Email | Password | Deskripsi |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@filltech.com` | `password` | Akses penuh sistem & laporan. |
| **Teknisi** | `budi@filltech.com` | `password` | Akses tugas & logistik. |
| **Client** | `siska@client.com` | `password` | Simulasi pelanggan. |

---

## ⏰ Penjadwalan (Task Scheduling)

Untuk menjalankan fitur **Tagihan Otomatis** di server lokal tanpa cron job asli, jalankan perintah:

```bash
php artisan schedule:work