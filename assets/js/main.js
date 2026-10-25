/* Ponto de entrada: monta cada seção no seu ponto de ancoragem. */
(function () {
  var B = window.Behling;
  document.documentElement.classList.add('js');

  function mount(id, component) {
    var el = document.getElementById(id);
    if (!el) return;
    try {
      component.init(el);
    } catch (err) {
      // Uma seção com erro não derruba o resto do site.
      if (window.console) console.error('[Behling] Falha ao montar "' + id + '":', err);
    }
  }

  function start() {
    mount('site-header', B.Header);
    mount('inicio', B.HeroSection);
    mount('portfolio', B.PortfolioGallery);
    mount('universo', B.ArtworkSection);
    mount('sobre', B.AboutSection);
    mount('orcamento', B.BookingSection);
    mount('faq', B.FAQSection);
    mount('contato', B.ContactSection);
    mount('site-footer', B.Footer);
    B.dom.reveal(document);

    // Âncoras: compensa o cabeçalho fixo e respeita movimento reduzido
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href').slice(1);
      if (!id) return;
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: B.dom.prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
      if (history.replaceState) history.replaceState(null, '', '#' + id);
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
