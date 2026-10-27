/* ============================================================
   GAME ENGINE: platformer/runner 2D berbasis Canvas
   ============================================================ */
const Game = (() => {
  const W = 960, H = 540, GY = 452;           // lebar, tinggi, tinggi tanah
  const SPEED = 4.6, JUMP = -14.8, GRAV = 0.74;
  const PW = 24, PH = 66;                      // hitbox pemain
  const QUIZ_TIME = 15000;                     // 15 detik
  const N_QUIZ = 10;

  let cv, ctx, raf = 0, lastTs = 0, acc = 0;
  let run = null, cfg = null, active = false, paused = false;
  const keys = { left: false, right: false, jump: false };
  const touch = { left: false, right: false, jump: false };
  let jumpQueued = false;
  const $ = s => document.querySelector(s);

  /* ---------- RNG deterministik untuk dekorasi ---------- */
  function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const rnd = (a, b) => a + Math.random() * (b - a);

  /* ---------- Dekorasi latar (sekali dibuat) ---------- */
  let clouds = [], blds = [], hills = [];
  function buildScenery() {
    const r = mulberry(7);
    clouds = Array.from({ length: 9 }, (_, i) => ({ x: i * 260 + r() * 100, y: 40 + r() * 120, s: 0.6 + r() * 0.8 }));
    let x = 0; blds = [];
    while (x < 3400) {
      const w = 90 + r() * 90, h = 110 + r() * 170, bank = r() < 0.18;
      blds.push({ x, w, h, bank, hue: Math.floor(r() * 3), win: Math.floor(r() * 3) });
      x += w + 10 + r() * 30;
    }
    hills = [];
  }

  /* ---------- Membuat level ---------- */
  function buildLevel() {
    const GAP = 1150, START = 1000;
    const gates = Array.from({ length: N_QUIZ }, (_, i) => ({ x: START + i * GAP, done: false, i }));
    const finishX = START + (N_QUIZ - 1) * GAP + 950;
    const L = { gates, finishX, len: finishX + 500, obs: [], plats: [], coins: [], deco: [] };
    const segs = [[520, gates[0].x - 260]];
    gates.forEach((g, i) => segs.push([g.x + 260, (i < N_QUIZ - 1 ? gates[i + 1].x - 260 : finishX - 200)]));
    const types = [
      { t: 'bill', w: 40, h: 44, label: 'TAGIHAN' },
      { t: 'debt', w: 44, h: 52, label: 'UTANG' },
      { t: 'infl', w: 56, h: 30, label: '' },
    ];
    segs.forEach(([a, b]) => {
      const n = b - a > 650 ? 3 : 2;
      for (let k = 0; k < n; k++) {
        const base = a + (k + 0.5) * (b - a) / n + rnd(-50, 50);
        const ty = types[Math.floor(Math.random() * types.length)];
        L.obs.push({ x: base, y: GY - ty.h, ...ty });
        if (Math.random() < 0.7) { // busur koin di atas rintangan
          for (let j = 0; j < 5; j++) L.coins.push({ x: base + ty.w / 2 - 60 + j * 30, y: GY - 34 - Math.sin(j / 4 * Math.PI) * (ty.h + 50), bag: false, got: false });
        }
        if (Math.random() < 0.4) { // platform alternatif
          const py = GY - rnd(100, 125), px = base - 120 + rnd(-40, 40);
          L.plats.push({ x: px, y: py, w: 150 });
          for (let j = 0; j < 3; j++) L.coins.push({ x: px + 35 + j * 40, y: py - 24, bag: j === 1, got: false });
        }
      }
      // deretan koin di tanah
      const cx = a + rnd(60, Math.max(80, b - a - 250));
      for (let j = 0; j < 4; j++) L.coins.push({ x: cx + j * 34, y: GY - 28, bag: false, got: false });
    });
    // dekorasi tanah (kios, papan)
    const labels = ['PASAR', 'KOPERASI', 'TOKO', 'BANK', 'KANTIN', 'UMKM'];
    for (let x = 300, i = 0; x < L.len; x += 520 + Math.random() * 260, i++) L.deco.push({ x, label: labels[i % labels.length], hue: i % 3 });
    return L;
  }

  /* ---------- State awal ---------- */
  function newRun() {
    const lvl = buildLevel();
    return {
      lvl, cam: 0, t: 0,
      p: { x: 120, y: GY, vx: 0, vy: 0, onGround: true, face: 1, inv: 0, stun: 0, wasAir: false },
      lives: 3, coins: 0, quizRight: 0, quizWrong: 0, answered: 0,
      bySub: { A: { r: 0, w: 0 }, B: { r: 0, w: 0 }, C: { r: 0, w: 0 }, D: { r: 0, w: 0 } },
      state: 'play',              // play | quiz | ended
      qIndex: 0, parts: [], floats: [], shake: 0,
    };
  }
  const points = () => run.coins + run.quizRight * 10;

  /* ---------- HUD ---------- */
  function hud() {
    const h = $('#hudHearts');
    h.innerHTML = Array.from({ length: 3 }, (_, i) => `<span class="heart ${i < run.lives ? '' : 'lost'}">♥</span>`).join('');
    $('#hudQuiz').textContent = `${Math.min(run.answered, N_QUIZ)}/${N_QUIZ}`;
    $('#hudPts').textContent = points();
    $('#hudCoins').textContent = run.coins;
  }
  function bump(id) { const e = $(id); e.classList.remove('bump'); void e.offsetWidth; e.classList.add('bump'); }

  /* ---------- Input ---------- */
  function keyMap(e) {
    switch (e.code) {
      case 'ArrowLeft': case 'KeyA': return 'left';
      case 'ArrowRight': case 'KeyD': return 'right';
      case 'ArrowUp': case 'Space': case 'KeyW': return 'jump';
    }
    return null;
  }
  function onKey(down) {
    return e => {
      if (!active) return;
      const k = keyMap(e);
      if (run && run.state === 'quiz') {
        if (down) {
          const i = ['Digit1', 'Digit2', 'Digit3', 'Digit4'].indexOf(e.code), j = ['KeyA', 'KeyB', 'KeyC', 'KeyD'].indexOf(e.code);
          const n = i >= 0 ? i : j; if (n >= 0) { answer(n); return; }
        }
        // tetap catat tombol panah agar gerak lanjut mulus setelah kuis
        if (k && e.code !== 'KeyA' && e.code !== 'KeyD') { keys[k] = down; e.preventDefault(); }
        else if (!down && k) keys[k] = false;
        return;
      }
      if (down && (e.code === 'Escape' || e.code === 'KeyP')) { setPause(!paused); e.preventDefault(); return; }
      if (!k) return;
      e.preventDefault();
      if (k === 'jump' && down && !keys.jump) jumpQueued = true;
      keys[k] = down;
    };
  }
  function bindTouch() {
    document.querySelectorAll('[data-ctl]').forEach(b => {
      const k = b.dataset.ctl;
      const on = e => { e.preventDefault(); if (k === 'jump' && !touch.jump) jumpQueued = true; touch[k] = true; b.classList.add('down'); };
      const off = e => { e.preventDefault(); touch[k] = false; b.classList.remove('down'); };
      b.addEventListener('pointerdown', on);
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => b.addEventListener(ev, off));
      b.addEventListener('contextmenu', e => e.preventDefault());
    });
  }

  /* ---------- Kuis ---------- */
  let quiz = null;
  function openQuiz(gate) {
    run.state = 'quiz';
    touch.left = touch.right = touch.jump = false;
    run.p.vx = 0;
    const q = cfg.questions[run.qIndex];
    quiz = { q, gate, start: performance.now(), done: false, lastTick: 15 };
    Sound.gate(); Sound.duck(true);
    $('#quizNo').textContent = `Kuis ${run.qIndex + 1}/${N_QUIZ}`;
    $('#quizSub').textContent = SUBS[q.s].icon + ' ' + SUBS[q.s].short;
    $('#quizQ').textContent = q.q;
    $('#quizFb').textContent = ''; $('#quizFb').className = 'quiz-fb';
    $('#quizOpts').innerHTML = q.opts.map((t, i) => `<button class="opt" data-i="${i}"><b>${'ABCD'[i]}</b><span></span></button>`).join('');
    document.querySelectorAll('#quizOpts .opt').forEach((b, i) => { b.querySelector('span').textContent = q.opts[i]; b.onclick = () => answer(i); });
    $('#timeFill').style.width = '100%';
    $('#quiz').classList.remove('hidden');
  }
  function quizTick(now) {
    if (!quiz || quiz.done) return;
    const left = Math.max(0, QUIZ_TIME - (now - quiz.start));
    $('#timeFill').style.width = (left / QUIZ_TIME * 100) + '%';
    const sec = Math.ceil(left / 1000);
    $('#quizTime').textContent = sec;
    $('#quiz').classList.toggle('urgent', left <= 5000);
    if (sec <= 3 && sec < quiz.lastTick) { Sound.tick(); }
    quiz.lastTick = sec;
    if (left <= 0) answer(-1);
  }
  function answer(i) {
    if (!quiz || quiz.done) return;
    quiz.done = true;
    const q = quiz.q, ok = i === q.correct;
    const sub = run.bySub[q.s];
    run.answered++;
    const opts = document.querySelectorAll('#quizOpts .opt');
    opts.forEach((b, k) => { b.disabled = true; if (k === q.correct) b.classList.add('right'); });
    const fb = $('#quizFb');
    if (ok) {
      sub.r++; run.quizRight++; Sound.correct();
      opts[i].classList.add('right');
      fb.textContent = '✅ Benar! +10 poin'; fb.className = 'quiz-fb ok';
      addFloat(run.p.x, run.p.y - 90, '+10', '#06d6a0'); burst(run.p.x, run.p.y - 40, '#ffd166', 18);
    } else {
      sub.w++; run.quizWrong++; run.lives--; Sound.wrong(); run.shake = 10;
      if (i >= 0) opts[i].classList.add('wrong');
      fb.textContent = i < 0 ? '⏰ Waktu habis! Nyawa −1' : '❌ Kurang tepat. Nyawa −1'; fb.className = 'quiz-fb bad';
      addFloat(run.p.x, run.p.y - 90, '−1 ♥', '#ef476f');
    }
    bump('#hudPts'); hud();
    const gate = quiz.gate;
    setTimeout(() => {
      $('#quiz').classList.add('hidden'); $('#quiz').classList.remove('urgent');
      Sound.duck(false);
      gate.done = true; run.qIndex++; quiz = null;
      if (run.lives <= 0) return finish('over');
      run.state = 'play'; hud();
    }, 1250);
  }

  /* ---------- Efek ---------- */
  function burst(x, y, color, n) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.28, s = rnd(1.5, 5);
      run.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1.5, life: rnd(20, 38), max: 38, color, size: rnd(2, 4.5) });
    }
  }
  function addFloat(x, y, text, color) { run.floats.push({ x, y, text, color, life: 55 }); }

  /* ---------- Update (60 fps tetap) ---------- */
  function update() {
    run.t++;
    const p = run.p, L = run.lvl;
    if (run.state === 'ended') { return; }
    if (run.state === 'quiz') { animateFx(); return; }

    let dir = 0;
    if (p.stun > 0) { p.stun--; }
    else {
      if (keys.left || touch.left) dir -= 1;
      if (keys.right || touch.right) dir += 1;
      p.vx = dir * SPEED;
      if (dir) p.face = dir;
      if (jumpQueued && p.onGround) { p.vy = JUMP; p.onGround = false; Sound.jump(); burst(p.x, p.y, '#ffffff', 5); }
    }
    jumpQueued = false;
    if (!(keys.jump || touch.jump) && p.vy < -6) p.vy *= 0.86;       // lompat variabel

    p.x = Math.max(30, Math.min(L.len - 30, p.x + p.vx));
    const prevY = p.y;
    p.vy += GRAV; p.y += p.vy;

    // landing di tanah / platform (one-way)
    let landed = false;
    if (p.y >= GY) { p.y = GY; landed = true; }
    else if (p.vy >= 0) {
      for (const pl of L.plats) {
        if (p.x + PW / 2 > pl.x && p.x - PW / 2 < pl.x + pl.w && prevY <= pl.y + 1 && p.y >= pl.y) { p.y = pl.y; landed = true; break; }
      }
    }
    if (landed) { if (!p.onGround && p.vy > 6) { Sound.land(); burst(p.x, p.y, '#cfe9d0', 5); } p.vy = 0; p.onGround = true; }
    else p.onGround = false;
    if (p.inv > 0) p.inv--;

    // rintangan
    if (p.inv === 0) {
      for (const o of L.obs) {
        const ox = o.x + 5, ow = o.w - 10, oy = o.y + 6;
        if (p.x + PW / 2 > ox && p.x - PW / 2 < ox + ow && p.y > oy && p.y - PH < o.y + o.h) {
          run.lives--; p.inv = 100; p.stun = 16; p.vy = -9; p.vx = -p.face * 5; p.onGround = false;
          Sound.hit(); run.shake = 12; burst(p.x, p.y - 30, '#ef476f', 14); addFloat(p.x, p.y - 90, '−1 ♥', '#ef476f');
          hud();
          if (run.lives <= 0) { finish('over'); return; }
          break;
        }
      }
    }
    // koin
    for (const c of L.coins) {
      if (c.got) continue;
      if (Math.abs(c.x - p.x) < 24 && c.y > p.y - PH - 10 && c.y < p.y + 12) {
        c.got = true; run.coins++; Sound.coin(); burst(c.x, c.y, '#ffd166', 7); addFloat(c.x, c.y - 14, '+1', '#ffb703');
        bump('#hudCoins'); bump('#hudPts'); hud();
      }
    }
    // gerbang kuis
    const g = L.gates.find(g => !g.done);
    if (g && p.x >= g.x - 30) { openQuiz(g); return; }
    // finish
    if (!g && p.x >= L.finishX) { finish('win'); return; }

    // kamera
    const target = Math.max(0, Math.min(L.len - W, p.x - 330));
    run.cam += (target - run.cam) * 0.12;
    animateFx();
  }
  function animateFx() {
    run.parts.forEach(q => { q.x += q.vx; q.y += q.vy; q.vy += 0.18; q.life--; });
    run.parts = run.parts.filter(q => q.life > 0);
    run.floats.forEach(f => { f.y -= 0.8; f.life--; });
    run.floats = run.floats.filter(f => f.life > 0);
    if (run.shake > 0) run.shake--;
    // jejak emas untuk skin hero
    if (cfg.skin === 'hero' && run.t % 3 === 0 && (Math.abs(run.p.vx) > 0 || !run.p.onGround))
      run.parts.push({ x: run.p.x - run.p.face * 10, y: run.p.y - rnd(8, 60), vx: -run.p.face * 0.6, vy: rnd(-0.5, 0.2), life: 22, max: 38, color: '#ffe27a', size: rnd(1.5, 3) });
  }

  /* ---------- Selesai ---------- */
  function finish(status) {
    if (run.state === 'ended') return;
    run.state = 'ended';
    keys.left = keys.right = keys.jump = false;
    $('#quiz').classList.add('hidden'); Sound.duck(false);
    const banner = $('#banner');
    banner.className = 'banner show ' + (status === 'win' ? 'win' : 'over');
    banner.innerHTML = status === 'win' ? '<h2>🎉 Misi Selesai!</h2><p>Kamu menaklukkan semua tantangan</p>' : '<h2>💔 Game Over</h2><p>Nyawamu habis. Yuk lihat evaluasinya!</p>';
    status === 'win' ? Sound.win() : Sound.gameover();
    const res = {
      status, pts: points(), coins: run.coins, quizRight: run.quizRight, quizWrong: run.quizWrong,
      answered: run.answered, bySub: run.bySub, lives: Math.max(0, run.lives),
    };
    setTimeout(() => { banner.className = 'banner'; stop(); cfg.onEnd(res); }, 2300);
  }

  /* ============================================================
     RENDER
     ============================================================ */
  function render() {
    const L = run.lvl, cam = run.cam;
    ctx.save();
    if (run.shake > 0) ctx.translate(rnd(-4, 4), rnd(-3, 3));
    drawSky(cam);
    drawBuildings(cam);
    drawGround(cam);
    ctx.save(); ctx.translate(-cam, 0);
    drawDeco(L, cam); drawPlats(L); drawGates(L); drawFinish(L);
    drawCoins(L, cam); drawObs(L);
    drawCharacter(ctx, run.p.x, run.p.y, { skin: cfg.skin, t: run.t, moving: Math.abs(run.p.vx) > 0.1 && run.state === 'play', air: !run.p.onGround, face: run.p.face, inv: run.p.inv > 0 });
    drawFx();
    ctx.restore();
    // progress bar
    ctx.fillStyle = 'rgba(16,50,74,.35)'; rrect(ctx, 20, H - 16, W - 40, 6, 3); ctx.fill();
    ctx.fillStyle = '#ffd166'; rrect(ctx, 20, H - 16, Math.max(6, (W - 40) * Math.min(1, run.p.x / L.finishX)), 6, 3); ctx.fill();
    ctx.restore();
  }

  function drawSky(cam) {
    const g = ctx.createLinearGradient(0, 0, 0, GY);
    g.addColorStop(0, '#6fd3e6'); g.addColorStop(0.6, '#bff0f5'); g.addColorStop(1, '#fff3d6');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // matahari
    const sg = ctx.createRadialGradient(800, 90, 10, 800, 90, 110);
    sg.addColorStop(0, 'rgba(255,240,170,1)'); sg.addColorStop(0.35, 'rgba(255,225,120,.55)'); sg.addColorStop(1, 'rgba(255,225,120,0)');
    ctx.fillStyle = sg; ctx.fillRect(650, -30, 300, 260);
    ctx.fillStyle = '#ffe27a'; ctx.beginPath(); ctx.arc(800, 90, 34, 0, 7); ctx.fill();
    // awan
    ctx.fillStyle = 'rgba(255,255,255,.9)';
    clouds.forEach(c => {
      const x = ((c.x - cam * 0.18 - run.t * 0.15) % 2600 + 2600) % 2600 - 200;
      ctx.beginPath(); ctx.arc(x, c.y, 24 * c.s, 0, 7); ctx.arc(x + 26 * c.s, c.y - 10 * c.s, 30 * c.s, 0, 7); ctx.arc(x + 58 * c.s, c.y, 22 * c.s, 0, 7); ctx.rect(x, c.y, 58 * c.s, 22 * c.s); ctx.fill();
    });
    // bukit jauh
    ctx.fillStyle = '#9ee2cf';
    ctx.beginPath(); ctx.moveTo(0, GY);
    for (let x = 0; x <= W; x += 20) ctx.lineTo(x, GY - 90 - Math.sin((x + cam * 0.25) / 130) * 38 - Math.sin((x + cam * 0.25) / 57) * 10);
    ctx.lineTo(W, GY); ctx.fill();
    ctx.fillStyle = '#7fd1b9';
    ctx.beginPath(); ctx.moveTo(0, GY);
    for (let x = 0; x <= W; x += 20) ctx.lineTo(x, GY - 50 - Math.sin((x + cam * 0.4 + 90) / 90) * 26);
    ctx.lineTo(W, GY); ctx.fill();
  }
  function drawBuildings(cam) {
    const pal = [['#4fa3b8', '#3b8aa0'], ['#6c7fd1', '#5568b8'], ['#f2a65a', '#d98a3d']];
    const off = cam * 0.5, span = 3400;
    for (let rep = -1; rep < 2; rep++) {
      blds.forEach(b => {
        const x = b.x + rep * span - (off % span) + (off % span < 0 ? span : 0) * 0;
        const sx = b.x - (off % span) + rep * span;
        if (sx > W + 20 || sx + b.w < -20) return;
        const col = pal[b.hue];
        ctx.fillStyle = col[0]; ctx.fillRect(sx, GY - b.h, b.w, b.h);
        ctx.fillStyle = col[1]; ctx.fillRect(sx + b.w - 10, GY - b.h, 10, b.h);
        if (b.bank) {
          ctx.fillStyle = '#ffd166'; ctx.beginPath(); ctx.moveTo(sx - 6, GY - b.h); ctx.lineTo(sx + b.w / 2, GY - b.h - 26); ctx.lineTo(sx + b.w + 6, GY - b.h); ctx.closePath(); ctx.fill();
          ctx.fillStyle = '#7a4f00'; ctx.font = 'bold 14px Fredoka, Arial'; ctx.textAlign = 'center'; ctx.fillText('BANK', sx + b.w / 2, GY - b.h + 4 + 10);
          ctx.fillStyle = '#fff'; for (let k = 0; k < 4; k++) ctx.fillRect(sx + 10 + k * ((b.w - 24) / 3), GY - b.h + 30, 6, b.h - 36);
        } else {
          ctx.fillStyle = 'rgba(255,255,255,.55)';
          for (let wy = GY - b.h + 14; wy < GY - 30; wy += 28) for (let wx = sx + 10; wx < sx + b.w - 22; wx += 24) ctx.fillRect(wx, wy, 12, 14);
        }
      });
    }
  }
  function drawGround(cam) {
    ctx.fillStyle = '#5ec27a'; ctx.fillRect(0, GY, W, 18);
    ctx.fillStyle = '#48a863'; ctx.fillRect(0, GY + 12, W, 6);
    const g = ctx.createLinearGradient(0, GY + 18, 0, H);
    g.addColorStop(0, '#b97a4a'); g.addColorStop(1, '#8d5a34');
    ctx.fillStyle = g; ctx.fillRect(0, GY + 18, W, H - GY);
    ctx.fillStyle = 'rgba(255,255,255,.12)';
    const o = cam % 80;
    for (let x = -o; x < W; x += 80) { ctx.fillRect(x + 10, GY + 34, 36, 6); ctx.fillRect(x + 44, GY + 58, 26, 6); }
    ctx.fillStyle = '#ffd166';
    for (let x = -(cam % 160); x < W; x += 160) { ctx.beginPath(); ctx.arc(x + 20, GY + 80, 5, 0, 7); ctx.fill(); }
  }
  function drawDeco(L, cam) {
    L.deco.forEach(d => {
      if (d.x < cam - 140 || d.x > cam + W + 40) return;
      const col = ['#ef476f', '#1b9aaa', '#ff8c1a'][d.hue];
      ctx.fillStyle = '#8d5a34'; ctx.fillRect(d.x + 6, GY - 70, 6, 70); ctx.fillRect(d.x + 98, GY - 70, 6, 70);
      ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(d.x - 6, GY - 70); ctx.lineTo(d.x + 116, GY - 70); ctx.lineTo(d.x + 108, GY - 96); ctx.lineTo(d.x + 2, GY - 96); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#fff'; for (let k = 0; k < 4; k++) ctx.fillRect(d.x + 2 + k * 28, GY - 96, 14, 26);
      ctx.fillStyle = '#d9a566'; ctx.fillRect(d.x + 10, GY - 30, 90, 30);
      ctx.fillStyle = '#10324a'; ctx.font = 'bold 12px Fredoka, Arial'; ctx.textAlign = 'center'; ctx.fillText(d.label, d.x + 55, GY - 11);
    });
  }
  function drawPlats(L) {
    L.plats.forEach(pl => {
      ctx.fillStyle = '#8d5a34'; rrect(ctx, pl.x, pl.y, pl.w, 16, 6); ctx.fill();
      ctx.fillStyle = '#5ec27a'; rrect(ctx, pl.x, pl.y - 4, pl.w, 9, 4); ctx.fill();
    });
  }
  function drawGates(L) {
    const pulse = 0.5 + 0.5 * Math.sin(run.t * 0.1);
    L.gates.forEach(g => {
      const x = g.x;
      if (g.done) ctx.globalAlpha = 0.75;
      // tiang & papan
      ctx.fillStyle = '#10324a'; ctx.fillRect(x - 5, GY - 140, 10, 140);
      if (!g.done) { ctx.fillStyle = `rgba(255,209,102,${0.18 + pulse * 0.2})`; ctx.beginPath(); ctx.arc(x, GY - 150, 52 + pulse * 6, 0, 7); ctx.fill(); }
      ctx.fillStyle = g.done ? '#06d6a0' : '#ffb703'; rrect(ctx, x - 44, GY - 200, 88, 60, 12); ctx.fill();
      ctx.strokeStyle = '#10324a'; ctx.lineWidth = 4; rrect(ctx, x - 44, GY - 200, 88, 60, 12); ctx.stroke();
      ctx.fillStyle = '#10324a'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
      ctx.font = 'bold 12px Fredoka, Arial'; ctx.fillText('KUIS ' + (g.i + 1), x, GY - 181);
      ctx.font = 'bold 30px Fredoka, Arial'; ctx.fillText(g.done ? '✔' : '?', x, GY - 150);
      ctx.globalAlpha = 1;
    });
  }
  function drawFinish(L) {
    const x = L.finishX;
    ctx.fillStyle = '#10324a'; ctx.fillRect(x, GY - 190, 8, 190);
    ctx.fillStyle = '#ffd166'; ctx.beginPath(); ctx.arc(x + 4, GY - 194, 9, 0, 7); ctx.fill();
    const w = Math.sin(run.t * 0.12) * 5;
    for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) {
      ctx.fillStyle = (r + c) % 2 ? '#10324a' : '#fff';
      ctx.fillRect(x + 8 + c * 14, GY - 186 + r * 14 + Math.sin(c * 0.8 + run.t * 0.12) * 2, 14, 14);
    }
    ctx.fillStyle = '#10324a'; ctx.font = 'bold 20px Fredoka, Arial'; ctx.textAlign = 'center'; ctx.fillText('🏆 FINISH', x + 40, GY + 36 + w * 0);
  }
  function drawCoins(L, cam) {
    L.coins.forEach(c => {
      if (c.got || c.x < cam - 30 || c.x > cam + W + 30) return;
      const sw = Math.abs(Math.cos(run.t * 0.08 + c.x * 0.02));
      const bob = Math.sin(run.t * 0.06 + c.x * 0.05) * 3;
      if (c.bag) {
        ctx.fillStyle = '#c98f2a'; ctx.beginPath(); ctx.ellipse(c.x, c.y + bob + 4, 13, 12, 0, 0, 7); ctx.fill();
        ctx.fillStyle = '#e0a84a'; ctx.beginPath(); ctx.moveTo(c.x - 6, c.y + bob - 6); ctx.lineTo(c.x + 6, c.y + bob - 6); ctx.lineTo(c.x + 9, c.y + bob - 14); ctx.lineTo(c.x - 9, c.y + bob - 14); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#5a3a08'; ctx.font = 'bold 14px Fredoka, Arial'; ctx.textAlign = 'center'; ctx.fillText('$', c.x, c.y + bob + 9);
      } else {
        ctx.fillStyle = '#ffb703'; ctx.beginPath(); ctx.ellipse(c.x, c.y + bob, 12 * Math.max(0.2, sw), 12, 0, 0, 7); ctx.fill();
        ctx.fillStyle = '#ffe27a'; ctx.beginPath(); ctx.ellipse(c.x, c.y + bob, 8 * Math.max(0.15, sw), 8, 0, 0, 7); ctx.fill();
        if (sw > 0.5) { ctx.fillStyle = '#b87900'; ctx.font = 'bold 11px Fredoka, Arial'; ctx.textAlign = 'center'; ctx.fillText('$', c.x, c.y + bob + 4); }
      }
    });
  }
  function drawObs(L) {
    L.obs.forEach(o => {
      if (o.x < run.cam - 80 || o.x > run.cam + W + 40) return;
      if (o.t === 'bill') {
        ctx.fillStyle = '#fff'; rrect(ctx, o.x, o.y, o.w, o.h, 4); ctx.fill();
        ctx.strokeStyle = '#ef476f'; ctx.lineWidth = 3; rrect(ctx, o.x, o.y, o.w, o.h, 4); ctx.stroke();
        ctx.fillStyle = '#ef476f'; ctx.fillRect(o.x + 6, o.y + 8, o.w - 12, 4); ctx.fillRect(o.x + 6, o.y + 16, o.w - 18, 3);
        ctx.font = 'bold 8px Fredoka, Arial'; ctx.textAlign = 'center'; ctx.fillText(o.label, o.x + o.w / 2, o.y + 34);
      } else if (o.t === 'debt') {
        ctx.fillStyle = '#3a0d1a'; rrect(ctx, o.x, o.y, o.w, o.h, 6); ctx.fill();
        ctx.fillStyle = '#ef476f'; ctx.fillRect(o.x, o.y + 12, o.w, 8);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 10px Fredoka, Arial'; ctx.textAlign = 'center'; ctx.fillText(o.label, o.x + o.w / 2, o.y + 40);
        ctx.fillStyle = '#ffd166'; ctx.beginPath(); ctx.arc(o.x + o.w / 2, o.y + 4, 3, 0, 7); ctx.fill();
      } else {
        ctx.fillStyle = '#8d99ae';
        const n = 4, sw = o.w / n;
        for (let k = 0; k < n; k++) { ctx.beginPath(); ctx.moveTo(o.x + k * sw, GY); ctx.lineTo(o.x + k * sw + sw / 2, o.y); ctx.lineTo(o.x + (k + 1) * sw, GY); ctx.closePath(); ctx.fill(); }
        ctx.fillStyle = '#ef476f'; ctx.font = 'bold 9px Fredoka, Arial'; ctx.textAlign = 'center'; ctx.fillText('↑ HARGA', o.x + o.w / 2, o.y - 5);
      }
    });
  }
  function drawFx() {
    run.parts.forEach(q => { ctx.globalAlpha = Math.max(0, q.life / q.max); ctx.fillStyle = q.color; ctx.beginPath(); ctx.arc(q.x, q.y, q.size, 0, 7); ctx.fill(); });
    ctx.globalAlpha = 1;
    run.floats.forEach(f => {
      ctx.globalAlpha = Math.min(1, f.life / 25); ctx.fillStyle = f.color; ctx.font = 'bold 22px Fredoka, Arial'; ctx.textAlign = 'center';
      ctx.strokeStyle = 'rgba(16,50,74,.7)'; ctx.lineWidth = 4; ctx.strokeText(f.text, f.x, f.y); ctx.fillText(f.text, f.x, f.y);
    });
    ctx.globalAlpha = 1;
  }

  /* ---------- Loop ---------- */
  function loop(ts) {
    if (!active) return;
    raf = requestAnimationFrame(loop);
    const dt = Math.min(100, ts - lastTs); lastTs = ts;
    if (!paused) {
      acc += dt;
      while (acc >= 1000 / 60) { update(); acc -= 1000 / 60; if (!active) return; }
      quizTick(performance.now());
    }
    render();
  }

  function setPause(v) {
    if (!run || run.state !== 'play') return;
    paused = v;
    $('#pauseMenu').classList.toggle('hidden', !v);
    if (v) { keys.left = keys.right = keys.jump = false; Sound.duck(true); } else { Sound.duck(false); lastTs = performance.now(); }
  }

  /* ---------- Public API ---------- */
  function init() {
    cv = $('#gameCanvas'); ctx = cv.getContext('2d');
    const s = Math.min(2, window.devicePixelRatio || 1);
    cv.width = W * s; cv.height = H * s; ctx.setTransform(s, 0, 0, s, 0, 0);
    buildScenery(); bindTouch();
    window.addEventListener('keydown', onKey(true));
    window.addEventListener('keyup', onKey(false));
    window.addEventListener('blur', () => { keys.left = keys.right = keys.jump = false; if (active && run && run.state === 'play') setPause(true); });
    $('#btnPause').onclick = () => { Sound.click(); setPause(true); };
    $('#btnResume').onclick = () => { Sound.click(); setPause(false); };
    $('#btnQuit').onclick = () => { Sound.click(); stop(); cfg.onQuit && cfg.onQuit(); };
  }
  function start(c) {
    cfg = c; run = newRun(); paused = false; quiz = null; active = true; jumpQueued = false;
    $('#pauseMenu').classList.add('hidden'); $('#quiz').classList.add('hidden'); $('#banner').className = 'banner';
    hud(); acc = 0; lastTs = performance.now();
    cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
  }
  function stop() { active = false; cancelAnimationFrame(raf); quiz = null; $('#quiz').classList.add('hidden'); Sound.duck(false); }

  return { init, start, stop, N_QUIZ };
})();
