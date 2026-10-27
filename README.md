# 🪙 Economic Quest: The Wealth Journey
*Jelajahi Dunia Ekonomi, Kuasai Materi, dan Taklukkan Setiap Tantangan!*

Media pembelajaran interaktif Ekonomi (Bab 1: Kebutuhan, Kelangkaan, Barang Pemuas, Prinsip Ekonomi).
Murni HTML + CSS + JavaScript (tanpa build, tanpa dependensi). Audio dibuat dengan Web Audio API, karakter & dunia digambar dengan Canvas.

## Deploy ke GitHub Pages
1. Buat repository baru, lalu upload **semua isi folder ini** (index.html harus di root).
2. Settings → Pages → Source: *Deploy from a branch* → Branch: `main` / `(root)` → Save.
3. Buka `https://<username>.github.io/<nama-repo>/`.

Jalankan lokal: buka `index.html`, atau `python3 -m http.server` lalu buka http://localhost:8000.

## Struktur
| File | Fungsi |
|---|---|
| `index.html` | Semua layar (splash, dashboard, petunjuk, materi, game, evaluasi) |
| `css/style.css` | Tema, animasi, responsif |
| `js/data.js` | **Materi, bank soal (57 soal), daftar skin**: edit di sini untuk mengubah konten |
| `js/audio.js` | Backsound + SFX, mute/unmute |
| `js/character.js` | Gambar karakter & 3 skin |
| `js/game.js` | Engine platformer, kuis 15 detik, nyawa, poin |
| `js/app.js` | Navigasi, toko skin, evaluasi, penyimpanan (localStorage) |

## Menambah soal
Di `js/data.js` → `BANK`, tambahkan `{ s:'A', q:'Pertanyaan?', o:['Jawaban BENAR','Salah 1','Salah 2','Salah 3'] }`.
Jawaban benar **selalu ditulis pertama**; urutan A–D diacak otomatis. `s` = sub-bab (A/B/C/D).
