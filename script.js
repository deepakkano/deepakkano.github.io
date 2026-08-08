// ===== Bug clearance intro game =====
(function initBugGame() {
  const game = document.getElementById('bugGame');
  const field = document.getElementById('bugField');
  const countEl = document.getElementById('bugCount');
  const success = document.getElementById('bugSuccess');
  const successFill = document.getElementById('successFill');
  if (!game || !field) return;

  const BUG_COUNT = 2;
  const TAIL_HEIGHT = 90;
  const BUG_TYPES = ['beetle', 'fly', 'roach', 'mosquito'];

  const bugSvgs = {
    beetle: (c) => `<svg class="bug-svg" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g stroke="${c.dark}" stroke-width="1.2" stroke-linecap="round">
        <path d="M12 28 L6 22 M12 34 L4 34 M12 40 L6 46" />
        <path d="M52 28 L58 22 M52 34 L60 34 M52 40 L58 46" />
        <path d="M22 48 L18 56 M32 50 L32 58 M42 48 L46 56" />
        <path d="M24 12 Q18 4 12 2 M40 12 Q46 4 52 2" fill="none"/>
      </g>
      <ellipse cx="32" cy="34" rx="18" ry="22" fill="${c.body}"/>
      <path d="M32 14 C24 14 18 22 18 34 C18 46 24 54 32 54 C40 54 46 46 46 34 C46 22 40 14 32 14Z" fill="${c.shell}" opacity="0.85"/>
      <line x1="32" y1="18" x2="32" y2="50" stroke="${c.dark}" stroke-width="1"/>
      <ellipse cx="32" cy="16" rx="7" ry="6" fill="${c.head}"/>
      <circle cx="29" cy="15" r="1.5" fill="#111"/><circle cx="35" cy="15" r="1.5" fill="#111"/>
    </svg>`,
    fly: (c) => `<svg class="bug-svg" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="20" cy="28" rx="14" ry="10" fill="${c.wing}" opacity="0.55"/>
      <ellipse cx="44" cy="28" rx="14" ry="10" fill="${c.wing}" opacity="0.55"/>
      <ellipse cx="32" cy="36" rx="10" ry="14" fill="${c.body}"/>
      <circle cx="32" cy="24" r="8" fill="${c.head}"/>
      <circle cx="29" cy="23" r="2.5" fill="#cc0000"/><circle cx="35" cy="23" r="2.5" fill="#cc0000"/>
      <g stroke="${c.dark}" stroke-width="1.2" stroke-linecap="round">
        <path d="M18 44 L10 52 M22 48 L14 58 M26 50 L20 60"/>
        <path d="M46 44 L54 52 M42 48 L50 58 M38 50 L44 60"/>
        <path d="M28 18 Q22 8 18 4 M36 18 Q42 8 46 4" fill="none"/>
      </g>
    </svg>`,
    roach: (c) => `<svg class="bug-svg" viewBox="0 0 72 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="36" cy="24" rx="22" ry="12" fill="${c.body}"/>
      <ellipse cx="36" cy="24" rx="16" ry="8" fill="${c.shell}" opacity="0.6"/>
      <circle cx="52" cy="22" r="7" fill="${c.head}"/>
      <circle cx="54" cy="20" r="1.8" fill="#111"/><circle cx="54" cy="24" r="1.8" fill="#111"/>
      <g stroke="${c.dark}" stroke-width="1.3" stroke-linecap="round">
        <path d="M14 18 L4 12 M14 24 L2 24 M14 30 L4 36"/>
        <path d="M22 16 L14 8 M22 32 L14 40"/>
        <path d="M30 14 L24 6 M30 34 L24 42"/>
        <path d="M58 16 L66 10 M58 22 L70 18 M58 28 L66 34"/>
        <path d="M50 14 L56 6 M50 34 L56 42"/>
        <path d="M60 12 L68 4" fill="none"/>
      </g>
    </svg>`,
    mosquito: (c) => `<svg class="bug-svg" viewBox="0 0 48 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="16" cy="22" rx="10" ry="6" fill="${c.wing}" opacity="0.5"/>
      <ellipse cx="32" cy="22" rx="10" ry="6" fill="${c.wing}" opacity="0.5"/>
      <ellipse cx="24" cy="30" rx="4" ry="10" fill="${c.body}"/>
      <ellipse cx="24" cy="42" rx="3" ry="8" fill="${c.body}"/>
      <circle cx="24" cy="16" r="5" fill="${c.head}"/>
      <path d="M24 52 L24 60" stroke="${c.dark}" stroke-width="1.5" stroke-linecap="round"/>
      <g stroke="${c.dark}" stroke-width="1.2" stroke-linecap="round">
        <path d="M18 36 L8 44 M18 40 L6 48 M18 44 L8 52"/>
        <path d="M30 36 L38 44 M30 40 L40 48 M30 44 L38 52"/>
        <path d="M20 12 L14 4 M28 12 L34 4" fill="none"/>
      </g>
    </svg>`
  };

  const bugPalettes = [
    { body: '#7c3aed', shell: '#5b21b6', head: '#4c1d95', dark: '#2e1065', wing: '#a78bfa' },
    { body: '#dc2626', shell: '#991b1b', head: '#7f1d1d', dark: '#450a0a', wing: '#fca5a5' },
    { body: '#16a34a', shell: '#15803d', head: '#166534', dark: '#14532d', wing: '#86efac' },
    { body: '#ca8a04', shell: '#a16207', head: '#854d0e', dark: '#713f12', wing: '#fde047' },
    { body: '#0891b2', shell: '#0e7490', head: '#155e75', dark: '#164e63', wing: '#67e8f9' },
    { body: '#ea580c', shell: '#c2410c', head: '#9a3412', dark: '#7c2d12', wing: '#fdba74' }
  ];

  const bugs = [];
  let animId = null;
  let remaining = BUG_COUNT;

  function dismissGame() {
    cancelAnimationFrame(animId);
    game.classList.add('hidden');
    document.body.style.overflow = '';
    setTimeout(() => game.remove(), 800);
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    dismissGame();
    return;
  }

  document.body.style.overflow = 'hidden';

  function spawnBug() {
    const type = BUG_TYPES[Math.floor(Math.random() * BUG_TYPES.length)];
    const palette = bugPalettes[Math.floor(Math.random() * bugPalettes.length)];

    const el = document.createElement('button');
    el.type = 'button';
    el.className = `bug type-${type}`;
    el.setAttribute('aria-label', 'Squash bug');
    el.innerHTML = `
      <div class="bug-wrap">
        <div class="bug-insect">${bugSvgs[type](palette)}</div>
        <div class="bug-kite-tail">
          <span class="bug-string"></span>
          <span class="bug-banner">I am the hacker</span>
        </div>
      </div>`;

    const sizeMap = { beetle: 58, fly: 52, roach: 62, mosquito: 48 };
    const bodySize = sizeMap[type] || 56;
    const bug = {
      el,
      tail: null,
      swayOffset: Math.random() * Math.PI * 2,
      x: Math.random() * (window.innerWidth - bodySize),
      y: 80 + Math.random() * (window.innerHeight - bodySize - TAIL_HEIGHT - 120),
      vx: (Math.random() - 0.5) * 2.4,
      vy: (Math.random() - 0.5) * 2.4,
      size: bodySize
    };

    bug.tail = el.querySelector('.bug-kite-tail');

    el.style.left = bug.x + 'px';
    el.style.top = bug.y + 'px';

    el.addEventListener('click', (e) => {
      e.stopPropagation();
      if (el.classList.contains('squished')) return;

      el.classList.add('squished');
      const splat = document.createElement('div');
      splat.className = 'bug-splat';
      splat.style.left = (bug.x - 6) + 'px';
      splat.style.top = (bug.y - 6) + 'px';
      field.appendChild(splat);
      setTimeout(() => splat.remove(), 500);

      remaining--;
      countEl.textContent = remaining;

      setTimeout(() => {
        el.remove();
        const idx = bugs.indexOf(bug);
        if (idx > -1) bugs.splice(idx, 1);
        if (remaining === 0) finishGame();
      }, 350);
    });

    field.appendChild(el);
    bugs.push(bug);
  }

  function animate() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    bugs.forEach(bug => {
      bug.x += bug.vx;
      bug.y += bug.vy;

      if (bug.x <= 0 || bug.x >= w - bug.size) {
        bug.vx *= -1;
        bug.x = Math.max(0, Math.min(bug.x, w - bug.size));
      }
      if (bug.y <= 70 || bug.y >= h - bug.size - TAIL_HEIGHT - 20) {
        bug.vy *= -1;
        bug.y = Math.max(70, Math.min(bug.y, h - bug.size - TAIL_HEIGHT - 20));
      }

      bug.el.style.left = bug.x + 'px';
      bug.el.style.top = bug.y + 'px';

      if (bug.tail) {
        const lean = Math.atan2(-bug.vx, bug.vy) * (180 / Math.PI);
        const sway = Math.sin(Date.now() / 280 + bug.swayOffset) * 10;
        bug.tail.style.transform = `rotate(${lean + sway}deg)`;
      }
    });

    animId = requestAnimationFrame(animate);
  }

  function finishGame() {
    cancelAnimationFrame(animId);
    success.hidden = false;

    let progress = 0;
    const interval = setInterval(() => {
      progress += 12;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(dismissGame, 350);
      }
      successFill.style.width = progress + '%';
    }, 120);
  }

  countEl.textContent = BUG_COUNT;
  for (let i = 0; i < BUG_COUNT; i++) spawnBug();
  animate();

  window.addEventListener('resize', () => {
    bugs.forEach(bug => {
      bug.x = Math.min(bug.x, window.innerWidth - bug.size);
      bug.y = Math.min(Math.max(bug.y, 70), window.innerHeight - bug.size - 20);
    });
  });
})();

