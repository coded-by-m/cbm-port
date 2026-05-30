/* ============================================
   Coded by M — Brand Hub Scripts
   ============================================ */

(function () {
  'use strict';

  // ==========================================
  // Mobile menu toggle
  // ==========================================
  const menuBtn = document.getElementById('menuBtn');
  const mobileNav = document.getElementById('mobileNav');

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      const isOpen = mobileNav.classList.contains('open');
      menuBtn.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    });

    // Close mobile nav on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        menuBtn.setAttribute('aria-label', 'Abrir menu');
      });
    });
  }

  // ==========================================
  // Intersection Observer — fade in sections
  // ==========================================
  const sections = document.querySelectorAll('.section');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    sections.forEach(section => observer.observe(section));
  } else {
    // Fallback for older browsers
    sections.forEach(section => section.classList.add('visible'));
  }

  // ==========================================
  // Copy email logo URL
  // ==========================================
  const copyBtn = document.getElementById('copyBtn');
  const emailUrlEl = document.getElementById('emailUrl');
  const toast = document.getElementById('toast');

  if (copyBtn && emailUrlEl) {
    copyBtn.addEventListener('click', async () => {
      const text = emailUrlEl.textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
        showToast('Caminho copiado para a área de transferência.');
      } catch (err) {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          showToast('Caminho copiado para a área de transferência.');
        } catch (e) {
          showToast('Não foi possível copiar automaticamente.');
        }
        document.body.removeChild(textarea);
      }
    });
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }

  // ==========================================
  // Copy email signature HTML code
  // ==========================================
  const copyCodeBtn = document.getElementById('copyCodeBtn');
  const emailCodeEl = document.getElementById('emailCode');

  if (copyCodeBtn && emailCodeEl) {
    copyCodeBtn.addEventListener('click', async () => {
      const text = emailCodeEl.textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
        showToast('Código HTML copiado para a área de transferência.');
      } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          showToast('Código HTML copiado para a área de transferência.');
        } catch (e) {
          showToast('Não foi possível copiar automaticamente.');
        }
        document.body.removeChild(textarea);
      }
    });
  }

  // ==========================================
  // Smooth scroll for anchor links (polyfill-like enhancement)
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 72;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================
  // Active nav link on scroll
  // ==========================================
  const navLinks = document.querySelectorAll('.nav a');
  const scrollSections = document.querySelectorAll('section[id]');

  function setActiveLink() {
    let current = '';
    scrollSections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop - 120) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActiveLink);
  setActiveLink();
})();
