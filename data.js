/* ============================================================
   DATA: Materi, Bank Soal, Skin
   Semua konten ada di sini supaya mudah diedit/dikembangkan.
   ============================================================ */

const SUBS = {
  A: { id: 'A', short: 'Kebutuhan Manusia', title: 'Kebutuhan Manusia', icon: '🧺', color: '#ef476f' },
  B: { id: 'B', short: 'Kelangkaan & Sumber Daya', title: 'Kelangkaan & Sumber Daya Ekonomi', icon: '⛏️', color: '#ff8c1a' },
  C: { id: 'C', short: 'Barang Pemuas Kebutuhan', title: 'Barang Pemuas Kebutuhan', icon: '📦', color: '#1b9aaa' },
  D: { id: 'D', short: 'Prinsip & Perilaku Ekonomi', title: 'Prinsip & Perilaku Ekonomi', icon: '⚖️', color: '#7b5cff' },
};

const SKINS = [
  { id: 'basic', name: 'Student Uniform', price: 0, desc: 'Seragam pelajar standar. Gratis untuk semua petualang.' },
  { id: 'exec',  name: 'Executive Wear', price: 50, desc: 'Jas rapi + koper bisnis. Tampil seperti calon CEO.' },
  { id: 'hero',  name: 'Golden Economy Armor', price: 150, desc: 'Zirah emas legendaris dengan jubah, aura, dan percikan cahaya.' },
];

