# Sistem warna portfolio

Dokumen ini mencatat palet yang sekarang dipakai dan pasangan palet light mode yang diusulkan. Palet dark di bawah diidentifikasi dari `src/styles/index.css` dan warna pada komponen 3D. Palet light adalah arahan desain; belum diterapkan ke aplikasi.

## Identitas visual

Portfolio memakai dasar navy yang dalam dengan aksen lavender, teal, dan cyan. Lavender memberi identitas kreatif, teal menandai hardware dan status interaktif, sedangkan cyan dan biru memberi nuansa sistem digital. Warna emas dipakai sebagai aksen kecil pada detail teknis dan pencapaian.

## Palet dark saat ini

| Peran | Warna | Sumber dan pemakaian |
| --- | --- | --- |
| Latar halaman | `#002B42` | `--background: 201 100% 13%` pada `:root` |
| Latar permukaan tinggi | `#0E3143` | `--background-elevated: 201 65% 16%` |
| Latar hero dan panggung 3D | `#080D1B` | Hero cosmic; mempertahankan cahaya model 3D agar terlihat jelas |
| Navigasi gelap | `#0B1121` | Navigasi dan menu |
| Panel interaktif | `#111D30` | Inspector keyboard dan panel modul board |
| Teks utama | `#FFFFFF` | Judul dan teks berprioritas tinggi |
| Teks sekunder | `#9AA8BE` – `#B4C2D5` | Deskripsi dan penjelasan di atas latar gelap |
| Teks label | `#7E8CA6` – `#8795AE` | Label teknis dan keterangan berprioritas rendah |
| Lavender | `#A58BFF`, `#B7A2FF` | Aksen hero, fokus visual, dan detail pilihan |
| Mint / teal | `#79D7C5`, `#57EAD9` | Status aktif dan aksen hardware; `#57EAD9` berasal dari `--accent` |
| Cyan terang | `#53DFD3`, `#65E8CA` | Emisi partikel dan sorotan model 3D |
| Biru informasi | `#6DB9F4`, `#83B9F2` | Aksen data dan komponen digital |
| Emas hangat | `#F5BC76` | Aksen komponen dan detail pencapaian |
| Garis tepi | Putih transparan, umumnya 7–15% | Contoh yang sering dipakai: `#FFFFFF12` hingga `#FFFFFF26` |

Warna aksen sengaja lebih terang dari teks biasa karena banyak dipakai sebagai emisi, garis, dan sorotan di atas panggung navy. Nilai latar dan teks pada `:root` masih berupa token HSL; warna lain tersebar sebagai nilai hex dalam CSS dan komponen.

## Pasangan light mode yang diusulkan

Light mode sebaiknya terasa sebagai tema pasangan, bukan inversi warna mentah. Gunakan permukaan netral yang sejuk, pertahankan lavender dan teal sebagai identitas, lalu gelapkan kedua aksen untuk teks, tautan, dan tombol.

| Peran | Warna usulan | Penggunaan |
| --- | --- | --- |
| Latar halaman | `#F5F7FB` | Kanvas utama yang sejuk |
| Latar hero | `#F1F2FA` | Nuansa lavender yang sangat lembut untuk hero |
| Permukaan kartu | `#FFFFFF` | Kartu, navigasi, dan panel |
| Permukaan sekunder | `#EFF3F8` | Bidang inset, kontrol, dan baris terpilih |
| Teks utama | `#172033` | Judul dan isi utama |
| Teks sekunder | `#475569` | Isi sekunder dan label penting |
| Teks muted | `#5F6B7A` | Keterangan kecil yang tetap perlu dibaca |
| Garis tepi | `#D7DFEA` | Pembatas kartu dan kontrol |
| Lavender interaktif | `#6842C2` | Tautan, tombol utama, dan focus ring |
| Hover lavender | `#5636A5` | Hover tombol lavender dengan teks putih |
| Latar lavender pilihan | `#EAE4FF` | Chip atau bidang pilihan; pasangkan dengan teks `#4F309A` |
| Teal interaktif | `#0F766E` | Status aktif, pilihan hardware, dan tombol sekunder |
| Hover teal | `#0B5F58` | Hover teal dengan teks putih |
| Latar mint pilihan | `#DDF7F2` | Chip atau bidang pilihan; pasangkan dengan teks `#0D635B` |
| Biru informasi | `#1769AA` | Tautan informasi atau data dengan teks putih |
| Emas status | `#8A5A12` pada `#FFF3D2` | Pencapaian atau perhatian yang jarang muncul |
| Merah error | `#B42318` pada `#FEE4E2` | Pesan error dan aksi destruktif |

