/* Optional presentation only. No form, calendar, storage or URL mutations. */
(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches) return;
  const loader = document.createElement('script');
  loader.src = '/assets/motion-12.23.24.js';
  loader.async = true;
  loader.onload = () => {
    if (preference.matches || !window.Motion?.animate) return;
    const active = new Map();
    const enter = (element, distance = 8) => {
      if (!element || preference.matches) return;
      active.get(element)?.stop();
      const controls = Motion.animate(element,
        { opacity: [0.82, 1], transform: [`translateY(${distance}px)`, 'translateY(0px)'] },
        { duration: 0.22, ease: [0.22, 1, 0.36, 1] });
      active.set(element, controls);
      controls.then(() => { if (active.get(element) === controls) active.delete(element); });
    };
    // Text and embeds never depend on an animation to become visible.
    enter(document.querySelector('.hero-visual'), 10);
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { enter(entry.target); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.section-intro,.section-head,.pricing-ledger,.team-work').forEach(el => observer.observe(el));
    document.querySelectorAll('[data-stage],[data-mode]').forEach(button => {
      button.addEventListener('click', () => {
        enter(document.querySelector('.bubbles'), 4);
        enter(document.querySelector('.owner-panel'), 4);
      });
    });
    preference.addEventListener('change', event => {
      if (!event.matches) return;
      observer.disconnect();
      active.forEach((controls, element) => {
        controls.stop(); element.style.removeProperty('opacity'); element.style.removeProperty('transform');
      });
      active.clear();
    });
  };
  // A failed optional download leaves a fully visible, functional page.
  document.head.appendChild(loader);
})();
