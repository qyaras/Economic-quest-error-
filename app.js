/* ============================================================
   APP: navigasi, materi, toko skin, evaluasi, penyimpanan
   ============================================================ */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const Store = {
  get(k, d) { try { const v = localStorage.getItem('eq_' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('eq_' + k, JSON.stringify(v)); } catch (e) {} },
};
const S = {
  name: Store.get('name', ''),
  wallet: Store.get('wallet', 0),
  owned: Store.get('owned', ['basic']),
  skin: Store.get('skin', 'basic'),
  read: Store.get('read', []),
  runs: Store.get('runs', []),
  stats: Store.get('stats', { A: { r: 0, w: 0 }, B: { r: 0, w: 0 }, C: { r: 0, w: 0 }, D: { r: 0, w: 0 } }),
  seen: Store.get('seen', []),
  best: Store.get('best', 0),
  last: Store.get('last', null),
};
const save = (...k) => k.forEach(x => Store.set(x, S[x]));

/* ---------- Latar koin melayang ---------- */
(function floaters() {
  const box = $('.bg-floaters');
  for (let i = 0; i < 12; i++) {
    const c = document.createElement('i');
    c.style.left = Math.random() * 100 + '%';
    c.style.animationDuration = 14 + Math.random() * 16 + 's';
    c.style.animationDelay = -Math.random() * 20 + 's';
    c.style.transform = `scale(${0.5 + Math.random() * 0.9})`;
    box.appendChild(c);
  }
})();

/* ---------- Toast ---------- */
let toastT;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2000); }

/* ---------- Mute ---------- */
function paintMute() { const b = $('#btnMute'); b.classList.toggle('off', Sound.isMuted()); b.firstElementChild.textContent = Sound.isMuted() ? '🔇' : '🔊'; }
$('#btnMute').onclick = () => { Sound.unlock(); Sound.toggle(); if (!Sound.isMuted()) { Sound.startBgm(); Sound.click(); } };
Sound.onMute(paintMute); paintMute();

/* ---------- Navigasi ---------- */
let current = 'splash', previewRaf = 0;
function go(id) {
  if (id === current) return;
  const from = $('#screen-' + current), to = $('#screen-' + id);
  from.classList.remove('active'); from.classList.add('leaving');
  setTimeout(() => from.classList.remove('leaving'), 260);
  to.classList.add('active'); current = id;
  window.scrollTo(0, 0);
  $('#btnMute').style.display = id === 'play' ? 'none' : '';
  cancelAnimationFrame(previewRaf);
  ({ dashboard: viewDashboard, materi: viewMateri, game: viewGame, evaluasi: viewEval, splash: viewSplash }[id] || (() => {}))();
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-go]');
  if (b) { Sound.click(); go(b.dataset.go); }
});

/* ---------- Splash ---------- */
function viewSplash() {
  const cv = $('#splashChar'), c = cv.getContext('2d'); let t = 0;
  (function loop() { if (current !== 'splash') return; t++; c.clearRect(0, 0, 160, 170); drawCharacter(c, 80, 150 - Math.abs(Math.sin(t * 0.05)) * 14, { skin: S.skin, t, moving: false, air: false, face: 1 }); requestAnimationFrame(loop); })();
}
$('#inpName').value = S.name;
$('#btnStart').onclick = () => {
  Sound.unlock(); Sound.click();
  S.name = ($('#inpName').value || '').trim() || 'Petualang'; save('name');
  Sound.startBgm();
  go('dashboard');
};
$('#inpName').addEventListener('keydown', e => { if (e.key === 'Enter') $('#btnStart').click(); });
function wallet() { $('#walletDash').textContent = S.wallet; $('#walletGame').textContent = S.wallet; }

/* ---------- Dashboard ---------- */
function viewDashboard() {
  $('#helloName').textContent = S.name || 'Petualang';
  wallet();
  const done = MATERI.filter(m => S.read.includes(m.id)).length;
  $('#badgeMateri').textContent = done ? `${done}/${MATERI.length} ✓` : '';
}

