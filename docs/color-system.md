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

## Light mode alternatif: putih, oranye, dan merah

Light mode tidak perlu memakai lavender. Usulan ini memberi halaman dasar putih hangat, oranye sebagai aksen utama, dan merah sebagai aksen kedua. Oranye-merah neon menjadi cahaya dan sorotan visual; varian lebih gelap dipakai untuk teks, tautan, tombol, dan status supaya tetap terbaca di atas putih.

| Peran | Warna usulan | Penggunaan |
| --- | --- | --- |
| Latar halaman | `#FFFCFA` | Putih hangat untuk kanvas utama |
| Latar hero / permukaan sekunder | `#FFF2EC` | Bidang lembut berona oranye |
| Permukaan kartu dan navigasi | `#FFFFFF` | Kartu, navigasi, dan panel |
| Teks utama | `#211815` | Judul dan isi utama |
| Teks sekunder | `#514643` | Isi sekunder dan label |
| Teks muted | `#675953` | Keterangan kecil yang tetap perlu dibaca |
| Garis tepi | `#E9DCD6` | Pembatas kartu dan kontrol |
| Oranye UI | `#B63F10` | Tautan, tombol utama, dan focus ring |
| Hover oranye | `#93300B` | Hover tombol oranye dengan teks putih |
| Merah UI | `#8F1725` | Status aktif atau aksen kedua |
| Latar pilihan oranye | `#FFE4D6` dengan teks `#6F2410` | Chip atau bidang pilihan |
| Latar pilihan merah | `#FFE2E3` dengan teks `#8F1725` | Status atau pilihan merah |
| Oranye neon | `#FF4D00` | Bloom, garis emisi, dan sorotan dekoratif |
| Merah neon | `#FF2843` | Bloom, garis emisi, dan sorotan dekoratif |
| Error | `#8F1725` pada `#FFE2E3` | Pesan error; gunakan teks yang lebih gelap |

`#FF4D00` dan `#FF2843` tidak memenuhi rasio 4.5:1 untuk teks normal di atas putih. Pakai keduanya sebagai cahaya atau grafis; untuk teks kecil gunakan oranye `#B63F10` atau merah `#8F1725`. Pasangan UI yang diusulkan memenuhi AA untuk teks normal.

Untuk model 3D pada light mode, oranye dan merah neon dapat menggantikan material lavender-teal pada visualnya. Jika sorotan kurang jelas di atas halaman putih, tempatkan model di panggung inset warna gelap; jaga UI di sekelilingnya tetap memakai teks dan kontrol gelap di atas permukaan terang.

### Token HSL untuk variabel tema aplikasi

Variabel dasar aplikasi sekarang menggunakan triplet HSL. Nilai di bawah cocok dengan warna light yang tercantum di atas dan dapat dipakai ketika tema light diimplementasikan.

```css
:root[data-theme="light"] {
  --background: 24 100% 99%;          /* #FFFCFA */
  --background-elevated: 0 0% 100%;   /* #FFFFFF */
  --foreground: 15 22.22% 10.59%;     /* #211815 */
  --muted-foreground: 18 10.75% 36.47%; /* #675953 */
  --primary: 16.99 83.84% 38.82%;     /* #B63F10 */
  --primary-foreground: 0 0% 100%;    /* #FFFFFF */
  --secondary: 18.95 100% 96.27%;     /* #FFF2EC */
  --muted: 18.95 100% 96.27%;         /* #FFF2EC */
  --accent: 353 72.29% 32.55%;        /* #8F1725 */
  --border: 18.95 30.16% 87.65%;       /* #E9DCD6 */
  --input: 18.95 30.16% 87.65%;        /* #E9DCD6 */
  --destructive: 353 72.29% 32.55%;   /* #8F1725 */
}
```

## Kontras teks

Rasio berikut dihitung untuk pasangan teks dan latar yang tercatat di dokumen. Teks UI oranye dan merah yang gelap memenuhi rasio WCAG AA 4.5:1 di atas permukaan terang. Neon dipisahkan karena fungsinya dekoratif.

| Teks | Latar | Rasio |
| --- | --- | ---: |
| `#FFFFFF` | `#002B42` dark saat ini | 14.74:1 |
| `#57EAD9` | `#002B42` dark saat ini | 9.95:1 |
| `#211815` | `#FFFCFA` light usulan | 17.04:1 |
| `#514643` | `#FFFCFA` light usulan | 8.91:1 |
| `#675953` | `#FFFCFA` light usulan | 6.57:1 |
| `#B63F10` | `#FFFCFA` light usulan | 5.55:1 |
| `#8F1725` | `#FFFCFA` light usulan | 8.85:1 |
| `#FFFFFF` | `#B63F10` tombol oranye | 5.66:1 |
| `#FFFFFF` | `#93300B` hover tombol oranye | 7.87:1 |
| `#FFFFFF` | `#8F1725` tombol merah | 9.06:1 |
| `#FF4D00` | `#FFFFFF` neon oranye dekoratif | 3.33:1 |
| `#FF2843` | `#FFFFFF` neon merah dekoratif | 3.73:1 |

Rasio pada tabel berlaku untuk warna solid yang disebutkan. Saat dipakai di atas foto, gradien, transparansi, atau efek blur, kontras perlu diperiksa lagi pada komposisi akhirnya.

## Aturan penggunaan ulang

- Dark mode tetap memakai navy sebagai dasar dengan lavender dan teal seperti palet saat ini.
- Light mode memakai putih hangat, oranye UI `#B63F10`, dan merah UI `#8F1725`; palet ini tidak membutuhkan lavender.
- Simpan oranye `#FF4D00` dan merah `#FF2843` untuk cahaya, bloom, dan grafis. Jangan gunakan neon tersebut untuk teks kecil di atas putih.
- Gunakan bidang oranye atau merah pastel untuk status pilihan, lalu pasangkan dengan teks gelap dari tabel.
- Border dark memakai putih transparan; border light memakai abu hangat solid `#E9DCD6`.
- Jangan memakai nilai teks muted pada bidang berwarna jika rasio kontrasnya belum diperiksa.
