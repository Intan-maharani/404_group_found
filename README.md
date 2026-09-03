# 404 Group Found [CHILL TIME]

Aplikasi  “Chill Time” ini Adalah aplikasi berbasis web untuk memudahkan proses penyewaan dan peminjaman alat-alat camping/piknik. Sistem ini dirancang untuk mempermudah pengguna dalam mengajukan peminjaman serta membantu pihak manajemen dalam memantau dan menyetujui ketersediaan alat secara real-time.

## Fitur Utama
Sistem ini memiliki beberapa fitur utama yang terbagi sesuai dengan alur pengguna dan pengelola:
 1. Autentikasi (Auth)
•	Register: Pendaftaran akun baru untuk pengguna/penyewa.
•	Login: Masuk ke dalam sistem menggunakan email/username dan kata sandi.
•	Role-based Access Control: Pemisahan hak akses antara User (Penyewa) dan Admin/Manajemen.
2. Pengajuan Peminjaman (User)
•	Katalog Alat: Melihat daftar alat piknik/camping yang tersedia (coolbox,tikar, kompor portable, dll.).
•	Form Pengajuan: Menentukan detail tanggal mulai, tanggal kembali, dan jumlah alat yang dipinjam.
•	Validasi Stok: Pemilihan alat secara otomatis mengecek ketersediaan stok sesuai tanggal yang dipilih.
3. Daftar & Status Peminjaman (User)
•	Riwayat Peminjaman: Melihat semua riwayat transaksi peminjaman yang pernah dilakukan.
•	Pelacakan Status Real-time: Memantau status pengajuan yang terbagi menjadi:
o	⏳ Pending: Menunggu persetujuan manajemen.
o	✅ Approved: Pengajuan disetujui, siap diambil.
o	❌ Rejected: Pengajuan ditolak (dilengkapi alasan penolakan).
o	🎒 Borrowed: Alat sedang dibawa/dipinjam.
o	✔️ Returned: Alat sudah dikembalikan.
5. Paket Hemat / Bundling (User & Admin)
•	Katalog Paket (User): Melihat dan memilih gabungan beberapa alat piknik/grill dalam satu paket dengan harga sewa yang lebih terjangkau.
•	Detail & Rincian Paket (User): Memeriksa daftar lengkap alat yang didapat, deskripsi penggunaan, serta total estimasi kehematan.
•	Pengajuan Sewa Instan (User): Mengajukan peminjaman seluruh alat di dalam paket sekaligus tanpa perlu memilih barang satu per satu.
•	Pengelolaan Paket (Admin): Menambah, memperbarui, atau menghapus kombinasi alat, deskripsi paket, dan harga promo bundling.
•	Sinkronisasi Stok Otomatis (Admin): Sistem memverifikasi ketersediaan stok setiap alat individu yang tergabung di dalam paket sebelum persetujuan diberikan.

6. Approval & Manajemen (Admin/Manajemen)
•	Dashboard Manajemen: Ringkasan data transaksi, total alat dipinjam, dan persetujuan yang tertunda.
•	Persetujuan (Approval): Menerima atau menolak pengajuan peminjaman dari pengguna.
•	Pengelolaan Inventaris: Menambah, memperbarui, atau menghapus data alat dan stok.
•	Pengembalian Alat: Verifikasi kondisi dan tanggal pengembalian alat dari pengguna.



