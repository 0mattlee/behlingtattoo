/* Cabeçalho: transparente sobre o hero, preto translúcido ao rolar.
   Em telas pequenas, menu compacto que fecha ao escolher uma seção. */
window.Behling = window.Behling || {};

window.Behling.Header = (function () {
  var B = window.Behling;
  var esc = B.dom.esc;
  var cfg = B.config;

  function render() {
    var links = cfg.nav
      .map(function (l) {
        return '<li><a class="nav__link" href="' + esc(l.href) + '">' + esc(l.label) + '</a></li>';
      })
      .join('');

    return (
      '<div class="header__inner">' +
        '<a class="header__brand" href="#inicio" aria-label="' + esc(cfg.brand.name) + ' — voltar ao início">' +
          '<img data-logo src="' + esc(B.theme.logoSrc()) + '" alt="' + esc(cfg.images.logoAlt) + '" height="46" decoding="async">' +
        '</a>' +
        '<nav class="header__nav" aria-label="Principal">' +
          '<ul class="nav__list">' + links + '</ul>' +
          '<a class="btn btn--small btn--ghost header__cta" href="' + esc(cfg.navCta.href) + '">' + esc(cfg.navCta.label) + '</a>' +
        '</nav>' +
        (B.theme.hasLightLogo()
          ? '<button class="header__theme" type="button" data-theme-toggle aria-pressed="false" aria-label="Ativar tema claro">' +
              '<span class="theme__icon theme__icon--sun">' + B.ornaments.icon('sun', 22) + '</span>' +
              '<span class="theme__icon theme__icon--moon">' + B.ornaments.icon('moonicon', 22) + '</span>' +
            '</button>'
          : '') +
        '<button class="header__toggle" type="button" aria-expanded="false" aria-controls="menu-movel" aria-label="Abrir menu">' +
          '<span class="toggle__icon toggle__icon--open">' + B.ornaments.icon('menu', 24) + '</span>' +
          '<span class="toggle__icon toggle__icon--close">' + B.ornaments.icon('close', 24) + '</span>' +
        '</button>' +
      '</div>' +
      '<div class="header__line" aria-hidden="true"></div>' +
      '<div class="mobile-menu" id="menu-movel" hidden>' +
        '<ul class="mobile-menu__list">' + links.replace(/nav__link/g, 'mobile-menu__link') + '</ul>' +
        '<a class="btn btn--solid mobile-menu__cta" href="' + esc(cfg.navCta.href) + '">' + esc(cfg.navCta.label) + '</a>' +
      '</div>'
    );
  }

  function init(root) {
    var dom = B.dom;
    root.innerHTML = render();

    var themeBtn = dom.qs('[data-theme-toggle]', root);
    if (themeBtn) themeBtn.addEventListener('click', function () { B.theme.toggle(themeBtn); });
    B.theme.sync();

    var toggle = dom.qs('.header__toggle', root);
    var menu = dom.qs('.mobile-menu', root);
    var hero = document.getElementById('inicio');

    function setMenu(open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      root.classList.toggle('is-menu-open', open);
      if (open) {
        menu.hidden = false;
        // força o próximo quadro para a transição acontecer
        requestAnimationFrame(function () { menu.classList.add('is-open'); });
      } else {
        menu.classList.remove('is-open');
        var done = function () { if (!root.classList.contains('is-menu-open')) menu.hidden = true; };
        if (dom.prefersReducedMotion()) done(); else setTimeout(done, 260);
      }
    }

    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });

    // Fecha ao escolher uma seção
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });

    // Fecha com Escape e ao clicar fora
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (toggle.getAttribute('aria-expanded') === 'true' && !root.contains(e.target)) setMenu(false);
    });

    // Se a janela crescer para desktop com o menu aberto, fecha
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900 && toggle.getAttribute('aria-expanded') === 'true') setMenu(false);
    });

    // Estados de rolagem: fundo ao rolar; logotipo discreto surge após o hero
    var ticking = false;
    function update() {
      ticking = false;
      var y = window.scrollY || 0;
      root.classList.toggle('is-scrolled', y > 24);
      var heroBottom = hero ? hero.offsetTop + hero.offsetHeight : 600;
      root.classList.toggle('show-brand', y > heroBottom * 0.55);
    }
    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
      },
      { passive: true }
    );
    window.addEventListener('resize', update);
    update();
  }

  return { init: init, render: render };
})();
