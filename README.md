# Web Pembayaran Tagihan Sekolah

## Deskripsi
Sistem ini memungkinkan admin untuk mengelola tagihan siswa, menetapkan denda otomatis berdasarkan tanggal jatuh tempo, serta menyediakan dashboard dengan chart data pembayaran bulanan.

## Fitur
- **Admin**:
  - Tambah, edit, hapus tagihan untuk siswa.
  - Melihat daftar siswa
- **Siswa**:
  - Melihat tagihan, membayar tagihan, dan mencetak kuitansi.
- **Dashboard**:
  - Visualisasi data pembayaran berdasarkan bulan.
- **Denda Otomatis**:
  - Denda ditambahkan jika pembayaran melewati jatuh tempo.



## Teknologi yang Digunakan
- [React.js](https://reactjs.org/)
- [Supabase](https://supabase.io/)
- [Tailwind CSS](https://tailwindcss.com/)

## Instalasi dan Menjalankan Project
1. Clone repository ini:
   ```sh
   git clone https://github.com/Jeffrryy/UJIKOM_Web_pembayaran_tagihan_sekolah.git
   cd UJIKOM_Web_pembayaran_tagihan_sekolah
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Buat file `.env` dan isi dengan konfigurasi Supabase:
   ```env
   VITE_SUPABASE_CLIENT_URL =your_supabase_url
   VITE_SUPABASE_SECRET_KEY =your_supabase_anon_key
   ```
4. Jalankan aplikasi:
   ```sh
   npm run dev
   ```

## Struktur Folder
```
/src  
  ├── assets/       # gambar, ikon, atau file statis lainnya  
  ├── config/       # konfigurasi Supabase dan setting global lainnya  
  ├── constants/    # nilai tetap 
  ├── hooks/        # custom hooks  
  ├── layout/       # komponen tata letak   
  ├── routes/       # definisi dan konfigurasi rute halaman  
  │   ├── dashboard/  # halaman dashboard (chart, statistik)  
  │   ├── kuitansi/   # halaman untuk melihat/mencetak kuitansi pembayaran  
  │   ├── login/      # halaman login  
  │   ├── profile/    # halaman profil user 
  │   ├── register/   # halaman pendaftaran akun  
  │   ├── tagihan/    # halaman daftar & detail tagihan  
  ├── utils/        # fungsi bantu 
        # Styling
```

## Kontributor
- Niko Christian

