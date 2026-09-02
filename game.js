'use strict';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const W = 800;
const H = 600;

// ── Input ─────────────────────────────────────────────────────────────────────
const keys = {};
const justPressed = {};

window.addEventListener('keydown', e => {
  justPressed[e.code] = !keys[e.code];
  keys[e.code] = true;
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code))
    e.preventDefault();
});
window.addEventListener('keyup', e => { keys[e.code] = false; });

function pressed(code) {
  const val = justPressed[code];
  justPressed[code] = false;
  return val;
}

// ── Utils ─────────────────────────────────────────────────────────────────────
const wrap  = (v, max) => ((v % max) + max) % max;
const dist  = (a, b)   => Math.hypot(a.x - b.x, a.y - b.y);
const rand  = (min, max) => min + Math.random() * (max - min);
const randInt = (min, max) => Math.floor(rand(min, max + 1));

// ── Bullet ────────────────────────────────────────────────────────────────────
class Bullet {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    const SPEED = 520;
    this.vx = Math.cos(angle) * SPEED;
    this.vy = Math.sin(angle) * SPEED;
    this.ttl  = 1.1;
    this.radius = 2;
    this.dead = false;
  }

  update(dt) {
    this.x = wrap(this.x + this.vx * dt, W);
    this.y = wrap(this.y + this.vy * dt, H);
    this.ttl -= dt;
    if (this.ttl <= 0) this.dead = true;
  }

  draw() {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ── Asteroid ──────────────────────────────────────────────────────────────────
const RADII  = [0, 16, 30, 50];   // por tamaño 1, 2, 3
const SPEEDS = [0, 85, 55, 32];   // velocidad base por tamaño
const POINTS = [0, 100, 50, 20];  // puntos por tamaño

class Asteroid {
  constructor(x, y, size = 3, star = false) {
    this.x    = x;
    this.y    = y;
    this.size = size;
    this.radius = RADII[size];
    this.dead = false;

    const angle = rand(0, Math.PI * 2);
    let speed = SPEEDS[size] + rand(-15, 15);
    if (star) speed *= 2.2;   // estrella fugaz: mucho más rápida
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.rotSpeed = rand(-1.2, 1.2);
    this.rot = rand(0, Math.PI * 2);

    // Estrella fugaz: desaparece sola
    this.isStar     = !!star;
    this.ttl        = this.isStar ? rand(9, 12) : Infinity;
    this.blinkTimer = 0;

    // Polígono irregular
    const n = randInt(8, 13);
    this.verts = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const r = this.radius * rand(0.6, 1.0);
      this.verts.push([Math.cos(a) * r, Math.sin(a) * r]);
    }
  }

  update(dt) {
    this.x   = wrap(this.x + this.vx * dt, W);
    this.y   = wrap(this.y + this.vy * dt, H);
    this.rot += this.rotSpeed * dt;
    if (this.isStar) {
      this.ttl -= dt;
      this.blinkTimer += dt;
      if (this.ttl <= 0) this.dead = true;
    }
  }

  split() {
    if (this.isStar || this.size <= 1) return [];
    return [
      new Asteroid(this.x, this.y, this.size - 1),
      new Asteroid(this.x, this.y, this.size - 1),
    ];
  }

  draw() {
    // Parpadeo acelerado al agotarse
    if (this.isStar && this.ttl < 2 &&
        Math.floor(this.blinkTimer * 12) % 2 !== 0) return;

    ctx.save();
    ctx.translate(this.x, this.y);

    // Estela en dirección opuesta al movimiento (espacio mundo)
    if (this.isStar) {
      ctx.beginPath();
      ctx.moveTo(-this.vx * 0.10, -this.vy * 0.10);
      ctx.lineTo(-this.vx * 0.28, -this.vy * 0.28);
      ctx.strokeStyle = 'rgba(255, 230, 0, 0.6)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.rotate(this.rot);

    ctx.strokeStyle = this.isStar ? '#ffe600' : '#fff';
    ctx.lineWidth   = 1.5;
    ctx.lineJoin    = 'round';
    ctx.beginPath();
    ctx.moveTo(this.verts[0][0], this.verts[0][1]);
    for (let i = 1; i < this.verts.length; i++)
      ctx.lineTo(this.verts[i][0], this.verts[i][1]);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
}

// ── Skins ─────────────────────────────────────────────────────────────────────
const SKINS = [
  { name: 'CLÁSICA',  color: '#fff',    verts: [[20, 0], [-12, -9], [-7, 0], [-12, 9]] },
  { name: 'DARDO',    color: '#4df3ff', verts: [[20, 0], [-2, -7], [-10, -3], [-4, 0], [-10, 3], [-2, 7]] },
  { name: 'ÁGUILA',   color: '#ff9d00', verts: [[20, 0], [-4, -11], [-16, -4], [-8, 0], [-16, 4], [-4, 11]] },
  { name: 'ÍCARO',    color: '#39ff8e', verts: [[22, 0], [0, -10], [-14, -2], [-6, 0], [-14, 2], [0, 10]] },
  { name: 'MARTILLO', color: '#ff5cff', verts: [[18, 0], [6, -6], [0, -12], [-8, -6], [-4, 0], [-8, 6], [0, 12], [6, 6]] },
];

// ── Ship ──────────────────────────────────────────────────────────────────────
class Ship {
  constructor() { this.reset(); }

  reset() {
    this.x      = W / 2;
    this.y      = H / 2;
    this.angle  = -Math.PI / 2;
    this.vx     = 0;
    this.vy     = 0;
    this.radius = 12;
    this.skin   = currentSkin;
    this.thrusting     = false;
    this.invincible    = 3;
    this.shootCooldown = 0;
    this.speedBoost    = 0;
    this.dead          = false;
  }

  update(dt) {
    if (this.dead) return;
    if (this.invincible    > 0) this.invincible    -= dt;
    if (this.shootCooldown > 0) this.shootCooldown -= dt;
    if (this.speedBoost    > 0) this.speedBoost    -= dt;

    const ROT   = 3.5;   // rad/s
    const THRUST = 260 * (this.speedBoost > 0 ? 2 : 1);  // px/s²
    const DRAG   = 0.987;

    if (keys['ArrowLeft'])  this.angle -= ROT * dt;
    if (keys['ArrowRight']) this.angle += ROT * dt;

    this.thrusting = !!keys['ArrowUp'];
    if (this.thrusting) {
      this.vx += Math.cos(this.angle) * THRUST * dt;
      this.vy += Math.sin(this.angle) * THRUST * dt;
    }

    this.vx *= DRAG;
    this.vy *= DRAG;
    this.x = wrap(this.x + this.vx * dt, W);
    this.y = wrap(this.y + this.vy * dt, H);
  }

  tryShoot() {
    if (this.shootCooldown > 0 || this.dead) return [];
    this.shootCooldown = 0.2;
    const NOSE = 21;
    const ox = this.x + Math.cos(this.angle) * NOSE;
    const oy = this.y + Math.sin(this.angle) * NOSE;
    return [new Bullet(ox, oy, this.angle)];
  }

  draw() {
    if (this.dead) return;
    // Parpadeo durante invencibilidad de reaparición
    if (this.invincible > 0 && Math.floor(this.invincible * 8) % 2 === 0) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    const sk = SKINS[this.skin];
    ctx.strokeStyle = sk.color;
    ctx.lineWidth   = 1.5;
    ctx.lineJoin    = 'round';

    // Silueta definida por el skin activo
    ctx.beginPath();
    ctx.moveTo(sk.verts[0][0], sk.verts[0][1]);
    for (let i = 1; i < sk.verts.length; i++)
      ctx.lineTo(sk.verts[i][0], sk.verts[i][1]);
    ctx.closePath();
    ctx.stroke();

    // Llama del propulsor
    if (this.thrusting && Math.random() > 0.35) {
      ctx.beginPath();
      ctx.moveTo(-8, -4);
      ctx.lineTo(-8 - rand(6, 14), 0);
      ctx.lineTo(-8,  4);
      ctx.strokeStyle = this.speedBoost > 0 ? 'rgba(0, 255, 200, 0.9)' : 'rgba(255, 130, 0, 0.85)';
      ctx.stroke();
    }

    ctx.restore();
  }
}

// ── Partículas (explosión) ────────────────────────────────────────────────────
class Particle {
  constructor(x, y) {
    this.x  = x;
    this.y  = y;
    const angle = rand(0, Math.PI * 2);
    const speed = rand(30, 130);
    this.vx   = Math.cos(angle) * speed;
    this.vy   = Math.sin(angle) * speed;
    this.life = rand(0.4, 1.1);
    this.ttl  = this.life;
    this.dead = false;
  }

  update(dt) {
    this.x  += this.vx * dt;
    this.y  += this.vy * dt;
    this.ttl -= dt;
    if (this.ttl <= 0) this.dead = true;
  }

  draw() {
    const alpha = this.ttl / this.life;
    ctx.strokeStyle = `rgba(255,255,255,${alpha.toFixed(2)})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.vx * 0.05, this.y - this.vy * 0.05);
    ctx.stroke();
  }
}

// ── Power-up ──────────────────────────────────────────────────────────────────
class PowerUp {
  constructor(x, y) {
    this.x          = x;
    this.y          = y;
    this.radius     = 11;
    this.ttl        = 8;       // segundos hasta desvanecerse
    this.blinkTimer = 0;
    this.dead       = false;
  }

  update(dt) {
    this.ttl -= dt;
    this.blinkTimer += dt;
    if (this.ttl <= 0) this.dead = true;
  }

  draw() {
    // Parpadeo constante; más rápido en los últimos 2s
    const speed = this.ttl < 2 ? 12 : 5;
    if (Math.floor(this.blinkTimer * speed) % 2 !== 0) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.strokeStyle = 'rgba(0, 255, 200, 0.9)';
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.font      = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('V', 0, 4);
    ctx.restore();
  }
}

// ── Estado del juego ──────────────────────────────────────────────────────────
let ship, bullets, asteroids, particles, powerUps;
let score, lives, level;
let state;      // 'playing' | 'dead' | 'gameover'
let deadTimer;
let starNotice;   // aviso al aparecer la estrella fugaz
let currentSkin = 0; // skin activo de la nave
let skinNotice  = 0; // aviso al cambiar de skin

function spawnAsteroids(count) {
  const SAFE_DIST = 130;
  for (let i = 0; i < count; i++) {
    let x, y;
    do {
      x = rand(0, W);
      y = rand(0, H);
    } while (Math.hypot(x - W / 2, y - H / 2) < SAFE_DIST);
    asteroids.push(new Asteroid(x, y, 3));
  }
  // Estrella fugaz: bonus rápido que desaparece sola (una por nivel)
  let cx, cy;
  // La estrella entra desde fuera de la pantalla (más espectacular)
  const fromEdge = randInt(0, 3);
  if (fromEdge === 0)      { cx = rand(0, W);  cy = -40; }
  else if (fromEdge === 1) { cx = rand(0, W);  cy = H + 40; }
  else if (fromEdge === 2) { cx = -40;         cy = rand(0, H); }
  else                     { cx = W + 40;      cy = rand(0, H); }
  asteroids.push(new Asteroid(cx, cy, 3, true));
  starNotice = 1.5;
}

function initGame() {
  ship          = new Ship();
  bullets   = [];
  asteroids = [];
  particles = [];
  powerUps  = [];
  score  = 0;
  lives  = 3;
  level  = 1;
  state  = 'playing';
  spawnAsteroids(4);
}

function nextLevel() {
  level++;
  bullets   = [];
  particles = [];
  powerUps  = [];
  ship.reset();
  spawnAsteroids(3 + level);
}

function explode(x, y, count = 8) {
  for (let i = 0; i < count; i++) particles.push(new Particle(x, y));
}

function killShip() {
  explode(ship.x, ship.y, 14);
  ship.dead = true;
  lives--;
  if (lives <= 0) {
    state = 'gameover';
  } else {
    state     = 'dead';
    deadTimer = 2;
  }
}

// ── Update ────────────────────────────────────────────────────────────────────
function update(dt) {
  if (starNotice > 0) starNotice -= dt;
  if (skinNotice  > 0) skinNotice  -= dt;

  // Cambio de skin en vivo (teclas 1-5)
  for (let i = 0; i < SKINS.length; i++)
    if (pressed('Digit' + (i + 1))) { currentSkin = i; ship.skin = i; skinNotice = 1.5; }

  if (state === 'gameover') {
    if (pressed('Space')) initGame();
    particles.forEach(p => p.update(dt));
    particles = particles.filter(p => !p.dead);
    return;
  }

  if (state === 'dead') {
    deadTimer -= dt;
    particles.forEach(p => p.update(dt));
    particles = particles.filter(p => !p.dead);
    asteroids.forEach(a => a.update(dt));
    powerUps.forEach(p => p.update(dt));
    if (deadTimer <= 0) { state = 'playing'; ship.reset(); }
    return;
  }

  // Disparar
  if (pressed('Space')) {
    bullets.push(...ship.tryShoot());
  }

  ship.update(dt);
  bullets.forEach(b => b.update(dt));
  asteroids.forEach(a => a.update(dt));
  particles.forEach(p => p.update(dt));
  powerUps.forEach(p => p.update(dt));

  bullets   = bullets.filter(b => !b.dead);
  particles = particles.filter(p => !p.dead);
  powerUps  = powerUps.filter(p => !p.dead);

  // Bala vs asteroide
  const newAsteroids = [];
  for (const b of bullets) {
    for (const a of asteroids) {
      if (!a.dead && !b.dead && dist(b, a) < a.radius) {
        b.dead = true;
        a.dead = true;
        score += a.isStar ? 50 : POINTS[a.size];
        explode(a.x, a.y, a.size * 5);
        // La estrella fugaz no se parte, los normales sí
        newAsteroids.push(...a.split());
        // Drop de power-up de velocidad (no aplica a la estrella)
        if (!a.isStar && Math.random() < 0.12) powerUps.push(new PowerUp(a.x, a.y));
      }
    }
  }
  asteroids = asteroids.filter(a => !a.dead).concat(newAsteroids);
  bullets   = bullets.filter(b => !b.dead);

  // Nave vs asteroide
  if (ship.invincible <= 0) {
    for (const a of asteroids) {
      if (dist(ship, a) < ship.radius + a.radius * 0.82) {
        killShip();
        break;
      }
    }
  }

  // Recoger power-up de velocidad
  for (const p of powerUps) {
    if (!p.dead && dist(ship, p) < ship.radius + p.radius) {
      ship.speedBoost = 5;
      p.dead = true;
    }
  }

  // Nivel completado (la estrella fugaz nunca bloquea el nivel)
  if (asteroids.length === 0 || asteroids.every(a => a.isStar)) nextLevel();
}

// ── Draw ──────────────────────────────────────────────────────────────────────
function drawLifeIcon(x, y) {
  const sk    = SKINS[currentSkin];
  const SCALE = 0.45;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-Math.PI / 2);
  ctx.strokeStyle = sk.color;
  ctx.lineWidth   = 1.2;
  ctx.lineJoin    = 'round';
  ctx.beginPath();
  ctx.moveTo(sk.verts[0][0] * SCALE, sk.verts[0][1] * SCALE);
  for (let i = 1; i < sk.verts.length; i++)
    ctx.lineTo(sk.verts[i][0] * SCALE, sk.verts[i][1] * SCALE);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function drawHUD() {
  ctx.fillStyle = '#fff';
  ctx.font = '15px monospace';

  ctx.textAlign = 'left';
  ctx.fillText(`SCORE  ${score}`, 14, 26);
  if (ship.speedBoost > 0)
    ctx.fillText(`VELOCIDAD ${ship.speedBoost.toFixed(1)}s`, 14, 44);

  ctx.textAlign = 'center';
  ctx.fillText(`NIVEL ${level}`, W / 2, 26);

  for (let i = 0; i < lives; i++)
    drawLifeIcon(W - 16 - i * 22, 18);

  // Aviso de estrella fugaz al aparecer
  if (starNotice > 0) {
    ctx.textAlign   = 'center';
    ctx.fillStyle   = '#ffe600';
    ctx.font        = 'bold 16px monospace';
    ctx.fillText('¡ESTRELLA FUGAZ!', W / 2, 52);
  }

  // Aviso de cambio de skin
  if (skinNotice > 0) {
    ctx.textAlign = 'center';
    ctx.fillStyle = SKINS[currentSkin].color;
    ctx.font      = '14px monospace';
    ctx.fillText(`SKIN: ${SKINS[currentSkin].name}`, W / 2, 76);
  }
}

function drawOverlay(title, sub) {
  ctx.textAlign   = 'center';
  ctx.fillStyle   = '#fff';
  ctx.font        = 'bold 46px monospace';
  ctx.fillText(title, W / 2, H / 2 - 18);
  ctx.font        = '18px monospace';
  ctx.fillStyle   = 'rgba(255,255,255,0.65)';
  ctx.fillText(sub, W / 2, H / 2 + 22);
}

function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);

  particles.forEach(p => p.draw());
  asteroids.forEach(a => a.draw());
  bullets.forEach(b => b.draw());
  ship.draw();

  drawHUD();

  if (state === 'gameover')
    drawOverlay('GAME OVER', `PUNTAJE: ${score}   —   ESPACIO PARA REINICIAR`);
}

// ── Loop principal ────────────────────────────────────────────────────────────
let lastTime = null;

function loop(ts) {
  const dt = lastTime === null ? 0 : Math.min((ts - lastTime) / 1000, 0.05);
  lastTime = ts;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

initGame();
requestAnimationFrame(loop);
