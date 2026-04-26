/* ============================================
   main.js — Karim Mokhtar Site
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Header scroll effect ───
  const header = document.getElementById('site-header');
  if (header) {
    const updateHeader = () => {
      if (window.pageYOffset > 50) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  }

  // ─── Mobile menu toggle ───
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  let scrollLockY = 0;

  const closeMenu = () => {
    if (!navLinks || !navLinks.classList.contains('open')) return;
    menuToggle.classList.remove('active');
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollLockY);
  };

  const openMenu = () => {
    if (!navLinks || navLinks.classList.contains('open')) return;
    scrollLockY = window.pageYOffset;
    menuToggle.classList.add('active');
    navLinks.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    // iOS Safari scroll lock — preserves position without jump
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollLockY}px`;
    document.body.style.width = '100%';
  };

  if (menuToggle && navLinks) {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-controls', 'nav-links');

    menuToggle.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) closeMenu();
      else openMenu();
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => closeMenu());
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    // Close on resize past breakpoint (avoids stuck-open state on rotate/resize)
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768) closeMenu();
      }, 100);
    });
  }

  // ─── Scroll reveal animations ───
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach((el) => {
    if (el.parentElement) {
      const siblings = Array.from(el.parentElement.querySelectorAll(':scope > .reveal'));
      const siblingIndex = siblings.indexOf(el);
      if (siblingIndex > 0) {
        el.dataset.delay = siblingIndex * 100;
      }
    }
    observer.observe(el);
  });

  // ─── Smooth scroll for anchor links ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // ─── Animate stat numbers on scroll ───
  const animateNumbers = () => {
    document.querySelectorAll('.stat-number').forEach(stat => {
      if (stat.dataset.animated) return;
      const rect = stat.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        stat.dataset.animated = 'true';
        const text = stat.textContent;
        const num = parseInt(text);
        if (isNaN(num)) return;
        const suffix = text.replace(/[0-9]/g, '');
        let current = 0;
        const increment = Math.max(1, Math.ceil(num / 40));
        const timer = setInterval(() => {
          current += increment;
          if (current >= num) {
            current = num;
            clearInterval(timer);
          }
          stat.textContent = current + suffix;
        }, 30);
      }
    });
  };

  window.addEventListener('scroll', animateNumbers, { passive: true });
  animateNumbers();

  // ─── Cursor glow effect on hero (desktop only) ───
  const hero = document.querySelector('.hero');
  if (hero && window.matchMedia('(hover: hover) and (min-width: 769px)').matches) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      hero.style.setProperty('--mouse-x', `${x}px`);
      hero.style.setProperty('--mouse-y', `${y}px`);
    });
  }

});