// ===== Pendulum theme toggle =====
(function initPendulumTheme() {
  const swing = document.getElementById('pendulumSwing');
  const bob = document.getElementById('pendulumBob');
  const themeColor = document.getElementById('themeColor');
  if (!swing || !bob) return;

  const STORAGE_KEY = 'kd-theme';
  const PULL_THRESHOLD = 12;
  const DRAG_THRESHOLD = 24;
  const MAX_ANGLE = 45;
  let dragging = false;
  let currentAngle = 0;
  let startX = 0;
  let startY = 0;
  let resumeTimer = null;

  function getTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function flashThemeTransition() {
    document.documentElement.classList.add('theme-transition');
    clearTimeout(flashThemeTransition._t);
    flashThemeTransition._t = setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 500);
  }

  function setTheme(theme) {
    flashThemeTransition();
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      if (themeColor) themeColor.setAttribute('content', '#e2e8f0');
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeColor) themeColor.setAttribute('content', '#030712');
    }
    localStorage.setItem(STORAGE_KEY, theme);
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }

  function toggleTheme() {
    setTheme(getTheme() === 'dark' ? 'light' : 'dark');
  }

  function getPivotCenter() {
    const pivot = swing.querySelector('.pendulum-pivot');
    if (!pivot) return { x: 0, y: 0 };
    const r = pivot.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  function angleFromPointer(clientX, clientY) {
    const p = getPivotCenter();
    const deg = Math.atan2(clientX - p.x, clientY - p.y) * (180 / Math.PI);
    return Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, deg));
  }

  function setSwingAngle(angle, animate) {
    currentAngle = angle;
    swing.style.animation = 'none';
    swing.style.transition = animate ? 'transform 0.5s cubic-bezier(0.34, 1.45, 0.64, 1)' : 'none';
    swing.style.transform = `rotate(${angle}deg)`;
  }

  function resumeSwing() {
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => {
      swing.classList.remove('is-dragging');
      swing.style.transition = '';
      swing.style.transform = '';
      swing.style.animation = '';
    }, 480);
  }

  function shouldToggle(clientX, clientY) {
    const dx = clientX - startX;
    const dy = clientY - startY;
    const distance = Math.hypot(dx, dy);
    return (
      Math.abs(currentAngle) >= PULL_THRESHOLD ||
      distance >= DRAG_THRESHOLD ||
      dy >= DRAG_THRESHOLD ||
      distance <= 6
    );
  }

  function onPointerDown(e) {
    e.preventDefault();
    e.stopPropagation();
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
    swing.classList.add('is-dragging');
    bob.setPointerCapture(e.pointerId);
    setSwingAngle(angleFromPointer(e.clientX, e.clientY), false);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  }

  function onPointerMove(e) {
    if (!dragging) return;
    setSwingAngle(angleFromPointer(e.clientX, e.clientY), false);
  }

  function onPointerUp(e) {
    if (!dragging) return;
    dragging = false;

    if (bob.hasPointerCapture(e.pointerId)) {
      bob.releasePointerCapture(e.pointerId);
    }

    if (shouldToggle(e.clientX, e.clientY)) toggleTheme();

    setSwingAngle(0, true);
    resumeSwing();

    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerUp);
  }

  bob.addEventListener('pointerdown', onPointerDown);
})();