/* ---------- Materi ---------- */
let mSel = 'P';
const minfo = m => SUBS[m.id] || m.meta;
function viewMateri() {
  const tabs = $('#materiTabs');
  tabs.innerHTML = MATERI.map(m => {
    const s = minfo(m), lbl = SUBS[m.id] ? m.id + '. ' : '';
    return `<button class="m-tab ${m.id === mSel ? 'active' : ''} ${S.read.includes(m.id) ? 'done' : ''}" data-m="${m.id}">
      <span class="ti" style="background:${s.color}">${s.icon}</span><span><b>${lbl}${s.short}</b><small>${m.sections.length} bagian</small></span><span class="ck">✓</span></button>`;
  }).join('');
  $$('.m-tab', tabs).forEach(b => b.onclick = () => { Sound.click(); mSel = b.dataset.m; viewMateri(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  renderMateri();
}
function renderMateri() {
  const m = MATERI.find(x => x.id === mSel), s = minfo(m), isSub = !!SUBS[m.id];
  const idx = MATERI.indexOf(m), next = MATERI[idx + 1];
  const body = $('#materiBody');
  body.style.animation = 'none'; void body.offsetWidth; body.style.animation = '';
  body.innerHTML = `
    <div class="m-head" style="background:linear-gradient(135deg, ${s.color}, ${s.color}cc)"><h2>${s.icon} ${isSub ? 'Sub-Bab ' + m.id + ': ' : ''}${s.title}</h2><p>${m.intro}</p></div>
    ${m.sections.map((sec, i) => `<details class="m-sec" ${i === 0 ? 'open' : ''}><summary><span class="no">${i + 1}</span>${sec.h}</summary><div class="content">${sec.html}</div></details>`).join('')}
    <div class="recap"><h3>📝 Ringkasan Kilat</h3><ul>${m.recap.map(r => `<li>${r}</li>`).join('')}</ul></div>
    <div class="m-actions">
      <button class="btn green" id="btnRead">${S.read.includes(m.id) ? '✔ Sudah dibaca' : '✓ Tandai Selesai Dibaca'}</button>
      ${next ? `<button class="btn" id="btnNext">${SUBS[next.id] ? 'Sub-Bab ' + next.id : minfo(next).short} ➜</button>` : `<button class="btn" data-go="game">🎮 Uji di Game ➜</button>`}
    </div>`;
  $$('.m-sec > summary', body).forEach(sm => sm.addEventListener('click', () => Sound.click()));
  $('#btnRead').onclick = () => {
    if (!S.read.includes(m.id)) { S.read.push(m.id); save('read'); Sound.correct(); toast('Bagian selesai dibaca! 🎉'); }
    viewMateri();
  };
  const bn = $('#btnNext'); if (bn) bn.onclick = () => { Sound.click(); mSel = next.id; viewMateri(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
}

/* ---------- Game lobby & toko ---------- */
let previews = [];
function viewGame() {
  wallet();
  const sk = SKINS.find(x => x.id === S.skin);
  $('#activeSkinName').textContent = sk.name;
  $('#bestNote').textContent = S.best ? `🏅 Poin terbaik: ${S.best}` : 'Belum ada rekor. Jadilah yang pertama!';
  const shop = $('#shop');
  shop.innerHTML = SKINS.map(k => {
    const owned = S.owned.includes(k.id), eq = S.skin === k.id;
    return `<div class="skin ${k.id} ${eq ? 'equipped' : ''}">
      ${eq ? '<span class="tag">Dipakai</span>' : ''}
      <canvas width="200" height="200" data-skin="${k.id}"></canvas>
      <h4>${k.name}</h4><p>${k.desc}</p>
      <div class="price">${k.price === 0 ? 'GRATIS' : '🪙 ' + k.price + ' poin'}</div>
      ${eq ? '<button class="btn green" disabled>✔ Terpakai</button>'
        : owned ? `<button class="btn" data-equip="${k.id}">Pakai Skin</button>`
        : `<button class="btn ${S.wallet >= k.price ? '' : 'ghost'}" data-buy="${k.id}">${S.wallet >= k.price ? '🛒 Beli' : '🔒 Poin kurang (' + (k.price - S.wallet) + ')'}</button>`}
    </div>`;
  }).join('');
  $$('[data-equip]', shop).forEach(b => b.onclick = () => { S.skin = b.dataset.equip; save('skin'); Sound.click(); viewGame(); });
  $$('[data-buy]', shop).forEach(b => b.onclick = () => {
    const k = SKINS.find(x => x.id === b.dataset.buy);
    if (S.wallet < k.price) { Sound.wrong(); toast(`Butuh ${k.price - S.wallet} poin lagi. Main dulu, yuk!`); return; }
    S.wallet -= k.price; S.owned.push(k.id); S.skin = k.id; save('wallet', 'owned', 'skin');
    Sound.buy(); toast(`${k.name} dibeli & dipakai! ✨`); viewGame();
  });
  // animasi pratinjau
  previews = $$('#shop canvas').map(cv => ({ c: cv.getContext('2d'), skin: cv.dataset.skin }));
  previews.push({ c: $('#lobbyChar').getContext('2d'), skin: S.skin, lobby: true });
  let t = 0;
  (function loop() {
    if (current !== 'game') return; t++;
    previews.forEach(p => {
      p.c.clearRect(0, 0, 200, 200); p.c.save(); p.c.scale(1.6, 1.6);
      drawCharacter(p.c, 62, 112, { skin: p.skin, t, moving: Math.floor(t / 150) % 2 === 1, air: false, face: 1 });
      p.c.restore();
    });
    previewRaf = requestAnimationFrame(loop);
  })();
}
$('#btnPlay').onclick = () => { Sound.click(); startGame(); };

/* ---------- Menyiapkan soal ---------- */
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function pickQuestions() {
  const withId = BANK.map((q, i) => ({ ...q, id: i }));
  const rank = q => (S.seen.includes(q.id) ? 1 : 0) + Math.random() * 0.9;   // prioritaskan yang belum pernah muncul
  const bySub = {}; withId.forEach(q => (bySub[q.s] = bySub[q.s] || []).push(q));
  let chosen = [];
  Object.values(bySub).forEach(list => { list.sort((a, b) => rank(a) - rank(b)); chosen.push(...list.slice(0, 2)); });
  const rest = withId.filter(q => !chosen.includes(q)).sort((a, b) => rank(a) - rank(b));
  chosen.push(...rest.slice(0, Game.N_QUIZ - chosen.length));
  shuffle(chosen);
  S.seen = [...new Set([...S.seen, ...chosen.map(q => q.id)])];
  if (S.seen.length > BANK.length - 12) S.seen = chosen.map(q => q.id);
  save('seen');
  return chosen.map(q => {
    const correctText = q.o[0], opts = shuffle([...q.o]);
    return { s: q.s, q: q.q, opts, correct: opts.indexOf(correctText) };
  });
}

/* ---------- Mulai & akhir game ---------- */
function startGame() {
  Sound.unlock(); Sound.startBgm();
  go('play');
  Game.start({
    skin: S.skin,
    questions: pickQuestions(),
    onEnd: res => finishRun(res),
    onQuit: () => go('game'),
  });
}
function finishRun(res) {
  S.wallet += res.pts;
  Object.keys(res.bySub).forEach(k => { S.stats[k].r += res.bySub[k].r; S.stats[k].w += res.bySub[k].w; });
  res.date = Date.now();
  S.last = res; S.runs.unshift(res); S.runs = S.runs.slice(0, 10);
  S.best = Math.max(S.best, res.pts);
  save('wallet', 'stats', 'last', 'runs', 'best');
  go('evaluasi');
}
Game.init();

/* ---------- Evaluasi ---------- */
function analyse(res) {
  const total = res.quizRight + res.quizWrong;
  const acc = total ? res.quizRight / total : 0;
  const wrongs = Object.entries(res.bySub).filter(([, v]) => v.w > 0).map(([k, v]) => ({ id: k, w: v.w, acc: v.r / (v.r + v.w) })).sort((a, b) => b.w - a.w || a.acc - b.acc);
  let kind, msg, sub = '';
  if (total === 0) { kind = 'neutral'; msg = 'Kamu belum sempat menjawab kuis. Coba lagi dan raih gerbang KUIS-nya!'; sub = 'Tips: hindari rintangan dengan melompat.'; }
  else if (acc >= 0.8) { kind = 'good'; msg = acc === 1 && total === Game.N_QUIZ ? 'Pemahamanmu bagus, selamat! 🎉 Nilai sempurna!' : 'Pemahamanmu bagus, selamat!'; sub = 'Pertahankan! Coba kumpulkan lebih banyak koin untuk skin Golden Armor.'; }
  else {
    kind = 'bad';
    const top = wrongs.filter(x => x.w === wrongs[0].w).slice(0, 2).map(x => SUBS[x.id].title);
    msg = `Pemahamanmu masih kurang nih pada materi ${top.join(' dan ')}, Belajar lagi yukk!`;
    sub = 'Buka menu Materi lalu coba main lagi. Soalnya selalu diacak!';
  }
  return { total, acc, wrongs, kind, msg, sub };
}
function stars(acc, n) { const k = n === 0 ? 0 : acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : acc > 0 ? 1 : 0; return [1, 2, 3].map(i => `<span class="${i <= k ? '' : 'off'}">⭐</span>`).join(''); }

function viewEval() {
  const body = $('#evalBody'), res = S.last;
  if (!res) {
    body.innerHTML = `<div class="panel empty"><div class="big">🎯</div><h3>Belum ada data evaluasi</h3><p>Mainkan game dan jawab kuis dulu, nanti hasil &amp; analisis pemahamanmu muncul di sini.</p><button class="btn big" data-go="game">🎮 Main Sekarang</button></div>`;
    return;
  }
  const a = analyse(res), pct = Math.round(a.acc * 100);
  const cum = Object.keys(SUBS).map(k => ({ id: k, ...S.stats[k] }));
  const statusTxt = res.status === 'win' ? '🏁 Misi selesai' : '💔 Game over';
  body.innerHTML = `
    <div class="panel ev-hero">
      <div class="ev-score" style="--p:0" id="evRing"><div><b>${pct}</b><small>% benar</small></div></div>
      <div>
        <h3>${statusTxt}, ${S.name || 'Petualang'}!</h3>
        <div class="stars">${stars(a.acc, a.total)}</div>
        <div class="ev-stats">
          <span class="pill">⭐ Total Poin: ${res.pts}</span>
          <span class="pill">✅ Benar: ${res.quizRight}</span>
          <span class="pill">❌ Salah: ${res.quizWrong}</span>
          <span class="pill">🪙 Koin: ${res.coins}</span>
          <span class="pill">❤️ Sisa nyawa: ${res.lives}</span>
        </div>
        <p class="mini-note">Poin sudah masuk ke saldo: 🪙 ${S.wallet} (bisa dipakai di Toko Skin).</p>
      </div>
    </div>
    <div class="feedback ${a.kind}"><span class="fe">${a.kind === 'good' ? '🏆' : a.kind === 'bad' ? '📖' : '🎯'}</span><div>${a.msg}<small>${a.sub}</small></div></div>
    <div class="panel"><h3>📊 Pemahaman per Sub-Bab (permainan terakhir)</h3><div class="bars">
      ${Object.keys(SUBS).map(k => { const v = res.bySub[k], n = v.r + v.w, p = n ? Math.round(v.r / n * 100) : 0; return `<div class="bar-row"><span class="nm">${SUBS[k].icon} ${k}. ${SUBS[k].short}</span><div class="bar"><i data-w="${p}" style="background:${SUBS[k].color}"></i></div><span class="v">${n ? `${v.r}/${n}` : '–'}</span></div>`; }).join('')}
    </div>
    ${a.wrongs.length ? `<h3 style="margin-top:20px">🔧 Area yang Perlu Diperkuat</h3><div class="weak-list">${a.wrongs.map(w => `<div class="weak"><b>${SUBS[w.id].icon} Sub-Bab ${w.id}: ${SUBS[w.id].title} <small>(${w.w} salah)</small></b><button class="btn" data-study="${w.id}">📚 Pelajari</button></div>`).join('')}</div>` : '<p class="tip" style="margin-top:16px">🌟 Tidak ada sub-bab yang salah. Mantap!</p>'}
    </div>
    <div class="panel"><h3>📈 Akumulasi Semua Permainan</h3><div class="bars">
      ${cum.map(c => { const n = c.r + c.w, p = n ? Math.round(c.r / n * 100) : 0; return `<div class="bar-row"><span class="nm">${SUBS[c.id].icon} ${c.id}. ${SUBS[c.id].short}</span><div class="bar"><i data-w="${p}" style="background:${SUBS[c.id].color}"></i></div><span class="v">${n ? p + '%' : '–'}</span></div>`; }).join('')}
    </div></div>
    <div class="panel"><h3>🕘 Riwayat (10 terakhir)</h3><div style="overflow:auto"><table class="hist"><tr><th>#</th><th>Hasil</th><th>Poin</th><th>Benar</th><th>Koin</th></tr>
      ${S.runs.map((r, i) => `<tr><td>${i + 1}</td><td>${r.status === 'win' ? '🏁 Selesai' : '💔 Game over'}</td><td>${r.pts}</td><td>${r.quizRight}/${r.quizRight + r.quizWrong}</td><td>${r.coins}</td></tr>`).join('')}
    </table></div></div>
    <div class="center"><button class="btn big" data-go="game">🔁 Main Lagi</button> <button class="btn big ghost" data-go="materi">📚 Buka Materi</button></div>`;
  $$('[data-study]', body).forEach(b => b.onclick = () => { Sound.click(); mSel = b.dataset.study; go('materi'); });
  // animasi
  requestAnimationFrame(() => setTimeout(() => {
    $('#evRing').style.setProperty('--p', pct);
    $$('.bar i', body).forEach(i => i.style.width = i.dataset.w + '%');
  }, 80));
}

/* ---------- Mulai ---------- */
viewSplash();
