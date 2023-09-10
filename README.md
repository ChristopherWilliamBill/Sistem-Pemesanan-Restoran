Petunjuk acuan teknis untuk perangkat lunak Sistem Informasi Pemesanan Restoran

===INSTALASI===
1.  Unduh dan install Node.js dari situs resmi Node.js di https://nodejs.org/en
2.  Unduh dan install PostgreSQL dari situs resmi PostgreSQL di https://www.postgresql.org/

===KONFIGURASI DATABASE===
1.  Konfigurasi user, host, port, dan database perlu diatur pada file /module/pg.js sesuai user, host, port, dan database PostgreSQL Anda
2.  Eksekusi perintah CREATE TABLE seperti yang terdapat pada file-file .sql pada folder /Database/DDL
3.  Jika ingin menggunakan data yang sudah ada, Anda perlu mengimport data CSV ke dalam tabel-tabel yang sudah dibuat pada langkah 4
    Data CSV terdapat pada folder /Database/Data dengan nama file yang sesuai dengan nama tabelnya
    Anda juga dipersilahkan untuk menambahkan data Anda sendiri jika tidak ingin menggunakan data yang sudah ada dan hendak mengoperasikan sistem pemesanan restoran ini dari 0

===CLOUDINARY===
1.  Buat akun Cloudinary di https://cloudinary.com/
2.  Anda akan mendapatkan API key dan API secret dari Cloudinary untuk ditambahkan ke environment variable
3.  Data gambar menu pada sistem pemesanan restoran disimpan pada Cloudinary, sehingga data gambar pada data CSV di tabel Menu dapat berbeda setiap akunnya.
4.  Untuk menyesuaikan gambar pada database dengan data pada Cloudinary dapat dilakukan dengan cara berikut:
5.  Mengunggah gambar menu yang akan digunakan ke akun Cloudinary anda
6.  Mengubah variable path pada file next.config.js (baris 7) menjadi url akun Cloudinary Anda (contoh: https://res.cloudinary.com/[idPengguna]/image/upload)
7.  Mengubah variable endpoint pada file /component/formmenu.js (baris 85) menjadi url akun Cloudinary Anda (contoh: https://api.cloudinary.com/v1_1/[idPengguna]/image/upload)
8.  Setelah gambar Menu berhasil diunggah pada akun Anda, maka Anda akan mendapatkan url seperti berikut: https://res.cloudinary.com/dpggxjyay/image/upload/v1678895941/nasiputih_caqo4y.jpg
9.  Data gambar menu yang disimpan pada database adalah url setelah /upload (contoh: /v1678895941/nasiputih_caqo4y.jpg)

===ENVIRONMENT VARIABLE=== 
1.  Tambahkan file .env.local pada direktori source code
2.  Tambahkan variable berikut:
    NEXTAUTH_SECRET=q2952e010373bcca7de11fbd2140891c00c7ccdc4
    NEXTAUTH_URL=http://localhost:3000/
    REVALIDATE_TOKEN=a1f94aecb52c2ab29c0b8a531b633961
3.  Tambahkan API secret dan API key dari akun Cloudinary Anda pada variable NEXT_PUBLIC_CLOUDINARY_API_SECRET dan NEXT_PUBLIC_CLOUDINARY_API_KEY
4.  Isi dari .env.local akhirnya adalah seperti berikut:

NEXTAUTH_SECRET=q2952e010373bcca7de11fbd2140891c00c7ccdc4
NEXTAUTH_URL=http://localhost:3000/

REVALIDATE_TOKEN=a1f94aecb52c2ab29c0b8a531b633961

NEXT_PUBLIC_CLOUDINARY_API_SECRET=API secret Anda
NEXT_PUBLIC_CLOUDINARY_API_KEY=API key Anda

===OPERASI===
1.  Buka terminal atau command prompt dan arahkan direktori ke tempat source code ini disimpan
2.  Jalankan perintah npm i, npm run build, npm run start secara berurutan (untuk selanjutnya, npm i dan npm run build tidak perlu dieksekusi lagi)
3.  Sistem pemesanan restoran dapat diakses pada http://localhost:3000/
4.  Sistem pemesanan restoran memiliki 3 role, yaitu manager, karyawan, dan meja (pelanggan)
5.  Jika Anda menggunakan data yang sudah ada:
    Memasuki sistem sebagai manager: tekan tombol Manager, dengan username bill dan password 123
    Memasuki sistem sebagai karyawan: tekan tombol Employee, dengan username chris dan password 888
    Memasuki sistem sebagai pelanggan: tekan tombol Table, dengan username Table 1 dan password meja1 
    Jika anda menggunakan data sendiri, maka username dan password dapat disesuaikan
6. Fitur-fitur sistem pemesanan restoran sudah dapat berfungsi dan diakses berdasarkan role yang Anda pilih