Untuk tampilan light, panggung WebGL boleh tetap memakai bidang navy `#080D1B` sebagai inset khusus. Warna neon pada material model (`#A58BFF`, `#53DFD3`, dan `#65E8CA`) sebaiknya tetap dipertahankan; gunakan warna teal dan lavender yang lebih gelap untuk teks antarmuka di luar panggung.

### Token HSL untuk variabel tema aplikasi

Variabel dasar aplikasi sekarang menggunakan triplet HSL. Nilai di bawah cocok dengan warna light yang tercantum di atas dan dapat dipakai ketika tema light diimplementasikan.

```css
:root[data-theme="light"] {
  --background: 220 43% 97%;          /* #F5F7FB */
  --background-elevated: 0 0% 100%;   /* #FFFFFF */
  --foreground: 221 38% 15%;          /* #172033 */
  --muted-foreground: 213 12% 43%;    /* #5F6B7A */
  --primary: 258 51% 51%;             /* #6842C2 */
  --primary-foreground: 0 0% 100%;    /* #FFFFFF */
  --secondary: 213 39% 95%;           /* #EFF3F8 */
  --muted: 213 39% 95%;               /* #EFF3F8 */
  --accent: 175 77% 26%;              /* #0F766E */
  --border: 215 31% 88%;              /* #D7DFEA */
  --input: 215 31% 88%;               /* #D7DFEA */
  --destructive: 4 76% 40%;           /* #B42318 */
}
```

## Kontras teks

Rasio berikut dihitung untuk pasangan teks dan latar yang tercatat di dokumen. Pasangan teks utama, sekunder, muted, serta dua aksen light memenuhi rasio WCAG AA 4.5:1 untuk teks normal.

| Teks | Latar | Rasio |
| --- | --- | ---: |
| `#FFFFFF` | `#002B42` dark saat ini | 14.74:1 |
| `#57EAD9` | `#002B42` dark saat ini | 9.95:1 |
| `#172033` | `#F5F7FB` light usulan | 15.17:1 |
| `#475569` | `#F5F7FB` light usulan | 7.07:1 |
| `#5F6B7A` | `#F5F7FB` light usulan | 5.06:1 |
| `#6842C2` | `#F5F7FB` light usulan | 6.22:1 |
| `#0F766E` | `#F5F7FB` light usulan | 5.10:1 |
| `#FFFFFF` | `#6842C2` tombol lavender | 6.67:1 |
| `#FFFFFF` | `#0F766E` tombol teal | 5.47:1 |

Rasio pada tabel berlaku untuk warna solid yang disebutkan. Saat dipakai di atas foto, gradien, transparansi, atau efek blur, kontras perlu diperiksa lagi pada komposisi akhirnya.

## Aturan penggunaan ulang

- Pakai navy sebagai dasar dark mode, dengan lavender sebagai aksen utama dan teal sebagai aksen engineering/interaksi.
- Di light mode, pakai lavender `#6842C2` dan teal `#0F766E` untuk teks dan kontrol. Simpan lavender neon dan cyan terang untuk material 3D, cahaya, dan dekorasi.
- Gunakan latar pastel lavender atau mint untuk keadaan terpilih; pasangkan dengan teks gelap dari tabel.
- Gunakan biru untuk informasi, emas untuk pencapaian, dan merah hanya untuk error atau aksi destruktif.
- Border dark memakai putih transparan; border light memakai abu-biru solid `#D7DFEA`.
- Jangan memakai nilai teks muted pada bidang berwarna jika rasio kontrasnya belum diperiksa.
