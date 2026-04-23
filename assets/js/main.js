/* ============================================
   main.js — Karim Mokhtar Site
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Header scroll effect ───
  const header = document.getElementById('site-header');
  if (header) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    }, { passive: true });
  }

  // ─── Mobile menu toggle ───
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ─── Scroll reveal animations ───
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger delay based on sibling index
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach((el, i) => {
    // Add stagger delay for grouped siblings
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
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
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
        const increment = Math.ceil(num / 40);
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
  if (hero && window.innerWidth > 768) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      hero.style.setProperty('--mouse-x', `${x}px`);
      hero.style.setProperty('--mouse-y', `${y}px`);
    });
  }

});
