/* ══════════════════════════════════════════════════════
   SUPABASE CONFIG
   TABLE memories   → id, image_url, caption (nullable)
   TABLE birthday_pics → id, image_url
   Enable RLS + SELECT policy for anon on both.
   
   ⚠️ REQUIRED: Replace YOUR_SUPABASE_URL and YOUR_SUPABASE_ANON_KEY with actual values
══════════════════════════════════════════════════════ */
const SB_URL = 'https://tvceseobuvsegbjmrgug.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2Y2VzZW9idXZzZWdiam1yZ3VnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5NTI1NzEsImV4cCI6MjA5MzUyODU3MX0.5IQUWqsljqiWpm0ymd5_YwO704stPOUUDEjiVy2cPig';

let db = null;
try {
  if (window.supabase && SB_URL !== 'YOUR_SUPABASE_URL' && SB_KEY !== 'YOUR_SUPABASE_ANON_KEY') {
    db = window.supabase.createClient(SB_URL, SB_KEY);
  }
} catch(e) {
  console.warn('Supabase initialization skipped. Fill in credentials in script.js to enable database features.');
}

/* ══════════════════════════════════════════════════════
   BIRTHDAY DATE CONFIGURATION
   Set the year, month (01-12), and day of the birthday!
══════════════════════════════════════════════════════ */
const BIRTHDAY_DATE = new Date('2026-05-12T00:00:00').getTime(); 

/* ══════════════════════════════════════════════════════
   SHARED CONFETTI FACTORY
   Returns a running confetti animation on a given canvas.
   call .stop() to halt it.
══════════════════════════════════════════════════════ */
function createConfetti(canvas, opts = {}) {
  const {
    count    = 80,
    speed    = 1,
    opacity  = 1,
    colors   = ['#dc143c','#c9a96e','#ffffff','#ff6b8a','#1a3055','#ff4560','#ffd700','#fff8f2'],
    shapes   = ['rect','circle','ribbon'],
  } = opts;

  const ctx = canvas.getContext('2d');
  let running = true;
  let raf;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  const resizeOb = new ResizeObserver(resize);
  resizeOb.observe(document.documentElement);

  function mkPiece(randomY = false) {
    return {
      x:     Math.random() * canvas.width,
      y:     randomY ? Math.random() * canvas.height : -20,
      w:     Math.random() * 10 + 4,
      h:     Math.random() * 5 + 2.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot:   Math.random() * Math.PI * 2,
      rotV:  (Math.random() - .5) * .12 * speed,
      vx:    (Math.random() - .5) * 1.8 * speed,
      vy:    (Math.random() * 2.5 + 1) * speed,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      alpha: (Math.random() * .5 + .4) * opacity,
    };
  }

  const pieces = Array.from({ length: count }, () => mkPiece(true));

  function draw(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    if (p.shape === 'rect') {
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
    } else if (p.shape === 'circle') {
      ctx.beginPath(); ctx.arc(0, 0, p.w/2, 0, Math.PI*2); ctx.fill();
    } else {
      ctx.fillRect(-p.w/2, -p.h/4, p.w, p.h/2);
    }
    ctx.restore();
  }

  function tick() {
    if (!running) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of pieces) {
      p.x   += p.vx;
      p.y   += p.vy;
      p.rot += p.rotV;
      if (p.y > canvas.height + 20) Object.assign(p, mkPiece(false));
      draw(p);
    }
    raf = requestAnimationFrame(tick);
  }
  tick();

  return {
    stop() {
      running = false;
      cancelAnimationFrame(raf);
      resizeOb.disconnect();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };
}


/* ══════════════════════════════════════════════════════
   1. INTRO CONFETTI + SPLASH
══════════════════════════════════════════════════════ */
let introConfetti;
function startIntroConfetti() {
  const canvas = document.getElementById('intro-canvas');
  introConfetti = createConfetti(canvas, { count: 160, speed: 1.3, opacity: 1 });
  setTimeout(closeIntro, 3200);
}

function closeIntro() {
  const intro = document.getElementById('intro');
  if (!intro || intro.classList.contains('hide')) return;
  intro.classList.add('hide');
  introConfetti?.stop();
  setTimeout(() => intro.remove(), 1000);
}


