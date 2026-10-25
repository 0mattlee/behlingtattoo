/* Tema escuro (padrão da marca) e tema claro ("papel e tinta").
   • A escolha fica salva só neste navegador (localStorage, com try/catch).
   • O atributo data-theme é definido por um script no <head> antes da pintura,
     para a página não piscar.
   • No tema claro, o logotipo troca para a versão preta (config.images.logoLight). */
window.Behling = window.Behling || {};

window.Behling.theme = (function () {
  var B = window.Behling;
  var KEY = 'behling-theme';
  var root = document.documentElement;
  var COLORS = { dark: '#090909', light: '#ECE6D8' };

  function get() { return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; }

  function logoSrc() {
    var i = B.config.images;
    return get() === 'light' && i.logoLight ? i.logoLight : i.logo;
  }

  function hasLightLogo() { return !!B.config.images.logoLight; }

  function sync() {
    var t = get();
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', COLORS[t]);
    var imgs = document.querySelectorAll('img[data-logo]');
    for (var i = 0; i < imgs.length; i++) {
      var src = logoSrc();
      if (imgs[i].getAttribute('src') !== src) imgs[i].setAttribute('src', src);
    }
    var btns = document.querySelectorAll('[data-theme-toggle]');
    for (var j = 0; j < btns.length; j++) {
      btns[j].setAttribute('aria-pressed', t === 'light' ? 'true' : 'false');
      btns[j].setAttribute('aria-label', t === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro');
      btns[j].setAttribute('title', t === 'light' ? 'Tema escuro' : 'Tema claro');
    }
  }

  function set(t) {
    root.setAttribute('data-theme', t === 'light' ? 'light' : 'dark');
    try { localStorage.setItem(KEY, get()); } catch (e) { /* sem armazenamento: vale só nesta visita */ }
    sync();
  }

  /* Troca com animação: um círculo nasce no botão e se espalha pela tela
     (View Transitions API). Sem suporte → fade suave de cores. Com
     "reduzir movimento" → troca instantânea. */
  var busy = false;
  function toggle(origin) {
    var next = get() === 'light' ? 'dark' : 'light';
    var reduce = B.dom.prefersReducedMotion();
    if (reduce || busy) { if (!busy) set(next); return; }

    if (typeof document.startViewTransition !== 'function' || !origin || !origin.getBoundingClientRect) {
      root.classList.add('theme-fade');
      set(next);
      setTimeout(function () { root.classList.remove('theme-fade'); }, 600);
      return;
    }

    var rect = origin.getBoundingClientRect();
    var x = rect.left + rect.width / 2;
    var y = rect.top + rect.height / 2;
    var radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    busy = true;
    root.classList.add('theme-anim');
    var vt;
    try {
      vt = document.startViewTransition(function () { set(next); });
    } catch (e) {
      busy = false; root.classList.remove('theme-anim'); set(next); return;
    }
    vt.ready.then(function () {
      root.animate(
        { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + radius + 'px at ' + x + 'px ' + y + 'px)'] },
        { duration: 800, easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)', pseudoElement: '::view-transition-new(root)' }
      );
    }).catch(function () { /* a troca já aconteceu; só a animação falhou */ });
    vt.finished.then(done, done);
    function done() { busy = false; root.classList.remove('theme-anim'); }
  }

  return { get: get, set: set, toggle: toggle, logoSrc: logoSrc, sync: sync, hasLightLogo: hasLightLogo };
})();
