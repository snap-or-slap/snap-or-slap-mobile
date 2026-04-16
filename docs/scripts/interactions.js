/* ==========================================================================
   INTERACTIONS — interactions.js
   --------------------------------------------------------------------------
   Scroll-reveal animations with stagger support.
   Elements with class "reveal" fade-in when they enter the viewport.
   Supports staggered children via "reveal-stagger" parent class.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Skip animations for reduced-motion users
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Instantly show all reveal elements
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('reveal--visible');
    });
    return;
  }

  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  // Assign stagger indices to children of .reveal-stagger parents
  document.querySelectorAll('.reveal-stagger').forEach(parent => {
    const children = parent.querySelectorAll('.reveal');
    children.forEach((child, i) => {
      child.style.setProperty('--reveal-index', i);
    });
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          io.unobserve(entry.target);            // animate only once
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach(el => io.observe(el));
});
