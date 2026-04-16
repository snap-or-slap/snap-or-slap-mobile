document.addEventListener('DOMContentLoaded', () => {
  const elements = Array.from(document.querySelectorAll('[data-parallax-speed]'));
  if (!elements.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const state = new Map();
  elements.forEach((el) => {
    state.set(el, {
      current: 0,
      base: (el.dataset.baseTransform || '').trim(),
    });
  });

  function update() {
    const viewportH = window.innerHeight;
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < -120 || rect.top > viewportH + 120) return;
      const speed = parseFloat(el.dataset.parallaxSpeed || '0');
      const target = (viewportH * 0.5 - (rect.top + rect.height * 0.5)) * speed;
      const item = state.get(el);
      item.current += (target - item.current) * 0.12;
      const base = item.base && item.base !== 'none' ? item.base + ' ' : '';
      el.style.transform = `${base}translate3d(0, ${item.current.toFixed(2)}px, 0)`;
    });
    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
});