const MATERI = [
  /* ------------------------------ P: Pengantar & Peta Konsep ------------------------------ */
  {
    id: 'P',
    meta: { short: 'Pengantar & Peta Konsep', title: 'Pengantar & Peta Konsep Bab 1', icon: '🧭', color: '#10324a' },
    intro: 'Bab 1: Kebutuhan Manusia dan Kelangkaan Sumber Daya. Mulai dari sini agar kamu punya gambaran besarnya.',
    sections: [
      {
        h: 'Kata Pengantar dari Dosen',
        html: `
<div class="quote">"Halo, para calon ekonom muda! Ekonomi itu bukan sekadar soal uang, tetapi seni <b>memilih dengan cerdas</b> ketika apa yang kita inginkan lebih banyak daripada yang tersedia. Pahami alur logika Bab 1 ini, dan kamu akan melihat setiap keputusan sehari-hari dengan kacamata baru. Semangat!" 🎓</div>`
      },
      {
        h: 'Peta Konsep / Alur Logika Bab 1',
        html: `
<div class="flow vertical">
  <div class="step"><b>1️⃣ Kebutuhan Manusia</b><span>Tidak terbatas, terus muncul &amp; beragam (dipengaruhi usia, pendidikan, teknologi, pendapatan, jumlah penduduk, iklan)</span></div>
  <div class="arrow down">⬇</div>
  <div class="step"><b>2️⃣ Alat Pemuas Kebutuhan</b><span>Barang &amp; jasa yang memiliki kegunaan (utility), dengan berbagai klasifikasi</span></div>
  <div class="arrow down">⬇ <small>tetapi jumlahnya…</small></div>
  <div class="step c-red"><b>3️⃣ Kelangkaan (Scarcity)</b><span>Alat pemuas &amp; sumber daya <u>terbatas</u>: geografis, penduduk, produksi, teknologi, bencana</span></div>
  <div class="arrow down">⬇</div>
  <div class="step"><b>4️⃣ Sumber Daya Ekonomi</b><span>SDA · Sumber Daya Modal · Sumber Daya Manusia &amp; Kewirausahaan</span></div>
  <div class="arrow down">⬇</div>
  <div class="step c-green"><b>5️⃣ Pilihan &amp; Keputusan Rasional</b><span>Ilmu ekonomi = <i>the study of choice</i> → skala prioritas, biaya peluang, prinsip ekonomi</span></div>
</div>`
      }
    ],
    recap: ['Alur besar: Kebutuhan tak terbatas → alat pemuas terbatas → kelangkaan → harus memilih → bertindak rasional.', 'Baca sub-bab A sampai D secara berurutan, lalu tutup dengan Rumus & Catatan Dosen.']
  },

  /* ------------------------------ A ------------------------------ */
  {
    id: 'A',
    intro: 'Mengapa kita membeli makanan, sekolah, atau menonton film? Karena ada kebutuhan yang ingin dipenuhi.',
    sections: [
      {
        h: 'Kebutuhan vs Keinginan',
        html: `
<p><b>Kebutuhan</b> adalah segala sesuatu yang diperlukan manusia untuk <b>mempertahankan hidup</b> dan <b>mencapai kesejahteraan</b>. <b>Keinginan</b> adalah hasrat terhadap sesuatu yang belum tentu penting bagi kelangsungan hidup.</p>
<table class="cmp"><tr><th></th><th>Kebutuhan</th><th>Keinginan</th></tr>
<tr><td><b>Sifat</b></td><td>Mendesak, penting untuk hidup</td><td>Belum tentu penting, bisa ditunda</td></tr>
<tr><td><b>Pemenuhan</b></td><td>Wajib dipenuhi</td><td>Dipenuhi bila ada kelebihan sumber daya</td></tr>
<tr><td><b>Contoh</b></td><td>Makan, minum, tempat tinggal</td><td>Gawai edisi terbaru, sepatu bermerek</td></tr></table>
<div class="callout"><b>💡 Kunci:</b> Keinginan yang didukung daya beli dan terus diulang bisa berubah menjadi kebutuhan.</div>`
      },
      {
        h: 'Ketidakterbatasan Kebutuhan & Faktor Penyebabnya',
        html: `
<p>Kebutuhan manusia bersifat <b>tidak terbatas</b>: satu kebutuhan terpenuhi, kebutuhan baru muncul, dan jenisnya makin beragam. Faktor yang memengaruhinya:</p>
<div class="grid3">
  <div class="mini"><span class="ico">🎂</span><h4>Usia</h4><p>Bayi butuh susu &amp; popok, pelajar butuh buku, lansia butuh obat dan layanan kesehatan.</p></div>
  <div class="mini"><span class="ico">🎓</span><h4>Pendidikan</h4><p>Makin tinggi pendidikan, kebutuhan akan buku, informasi, dan hal bermutu makin beragam.</p></div>
  <div class="mini"><span class="ico">📱</span><h4>Teknologi</h4><p>Kemajuan teknologi memunculkan kebutuhan baru: ponsel, internet, dompet digital.</p></div>
  <div class="mini"><span class="ico">💰</span><h4>Pendapatan</h4><p>Pendapatan naik → daya beli naik → kebutuhan makin banyak dan bervariasi.</p></div>
  <div class="mini"><span class="ico">👥</span><h4>Jumlah Penduduk</h4><p>Penduduk bertambah → kebutuhan masyarakat (pangan, rumah, sekolah) ikut meningkat.</p></div>
  <div class="mini"><span class="ico">📣</span><h4>Promosi / Iklan</h4><p>Iklan menarik dapat memunculkan keinginan membeli barang yang semula tak terpikir.</p></div>
</div>`
      },
      {
        h: 'Klasifikasi Kebutuhan',
        html: `
<h4 class="sub">1️⃣ Menurut Intensitas Kegunaan</h4>
<div class="grid3">
  <div class="mini c-red"><h4>Primer</h4><p>Kebutuhan pokok, wajib dipenuhi lebih dulu. <i>Sandang, pangan, papan.</i></p></div>
  <div class="mini c-orange"><h4>Sekunder</h4><p>Dipenuhi setelah primer, membuat hidup lebih nyaman. <i>Sepeda, kulkas, buku bacaan.</i></p></div>
  <div class="mini c-purple"><h4>Tersier</h4><p>Kebutuhan mewah, bukan pokok. <i>Mobil mewah, perhiasan, jam tangan koleksi.</i></p></div>
</div>
<h4 class="sub">2️⃣ Menurut Bentuk &amp; Sifat</h4>
<div class="grid2">
  <div class="mini"><h4>Jasmani</h4><p>Berkaitan dengan fisik: makan, minum, pakaian, tempat tinggal, olahraga.</p></div>
  <div class="mini"><h4>Rohani</h4><p>Berkaitan dengan batin: ibadah, hiburan, pendidikan, rasa aman, rekreasi.</p></div>
</div>
<h4 class="sub">3️⃣ Menurut Waktu Pemenuhan</h4>
<div class="grid2">
  <div class="mini"><h4>Sekarang</h4><p>Harus dipenuhi saat ini juga. <i>Makan saat lapar.</i></p></div>
  <div class="mini"><h4>Masa Depan</h4><p>Dipersiapkan untuk nanti. <i>Menabung, asuransi, dana pendidikan.</i></p></div>
  <div class="mini"><h4>Tidak Terduga</h4><p>Muncul tiba-tiba. <i>Biaya berobat akibat kecelakaan, perbaikan akibat bencana.</i></p></div>
  <div class="mini"><h4>Sepanjang Waktu</h4><p>Dibutuhkan terus-menerus selama hidup. <i>Makan, minum, tidur.</i></p></div>
</div>
<h4 class="sub">4️⃣ Menurut Subjek</h4>
<div class="grid2">
  <div class="mini"><h4>Individu</h4><p>Kebutuhan perseorangan. <i>Seragam pribadi, obat untuk diri sendiri.</i></p></div>
  <div class="mini"><h4>Kelompok (Kolektif)</h4><p>Kebutuhan bersama masyarakat. <i>Jalan raya, jembatan, taman kota, penerangan jalan.</i></p></div>
</div>`
      }
    ],
    recap: ['Kebutuhan = wajib dipenuhi; keinginan = bisa ditunda.', 'Kebutuhan tak terbatas; 6 faktor: usia, pendidikan, teknologi, pendapatan, jumlah penduduk, promosi/iklan.', 'Klasifikasi: intensitas, bentuk/sifat, waktu, subjek.']
  },

  /* ------------------------------ B ------------------------------ */
  {
    id: 'B',
    intro: 'Kebutuhan tak terbatas, sedangkan sumber dayanya terbatas. Dari sinilah masalah ekonomi lahir.',
    sections: [
      {
        h: 'Kelangkaan (Scarcity): Pengertian & Penyebab',
        html: `
<p><b>Kelangkaan</b> adalah kondisi ketika jumlah alat pemuas kebutuhan (barang, jasa, sumber daya) <b>terbatas</b>, sedangkan kebutuhan manusia <b>tidak terbatas</b>. Akibatnya manusia harus <b>memilih</b>.</p>
<h4 class="sub">Penyebab Kelangkaan</h4>
<div class="grid3">
  <div class="mini"><span class="ico">🗺️</span><h4>Perbedaan Letak Geografis</h4><p>Sumber daya tersebar tidak merata. Minyak bumi hanya ada di wilayah tertentu.</p></div>
  <div class="mini"><span class="ico">📈</span><h4>Pertumbuhan Penduduk</h4><p>Penduduk bertambah cepat, sementara lahan dan hasil produksi terbatas.</p></div>
  <div class="mini"><span class="ico">🏭</span><h4>Kemampuan Produksi</h4><p>Keterbatasan tenaga ahli, modal, dan mesin membuat produksi tak mengimbangi kebutuhan.</p></div>
  <div class="mini"><span class="ico">🔧</span><h4>Ketimpangan Teknologi</h4><p>Teknologi yang tidak merata/belum memadai menyulitkan pengolahan sumber daya.</p></div>
  <div class="mini"><span class="ico">🌋</span><h4>Bencana Alam</h4><p>Banjir, gempa, dan kekeringan merusak lahan, hasil panen, dan sarana produksi.</p></div>
</div>`
      },
      {
        h: 'Sumber Daya Alam (SDA)',
        html: `
<div class="grid2">
  <div class="mini c-green"><h4>🌱 Terbarukan</h4><p>Dapat diperbarui/dibudidayakan bila dikelola lestari. <i>Hutan, ikan, air, tanaman pangan.</i></p></div>
  <div class="mini c-red"><h4>⛏️ Tidak Terbarukan</h4><p>Tidak dapat diperbarui, atau butuh waktu jutaan tahun. <i>Minyak bumi, batu bara, gas alam, emas, nikel.</i></p></div>
</div>
<div class="callout">Sumber daya terbarukan pun bisa habis jika dieksploitasi berlebihan, misalnya penebangan hutan tanpa reboisasi.</div>`
      },
      {
        h: 'Sumber Daya Modal',
        html: `
<p><b>Sumber daya modal</b> adalah barang buatan manusia (atau uang) yang dipakai untuk menghasilkan barang/jasa lain. Penggolongannya:</p>
<table class="cmp"><tr><th>Dasar</th><th>Jenis</th><th>Contoh</th></tr>
<tr><td><b>Wujud</b></td><td>Modal Konkret · Modal Abstrak</td><td>Mesin, gedung · Hak paten, merek, nama baik</td></tr>
<tr><td><b>Bentuk</b></td><td>Modal Barang · Modal Uang</td><td>Peralatan, kendaraan · Dana tunai untuk usaha</td></tr>
<tr><td><b>Sumber</b></td><td>Modal Sendiri · Modal Asing</td><td>Tabungan pemilik · Pinjaman bank</td></tr>
<tr><td><b>Sifat</b></td><td>Modal Tetap · Modal Lancar</td><td>Mesin (dipakai berulang) · Bahan baku (habis sekali proses)</td></tr>
<tr><td><b>Subjek</b></td><td>Modal Perorangan · Modal Masyarakat</td><td>Toko milik pribadi · Jalan, jembatan, pelabuhan</td></tr></table>`
      },
      {
        h: 'Sumber Daya Manusia (Tenaga Kerja) & Kewirausahaan',
        html: `
<h4 class="sub">Berdasarkan Sifat Pekerjaan</h4>
<div class="grid2">
  <div class="mini"><h4>Tenaga Kerja Jasmani</h4><p>Mengandalkan kekuatan fisik. <i>Petani, kuli angkut, buruh pabrik.</i></p></div>
  <div class="mini"><h4>Tenaga Kerja Rohani</h4><p>Mengandalkan pikiran/mental. <i>Guru, dokter, programmer.</i></p></div>
</div>
<h4 class="sub">Berdasarkan Kualitas (Pendidikan &amp; Keahlian)</h4>
<div class="grid3">
  <div class="mini c-green"><h4>Terdidik</h4><p>Keahlian dari pendidikan formal tinggi. <i>Dokter, insinyur, akuntan.</i></p></div>
  <div class="mini c-orange"><h4>Terlatih</h4><p>Keahlian dari pelatihan &amp; pengalaman. <i>Montir, sopir, tukang las.</i></p></div>
  <div class="mini c-red"><h4>Tidak Terdidik &amp; Tidak Terlatih</h4><p>Tanpa keahlian khusus. <i>Kuli panggul, buruh kasar.</i></p></div>
</div>
<h4 class="sub">🚀 Kewirausahaan</h4>
<p><b>Wirausahawan (entrepreneur)</b> adalah orang yang mampu <b>menggabungkan faktor-faktor produksi</b> (alam, tenaga kerja, modal), berani mengambil <b>risiko</b>, dan <b>inovatif</b> untuk menghasilkan barang/jasa yang bernilai.</p>`
      }
    ],
    recap: ['Kelangkaan = alat pemuas terbatas vs kebutuhan tak terbatas.', '5 penyebab: geografis, pertumbuhan penduduk, kemampuan produksi, ketimpangan teknologi, bencana alam.', 'SDA: terbarukan / tidak terbarukan. Modal: wujud, bentuk, sumber, sifat, subjek.', 'SDM: jasmani/rohani dan terdidik/terlatih/tidak terdidik-terlatih; wirausaha mengelola semuanya.']
  },

  /* ------------------------------ C ------------------------------ */
  {
    id: 'C',
    intro: 'Segala sesuatu yang dipakai untuk memenuhi kebutuhan disebut alat pemuas: barang dan jasa.',
    sections: [
      {
        h: 'Kegunaan Barang (Utility)',
        html: `
<p><b>Utility</b> adalah kemampuan barang/jasa untuk memenuhi kebutuhan. Nilai guna dapat ditambah lewat proses ekonomi:</p>
<div class="grid3">
  <div class="mini"><h4>🛠️ Form Utility</h4><p>Kegunaan <b>bentuk</b>: diolah jadi bentuk baru. <i>Kayu → meja, kapas → kain.</i></p></div>
  <div class="mini"><h4>📍 Place Utility</h4><p>Kegunaan <b>tempat</b>: dipindahkan ke lokasi yang lebih berguna. <i>Pasir dari sungai ke lokasi bangunan.</i></p></div>
  <div class="mini"><h4>🤝 Ownership Utility</h4><p>Kegunaan <b>kepemilikan</b>: berguna penuh setelah dimiliki orang yang membutuhkan. <i>Buku di toko → milik pelajar.</i></p></div>
  <div class="mini"><h4>⏰ Time Utility</h4><p>Kegunaan <b>waktu</b>: bernilai pada saat dibutuhkan. <i>Payung saat hujan.</i></p></div>
  <div class="mini"><h4>🧑‍⚕️ Service Utility</h4><p>Kegunaan <b>pelayanan</b>: bertambah lewat jasa. <i>Dokter, tukang cukur, kurir.</i></p></div>
  <div class="mini"><h4>🌾 Elementary Utility</h4><p>Kegunaan <b>asli/dasar</b>: fungsi pokok yang melekat pada barang. <i>Beras untuk dimakan, cangkul untuk mencangkul.</i></p></div>
</div>`
      },
      {
        h: 'Klasifikasi: Cara Memperoleh',
        html: `
<div class="grid3">
  <div class="mini c-orange"><h4>Barang Ekonomi</h4><p>Perlu <b>pengorbanan</b> (uang, tenaga, waktu), jumlahnya terbatas. <i>Pakaian, makanan, buku.</i></p></div>
  <div class="mini c-green"><h4>Barang Bebas</h4><p>Tersedia melimpah di alam, <b>tanpa pengorbanan</b>. <i>Udara, sinar matahari.</i></p></div>
  <div class="mini c-red"><h4>Barang Illith</h4><p>Keberadaannya justru <b>merugikan</b>/tidak diinginkan. <i>Sampah, limbah beracun, narkoba, minuman keras.</i></p></div>
</div>`
      },
      {
        h: 'Klasifikasi: Cara Penggunaan & Hubungan Antarbarang',
        html: `
<h4 class="sub">Cara Penggunaan</h4>
<div class="grid2">
  <div class="mini"><h4>Barang Konsumsi</h4><p>Langsung dipakai/dinikmati. <i>Nasi, baju, sepatu.</i></p></div>
  <div class="mini"><h4>Barang Produksi</h4><p>Dipakai untuk menghasilkan barang lain. <i>Mesin jahit, tepung untuk pabrik roti.</i></p></div>
</div>
<div class="callout">Barang yang sama bisa berbeda golongan: tepung di dapur rumah = konsumsi, di pabrik roti = produksi.</div>
<h4 class="sub">Hubungan dengan Barang Lain</h4>
<div class="grid2">
  <div class="mini"><h4>Barang Substitusi (Pengganti)</h4><p>Saling menggantikan. <i>Beras ↔ jagung, teh ↔ kopi.</i> Harga satu naik → permintaan penggantinya cenderung naik.</p></div>
  <div class="mini"><h4>Barang Komplementer (Pelengkap)</h4><p>Dipakai bersama agar berguna. <i>Mobil &amp; bensin, sepatu &amp; kaus kaki.</i></p></div>
</div>`
      },
      {
        h: 'Klasifikasi: Proses Pembuatan',
        html: `
<div class="flow">
  <div class="step"><b>Bahan Mentah</b><span>Belum diolah. <i>Kapas, biji kakao, kayu gelondongan.</i></span></div>
  <div class="arrow">➜</div>
  <div class="step"><b>Barang Setengah Jadi</b><span>Sudah diolah, masih perlu diolah lagi. <i>Benang, tepung, papan kayu.</i></span></div>
  <div class="arrow">➜</div>
  <div class="step"><b>Barang Jadi</b><span>Siap dipakai konsumen. <i>Kemeja, roti, lemari.</i></span></div>
</div>`
      }
    ],
    recap: ['6 utility: form, place, ownership, time, service, elementary.', 'Cara memperoleh: ekonomi, bebas, illith. Penggunaan: konsumsi vs produksi.', 'Hubungan: substitusi vs komplementer. Proses: mentah → setengah jadi → jadi.']
  },

  /* ------------------------------ D ------------------------------ */
  {
    id: 'D',
    intro: 'Karena sumber daya terbatas, setiap orang harus cerdas memilih. Inilah inti ilmu ekonomi.',
    sections: [
      {
        h: 'Peran Ilmu Ekonomi: The Study of Choice',
        html: `
<p>Inti masalah ekonomi adalah <b>pilihan</b>. Ilmu ekonomi mempelajari bagaimana individu dan masyarakat <b>memilih</b> cara menggunakan sumber daya yang langka untuk memenuhi kebutuhan yang tak terbatas.</p>
<div class="grid3">
  <div class="mini"><h4>📋 Skala Prioritas</h4><p>Urutan kebutuhan dari yang paling penting/mendesak sampai yang bisa ditunda.</p></div>
  <div class="mini"><h4>🪙 Biaya Peluang</h4><p>Nilai pilihan terbaik yang <b>dikorbankan</b> saat kita memilih sesuatu (<i>opportunity cost</i>).</p></div>
  <div class="mini"><h4>🔀 Pilihan Dasar</h4><p>Produksi apa? Bagaimana memproduksinya? Untuk siapa hasilnya?</p></div>
</div>
<div class="callout">Contoh: Rani memilih membeli buku dan melepaskan kesempatan menonton konser. Konser = biaya peluangnya.</div>`
      },
      {
        h: 'Prinsip Ekonomi',
        html: `
<p><b>Prinsip ekonomi</b>: <u>dengan pengorbanan sekecil-kecilnya, memperoleh hasil/keuntungan sebesar-besarnya</u>. Diwujudkan lewat tindakan yang <b>cermat</b>, <b>hemat</b>, dan <b>efisien</b>.</p>
<div class="grid3">
  <div class="mini"><h4>Cermat</h4><p>Teliti sebelum membeli: cek harga, kualitas, kegunaan.</p></div>
  <div class="mini"><h4>Hemat</h4><p>Tidak boros, misalnya mematikan lampu saat tak dipakai.</p></div>
  <div class="mini"><h4>Efisien</h4><p>Mencapai tujuan dengan tenaga, waktu, dan biaya paling sedikit.</p></div>
</div>`
      },
      {
        h: 'Perilaku Rasional vs Irasional',
        html: `
<table class="cmp"><tr><th>Rasional ✅</th><th>Irasional ❌</th></tr>
<tr><td>Menimbang kebutuhan, manfaat, dan biaya</td><td>Membeli karena emosi/impulsif</td></tr>
<tr><td>Membandingkan harga &amp; kualitas</td><td>Ikut tren, gengsi, atau FOMO</td></tr>
<tr><td>Menyusun anggaran &amp; skala prioritas</td><td>Tergiur iklan dan diskon tanpa kebutuhan</td></tr>
<tr><td>Menabung dan menunda keinginan</td><td>Boros dan konsumtif</td></tr></table>
<div class="callout"><b>Rumus keputusan rasional:</b> ambil pilihan bila <b>manfaat yang diperoleh &gt; pengorbanan (biaya) yang dikeluarkan</b>.</div>`
      }
    ],
    recap: ['Ilmu ekonomi = ilmu tentang pilihan (the study of choice).', 'Skala prioritas &amp; biaya peluang membantu memilih.', 'Prinsip ekonomi: pengorbanan minimal, hasil maksimal. Rasional ≠ ikut-ikutan.']
  },

  /* ------------------------------ Z: Rumus & Catatan Dosen ------------------------------ */
  {
    id: 'Z',
    meta: { short: 'Rumus & Catatan Dosen', title: 'Rangkuman Rumus & Catatan Dosen', icon: '🎓', color: '#e0a800' },
    intro: 'Bagian penutup yang paling pas dibaca ulang sebelum ujian.',
    sections: [
      {
        h: 'Rangkuman Formula / Axiom Utama',
        html: `
<div class="formula">Kebutuhan <b>Tak Terbatas</b> + Sumber Daya <b>Terbatas</b> = <b>Kelangkaan</b></div>
<div class="formula">Kelangkaan → <b>Pilihan</b> → Skala Prioritas + Biaya Peluang</div>
<div class="formula">Prinsip Ekonomi = <b>Hasil Maksimal</b> ÷ <b>Pengorbanan Minimal</b></div>
<div class="formula">Keputusan Rasional = <b>Manfaat</b> &gt; <b>Biaya</b></div>
<div class="formula">Nilai Guna Barang = Form + Place + Ownership + Time + Service (+ Elementary)</div>`
      },
      {
        h: 'Catatan Dosen: Takeaway Kunci',
        html: `
<ul class="dots">
  <li><b>Bedakan kebutuhan dan keinginan</b> sebelum mengeluarkan uang. Tanya: "Kalau tidak dibeli, apakah hidupku terganggu?"</li>
  <li><b>Buat skala prioritas</b> mingguan/bulanan: primer dulu, sekunder berikutnya, tersier terakhir.</li>
  <li><b>Hitung biaya peluang</b>: setiap pilihan berarti melepas pilihan lain, jadi pilih yang manfaatnya terbesar.</li>
  <li><b>Waspadai iklan dan tren</b>: tanyakan apakah barang itu benar-benar dibutuhkan atau hanya terbawa suasana.</li>
  <li><b>Hargai sumber daya</b>: hemat air, energi, dan makanan, karena kelangkaan itu nyata.</li>
  <li><b>Kembangkan diri</b> (pendidikan, keterampilan, jiwa wirausaha) karena SDM yang berkualitas adalah sumber daya paling berharga.</li>
</ul>
<div class="quote">"Rasional itu bukan pelit, tetapi <b>cerdas memilih</b>. Selamat belajar dan sukses di ujian!" 🌟</div>`
      }
    ],
    recap: ['Hafalkan 4 rumus utama di atas.', 'Praktikkan: kebutuhan dulu, keinginan kemudian, selalu hitung manfaat vs biaya.']
  }
];