/* ══════════════════════════════════════════════════════
   2. PERSISTENT BACKGROUND CONFETTI (runs always)
══════════════════════════════════════════════════════ */
function startBgConfetti() {
  const canvas = document.getElementById('bg-confetti');
  createConfetti(canvas, {
    count:   55,
    speed:   0.55,
    opacity: 0.38,    // subtle — behind all content
    colors:  ['#dc143c','#c9a96e','#ffffff','#8b0020','#1a3055','#ffd700'],
  });
}


/* ══════════════════════════════════════════════════════
   3. DOUBLE-CLICK → CYCLE 3 MODES (with localStorage)
   Works on desktop (double-click) and mobile (double-tap)
══════════════════════════════════════════════════════ */
const MODES = [
  { label: '🔴 RED MODE',  attr: '0' },
  { label: '🌊 NAVY MODE',   attr: '1' },
  { label: '⬛ BLACK MODE', attr: '2' },
];

let modeIdx = 0;
let tTimer;

function setMode(modeIndex) {
  modeIdx = modeIndex;
  document.documentElement.setAttribute('data-mode', MODES[modeIdx].attr);
  localStorage.setItem('theme-mode', MODES[modeIdx].attr);
}

function loadSavedMode() {
  const saved = localStorage.getItem('theme-mode');
  if (saved) {
    modeIdx = MODES.findIndex(m => m.attr === saved);
    if (modeIdx === -1) modeIdx = 0;
  }
  document.documentElement.setAttribute('data-mode', MODES[modeIdx].attr);
}

function showThemeToast() {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = MODES[modeIdx].label;
    toast.classList.add('on');
    clearTimeout(tTimer);
    tTimer = setTimeout(() => toast.classList.remove('on'), 2500);
  }
}

function cycleTheme() {
  modeIdx = (modeIdx + 1) % 3;
  setMode(modeIdx);
  showThemeToast();
}

function setupThemeToggle() {
  // Desktop: double-click
  document.body.addEventListener('dblclick', e => {
    if (e.target.closest('button,a,input')) return;
    cycleTheme();
  });

  // Mobile: double-tap detection
  let lastTap = 0;
  document.body.addEventListener('touchend', e => {
    if (e.target.closest('button,a,input')) return;
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    
    if (tapLength < 300 && tapLength > 0) {
      e.preventDefault();
      cycleTheme();
    }
    lastTap = currentTime;
  }, false);
}


