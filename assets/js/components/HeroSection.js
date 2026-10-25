/* Hero: composição editorial assimétrica — logotipo, título, fotografia de Kim. */
window.Behling = window.Behling || {};

window.Behling.HeroSection = (function () {
  var B = window.Behling;
  var esc = B.dom.esc;

  function render() {
    var cfg = B.config;
    var t = cfg.text.hero;
    var o = B.ornaments;

    return (
      '<div class="hero__bg" aria-hidden="true"><span class="hero__glow"></span></div>' +
      '<div class="hero__ornaments" aria-hidden="true">' +
        '<span class="hero__orn hero__orn--a">' + o.star(18) + '</span>' +
        '<span class="hero__orn hero__orn--b">' + o.star(10) + '</span>' +
        '<span class="hero__orn hero__orn--c">' + o.moon(22) + '</span>' +
        '<span class="hero__rule hero__rule--v"></span>' +
      '</div>' +
      '<div class="container hero__grid">' +
        '<div class="hero__copy">' +
          '<p class="eyebrow hero__eyebrow">' + esc(t.eyebrow) + '</p>' +
          '<h1 class="hero__title">' +
            '<span class="sr-only">Behling Tattoo — </span>' +
            '<img class="hero__logo" data-logo src="' + esc(B.theme.logoSrc()) + '" alt="" ' +
              'width="435" height="306" fetchpriority="high" decoding="async">' +
            '<span class="hero__headline">' +
              t.titleLines.map(function (l) { return '<span class="hero__line">' + l + '</span>'; }).join('') +
            '</span>' +
          '</h1>' +
          '<p class="hero__lead">' + esc(t.lead) + '</p>' +
          '<div class="hero__actions">' +
            '<a class="btn btn--solid" href="' + esc(t.primaryCta.href) + '">' + esc(t.primaryCta.label) + '</a>' +
            '<a class="btn btn--ghost" href="' + esc(t.secondaryCta.href) + '">' + esc(t.secondaryCta.label) + '</a>' +
          '</div>' +
        '</div>' +
        '<figure class="hero__figure">' +
          '<div class="hero__portrait">' +
            '<img src="' + esc(cfg.images.kim) + '" alt="' + esc(cfg.images.kimAlt) + '" ' +
              'width="468" height="533" fetchpriority="high" decoding="async">' +
          '</div>' +
        '</figure>' +
      '</div>' +
      '<a class="hero__scroll" href="#portfolio" aria-label="Rolar para o portfólio">' +
        '<span class="hero__scroll-label">' + esc(t.scrollLabel) + '</span>' +
        '<span class="hero__scroll-line"></span>' + o.arrowDown() +
      '</a>'
    );
  }

  function init(root) {
    root.innerHTML = render();
  }

  return { init: init, render: render };
})();