/* ============================================================
   BANK SOAL. Jawaban benar SELALU ditulis pertama di array `o`;
   urutan opsi diacak otomatis saat game berjalan.
   ============================================================ */
const BANK = [
  /* ---- A: Kebutuhan Manusia ---- */
  { s:'A', q:'Kebutuhan manusia adalah …', o:['Segala sesuatu yang diperlukan untuk mempertahankan hidup dan mencapai kesejahteraan','Keinginan yang selalu bisa ditunda tanpa batas','Barang yang hanya dimiliki orang kaya','Uang yang disimpan untuk tabungan'] },
  { s:'A', q:'Dina ingin membeli ponsel baru setelah melihat iklan yang menarik. Faktor yang memengaruhi kebutuhan tersebut adalah …', o:['Promosi/iklan','Jumlah penduduk','Usia','Pendapatan'] },
  { s:'A', q:'Pelajar membutuhkan buku dan alat tulis, sedangkan lansia membutuhkan obat-obatan. Perbedaan ini dipengaruhi oleh …', o:['Usia','Teknologi','Promosi','Jumlah penduduk'] },
  { s:'A', q:'Ketika pendapatan seseorang meningkat, kebutuhannya cenderung …', o:['Meningkat dan makin beragam','Menurun drastis','Tetap sama persis','Hanya berupa kebutuhan primer'] },
  { s:'A', q:'Yang termasuk kebutuhan primer adalah …', o:['Makanan bergizi dan tempat tinggal','Mobil mewah','Liburan ke luar negeri','Perhiasan emas'] },
  { s:'A', q:'Sepeda motor untuk berangkat sekolah dan kulkas di rumah termasuk kebutuhan …', o:['Sekunder','Primer','Tersier','Tak terduga'] },
  { s:'A', q:'Membeli jam tangan mewah edisi terbatas termasuk kebutuhan …', o:['Tersier','Primer','Sekunder','Sepanjang waktu'] },
  { s:'A', q:'Beribadah, mendengarkan ceramah, dan berekreasi untuk ketenangan batin termasuk kebutuhan …', o:['Rohani','Jasmani','Primer','Tak terduga'] },
  { s:'A', q:'Menabung dan membeli asuransi pendidikan untuk anak adalah contoh kebutuhan menurut waktu, yaitu kebutuhan …', o:['Masa depan','Sekarang','Tak terduga','Sepanjang waktu'] },
  { s:'A', q:'Biaya berobat mendadak karena kecelakaan termasuk kebutuhan …', o:['Tak terduga','Masa depan','Sekarang','Sepanjang waktu'] },
  { s:'A', q:'Jalan raya, jembatan, dan taman kota yang dipakai bersama termasuk kebutuhan …', o:['Kelompok (kolektif)','Individu','Tersier','Jasmani'] },
  { s:'A', q:'Makan, minum, dan tidur dibutuhkan selama manusia hidup. Kebutuhan ini disebut kebutuhan …', o:['Sepanjang waktu','Masa depan','Tak terduga','Tersier'] },
  { s:'A', q:'Bertambahnya jumlah penduduk suatu daerah akan menyebabkan …', o:['Kebutuhan masyarakat secara keseluruhan meningkat','Kebutuhan masyarakat menurun','Semua barang menjadi gratis','Kebutuhan tidak berubah'] },

  /* ---- B: Kelangkaan & Sumber Daya ---- */
  { s:'B', q:'Kelangkaan adalah kondisi ketika …', o:['Sumber daya terbatas sedangkan kebutuhan manusia tidak terbatas','Barang melimpah sehingga tidak laku','Semua barang di pasar habis terjual','Harga barang sangat murah'] },
  { s:'B', q:'Minyak bumi hanya ada di wilayah tertentu dan tidak merata di semua negara. Ini contoh penyebab kelangkaan karena faktor …', o:['Geografis','Bencana alam','Teknologi','Pertumbuhan penduduk'] },
  { s:'B', q:'Gagal panen akibat banjir dan gempa membuat beras menjadi langka. Penyebab kelangkaannya adalah …', o:['Bencana alam','Faktor geografis','Kemajuan teknologi','Kelebihan produksi'] },
  { s:'B', q:'Jumlah penduduk meningkat pesat sementara lahan pertanian tetap. Penyebab kelangkaan ini adalah …', o:['Pertumbuhan penduduk','Bencana alam','Teknologi canggih','Faktor geografis'] },
  { s:'B', q:'Pabrik kekurangan tenaga ahli dan mesin sehingga hasil produksi sedikit. Faktor penyebab kelangkaannya adalah …', o:['Keterbatasan kemampuan produksi','Bencana alam','Pertumbuhan penduduk','Faktor geografis'] },
  { s:'B', q:'Tambang di kedalaman laut belum bisa digali karena alatnya belum ada. Ini menunjukkan kelangkaan akibat …', o:['Teknologi yang belum memadai','Bencana alam','Kelebihan penduduk','Perbedaan selera'] },
  { s:'B', q:'Contoh sumber daya alam terbarukan adalah …', o:['Hutan dan ikan yang dikelola lestari','Batu bara','Minyak bumi','Gas alam'] },
  { s:'B', q:'Batu bara, minyak bumi, dan gas alam termasuk …', o:['SDA tak terbarukan','SDA terbarukan','Sumber daya modal','Sumber daya manusia'] },
  { s:'B', q:'Guru, dokter, petani, dan buruh adalah contoh …', o:['Sumber daya manusia','Sumber daya modal','SDA terbarukan','SDA tak terbarukan'] },
  { s:'B', q:'Mesin pabrik, gedung, dan peralatan yang dipakai untuk menghasilkan barang termasuk …', o:['Sumber daya modal','Sumber daya manusia','SDA terbarukan','Barang illith'] },

  /* ---- C: Barang Pemuas Kebutuhan ---- */
  { s:'C', q:'Udara dan sinar matahari yang tersedia melimpah tanpa pengorbanan termasuk barang …', o:['Bebas','Ekonomi','Illith','Setengah jadi'] },
  { s:'C', q:'Barang yang untuk memperolehnya diperlukan pengorbanan (uang, tenaga, waktu) disebut barang …', o:['Ekonomi','Bebas','Illith','Mentah'] },
  { s:'C', q:'Narkoba, minuman keras, dan limbah beracun yang keberadaannya merugikan termasuk barang …', o:['Illith','Bebas','Ekonomi','Komplementer'] },
  { s:'C', q:'Nasi yang langsung dimakan untuk memenuhi kebutuhan termasuk barang …', o:['Konsumsi','Produksi','Illith','Mentah'] },
  { s:'C', q:'Tepung terigu yang dipakai pabrik untuk membuat roti termasuk barang …', o:['Produksi','Konsumsi','Bebas','Jadi'] },
  { s:'C', q:'Teh dan kopi, atau beras dan jagung, merupakan contoh hubungan barang …', o:['Substitusi','Komplementer','Produksi','Illith'] },
  { s:'C', q:'Mobil dan bensin, atau sepatu dan kaus kaki, merupakan contoh barang …', o:['Komplementer','Substitusi','Bebas','Mentah'] },
  { s:'C', q:'Jika harga teh naik drastis, permintaan terhadap kopi (barang substitusinya) cenderung …', o:['Naik','Turun','Tetap','Hilang'] },
  { s:'C', q:'Kapas yang baru dipanen dari ladang termasuk barang …', o:['Mentah','Setengah jadi','Jadi','Illith'] },
  { s:'C', q:'Benang yang masih akan ditenun menjadi kain termasuk barang …', o:['Setengah jadi','Mentah','Jadi','Bebas'] },
  { s:'C', q:'Kemeja yang siap dipakai konsumen termasuk barang …', o:['Jadi','Mentah','Setengah jadi','Illith'] },

  /* ---- D: Prinsip & Perilaku Ekonomi ---- */
  { s:'D', q:'Pernyataan yang tepat tentang prinsip ekonomi adalah …', o:['Dengan pengorbanan sekecil-kecilnya memperoleh hasil sebesar-besarnya','Dengan pengorbanan sebesar-besarnya memperoleh hasil sekecil-kecilnya','Membeli semua barang yang sedang diskon','Menimbun barang sebanyak mungkin'] },
  { s:'D', q:'Menyusun kebutuhan berdasarkan tingkat kepentingannya disebut …', o:['Skala prioritas','Barang substitusi','Kelangkaan','Promosi'] },
  { s:'D', q:'Rina membandingkan harga, kualitas, dan manfaat dua ponsel sebelum membeli. Sikap ini menunjukkan perilaku …', o:['Rasional','Konsumtif','Impulsif','Boros'] },
  { s:'D', q:'Rani memilih membeli buku dan melepaskan kesempatan menonton konser. Nilai konser yang dikorbankan disebut …', o:['Biaya peluang (opportunity cost)','Barang komplementer','Kelangkaan','Pendapatan'] },
  { s:'D', q:'Membeli barang hanya karena ikut-ikutan dan tergiur diskon, padahal tidak dibutuhkan, bertentangan dengan …', o:['Sikap rasional dan prinsip ekonomi','Hukum alam','Skala usia','Kebutuhan sepanjang waktu'] },
  { s:'D', q:'Mematikan lampu dan keran air saat tidak digunakan merupakan wujud tindakan ekonomi yang …', o:['Hemat','Boros','Konsumtif','Illith'] },
  { s:'D', q:'Hal yang perlu dipertimbangkan agar rasional dalam memilih adalah …', o:['Manfaat, kebutuhan, dan kemampuan keuangan','Hanya merek yang sedang tren','Hanya harga paling mahal','Saran teman tanpa pertimbangan'] },
  { s:'D', q:'Manusia harus membuat pilihan karena …', o:['Kebutuhan tidak terbatas sedangkan alat pemuas terbatas','Semua barang tersedia gratis','Kebutuhan manusia sangat sedikit','Uang tidak pernah habis'] },
  /* ---- Tambahan dari materi terbaru ---- */
  { s:'A', q:'Pernyataan yang benar tentang kebutuhan dan keinginan adalah …', o:['Kebutuhan wajib dipenuhi demi hidup, keinginan boleh ditunda','Keinginan harus selalu dipenuhi lebih dulu','Kebutuhan dan keinginan selalu sama','Kebutuhan hanya milik orang dewasa'] },
  { s:'C', q:'Pasir yang dipindahkan dari sungai ke lokasi pembangunan rumah nilai gunanya bertambah. Ini kegunaan …', o:['Tempat (place utility)','Bentuk (form utility)','Waktu (time utility)','Kepemilikan (ownership utility)'] },
  { s:'C', q:'Kayu yang diolah menjadi meja dan kursi menambah kegunaan …', o:['Bentuk (form utility)','Tempat (place utility)','Pelayanan (service utility)','Waktu (time utility)'] },
  { s:'C', q:'Payung menjadi sangat berguna ketika hujan turun. Ini menunjukkan kegunaan …', o:['Waktu (time utility)','Bentuk (form utility)','Tempat (place utility)','Elementary utility'] },
  { s:'C', q:'Jasa dokter, tukang cukur, dan sopir menambah nilai guna melalui …', o:['Pelayanan (service utility)','Bentuk (form utility)','Tempat (place utility)','Kepemilikan (ownership utility)'] },
  { s:'B', q:'Hak paten, merek dagang, dan nama baik perusahaan termasuk modal …', o:['Abstrak','Konkret','Lancar','Asing'] },
  { s:'B', q:'Bahan baku yang habis dalam sekali proses produksi termasuk modal …', o:['Lancar','Tetap','Abstrak','Asing'] },
  { s:'B', q:'Modal yang berasal dari pinjaman bank disebut modal …', o:['Asing','Sendiri','Tetap','Abstrak'] },
  { s:'B', q:'Jalan raya, jembatan, dan pelabuhan yang dipakai bersama termasuk modal …', o:['Masyarakat','Perorangan','Lancar','Abstrak'] },
  { s:'B', q:'Montir, sopir, dan tukang las yang keahliannya diperoleh dari pelatihan termasuk tenaga kerja …', o:['Terlatih','Terdidik','Tidak terdidik dan tidak terlatih','Rohani'] },
  { s:'B', q:'Dokter dan insinyur yang keahliannya dari pendidikan formal tinggi termasuk tenaga kerja …', o:['Terdidik','Terlatih','Jasmani','Tidak terlatih'] },
  { s:'B', q:'Orang yang berani mengambil risiko dan menggabungkan faktor produksi untuk membuka usaha disebut …', o:['Wirausahawan (entrepreneur)','Konsumen','Tenaga kerja kasar','Penabung'] },
  { s:'D', q:'Ilmu ekonomi disebut ilmu tentang pilihan (the study of choice) karena …', o:['Sumber daya langka memaksa manusia memilih penggunaan terbaik','Semua barang tersedia melimpah','Manusia tidak punya kebutuhan','Pilihan tidak pernah berpengaruh'] },
  { s:'D', q:'Membeli barang karena gengsi dan ikut tren tanpa menghitung kebutuhan dan anggaran adalah perilaku …', o:['Irasional','Rasional','Hemat','Efisien'] },
  { s:'D', q:'Dalam keputusan rasional, suatu pilihan layak diambil bila …', o:['Manfaat yang diperoleh lebih besar dari pengorbanannya','Harganya paling mahal','Sedang ramai dibicarakan','Dibeli banyak orang'] },
];
