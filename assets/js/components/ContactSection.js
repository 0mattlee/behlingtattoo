/* Chamada final. Só lista canais configurados; o botão principal sempre
   tem um destino válido (WhatsApp → Instagram → e-mail → formulário). */
window.Behling = window.Behling || {};

window.Behling.ContactSection = (function () {
  var B = window.Behling;
  var esc = B.dom.esc;

  function init(root) {
    var t = B.config.text.contact;
    var primary = B.contact.primary();
    var channels = B.contact.channels();

    root.innerHTML =
      '<div class="container contact__inner" data-reveal>' +
        '<span class="contact__star" aria-hidden="true">' + B.ornaments.star(22) + '</span>' +
        '<p class="eyebrow">' + esc(t.eyebrow) + '</p>' +
        '<h2 class="contact__title">' + esc(t.title) + '</h2>' +
        '<p class="contact__text">' + esc(t.text) + '</p>' +
        '<a class="btn btn--solid btn--large" href="' + esc(primary.href) + '"' +
          (primary.external ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' + esc(t.cta) + '</a>' +
        (channels.length
          ? '<ul class="contact__channels">' +
              channels.map(function (c) {
                return (
                  '<li><a class="channel" href="' + esc(c.href) + '"' + (c.external ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' +
                    B.ornaments.icon(c.icon, 20) +
                    '<span class="channel__text"><span class="channel__name">' + esc(c.label) + '</span>' +
                    (c.detail ? '<span class="channel__detail">' + esc(c.detail) + '</span>' : '') + '</span>' +
                  '</a></li>'
                );
              }).join('') +
            '</ul>'
          : '') +
        (B.config.brand.region ? '<p class="contact__region">' + B.ornaments.star(9) + '<span>' + esc(B.config.brand.region) + '</span>' + B.ornaments.star(9) + '</p>' : '') +
      '</div>';
    B.dom.reveal(root);
  }

  return { init: init };
})();
