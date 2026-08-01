// ===== Boot Loader =====
(function bootLoader() {
  const loader = document.getElementById('loader');
  const fill = document.getElementById('loaderFill');
  const lines = document.querySelectorAll('.loader-line');
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 18 + 8;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => loader.classList.add('hidden'), 400);
    }
    fill.style.width = progress + '%';
  }, 180);

  lines.forEach((line, i) => {
    setTimeout(() => line.classList.add('show'), 300 + i * 350);
  });
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

// ===== Resume =====
document.getElementById('downloadBtn').addEventListener('click', () => {
  const link = document.createElement('a');
  link.href = 'doc/KanojiyaDeepak_resume.pdf';
  link.download = 'Kanojiya_Deepak_Resume.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

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

  function draw() {
    ctx.fillStyle = 'rgba(3, 7, 18, 0.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${cellSize - 4}px JetBrains Mono, monospace`;

    for (let i = 0; i < columns; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * cellSize;
      const y = drops[i] * cellSize;
      const alpha = Math.random() * 0.3 + 0.06;
      ctx.fillStyle = `rgba(52, 211, 153, ${alpha})`;
      ctx.fillText(char, x, y);

      if (y > canvas.height && Math.random() > 0.985) drops[i] = 0;
      drops[i] += 0.5 + Math.random() * 0.5;
    }
    animId = requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize);

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
