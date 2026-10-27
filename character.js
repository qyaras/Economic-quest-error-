/* ============================================================
   KARAKTER: digambar dengan Canvas (tanpa file gambar).
   drawCharacter(ctx, x, y, {skin, t, moving, air, face, inv})
   (x, y) = titik tengah-bawah kaki karakter.
   ============================================================ */
function rrect(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}
function limb(c, x1, y1, x2, y2, w, col) {
  c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round';
  c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
}

function drawCharacter(c, x, y, o) {
  const sk = o.skin || 'basic', t = o.t || 0, air = !!o.air, mv = !!o.moving;
  const ph = mv && !air ? Math.sin(t * 0.3) : 0;
  const bob = air ? 0 : (mv ? -Math.abs(Math.sin(t * 0.3)) * 2.5 : Math.sin(t * 0.07) * 1.2);
  const SK = '#f6c9a0';
  c.save();
  c.translate(x, y);
  c.scale(o.face < 0 ? -1 : 1, 1);
  if (o.inv && Math.floor(t / 4) % 2) c.globalAlpha = 0.4;

  if (!air) { c.fillStyle = 'rgba(0,0,0,.18)'; c.beginPath(); c.ellipse(0, 0, 16, 4, 0, 0, 7); c.fill(); }

  /* ---------- palet per skin ---------- */
  const P = {
    basic: { top: '#ffffff', topShade: '#dfe8f0', sleeve: '#ffffff', pants: '#5b6b82', shoe: '#2b2d42' },
    exec:  { top: '#1d3557', topShade: '#16294a', sleeve: '#1d3557', pants: '#14213d', shoe: '#0b0d17' },
    hero:  { top: '#1b3a6b', topShade: '#122a50', sleeve: '#1b3a6b', pants: '#1b3a6b', shoe: '#e0a800' },
  }[sk];

  /* ---------- efek khusus hero (belakang) ---------- */
  if (sk === 'hero') {
    const g = c.createRadialGradient(0, -34, 8, 0, -34, 54);
    g.addColorStop(0, 'rgba(255,220,100,.55)'); g.addColorStop(1, 'rgba(255,220,100,0)');
    c.fillStyle = g; c.beginPath(); c.arc(0, -34, 54, 0, 7); c.fill();
    // jubah
    const wave = Math.sin(t * 0.18) * 4 + (mv ? 8 : 0) + (air ? 6 : 0);
    c.fillStyle = '#d90429';
    c.beginPath();
    c.moveTo(-8, -46 + bob);
    c.quadraticCurveTo(-26 - wave, -30, -34 - wave, -6 + (air ? -8 : 0));
    c.lineTo(-18 - wave * 0.4, -10 + Math.sin(t * 0.2) * 2);
    c.lineTo(-8, -22);
    c.closePath(); c.fill();
    c.fillStyle = '#9d0208';
    c.beginPath(); c.moveTo(-8, -46 + bob); c.quadraticCurveTo(-18, -30, -22 - wave * 0.6, -14); c.lineTo(-8, -22); c.closePath(); c.fill();
  }
  if (sk === 'basic') { // tas ransel
    c.fillStyle = '#ffb703'; rrect(c, -22, -44 + bob, 11, 22, 4); c.fill();
    c.fillStyle = '#fb8500'; rrect(c, -22, -36 + bob, 11, 6, 2); c.fill();
  }

  /* ---------- kaki ---------- */
  for (const s of [-1, 1]) {
    const fx = s * 5 + (air ? (s > 0 ? 8 : -6) : s * ph * 11);
    const fy = air ? (s > 0 ? -10 : -4) : -2 - Math.max(0, -s * ph) * 5;
    limb(c, s * 5, -22 + bob * 0.5, fx, fy, 9, P.pants);
    c.fillStyle = P.shoe; c.beginPath(); c.ellipse(fx + 2, fy + 1, 7.5, 4, 0, 0, 7); c.fill();
  }

  /* ---------- lengan belakang ---------- */
  const hands = [];
  for (const s of [-1, 1]) {
    const hx = s * 18 + (air ? s * 2 : 0);
    const hy = air ? -58 : -26 + (-s * ph) * 5;
    hands.push([hx, hy]);
    if (s < 0) {
      limb(c, s * 14, -43 + bob, hx, hy, 7.5, sk === 'hero' ? '#e0a800' : P.sleeve);
      c.fillStyle = SK; c.beginPath(); c.arc(hx, hy, 4.2, 0, 7); c.fill();
    }
  }

  /* ---------- badan ---------- */
  c.fillStyle = P.top; rrect(c, -13, -46 + bob, 26, 27, 7); c.fill();
  c.fillStyle = P.topShade; rrect(c, -13, -30 + bob, 26, 11, 6); c.fill();

  if (sk === 'basic') {
    c.fillStyle = '#ef476f'; // dasi kecil
    c.beginPath(); c.moveTo(-3, -45 + bob); c.lineTo(3, -45 + bob); c.lineTo(2, -32 + bob); c.lineTo(0, -29 + bob); c.lineTo(-2, -32 + bob); c.closePath(); c.fill();
    c.fillStyle = '#1b9aaa'; c.fillRect(-13, -22 + bob, 26, 3); // ikat pinggang
  }
  if (sk === 'exec') {
    c.fillStyle = '#fff'; c.beginPath(); c.moveTo(-5, -46 + bob); c.lineTo(5, -46 + bob); c.lineTo(0, -29 + bob); c.closePath(); c.fill();
    c.fillStyle = '#e63946'; c.beginPath(); c.moveTo(-2, -44 + bob); c.lineTo(2, -44 + bob); c.lineTo(3, -34 + bob); c.lineTo(0, -29 + bob); c.lineTo(-3, -34 + bob); c.closePath(); c.fill();
    c.strokeStyle = '#0d1b33'; c.lineWidth = 1.5;
    c.beginPath(); c.moveTo(-5, -46 + bob); c.lineTo(0, -29 + bob); c.lineTo(5, -46 + bob); c.stroke();
    c.fillStyle = '#ffd166'; c.beginPath(); c.arc(0, -24 + bob, 1.5, 0, 7); c.fill();
  }
  if (sk === 'hero') {
    const g = c.createLinearGradient(-14, -46, 14, -24);
    g.addColorStop(0, '#fff3b0'); g.addColorStop(0.5, '#ffd166'); g.addColorStop(1, '#c98f00');
    c.fillStyle = g; rrect(c, -14, -47 + bob, 28, 22, 7); c.fill();
    c.strokeStyle = '#a06f00'; c.lineWidth = 1.5; rrect(c, -14, -47 + bob, 28, 22, 7); c.stroke();
    c.fillStyle = '#7a4f00'; c.font = 'bold 14px Fredoka, Arial'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText('$', 0, -36 + bob);
    c.fillStyle = '#e0a800'; c.fillRect(-13, -24 + bob, 26, 4);
    c.fillStyle = '#ffd166'; for (const s of [-1, 1]) { c.beginPath(); c.arc(s * 15, -44 + bob, 7, 0, 7); c.fill(); c.strokeStyle = '#a06f00'; c.stroke(); }
  }

  /* ---------- lengan depan ---------- */
  {
    const [hx, hy] = hands[1];
    limb(c, 14, -43 + bob, hx, hy, 7.5, sk === 'hero' ? '#e0a800' : P.sleeve);
    c.fillStyle = SK; c.beginPath(); c.arc(hx, hy, 4.2, 0, 7); c.fill();
    if (sk === 'exec') { // koper
      c.fillStyle = '#7b4a2b'; rrect(c, hx - 2, hy + 2, 20, 15, 3); c.fill();
      c.strokeStyle = '#4a2b17'; c.lineWidth = 2; c.beginPath(); c.moveTo(hx + 4, hy + 2); c.lineTo(hx + 4, hy - 2); c.lineTo(hx + 12, hy - 2); c.lineTo(hx + 12, hy + 2); c.stroke();
      c.fillStyle = '#ffd166'; c.fillRect(hx + 6, hy + 8, 4, 3);
    }
  }

  /* ---------- kepala ---------- */
  const hy0 = -58 + bob;
  c.fillStyle = SK; c.beginPath(); c.arc(1, hy0, 12, 0, 7); c.fill();
  if (sk === 'hero') {
    // helm emas
    const g = c.createLinearGradient(-12, hy0 - 12, 12, hy0);
    g.addColorStop(0, '#fff3b0'); g.addColorStop(1, '#d19a00');
    c.fillStyle = g; c.beginPath(); c.arc(1, hy0 - 1, 13.5, Math.PI * 0.98, Math.PI * 2.02); c.lineTo(14, hy0 + 2); c.lineTo(-12, hy0 + 2); c.closePath(); c.fill();
    c.fillStyle = '#d90429'; // jambul
    c.beginPath(); c.moveTo(-5, hy0 - 12); c.quadraticCurveTo(-8 - Math.sin(t * 0.2) * 2, hy0 - 22, 2, hy0 - 24); c.quadraticCurveTo(-1, hy0 - 18, 4, hy0 - 12); c.closePath(); c.fill();
  } else {
    c.fillStyle = '#3b2a20';
    c.beginPath(); c.arc(1, hy0 - 1, 12.5, Math.PI * 0.92, Math.PI * 2.08); c.lineTo(13, hy0 - 4); c.quadraticCurveTo(5, hy0 - 8, -8, hy0 - 3); c.closePath(); c.fill();
  }
  // wajah
  const blink = (Math.floor(t / 8) % 22) === 0;
  c.fillStyle = '#23201f';
  if (blink) { c.fillRect(2, hy0 + 1, 4, 1.6); c.fillRect(8, hy0 + 1, 4, 1.6); }
  else { c.beginPath(); c.ellipse(4, hy0 + 1, 1.8, 2.4, 0, 0, 7); c.ellipse(10, hy0 + 1, 1.8, 2.4, 0, 0, 7); c.fill(); }
  c.strokeStyle = '#a5532f'; c.lineWidth = 1.6; c.lineCap = 'round';
  c.beginPath(); c.arc(7, hy0 + 4, 3.2, 0.15, Math.PI - 0.15); c.stroke();
  c.fillStyle = 'rgba(255,120,120,.35)'; c.beginPath(); c.arc(11, hy0 + 5, 2.4, 0, 7); c.fill();

  /* ---------- percikan hero (depan) ---------- */
  if (sk === 'hero') {
    for (let i = 0; i < 4; i++) {
      const a = t * 0.06 + i * 1.57, r = 30 + Math.sin(t * 0.1 + i) * 5;
      const sx = Math.cos(a) * r, sy = -36 + Math.sin(a) * r * 0.9, s = 2 + (i % 2);
      c.fillStyle = 'rgba(255,240,150,' + (0.5 + 0.5 * Math.sin(t * 0.2 + i)) + ')';
      c.beginPath(); c.moveTo(sx, sy - s * 2); c.lineTo(sx + s, sy); c.lineTo(sx, sy + s * 2); c.lineTo(sx - s, sy); c.closePath(); c.fill();
    }
  }
  c.restore();
}
