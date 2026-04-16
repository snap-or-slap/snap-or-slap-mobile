/* ==========================================================================
   NAV — nav.js
   --------------------------------------------------------------------------
   Sticky nav shadow on scroll + mobile hamburger toggle +
   active section highlighting.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const nav    = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  const links  = document.querySelector('.nav__links');
  const navLinks = document.querySelectorAll('.nav__link[href^="#"]');

  /* ── Scroll shadow ───────────────────────────────────────────────────── */
  if (nav) {
    const observer = new IntersectionObserver(
      ([entry]) => nav.classList.toggle('nav--scrolled', !entry.isIntersecting),
      { threshold: 0, rootMargin: '-1px 0px 0px 0px' }
    );
    // Observe a 1-px sentinel at the very top of the page
    const sentinel = document.createElement('div');
    sentinel.style.height = '1px';
    document.body.prepend(sentinel);
    observer.observe(sentinel);
  }

  /* ── Active section highlight ────────────────────────────────────────── */
  if (navLinks.length) {
    const sections = [];
    navLinks.forEach(link => {
      const id = link.getAttribute('href').slice(1);
      const section = document.getElementById(id);
      if (section) sections.push({ id, el: section, link });
    });

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const match = sections.find(s => s.el === entry.target);
          if (match) {
            if (entry.isIntersecting) {
              navLinks.forEach(l => l.classList.remove('nav__link--active'));
              match.link.classList.add('nav__link--active');
            }
          }
        });
      },
      { threshold: 0.2, rootMargin: '-80px 0px -50% 0px' }
    );

    sections.forEach(s => sectionObserver.observe(s.el));
  }

  /* ── Mobile toggle ───────────────────────────────────────────────────── */
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('nav__links--open');
      toggle.setAttribute('aria-expanded', isOpen);
    });

    // Close the menu when a link is tapped
    links.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('nav__links--open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
});
