# Undangan Pernikahan Digital — Elegan & Minimalis (Tidak Alay)

Contoh template undangan pernikahan digital interaktif dengan desain editorial, modern, dan minimalis. Dilengkapi dengan **Google Maps terintegrasi**, **latar musik YouTube Music**, **fitur RSVP interaktif**, **penghitung waktu mundur (countdown)**, dan **amplop digital**.

---

## ✨ Fitur Utama

1. **Desain Editorial & Minimalis ("Tidak Alay")**:
   - Tipografi elegan berkelas menggunakan font *Cormorant Garamond* (Serif Editorial) dan *Plus Jakarta Sans* (Modern Sans).
   - Palet warna lembut *warm ivory, linen, taupe,* dan aksen arang elegan (*charcoal*).
   - Tanpa animasi norak (tidak ada kelopak mawar jatuh berlebihan, efek glitter mencolok, atau musik otomatis yang mengagetkan tanpa izin pengguna).
   - Transisi *fade-up* halus menggunakan *Intersection Observer*.

2. **Musik YouTube Terintegrasi & Dual Audio Engine**:
   - Menggunakan lagu resmi: `https://music.youtube.com/watch?v=DIFlwV7WQx8` (*Ginger Tunes – Lamentation*).
   - Dilengkapi berkas audio lokal (`audio/song.m4a` dan `audio/song.webm`) serta *fallback* YouTube Iframe API.
   - **Autoplay Policy Compliance**: Sesuai standar privasi browser modern (Chrome, Safari, Edge, Android, iOS), musik berputar mulus begitu tombol **"Buka Undangan"** atau sentuhan pertama pada layar dilakukan.
   - Dilengkapi *floating vinyl player button* di pojok kanan bawah untuk menjeda (*pause*) atau memutar kembali (*play*) musik kapan saja.

3. **Peta Google Maps Terintegrasi**:
   - *Embed iframe* interaktif dengan sudut melengkung modern (*rounded frame*).
   - Tombol langsung untuk navigasi di aplikasi Google Maps (*Turn-by-turn directions*).
   - Tombol sekali klik untuk menyalin alamat lengkap ke *clipboard*.

4. **Personalisasi Nama Tamu Otomatis**:
   - Dukungan parameter URL: buka dengan `index.html?to=Nama+Tamu` (contoh: `index.html?to=Bapak+Joko+Sekeluarga`). Nama tamu akan otomatis tampil di kartu sampul depan.

5. **RSVP & Buku Doa Interaktif**:
   - Tamu dapat mengisi konfirmasi kehadiran (Hadir / Tidak Hadir / Ragu) beserta ucapan doa.
   - Doa langsung muncul di daftar ucapan dan tersimpan di `localStorage` peramban.

6. **Amplop Digital / Tanda Kasih**:
   - Kartu rekening BCA & Mandiri dengan tombol salin nomor rekening instan beranimasi *toast*.

7. **Simpan ke Kalender**:
   - Unduh file `.ics` acara untuk ditambahkan langsung ke Google Calendar, Apple Calendar, atau Outlook.

---

## 📁 Struktur Berkas

```
contoh-undagan/
├── index.html       # Struktur utama undangan web
├── css/
│   └── style.css    # Gaya kustom, tekstur linen, animasi piringan hitam, toast
├── js/
│   └── app.js       # Engine YouTube Player API, Countdown, RSVP, Copy to clipboard
└── README.md        # Panduan penggunaan & kustomisasi
```

---

## 🚀 Cara Menjalankan

Cukup klik dua kali (double-click) file **`index.html`** untuk membukanya di browser apa saja (Google Chrome, Microsoft Edge, Safari, Firefox).

Atau jalankan server lokal sederhana dengan terminal PowerShell:
```powershell
# Menggunakan Python
python -m http.server 8000

# Atau menggunakan npx serve
npx serve .
```
Lalu buka di browser: `http://localhost:8000?to=Budi+Santoso`

---

## 🛠️ Cara Kustomisasi

### 1. Mengganti Lagu YouTube
Buka file `js/app.js`, ubah baris konfigurasi berikut:
```javascript
const CONFIG = {
  // Ganti ID video YouTube di sini (karakter setelah ?v=)
  youtubeId: 'DIFlwV7WQx8',
  songTitle: 'Lamentation - Ginger Tunes',
  ...
};
```

### 2. Mengganti Tanggal Acara & Countdown
Buka file `js/app.js`:
```javascript
targetDate: new Date('2026-11-14T09:00:00+07:00').getTime(),
```

### 3. Mengganti Nama Mempelai, Teks, & Foto
Buka `index.html`:
- Cari nama **Arga Pradipta** dan **Nadia Larasati** lalu ganti dengan nama pasangan yang diinginkan.
- Ganti tautan foto pada tag `<img>` dengan foto prewedding Anda.
- Ganti nomor rekening BCA & Mandiri di bagian *Amplop Digital*.
- Ganti alamat Google Maps di bagian *Section Lokasi*.
