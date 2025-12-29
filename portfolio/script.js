// ---------- Helpers ----------
const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// ---------- Mobile nav ----------
const navToggle = qs('.nav-toggle');
const navMenu = qs('#nav-menu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
}

// ---------- Scroll progress ----------
const progress = qs('.progress-bar');
if (progress) {
  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
    progress.style.width = percent + '%';
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
}

// ---------- Reveal on scroll ----------
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('in-view');
  });
}, { threshold: 0.12 });

qsa('.section, .glass, .project-card, .skill, .item, .testimonial').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

// ---------- Typing effect ----------
const typingEl = qs('.typing');
if (typingEl) {
  const words = (typingEl.getAttribute('data-words') || 'Developer').split(',');
  let i = 0, j = 0, deleting = false;
  const speed = () => deleting ? 40 : 90;

  const tick = () => {
    const word = words[i].trim();
    typingEl.textContent = deleting ? word.slice(0, j--) : word.slice(0, j++);
    if (!deleting && j > word.length + 2) { deleting = true; }
    else if (deleting && j < 0) { deleting = false; i = (i + 1) % words.length; }
    setTimeout(tick, speed());
  };
  tick();
}

// ---------- Theme toggle ----------
const root = document.documentElement;
const themeToggle = qs('#theme-toggle');
const storedTheme = localStorage.getItem('theme');
if (storedTheme) root.setAttribute('data-theme', storedTheme);

const setTheme = (mode) => {
  root.setAttribute('data-theme', mode);
  localStorage.setItem('theme', mode);
  const icon = qs('.theme-icon', themeToggle);
  if (icon) icon.textContent = mode === 'light' ? '☀️' : '🌙';
};
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    setTheme(current);
  });
  // Initialize icon correctly
  setTheme(root.getAttribute('data-theme') || 'dark');
}

// ---------- Tilt effect ----------
qsa('.tilt').forEach(card => {
  let bounds = card.getBoundingClientRect();
  const onMove = (e) => {
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    const rx = ((y / bounds.height) - 0.5) * -6;
    const ry = ((x / bounds.width) - 0.5) * 6;
    card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0.0001px)`;
  };
  const onEnter = () => { card.style.transition = 'transform 180ms ease'; };
  const onLeave = () => { card.style.transition = 'transform 220ms ease'; card.style.transform = 'perspective(700px) rotateX(0) rotateY(0)'; };
  window.addEventListener('resize', () => { bounds = card.getBoundingClientRect(); });
  card.addEventListener('mousemove', onMove);
  card.addEventListener('mouseenter', onEnter);
  card.addEventListener('mouseleave', onLeave);
});

// ---------- Magnetic buttons ----------
qsa('.magnetic').forEach(btn => {
  const span = qs('span', btn);
  if (!span) return;
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    span.style.transform = `translate(${x * 0.15}px, ${y * 0.25}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    span.style.transform = 'translate(0,0)';
  });
});

// ---------- Smooth anchor focus ----------
qsa('a[href^="#"]').forEach(a => {
  a.addEventListener('click', () => {
    const id = a.getAttribute('href').slice(1);
    const section = qs(`#${id}`);
    if (section) section.setAttribute('tabindex', '-1'), section.focus({ preventScroll: true });
  });
});

// ---------- Footer year ----------
const yearEl = qs('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------- Demo form handler ----------
const form = qs('.contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = qs('#name').value.trim();
    const email = qs('#email').value.trim();
    const message = qs('#message').value.trim();

    if (!name || !email || !message) {
      alert('Please fill out all fields.');
      return;
    }
    // PLACEHOLDER: integrate your backend or use mailto:
    // Example: window.location.href = `mailto:your@email.com?subject=Portfolio inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}`
    alert('Thanks! This demo form does not send yet — replace with your backend or mailto.');
    form.reset();
  });
}