/* ══════════════════════════════════════════════════════
   4. MEMORIES CAROUSEL (Supabase)
══════════════════════════════════════════════════════ */
async function loadCarousel() {
  const box = document.getElementById('carouselBox');
  let rows = [];
  
  if (!db) {
    box.innerHTML = `
      <div class="cload" style="flex-direction:column;gap:.9rem;">
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" opacity=".35">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span>⚙️ Configure Supabase to load memories</span>
        <span style="opacity:.4;font-size:.5rem;">Add SB_URL &amp; SB_KEY in script.js</span>
      </div>`;
    return;
  }

  try {
    const { data, error } = await db.from('memories').select('image_url,caption').order('id');
    if (!error && data?.length) rows = data;
  } catch(e) { 
    console.warn('memories error:', e.message); 
  }

  if (!rows.length) {
    box.innerHTML = `
      <div class="cload" style="flex-direction:column;gap:.9rem;">
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" opacity=".35">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span>No memories found in database</span>
        <span style="opacity:.4;font-size:.5rem;">Add data to the 'memories' table</span>
      </div>`;
    return;
  }

  const BLANK = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500'%3E%3Crect fill='%230d1b2a' width='100%25' height='100%25'/%3E%3Ctext fill='%236a82a0' x='50%25' y='50%25' text-anchor='middle' dy='.35em' font-size='13' font-family='monospace'%3EImage unavailable%3C/text%3E%3C/svg%3E`;

  box.innerHTML = `
    <div class="cw">
      <div class="cvp">
        <div class="ctr" id="ctr">
          ${rows.map((r,i)=>`
            <div class="csl${i===0?' active':''}">
              <img src="${r.image_url}" alt="${r.caption||'Memory'}" loading="lazy" onerror="this.src='${BLANK}'"/>
              ${r.caption?`<div class="ccap">${r.caption}</div>`:''}
            </div>`).join('')}
        </div>
      </div>
      <button class="cbtn prev" id="cPrev" aria-label="Prev">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <button class="cbtn next" id="cNext" aria-label="Next">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
      <div class="cdots">
        ${rows.map((_,i)=>`<div class="dot${i===0?' a':''}" data-i="${i}"></div>`).join('')}
      </div>
    </div>`;

  const track  = document.getElementById('ctr');
  const slides = box.querySelectorAll('.csl');
  const dots   = box.querySelectorAll('.dot');
  let cur=0, auto;

  function go(n){
    slides[cur].classList.remove('active'); 
    dots[cur].classList.remove('a');
    cur=((n%rows.length)+rows.length)%rows.length;
    track.style.transform=`translateX(-${cur*100}%)`;
    slides[cur].classList.add('active'); 
    dots[cur].classList.add('a');
  }
  
  function resetAuto(){
    clearInterval(auto);
    auto=setInterval(()=>go(cur+1),4000);
  }

  document.getElementById('cPrev').onclick=()=>{go(cur-1);resetAuto();};
  document.getElementById('cNext').onclick=()=>{go(cur+1);resetAuto();};
  dots.forEach(d=>d.onclick=()=>{go(+d.dataset.i);resetAuto();});
  resetAuto();

  let sx=0;
  const vp=box.querySelector('.cvp');
  vp.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;},{passive:true});
  vp.addEventListener('touchend',e=>{
    const dx=e.changedTouches[0].clientX-sx;
    if(Math.abs(dx)>45){go(cur+(dx<0?1:-1));resetAuto();}
  });
}


/* ══════════════════════════════════════════════════════
   5. BIRTHDAY PICS (conditional)
══════════════════════════════════════════════════════ */
async function loadBdayPics(){
  if (!db) return;
  
  const sec=document.getElementById('bpics');
  const grid=document.getElementById('bpGrid');
  let pics=[];
  
  try{
    const{data,error}=await db.from('birthday_pics').select('image_url').not('image_url','is',null).order('id');
    if(!error&&data?.length)pics=data;
  }catch(e){
    console.warn('birthday_pics error:',e.message);
  }
  
  if(!pics.length)return;
  
  grid.innerHTML=pics.map(p=>`
    <div class="bp-item">
      <img src="${p.image_url}" alt="Birthday moment" loading="lazy" onerror="this.parentElement.style.display='none'"/>
    </div>`).join('');
  sec.style.display='block';
}


/* ══════════════════════════════════════════════════════
   6. SCROLL FADE-IN
══════════════════════════════════════════════════════ */
function initFadeIn(){
  const io=new IntersectionObserver(entries=>{
    entries.filter(e=>e.isIntersecting).forEach((e,i)=>{
      setTimeout(()=>e.target.classList.add('vis'),i*90);
      io.unobserve(e.target);
    });
  },{threshold:.1,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.fu,.fu-l,.fu-r,.fu-s').forEach(el=>io.observe(el));
}


/* ══════════════════════════════════════════════════════
   BOOT
══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded',()=>{
  const now = new Date().getTime();
  
  if (now < BIRTHDAY_DATE) {
    // If visited before the set date, hide everything except the early screen
    document.getElementById('early-screen').style.display = 'flex';
    document.getElementById('intro').style.display = 'none';
    document.getElementById('bg-confetti').style.display = 'none';
    document.querySelector('main').style.display = 'none';
    document.querySelector('footer').style.display = 'none';
    
    // Optionally dynamically display the target date
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(BIRTHDAY_DATE).toLocaleDateString(undefined, dateOptions);
    document.getElementById('early-date-msg').innerHTML = `Come back on <strong style="color:var(--accent);">${formattedDate}</strong> to celebrate.`;
  } else {
    // Execute the birthday page normally
    startIntroConfetti();
    startBgConfetti();
    loadSavedMode();
    setupThemeToggle();
    loadCarousel();
    loadBdayPics();
    initFadeIn();
  }
});
