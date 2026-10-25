/* Sobre Kim — foto real (config.images.about), sem recorte nem tratamento artificial. */
window.Behling = window.Behling || {};

window.Behling.AboutSection = (function () {
  var B = window.Behling;
  var esc = B.dom.esc;

  function init(root) {
    var cfg = B.config;
    var t = cfg.text.about;
    var paras = (t.paragraphs || []).filter(function (p) { return p && String(p).trim(); });

    root.innerHTML =
      '<div class="container about__grid">' +
        '<figure class="about__figure" data-reveal>' +
          '<div class="about__arch">' +
            '<img src="' + esc(cfg.images.about || cfg.images.kim) + '" alt="' + esc(cfg.images.about ? cfg.images.aboutAlt : cfg.images.kimAlt) + '" width="' + (cfg.images.aboutWidth || 468) + '" height="' + (cfg.images.aboutHeight || 533) + '" loading="lazy" decoding="async">' +
          '</div>' +
          '<span class="about__star about__star--a" aria-hidden="true">' + B.ornaments.star(16) + '</span>' +
          '<span class="about__star about__star--b" aria-hidden="true">' + B.ornaments.star(9) + '</span>' +
        '</figure>' +
        '<div class="about__copy" data-reveal>' +
          '<p class="eyebrow">' + esc(t.eyebrow) + '</p>' +
          '<h2 class="section__title">' + esc(t.title) + '</h2>' +
          paras.map(function (p) { return '<p class="about__p">' + esc(p) + '</p>'; }).join('') +
          (t.signature ? '<p class="about__sign">' + B.ornaments.moon(18) + '<span>' + esc(t.signature) + '</span></p>' : '') +
        '</div>' +
      '</div>';
    B.dom.reveal(root);
  }

  return { init: init };
})();
