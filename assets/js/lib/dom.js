/* Utilitários de DOM compartilhados pelos componentes. */
window.Behling = window.Behling || {};

window.Behling.dom = (function () {
  var reduceQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function prefersReducedMotion() {
    return !!(reduceQuery && reduceQuery.matches);
  }

  /* Aparição suave ao rolar. Sem JS ou com movimento reduzido, tudo fica visível. */
  var observer = null;
  function reveal(root) {
    var nodes = qsa('[data-reveal]:not(.is-visible)', root);
    if (!nodes.length) return;
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      nodes.forEach(function (n) { n.classList.add('is-visible'); });
      return;
    }
    if (!observer) {
      observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
      );
    }
    nodes.forEach(function (n) { observer.observe(n); });
  }

  return { esc: esc, qs: qs, qsa: qsa, prefersReducedMotion: prefersReducedMotion, reveal: reveal };
})();
