/* ==========================================================================
   INTERACTIONS — interactions.js
   --------------------------------------------------------------------------
   Scroll-reveal animations.  Elements with class "reveal" fade-in when
   they enter the viewport.  Add more interaction helpers below.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const reveals = document.querySelectorAll('.reveal');

  if (!reveals.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          io.unobserve(entry.target);            // animate only once
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach(el => io.observe(el));
});
