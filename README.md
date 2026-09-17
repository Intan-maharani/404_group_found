# 404 Group Found [CHILL TIME]

Aplikasi **“Chill Time”** ini adalah aplikasi berbasis web untuk memudahkan proses penyewaan dan peminjaman alat-alat camping/piknik. Sistem ini dirancang untuk mempermudah pengguna dalam mengajukan peminjaman serta membantu pihak manajemen dalam memantau dan menyetujui ketersediaan alat secara real-time.

## Fitur Utama

Sistem ini memiliki 4 fitur utama yang terbagi sesuai dengan alur pengguna dan pengelola:

### 1. Autentikasi (Auth)

- **Register:** Pendaftaran akun baru untuk pengguna/penyewa.
- **Login:** Masuk ke dalam sistem menggunakan username dan kata sandi.
- **Role-based Access Control:** Pemisahan hak akses antara User (Penyewa) dan Admin.

### 2. Katalog & Pengajuan Peminjaman (User)

- **Katalog Alat Satuan & Paket Bundle:** Menelusuri pilihan alat camping/piknik satuan maupun paket hemat bundling.
- **Form Pengajuan:** Menentukan detail tanggal mulai, tanggal kembali, dan jumlah alat/paket yang dipinjam.
- **Validasi Stok Otomatis:** Sistem secara otomatis mengecek ketersediaan stok alat sesuai rentang tanggal yang dipilih sebelum pengajuan dikirim.

### 3. Riwayat & Status Peminjaman (User)

- **Riwayat Peminjaman:** Melihat daftar seluruh riwayat transaksi peminjaman yang pernah dilakukan.
- **Pelacakan Status Real-time:** Memantau status pengajuan yang terbagi menjadi:
  - ⏳ **Pending:** Menunggu persetujuan manajemen.
  - ✅ **Approved:** Pengajuan disetujui, siap diambil.
  - ❌ **Rejected:** Pengajuan ditolak (dilengkapi alasan penolakan).
  - 🎒 **Borrowed:** Alat sedang dibawa/dipinjam.
  - ✔️ **Returned:** Alat sudah dikembalikan dan diverifikasi.

### 4. Approval & Manajemen (Admin/Manajemen)

- **Dashboard Manajemen:** Ringkasan data transaksi operasional, total alat dipinjam, antrean persetujuan tertunda, dan total penyewa aktif.
- **Persetujuan (Approval):** Menerima atau menolak pengajuan peminjaman dari pengguna.
- **Pengelolaan Inventaris & Stok:** Memantau ketersediaan unit dan status alat camping.
- **Verifikasi Pengembalian:** Verifikasi kondisi dan tanggal pengembalian alat dari pengguna.