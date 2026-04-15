/* ==========================================================================
   NAV — nav.js
   --------------------------------------------------------------------------
   Sticky nav shadow on scroll  +  mobile hamburger toggle.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const nav    = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  const links  = document.querySelector('.nav__links');

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
