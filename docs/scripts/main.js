/* ==========================================================================
   MAIN — main.js
   --------------------------------------------------------------------------
   Application entry-point.  Coordinates other modules and contains
   miscellaneous page-level logic.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Lazy image loading ──────────────────────────────────────────────── */
  // Fade in lazy-loaded images when they finish loading
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  lazyImages.forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('loaded'));
      img.addEventListener('error', () => img.classList.add('loaded')); // show anyway
    }
  });

  /* ── Console branding ────────────────────────────────────────────────── */
  console.log(
    '%c SnapOrSlap %c Snap to prove — Slap to move ',
    'background:#E86A33;color:#fff;font-weight:bold;padding:4px 8px;border-radius:4px 0 0 4px;',
    'background:#161B24;color:#F8F6F2;padding:4px 8px;border-radius:0 4px 4px 0;'
  );

});