// ===== Navbar =====
const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');
const backTop = document.getElementById('backTop');
const scrollProgress = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;

  navbar.classList.toggle('scrolled', scrollY > 40);
  backTop.classList.toggle('show', scrollY > 500);
  scrollProgress.style.width = (scrollY / docHeight) * 100 + '%';

  let current = '';
  document.querySelectorAll('section[id]').forEach(section => {
    if (scrollY >= section.offsetTop - 140) current = section.getAttribute('id');
  });
  navItems.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('open');
});

navItems.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
  });
});

backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== Typed Text =====
const typedText = document.getElementById('typedText');
const roles = [
  'Flutter Developer',
  'Learning Mobile Security',
  'Aspiring Pen Tester',
  'Mobile App Developer'
];
let roleIndex = 0, charIndex = 0, isDeleting = false;

function typeEffect() {
  const current = roles[roleIndex];
  typedText.textContent = isDeleting
    ? current.substring(0, charIndex--)
    : current.substring(0, charIndex++);

  let speed = isDeleting ? 30 : 65;

  if (!isDeleting && charIndex === current.length + 1) {
    speed = 2200;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    speed = 350;
  }
  setTimeout(typeEffect, speed);
}
typeEffect();

// ===== Matrix Rain (performance optimized) =====
(function initMatrix() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  const chars = '01アイウエオカキクケコサシスセソタチツテト';
  let columns, drops, animId;
  const cellSize = 20;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / cellSize);
    drops = Array(columns).fill(0).map(() => Math.random() * -50);
  }

  function getMatrixColors() {
    const root = getComputedStyle(document.documentElement);
    const fade = root.getPropertyValue('--matrix-fade').trim() || 'rgba(3, 7, 18, 0.06)';
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const charRgb = isLight ? '5, 150, 105' : '52, 211, 153';
    return { fade, charRgb };
  }

  function draw() {
    const { fade, charRgb } = getMatrixColors();
    ctx.fillStyle = fade;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${cellSize - 4}px JetBrains Mono, monospace`;

    for (let i = 0; i < columns; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * cellSize;
      const y = drops[i] * cellSize;
      const alpha = Math.random() * 0.3 + 0.06;
      ctx.fillStyle = `rgba(${charRgb}, ${alpha})`;
      ctx.fillText(char, x, y);

      if (y > canvas.height && Math.random() > 0.985) drops[i] = 0;
      drops[i] += 0.5 + Math.random() * 0.5;
    }
    animId = requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize);
  window.addEventListener('themechange', () => {});

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else draw();
  });
})();

// ===== Terminal live commands =====
(function initTerminal() {
  const body = document.getElementById('terminalBody');
  if (!body) return;

  const cmds = [
    'frida -U -f com.target.app -l bypass.js',
    'jadx -d output/ vulnerable.apk',
    'adb shell pm list packages | grep bank',
    'mobsf --analyze ./app-release.apk',
    'objection -g com.app explore'
  ];
  let idx = 0;

  function addCmd() {
    const dyn = body.querySelectorAll('.term-dynamic');
    if (dyn.length >= 3) dyn[0].remove();

    const line = document.createElement('div');
    line.className = 'term-line term-dynamic';
    line.innerHTML = `<span class="prompt">$</span> ${cmds[idx]}`;
    body.insertBefore(line, body.lastElementChild);
    body.scrollTop = body.scrollHeight;
    idx = (idx + 1) % cmds.length;
    setTimeout(addCmd, 3500);
  }
  setTimeout(addCmd, 2500);
})();

// ===== Scroll reveal =====
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      e.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .timeline-item').forEach(el => revealObserver.observe(el));

// ===== Animated counters =====
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.target;
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-target]').forEach(el => counterObserver.observe(el));

// ===== Smooth anchor offset =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ===== Floating code snippets =====
(function initFloatingCode() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const layer = document.getElementById('floatingCode');
  if (!layer) return;

  const snippets = [
    { text: 'runApp(MyApp())', type: 'dev' },
    { text: 'Widget build(BuildContext ctx)', type: 'dev' },
    { text: 'Get.put(AuthController())', type: 'dev' },
    { text: 'FirebaseAuth.instance', type: 'dev' },
    { text: 'class MainActivity', type: 'dev' },
    { text: 'await dio.get("/api")', type: 'dev' },
    { text: 'jadx -d out app.apk', type: 'sec' },
    { text: 'frida -U -f com.app', type: 'sec' },
    { text: 'SSL pinning bypass', type: 'sec' },
    { text: 'OWASP M2: storage', type: 'sec' },
    { text: 'adb shell pm list', type: 'sec' },
    { text: 'static analysis...', type: 'sec' },
    { text: '0x7f3a2b1c', type: '' },
    { text: '01001001 01101110', type: '' },
    { text: 'JWT.decode(token)', type: 'dev' },
  ];

  function spawn() {
    const s = snippets[Math.floor(Math.random() * snippets.length)];
    const el = document.createElement('div');
    el.className = 'float-snippet' + (s.type ? ` ${s.type}-snippet` : '');
    el.textContent = s.text;
    el.style.left = Math.random() * 90 + '%';
    el.style.animationDuration = (8 + Math.random() * 10) + 's';
    layer.appendChild(el);
    setTimeout(() => el.remove(), 18000);
  }

  for (let i = 0; i < 6; i++) setTimeout(spawn, i * 800);
  setInterval(spawn, 2200);
})();

// ===== Cyber particles (icons) =====
(function initCyberParticles() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const container = document.getElementById('cyberParticles');
  if (!container) return;

  const icons = ['{ }', '<>', '//', '0x', 'KEY', '***', '01', 'fn'];
  function spawn() {
    const el = document.createElement('span');
    el.className = 'cyber-particle';
    el.textContent = icons[Math.floor(Math.random() * icons.length)];
    el.style.left = Math.random() * 100 + '%';
    el.style.top = Math.random() * 100 + '%';
    el.style.setProperty('--dx', (Math.random() - 0.5) * 120 + 'px');
    el.style.setProperty('--dy', (Math.random() - 0.5) * 120 + 'px');
    el.style.animationDuration = (6 + Math.random() * 6) + 's';
    container.appendChild(el);
    setTimeout(() => el.remove(), 14000);
  }
  setInterval(spawn, 1500);
})();

// ===== Live code editor typing =====
(function initLiveCode() {
  const codeEl = document.getElementById('liveCode');
  const tabs = document.querySelectorAll('.editor-tab');
  if (!codeEl) return;

  const files = {
    dart: [
      '<span class="kw">void</span> <span class="fn">main</span>() {',
      '  <span class="fn">runApp</span>(<span class="fn">MyApp</span>());',
      '}',
      '',
      '<span class="kw">class</span> <span class="fn">SecureAuth</span> {',
      '  <span class="kw">final</span> token = <span class="fn">validateJWT</span>();',
      '}',
    ],
    security: [
      '<span class="cm"># security scan</span>',
      '<span class="cmd">$</span> jadx -d output/ app.apk',
      '<span class="cmd">$</span> adb shell pm list packages',
      '<span class="cm"># analyzing...</span>',
      '<span class="cmd">$</span> frida -U -f com.target.app',
      '<span class="str">[+] SSL check: running</span>',
    ]
  };

  let file = 'dart';
  let lineIdx = 0;
  let charIdx = 0;
  let currentLines = [];
  let built = '';

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      file = tab.dataset.file;
      lineIdx = 0; charIdx = 0; built = '';
      currentLines = files[file];
      codeEl.innerHTML = '';
    });
  });

  function typeCode() {
    if (lineIdx >= currentLines.length) {
      setTimeout(() => {
        lineIdx = 0; charIdx = 0; built = '';
        codeEl.innerHTML = '';
        file = file === 'dart' ? 'security' : 'dart';
        tabs.forEach(t => t.classList.toggle('active', t.dataset.file === file));
        currentLines = files[file];
        typeCode();
      }, 2500);
      return;
    }

    const line = currentLines[lineIdx];
    if (charIdx === 0 && lineIdx > 0) built += '<br>';

    if (charIdx < line.length) {
      const chunk = line.slice(charIdx, charIdx + 2);
      built += chunk;
      charIdx += 2;
      codeEl.innerHTML = built;
      setTimeout(typeCode, 25 + Math.random() * 20);
    } else {
      lineIdx++;
      charIdx = 0;
      setTimeout(typeCode, 80);
    }
  }

  currentLines = files.dart;
  typeCode();
})();

// ===== Phone mockup coding animation =====
(function initPhoneCode() {
  const el = document.getElementById('phoneCode');
  if (!el) return;

  const lines = [
    'import flutter',
    'class HomeScreen',
    '  build() {',
    '    return Scaffold(',
    '      appBar: AppBar()',
    '    );',
    '  }',
    '}',
    '// compiling...',
    '✓ Build success',
  ];
  let i = 0;

  function addLine() {
    if (i >= lines.length) {
      setTimeout(() => { el.innerHTML = ''; i = 0; addLine(); }, 2000);
      return;
    }
    el.innerHTML += (i > 0 ? '<br>' : '') + lines[i];
    i++;
    setTimeout(addLine, 400 + Math.random() * 300);
  }
  addLine();
})();

// ===== Security scan animation =====
(function initSecurityScan() {
  const bar = document.getElementById('scanBarFill');
  const log = document.getElementById('scanLog');
  if (!bar || !log) return;

  const steps = [
    { pct: 15, msg: '[*] Loading APK...', cls: '' },
    { pct: 30, msg: '[*] Decompiling with jadx...', cls: '' },
    { pct: 45, msg: '[!] Checking permissions...', cls: 'log-warn' },
    { pct: 60, msg: '[*] Static analysis...', cls: '' },
    { pct: 75, msg: '[!] Insecure storage found', cls: 'log-warn' },
    { pct: 90, msg: '[*] SSL pinning detected', cls: 'log-warn' },
    { pct: 100, msg: '[+] Scan complete — 3 findings', cls: 'log-ok' },
  ];

  let step = 0;

  function runScan() {
    if (step >= steps.length) {
      setTimeout(() => { log.innerHTML = ''; step = 0; bar.style.width = '0'; runScan(); }, 3000);
      return;
    }
    const s = steps[step];
    bar.style.width = s.pct + '%';
    const line = document.createElement('div');
    line.className = s.cls;
    line.textContent = s.msg;
    log.appendChild(line);
    if (log.children.length > 5) log.removeChild(log.firstChild);
    step++;
    setTimeout(runScan, 900);
  }
  runScan();
})();

// ===== Cyber radar canvas (corner) =====
(function initCyberRadarCanvas() {
  const canvas = document.getElementById('cyber-radar');
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  let angle = 0;

  function resize() {
    canvas.width = 200;
    canvas.height = 200;
  }

  function draw() {
    const cx = 100, cy = 100, r = 90;
    ctx.clearRect(0, 0, 200, 200);

    ctx.strokeStyle = 'rgba(52, 211, 153, 0.12)';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(cx, cy, (r / 3) * i, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(0, 255, 136, 0.08)';
    ctx.beginPath();
    ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy);
    ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r);
    ctx.stroke();

    const grad = ctx.createConicGradient(angle, cx, cy);
    grad.addColorStop(0, 'rgba(52, 211, 153, 0.3)');
    grad.addColorStop(0.15, 'rgba(52, 211, 153, 0)');
    grad.addColorStop(1, 'rgba(52, 211, 153, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, angle, angle + Math.PI / 3);
    ctx.closePath();
    ctx.fill();

    angle += 0.02;
    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize);
})();
