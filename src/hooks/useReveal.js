import { useEffect } from 'react';

/**
 * Réactive les animations d'apparition (.reveal / .reveal-left / .reveal-right)
 * à chaque changement de page.
 */
export default function useReveal(deps = []) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      const els = document.querySelectorAll(
        '.page.active .reveal, .page.active .reveal-left, .page.active .reveal-right'
      );
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('visible');
              obs.unobserve(e.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
      );
      els.forEach((el) => obs.observe(el));
    }, 60);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
