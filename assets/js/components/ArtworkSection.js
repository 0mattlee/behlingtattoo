/* Universo artístico — "caderno de artista". Só exibe itens cadastrados e
   publicados em assets/js/data/universe.js. */
window.Behling = window.Behling || {};

window.Behling.ArtworkSection = (function () {
  var B = window.Behling;
  var esc = B.dom.esc;
  var PD = B.portfolioData;

  var ROMAN = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX'];

  function leaf(w, i) {
    var meta = [PD.label(w)].concat(PD.metaParts(w));
    return (
      '<figure class="leaf" data-reveal>' +
        '<button class="leaf__open" type="button" data-open="' + i + '" aria-label="Ampliar: ' + esc(w.title || PD.label(w)) + '">' +
          '<span class="leaf__mat">' + PD.img(w, { sizes: '(min-width: 1024px) 340px, (min-width: 640px) 44vw, 86vw' }) + '</span>' +
        '</button>' +
        '<figcaption class="leaf__caption">' +
          '<span class="leaf__no" aria-hidden="true">' + (ROMAN[i] || i + 1) + '</span>' +
          '<span class="leaf__label">' + (w.title ? esc(w.title) + ' · ' : '') + meta.map(esc).join(' · ') + '</span>' +
          (w.caption ? '<span class="leaf__text">' + esc(w.caption) + '</span>' : '') +
        '</figcaption>' +
      '</figure>'
    );
  }

  /* ESPAÇOS RESERVADOS — enquanto assets/js/data/universe.js estiver vazio.
     >>> SUBSTITUIR: ao publicar o primeiro desenho/flash/estudo, estas três
     >>> molduras somem sozinhas e entram as peças reais.
     São só molduras neutras (sem imagem, sem texto, não clicáveis). */
  function placeholderLeaf(i) {
    return (
      '<figure class="leaf leaf--ph" data-reveal aria-hidden="true">' +
        '<span class="leaf__mat"><span class="leaf__ph">' + (i === 1 ? B.ornaments.star(16) : '') + '</span></span>' +
        '<figcaption class="leaf__caption"><span class="leaf__no">' + ROMAN[i] + '</span></figcaption>' +
      '</figure>'
    );
  }

  function init(root) {
    var t = B.config.text.universe;
    var items = PD.universeItems();

    root.innerHTML =
      '<div class="container">' +
        '<header class="section__head section__head--split" data-reveal>' +
          '<div>' +
            '<p class="eyebrow">' + esc(t.eyebrow) + '</p>' +
            '<h2 class="section__title">' + esc(t.title) + '</h2>' +
          '</div>' +
          '<p class="section__sub">' + esc(t.text) + '</p>' +
        '</header>' +
        (items.length
          ? '<div class="notebook notebook--' + (items.length >= 3 ? 'many' : items.length === 2 ? 'two' : 'one') + '">' + items.map(leaf).join('') + '</div>'
          : '<div class="notebook notebook--many notebook--ph">' + [0, 1, 2, 3].map(placeholderLeaf).join('') + '</div>') +
      '</div>';

    root.addEventListener('click', function (e) {
      var open = e.target.closest('[data-open]');
      if (open) B.Lightbox.open(items, Number(open.getAttribute('data-open')), open);
    });
    B.dom.reveal(root);
  }

  return { init: init };
})();
