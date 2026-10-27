/* ============================================================
   AUDIO: backsound & SFX dibuat 100% dengan Web Audio API
   (tanpa file mp3, jadi ringan dan aman untuk GitHub Pages)
   ============================================================ */
const Sound = (() => {
  let ac = null, master, bgmG, sfxG, noiseBuf, timer = null;
  let muted = false, playing = false, step = 0, nextT = 0;
  const listeners = [];
  try { muted = JSON.parse(localStorage.getItem('eq_muted') || 'false'); } catch (e) {}

  const mtof = n => 440 * Math.pow(2, (n - 69) / 12);

  function ensure() {
    if (!ac) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return false;
      ac = new C();
      master = ac.createGain(); master.gain.value = muted ? 0 : 1; master.connect(ac.destination);
      bgmG = ac.createGain(); bgmG.gain.value = 0.55; bgmG.connect(master);
      sfxG = ac.createGain(); sfxG.gain.value = 0.9; sfxG.connect(master);
      noiseBuf = ac.createBuffer(1, ac.sampleRate * 0.2, ac.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ac.state === 'suspended') ac.resume();
    return true;
  }

  function tone(f, t0, dur, type = 'sine', vol = 0.2, to = null, dest = null) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t0);
    if (to) o.frequency.exponentialRampToValueAtTime(to, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(dest || sfxG);
    o.start(t0); o.stop(t0 + dur + 0.05);
  }
  function hat(t0, vol, dest) {
    const s = ac.createBufferSource(), g = ac.createGain(), f = ac.createBiquadFilter();
    s.buffer = noiseBuf; f.type = 'highpass'; f.frequency.value = 7000;
    g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.05);
    s.connect(f); f.connect(g); g.connect(dest); s.start(t0); s.stop(t0 + 0.06);
  }

  /* --------- BGM: loop santai C – Am – F – G --------- */
  const CH = [
    { b: 48, a: [60, 64, 67, 72] },
    { b: 45, a: [57, 60, 64, 69] },
    { b: 41, a: [57, 60, 65, 69] },
    { b: 43, a: [59, 62, 67, 71] },
  ];
  const ARP = [0, 1, 2, 3, 2, 1, 2, 1];
  const MEL = [
    [76, null, null, 79, null, 76, null, null],
    [76, null, 72, null, null, 69, null, null],
    [77, null, null, 76, null, 72, null, null],
    [74, null, 79, null, 76, null, 74, null],
  ];
  const EIGHTH = 60 / 96 / 2;

  function sched(s, t) {
    const bar = (s >> 3) % 4, i = s & 7, c = CH[bar];
    tone(mtof(c.a[ARP[i]]), t, EIGHTH * 1.9, 'triangle', 0.085, null, bgmG);
    if (i === 0) tone(mtof(c.b), t, EIGHTH * 3.6, 'sine', 0.17, null, bgmG);
    if (i === 4) tone(mtof(c.b + 7), t, EIGHTH * 2.4, 'sine', 0.10, null, bgmG);
    const m = MEL[bar][i];
    if (m) tone(mtof(m), t, EIGHTH * 2.6, 'sine', 0.07, null, bgmG);
    if (i % 2 === 1) hat(t, 0.025, bgmG);
  }
  function pump() {
    if (!ac) return;
    while (nextT < ac.currentTime + 0.4) { sched(step, nextT); nextT += EIGHTH; step++; }
  }
  function startBgm() {
    if (!ensure() || playing) return;
    playing = true; step = 0; nextT = ac.currentTime + 0.1;
    timer = setInterval(pump, 120); pump();
  }
  function stopBgm() { playing = false; clearInterval(timer); timer = null; }
  function duck(on) { if (ac) bgmG.gain.setTargetAtTime(on ? 0.25 : 0.55, ac.currentTime, 0.15); }

  /* --------- SFX --------- */
  const sfx = {
    click() { if (!ensure()) return; const t = ac.currentTime; tone(660, t, 0.07, 'triangle', 0.14, 880); },
    coin() { if (!ensure()) return; const t = ac.currentTime; tone(988, t, 0.08, 'square', 0.08); tone(1319, t + 0.07, 0.16, 'square', 0.08); },
    jump() { if (!ensure()) return; const t = ac.currentTime; tone(280, t, 0.18, 'sine', 0.2, 620); },
    land() { if (!ensure()) return; const t = ac.currentTime; tone(120, t, 0.08, 'sine', 0.12, 70); },
    correct() { if (!ensure()) return; const t = ac.currentTime; [523, 659, 784, 1047].forEach((f, k) => tone(f, t + k * 0.08, 0.2, 'triangle', 0.2)); },
    wrong() { if (!ensure()) return; const t = ac.currentTime; tone(220, t, 0.28, 'sawtooth', 0.13, 110); tone(165, t + 0.12, 0.3, 'sawtooth', 0.12, 80); },
    hit() { if (!ensure()) return; const t = ac.currentTime; tone(200, t, 0.2, 'square', 0.14, 60); },
    tick() { if (!ensure()) return; const t = ac.currentTime; tone(1000, t, 0.05, 'square', 0.07); },
    gate() { if (!ensure()) return; const t = ac.currentTime; tone(440, t, 0.1, 'triangle', 0.16); tone(660, t + 0.09, 0.18, 'triangle', 0.16); },
    buy() { if (!ensure()) return; const t = ac.currentTime; [784, 988, 1175, 1568].forEach((f, k) => tone(f, t + k * 0.07, 0.18, 'square', 0.08)); },
    gameover() { if (!ensure()) return; const t = ac.currentTime; [392, 330, 262, 196].forEach((f, k) => tone(f, t + k * 0.22, 0.32, 'triangle', 0.2)); },
    win() { if (!ensure()) return; const t = ac.currentTime; [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, k) => tone(f, t + k * 0.12, 0.22, 'triangle', 0.2)); },
  };

  function setMuted(m) {
    muted = !!m;
    try { localStorage.setItem('eq_muted', JSON.stringify(muted)); } catch (e) {}
    if (ac) master.gain.setTargetAtTime(muted ? 0 : 1, ac.currentTime, 0.05);
    listeners.forEach(fn => fn(muted));
  }
  document.addEventListener('visibilitychange', () => {
    if (!ac) return;
    if (document.hidden) ac.suspend(); else ac.resume();
  });

  return {
    ...sfx,
    unlock: ensure, startBgm, stopBgm, duck,
    isMuted: () => muted,
    toggle: () => setMuted(!muted),
    onMute: fn => listeners.push(fn),
  };
})();
