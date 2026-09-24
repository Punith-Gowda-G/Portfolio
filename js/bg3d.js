(function () {
  /* =========================================================
     3D Neural Network + Floating Geometry Background
     Optimized for an AI/ML portfolio — dark teal/amber palette
     Pure Canvas 2D with 3D perspective projection (no libs)
     ========================================================= */
  const canvas = document.getElementById('bg3d-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  let W, H;

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width  = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  /* ---- Colour helpers ---- */
  function hexToRgb(hex) {
    const h = (hex || '#56E0C6').trim().replace('#', '');
    const big = parseInt(h, 16);
    return [(big >> 16) & 255, (big >> 8) & 255, big & 255];
  }
  function getVar(name, fallback) {
    return (getComputedStyle(document.documentElement).getPropertyValue(name) || fallback).trim();
  }

  /* ---- Mouse / gyro state ---- */
  const mouse = { x: 0, y: 0, nx: 0, ny: 0 }; // nx,ny: -1..1
  let mouseActive = false;
  window.addEventListener('mousemove', e => {
    mouse.x  = e.clientX;
    mouse.y  = e.clientY;
    mouse.nx = (e.clientX / W) * 2 - 1;
    mouse.ny = (e.clientY / H) * 2 - 1;
    mouseActive = true;
  });
  window.addEventListener('mouseleave', () => { mouseActive = false; });

  /* ---- 3-D perspective camera ---- */
  const CAM = { fov: 600, rotX: 0, rotY: 0, z: 0 };

  function project(x3, y3, z3) {
    // apply gentle rotation driven by mouse parallax
    const rx = CAM.rotX, ry = CAM.rotY;
    const cosX = Math.cos(rx), sinX = Math.sin(rx);
    const cosY = Math.cos(ry), sinY = Math.sin(ry);
    // rotate Y then X
    let nx = x3 * cosY - z3 * sinY;
    let nz = x3 * sinY + z3 * cosY;
    let ny = y3 * cosX - nz * sinX;
    nz     = y3 * sinX + nz * cosX;
    // perspective divide
    const scale = CAM.fov / (CAM.fov + nz + 400);
    return { sx: nx * scale + W / 2, sy: ny * scale + H / 2, scale, depth: nz };
  }

  /* ---- Neural network nodes ---- */
  const NODE_COUNT = Math.round(Math.min(60, Math.max(28, W / 30)));
  const SPREAD = Math.min(W, H) * 0.52;

  class Node {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = (Math.random() - 0.5) * SPREAD * 2;
      this.y = (Math.random() - 0.5) * SPREAD * 1.4;
      this.z = (Math.random() - 0.5) * SPREAD * 1.2;
      this.vx = (Math.random() - 0.5) * 0.18;
      this.vy = (Math.random() - 0.5) * 0.14;
      this.vz = (Math.random() - 0.5) * 0.12;
      this.baseR = 1.2 + Math.random() * 2.8;
      this.phase = Math.random() * Math.PI * 2;
      this.speed = 0.6 + Math.random() * 1.4;
      this.isHub = Math.random() < 0.12; // ~12% are "hub" nodes (bigger, brighter)
    }
    update(t) {
      this.x += this.vx;
      this.y += this.vy;
      this.z += this.vz;
      const bound = SPREAD * 1.1;
      if (Math.abs(this.x) > bound) this.vx *= -1;
      if (Math.abs(this.y) > bound) this.vy *= -1;
      if (Math.abs(this.z) > bound) this.vz *= -1;
    }
  }

  const nodes = Array.from({ length: NODE_COUNT }, () => new Node());

  /* Build a sparse connection list (each node connects to ~3-5 closest) */
  const CONNECTIONS = [];
  function buildConnections() {
    CONNECTIONS.length = 0;
    for (let i = 0; i < nodes.length; i++) {
      const dists = [];
      for (let j = 0; j < nodes.length; j++) {
        if (i === j) continue;
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dz = nodes[i].z - nodes[j].z;
        dists.push({ j, d2: dx*dx + dy*dy + dz*dz });
      }
      dists.sort((a, b) => a.d2 - b.d2);
      const k = nodes[i].isHub ? 6 : 3;
      for (let c = 0; c < Math.min(k, dists.length); c++) {
        const j = dists[c].j;
        if (!CONNECTIONS.find(e => (e[0]===i&&e[1]===j)||(e[0]===j&&e[1]===i))) {
          CONNECTIONS.push([i, j]);
        }
      }
    }
  }
  buildConnections();

  /* ---- Floating geometry particles (hexagons) ---- */
  const GEO_COUNT = Math.round(Math.min(14, Math.max(6, W / 180)));
  class GeoParticle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = (Math.random() - 0.5) * SPREAD * 1.8;
      this.y = (Math.random() - 0.5) * SPREAD * 1.4;
      this.z = (Math.random() - 0.5) * SPREAD * 1.0;
      this.rotSpeed = (Math.random() - 0.5) * 0.008;
      this.angle = Math.random() * Math.PI * 2;
      this.sides = [3, 4, 6][Math.floor(Math.random() * 3)];
      this.size = 8 + Math.random() * 18;
      this.phase = Math.random() * Math.PI * 2;
      this.vx = (Math.random() - 0.5) * 0.08;
      this.vy = (Math.random() - 0.5) * 0.06;
      this.vz = (Math.random() - 0.5) * 0.06;
    }
    update(t) {
      this.angle += this.rotSpeed;
      this.x += this.vx;
      this.y += this.vy;
      this.z += this.vz;
      const b = SPREAD * 1.0;
      if (Math.abs(this.x) > b) this.vx *= -1;
      if (Math.abs(this.y) > b) this.vy *= -1;
      if (Math.abs(this.z) > b) this.vz *= -1;
    }
  }
  const geoParticles = Array.from({ length: GEO_COUNT }, () => new GeoParticle());

  /* ---- Signal pulse along connections ---- */
  const PULSES = [];
  const MAX_PULSES = 12;
  function spawnPulse() {
    if (PULSES.length >= MAX_PULSES || CONNECTIONS.length === 0) return;
    const conn = CONNECTIONS[Math.floor(Math.random() * CONNECTIONS.length)];
    PULSES.push({ conn, t: 0, speed: 0.004 + Math.random() * 0.006 });
  }
  setInterval(spawnPulse, 600);

  /* ---- Colour theming (refreshed each frame for theme toggle support) ---- */
  let colours = {};
  function refreshColours() {
    const teal  = hexToRgb(getVar('--teal',  '#56E0C6'));
    const amber = hexToRgb(getVar('--amber', '#F0A94E'));
    colours = {
      teal, amber,
      tealStr:  `rgb(${teal.join(',')})`,
      amberStr: `rgb(${amber.join(',')})`,
      bgA: getVar('--ink',   '#0A0E13'),
      bgB: getVar('--panel', '#10161E'),
    };
  }

  /* ---- Main draw loop ---- */
  let lastColourRefresh = 0;
  let frame = 0;

  function draw(ts) {
    ts = ts || 0;

    // refresh colours every 2 s (handles theme toggle)
    if (ts - lastColourRefresh > 2000) { refreshColours(); lastColourRefresh = ts; }

    /* smooth camera rotation toward mouse */
    const targetRX = mouseActive ? mouse.ny * 0.12 : 0;
    const targetRY = mouseActive ? mouse.nx * 0.16 : 0;
    CAM.rotX += (targetRX - CAM.rotX) * 0.04;
    CAM.rotY += (targetRY - CAM.rotY) * 0.04;
    // add slow auto-rotation when mouse idle
    if (!mouseActive) {
      CAM.rotY += 0.0008;
      CAM.rotX  = Math.sin(ts * 0.00015) * 0.05;
    }

    /* background */
    ctx.clearRect(0, 0, W, H);
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, colours.bgA || '#0A0E13');
    grad.addColorStop(1, colours.bgB || '#10161E');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    /* subtle vignette */
    const vig = ctx.createRadialGradient(W/2, H/2, H*0.1, W/2, H/2, H*0.85);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, 'rgba(0,0,0,0.38)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);

    /* update all entities */
    for (const n of nodes)     n.update(ts);
    for (const g of geoParticles) g.update(ts);

    /* project all nodes */
    const projected = nodes.map(n => {
      const p = project(n.x, n.y, n.z);
      p.node = n;
      return p;
    });

    /* ---- Draw connections ---- */
    const [tr, tg, tb] = colours.teal || [86, 224, 198];
    const [ar, ag, ab] = colours.amber || [240, 169, 78];

    for (const [i, j] of CONNECTIONS) {
      const a = projected[i], b = projected[j];
      if (!a || !b) continue;
      const midScale = (a.scale + b.scale) * 0.5;
      const alpha = Math.max(0, Math.min(0.18, midScale * 0.22));
      ctx.beginPath();
      ctx.moveTo(a.sx, a.sy);
      ctx.lineTo(b.sx, b.sy);
      ctx.strokeStyle = `rgba(${tr},${tg},${tb},${alpha.toFixed(3)})`;
      ctx.lineWidth = midScale * 1.2;
      ctx.stroke();
    }

    /* ---- Draw signal pulses ---- */
    for (let k = PULSES.length - 1; k >= 0; k--) {
      const pulse = PULSES[k];
      pulse.t += pulse.speed;
      if (pulse.t >= 1) { PULSES.splice(k, 1); continue; }
      const [i, j] = pulse.conn;
      const a = projected[i], b = projected[j];
      if (!a || !b) continue;
      const px = a.sx + (b.sx - a.sx) * pulse.t;
      const py = a.sy + (b.sy - a.sy) * pulse.t;
      const ps = a.scale + (b.scale - a.scale) * pulse.t;
      const glow = ctx.createRadialGradient(px, py, 0, px, py, 8 * ps);
      const fade = Math.sin(pulse.t * Math.PI);
      glow.addColorStop(0,   `rgba(${ar},${ag},${ab},${(fade * 0.9).toFixed(2)})`);
      glow.addColorStop(0.5, `rgba(${tr},${tg},${tb},${(fade * 0.3).toFixed(2)})`);
      glow.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(px, py, 8 * ps, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
    }

    /* ---- Draw nodes ---- */
    const sortedProj = [...projected].sort((a, b) => a.depth - b.depth);
    for (const p of sortedProj) {
      const n = p.node;
      const s = p.scale;
      const r = n.baseR * s * (n.isHub ? 2.6 : 1.4);
      const pulse = 1 + Math.sin(ts * 0.001 * n.speed + n.phase) * 0.25;
      const rp = r * pulse;

      // glow halo
      const haloR = rp * (n.isHub ? 4.5 : 3.2);
      const alpha = Math.max(0, Math.min(0.55, s * 0.65));
      const haloAlpha = alpha * 0.3;
      const halo = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, haloR);
      if (n.isHub) {
        halo.addColorStop(0, `rgba(${ar},${ag},${ab},${(haloAlpha * 1.8).toFixed(3)})`);
        halo.addColorStop(0.4, `rgba(${ar},${ag},${ab},${(haloAlpha * 0.5).toFixed(3)})`);
      } else {
        halo.addColorStop(0, `rgba(${tr},${tg},${tb},${(haloAlpha * 1.4).toFixed(3)})`);
        halo.addColorStop(0.4, `rgba(${tr},${tg},${tb},${(haloAlpha * 0.3).toFixed(3)})`);
      }
      halo.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, haloR, 0, Math.PI * 2);
      ctx.fillStyle = halo;
      ctx.fill();

      // node core
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, Math.max(0.4, rp), 0, Math.PI * 2);
      ctx.fillStyle = n.isHub ? `rgba(${ar},${ag},${ab},${alpha.toFixed(2)})` : `rgba(${tr},${tg},${tb},${(alpha*0.85).toFixed(2)})`;
      ctx.fill();
    }

    /* ---- Draw floating geometry ---- */
    for (const g of geoParticles) {
      const p = project(g.x, g.y, g.z);
      const s = p.scale;
      const alpha = Math.max(0, Math.min(0.12, s * 0.14));
      const size = g.size * s;
      ctx.save();
      ctx.translate(p.sx, p.sy);
      ctx.rotate(g.angle);
      ctx.beginPath();
      for (let v = 0; v < g.sides; v++) {
        const angle = (v / g.sides) * Math.PI * 2 - Math.PI / 2;
        const vx = Math.cos(angle) * size;
        const vy = Math.sin(angle) * size;
        v === 0 ? ctx.moveTo(vx, vy) : ctx.lineTo(vx, vy);
      }
      ctx.closePath();
      const useAmber = (g.sides === 3);
      ctx.strokeStyle = useAmber
        ? `rgba(${ar},${ag},${ab},${(alpha * 2).toFixed(3)})`
        : `rgba(${tr},${tg},${tb},${(alpha * 2).toFixed(3)})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }

    /* ---- Mouse attraction beam ---- */
    if (mouseActive) {
      for (const p of projected) {
        const dx = p.sx - mouse.x, dy = p.sy - mouse.y;
        const d2 = dx*dx + dy*dy;
        const maxD = Math.min(200, W * 0.18);
        if (d2 < maxD * maxD) {
          const dist = Math.sqrt(d2);
          const alpha = (1 - dist / maxD) * 0.3;
          ctx.beginPath();
          ctx.moveTo(p.sx, p.sy);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${tr},${tg},${tb},${alpha.toFixed(3)})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }
    }

    frame++;
    // rebuild connections every 180 frames to adapt to node drift
    if (frame % 180 === 0) buildConnections();

    requestAnimationFrame(draw);
  }

  /* start */
  refreshColours();
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    requestAnimationFrame(draw);
  } else {
    refreshColours();
    draw(0);
  }
})();
