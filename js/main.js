/* =============================================
   AHM — Main JavaScript (SaaS Redesign)
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {
  // ===== THEME TOGGLE =====
  function getPreferredTheme() {
    const stored = localStorage.getItem('ahm-theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function syncThemeToggleUI(theme) {
    document.querySelectorAll('#theme-toggle').forEach(btn => {
      const icon = btn.querySelector('i');
      const label = btn.querySelector('.ds-theme-toggle__label');
      const isLight = theme === 'light';
      if (icon) icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
      if (label) label.textContent = isLight ? 'Light' : 'Dark';
      btn.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
      btn.setAttribute('title', isLight ? 'Switch to dark theme' : 'Switch to light theme');
      btn.setAttribute('aria-pressed', String(isLight));
    });
  }

  function applyTheme(theme) {
    const normalized = theme === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', normalized);
    localStorage.setItem('ahm-theme', normalized);
    syncThemeToggleUI(normalized);
  }

  function initThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    if (!btn || btn.dataset.bound === 'true') return;
    btn.dataset.bound = 'true';
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
    syncThemeToggleUI(document.documentElement.getAttribute('data-theme') || 'dark');
  }

  applyTheme(getPreferredTheme());
  document.addEventListener('includes:loaded', initThemeToggle);
  initThemeToggle();

  // ===== SCROLL ANIMATIONS =====
  const observedSet = new WeakSet();
  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0});

  function observeAnimations() {
    document.querySelectorAll('.ds-animate, .ds-slide-left, .ds-slide-right').forEach(el => {
      if (!observedSet.has(el)) {
        observedSet.add(el);
        animObserver.observe(el);
      }
    });
  }
  observeAnimations();
  // Re-observe after partials.js injects header/hero/footer
  document.addEventListener('includes:loaded', observeAnimations);

  // ===== INIT NAV (runs after partials inject header) =====
  function initNav() {
    const navToggle = document.querySelector('.ds-nav__toggle');
    const navLinks = document.getElementById('site-nav');
    if (navToggle && navLinks) {
      navToggle.addEventListener('click', () => {
        const open = navLinks.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', String(open));
        navToggle.innerHTML = open ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
          navLinks.classList.remove('is-open');
          navToggle.setAttribute('aria-expanded', 'false');
          navToggle.innerHTML = '<i class="fas fa-bars"></i>';
          navToggle.focus();
        }
      });
    }
    const nav = document.querySelector('.ds-nav');
    if (nav) {
      const onScroll = () => {
        const y = window.scrollY;
        const style = getComputedStyle(document.documentElement);
        const navBg = style.getPropertyValue('--nav-bg').trim() || 'rgba(11,18,34,0.85)';
        const navBgScrolled = style.getPropertyValue('--nav-bg-scrolled').trim() || 'rgba(11,18,34,0.96)';
        nav.style.background = y > 20 ? navBgScrolled : navBg;
        nav.style.boxShadow = y > 20 ? '0 4px 24px rgba(0,0,0,0.3)' : 'none';
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  }
  document.addEventListener('includes:loaded', initNav);
  initNav(); // also try immediately in case includes already loaded

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== FORM HANDLING =====
  document.querySelectorAll('.secure-form').forEach(form => {
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) validateField(input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;
      inputs.forEach(input => { if (!validateField(input)) valid = false; });
      if (valid) submitForm(form);
      else {
        const first = form.querySelector('.is-invalid');
        if (first) { first.focus(); first.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      }
    });
  });

  function validateField(field) {
    const val = field.value.trim();
    const req = field.hasAttribute('required');
    field.classList.remove('is-valid', 'is-invalid');
    if (!req && !val) return true;
    let ok = true;
    if (req && !val) ok = false;
    if (val && ok) {
      if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) ok = false;
      if (field.type === 'tel' && val.replace(/\D/g, '').length < 10) ok = false;
      if ((field.name === 'firstName' || field.name === 'lastName') && val.length < 2) ok = false;
      if (field.tagName === 'TEXTAREA' && field.name === 'message' && val.length < 10) ok = false;
    }
    field.classList.add(ok ? 'is-valid' : 'is-invalid');
    field.style.borderColor = ok ? '' : 'var(--sys-danger)';
    return ok;
  }

  function submitForm(form) {
    const btn = form.querySelector('button[type="submit"]');
    const btnText = btn.querySelector('.btn-text');
    const origText = btnText ? btnText.textContent : btn.textContent;
    if (btnText) btnText.textContent = 'Sending...';
    else btn.textContent = 'Sending...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    const data = new FormData(form);
    data.append('_timestamp', new Date().toISOString());

    fetch(form.action, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
      .then(r => {
        if (r.ok) showMsg(form, 'success', 'Thank you! Your message has been sent. We\'ll respond within 24 hours.');
        else throw new Error('Failed');
      })
      .catch(() => showMsg(form, 'error', 'Something went wrong. Please try again or email us directly.'))
      .finally(() => {
        if (btnText) btnText.textContent = origText;
        else btn.textContent = origText;
        btn.disabled = false;
        btn.style.opacity = '';
      });
  }

  function showMsg(form, type, text) {
    const div = document.createElement('div');
    div.setAttribute('role', type === 'error' ? 'alert' : 'status');
    div.style.cssText = `padding:16px 20px;border-radius:10px;margin-bottom:16px;font-size:0.9375rem;line-height:1.5;border:1px solid ${type === 'error' ? 'var(--sys-danger)' : 'var(--sys-success)'};color:${type === 'error' ? '#FCA5A5' : '#6EE7B7'};background:${type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)'}`;
    div.textContent = text;
    form.parentNode.insertBefore(div, form);
    if (type === 'success') { form.reset(); form.querySelectorAll('.is-valid,.is-invalid').forEach(f => { f.classList.remove('is-valid','is-invalid'); f.style.borderColor = ''; }); }
    setTimeout(() => div.remove(), 8000);
  }

  // ===== BACK TO TOP =====
  const btt = document.getElementById('back-to-top-btn');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('show', window.scrollY > 400);
    }, { passive: true });
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
});

function setActiveNav() {
  const links = document.querySelectorAll('.ds-nav__link');
  const current = window.location.pathname.replace(/\/index\.html$/, '');

  links.forEach(link => {
    const href = link.getAttribute('href').replace(/\/index\.html$/, '');

    if (current === href) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}
