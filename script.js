/* ---------- App registry ----------
   Add a new object here each time you ship something new. That's the only
   edit required — the grid, search, and empty-slot count all update on their own. */
const APPS = [
  {
    name: "THE SMITHY",
    desc: "Athletic Pilates Club",
    url: "https://pilatesmith-smithy.onrender.com",
    icon: "assets/smithy-mark.png",
    tag: "LIVE",
    featured: true,
  },
];

const MIN_SLOTS = 4; // keep the grid feeling like a roster, not a single tile

/* ---------- Clock + greeting ---------- */

function pad(n) { return String(n).padStart(2, "0"); }

function tick() {
  const now = new Date();
  const h = pad(now.getHours());
  const m = pad(now.getMinutes());
  const s = pad(now.getSeconds());
  document.getElementById("time").textContent = `${h}:${m}:${s}`;
  document.getElementById("date").textContent = now.toLocaleDateString(undefined, {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });
}

function greet() {
  const hour = new Date().getHours();
  let phrase = "Good evening";
  if (hour < 5) phrase = "Still up";
  else if (hour < 12) phrase = "Good morning";
  else if (hour < 18) phrase = "Good afternoon";
  document.getElementById("greetingText").textContent = `${phrase}, Shereef.`;
}

setInterval(tick, 1000);
tick();
greet();
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Grid render ---------- */

const grid = document.getElementById("appGrid");
const filterInput = document.getElementById("filterInput");
const cmdCount = document.getElementById("cmdCount");

function cardHTML(app) {
  const featuredClass = app.featured ? " featured" : "";
  return `
    <a class="card${featuredClass}" href="${app.url}" target="_blank" rel="noopener noreferrer" data-name="${app.name.toLowerCase()}">
      <div class="card-top">
        <div class="card-icon"><img src="${app.icon}" alt="${app.name} icon" /></div>
        <span class="card-badge">${app.tag}</span>
      </div>
      <div>
        <div class="card-title">${app.name}</div>
        <div class="card-desc">${app.desc}</div>
      </div>
      <div class="card-foot">
        <span>OPEN APP</span>
        <span class="card-arrow">→</span>
      </div>
    </a>`;
}

function slotHTML() {
  return `
    <div class="card slot">
      <div class="slot-plus">+</div>
      <div class="slot-label">Next build</div>
    </div>`;
}

function render(filter = "") {
  const q = filter.trim().toLowerCase();
  const visible = APPS.filter(a => a.name.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q));

  if (q && visible.length === 0) {
    grid.innerHTML = `<div class="empty-msg">No builds match “${filter}”.</div>`;
    cmdCount.textContent = "0 results";
    return;
  }

  let html = visible.map(cardHTML).join("");

  if (!q) {
    const slots = Math.max(0, MIN_SLOTS - APPS.length);
    for (let i = 0; i < slots; i++) html += slotHTML();
  }

  grid.innerHTML = html;
  cmdCount.textContent = q ? `${visible.length} result${visible.length === 1 ? "" : "s"}` : `${APPS.length} deployed`;
}

render();

filterInput.addEventListener("input", e => render(e.target.value));

document.addEventListener("keydown", e => {
  const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
  if (isCmdK) {
    e.preventDefault();
    filterInput.focus();
  }
  if (e.key === "Escape" && document.activeElement === filterInput) {
    filterInput.value = "";
    render();
    filterInput.blur();
  }
});

/* ---------- Ambient particle field ---------- */

const canvas = document.getElementById("field");
const ctx = canvas.getContext("2d");
let particles = [];
let w, h;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}

function initParticles() {
  const count = Math.min(34, Math.floor((w * h) / 42000));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1 + 0.3,
    vx: (Math.random() - 0.5) * 0.05,
    vy: (Math.random() - 0.5) * 0.05,
    a: Math.random() * 0.25 + 0.06,
  }));
}

function draw() {
  ctx.clearRect(0, 0, w, h);
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
    if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200, 164, 79, ${p.a})`;
    ctx.fill();
  }
  requestAnimationFrame(draw);
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

resize();
initParticles();
window.addEventListener("resize", () => { resize(); initParticles(); });
if (!prefersReducedMotion) draw();
