/* Regras de exibição do portfólio: o que é publicado, rótulos de tipo e
   legendas. Mantém tatuagem realizada e desenho claramente separados. */
window.Behling = window.Behling || {};

window.Behling.portfolioData = (function () {
  var esc = window.Behling.dom.esc;

  var TYPE_LABELS = {
    tattoo: 'Tatuagem realizada',
    flash: 'Flash autoral',
    drawing: 'Desenho autoral',
    study: 'Estudo',
    process: 'Processo criativo',
  };

  function isValid(w) {
    return !!(w && w.published === true && w.src && TYPE_LABELS[w.type]);
  }

  function published(list) {
    return (Array.isArray(list) ? list : []).filter(isValid);
  }

  function label(w) {
    return TYPE_LABELS[w.type] || '';
  }

  function altText(w) {
    if (w.alt) return w.alt;
    return label(w) + (w.title ? ': ' + w.title : '');
  }

  /* Linha de legenda: só inclui campos preenchidos. */
  function metaParts(w) {
    return [w.style, w.bodyArea].filter(function (v) { return v && String(v).trim(); });
  }

  /* Elemento <img> com tamanho declarado quando disponível (evita saltos de layout). */
  function img(w, opts) {
    opts = opts || {};
    var attrs = [
      'src="' + esc(w.src) + '"',
      'alt="' + esc(altText(w)) + '"',
      'decoding="async"',
      'draggable="false"',
    ];
    attrs.push('loading="' + (opts.eager ? 'eager' : 'lazy') + '"');
    if (opts.eager) attrs.push('fetchpriority="high"');
    if (w.width && w.height) {
      attrs.push('width="' + Number(w.width) + '"', 'height="' + Number(w.height) + '"');
    }
    if (opts.cover && w.focus) attrs.push('style="object-position:' + esc(w.focus) + '"');
    if (opts.sizes) attrs.push('sizes="' + esc(opts.sizes) + '"');
    return '<img ' + attrs.join(' ') + '>';
  }

  /* Itens usados em cada área */
  function all() {
    return published(window.Behling.works);
  }

  function carouselItems() {
    return all().filter(function (w) { return w.type === 'tattoo' && w.featured !== false; });
  }

  /* A galeria evita repetir, logo abaixo, as mesmas poucas fotos do carrossel.
     Com até 4 peças no total, ela lista só o que NÃO está no carrossel. */
  function galleryItems() {
    var items = all();
    var inCarousel = carouselItems();
    if (inCarousel.length >= 1 && items.length <= 4) {
      return items.filter(function (w) { return inCarousel.indexOf(w) === -1; });
    }
    return items;
  }

  function universeItems() {
    return published(window.Behling.universe).filter(function (w) { return w.type !== 'tattoo'; });
  }

  return {
    label: label,
    altText: altText,
    metaParts: metaParts,
    img: img,
    all: all,
    carouselItems: carouselItems,
    galleryItems: galleryItems,
    universeItems: universeItems,
    TYPE_LABELS: TYPE_LABELS,
  };
})();
