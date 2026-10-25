/* Rodapé: logotipo reduzido, navegação, redes configuradas e ano automático.
   Região de atendimento genérica (config.brand.region); nunca endereço. */
window.Behling = window.Behling || {};

window.Behling.Footer = (function () {
  var B = window.Behling;
  var esc = B.dom.esc;

  function init(root) {
    var cfg = B.config;
    var channels = B.contact.channels();
    var privacy = B.contact.privacyUrl();

    root.innerHTML =
      '<div class="container footer__inner">' +
        '<div class="footer__brand">' +
          '<img data-logo src="' + esc(B.theme.logoSrc()) + '" alt="' + esc(cfg.images.logoAlt) + '" width="150" height="105" loading="lazy" decoding="async">' +
          '<p class="footer__name">' + esc(cfg.brand.name) + '</p>' +
          '<p class="footer__artist">' + esc(cfg.brand.artist) + '</p>' +
          (cfg.brand.region ? '<p class="footer__region">' + esc(cfg.brand.region) + '</p>' : '') +
        '</div>' +
        '<nav class="footer__nav" aria-label="Rodapé">' +
          '<ul>' +
            cfg.nav.map(function (l) { return '<li><a href="' + esc(l.href) + '">' + esc(l.label) + '</a></li>'; }).join('') +
            '<li><a href="' + esc(cfg.navCta.href) + '">' + esc(cfg.navCta.label) + '</a></li>' +
          '</ul>' +
        '</nav>' +
        (channels.length
          ? '<ul class="footer__social" aria-label="Redes e contatos">' +
              channels.map(function (c) {
                return '<li><a href="' + esc(c.href) + '"' + (c.external ? ' target="_blank" rel="noopener noreferrer"' : '') +
                  ' aria-label="' + esc(c.label) + '">' + B.ornaments.icon(c.icon, 20) + '<span>' + esc(c.label) + '</span></a></li>';
              }).join('') +
            '</ul>'
          : '') +
      '</div>' +
      '<div class="container footer__base">' +
        '<p>© <span data-year></span> ' + esc(cfg.brand.name) + ' · ' + esc(cfg.brand.artist) + '</p>' +
        (privacy ? '<a href="' + esc(privacy) + '" target="_blank" rel="noopener noreferrer">Política de privacidade</a>' : '') +
      '</div>';

    B.dom.qs('[data-year]', root).textContent = String(new Date().getFullYear());
  }

  return { init: init };
})();
