/* Seção Portfólio: título + carrossel + galeria editorial.
   A galeria só mostra filtros quando existem peças suficientes em categorias
   distintas, e nunca exibe categorias vazias. */
window.Behling = window.Behling || {};

window.Behling.PortfolioGallery = (function () {
  var B = window.Behling;
  var esc = B.dom.esc;
  var PD = B.portfolioData;

  function itemHtml(w, i) {
    var meta = PD.metaParts(w);
    return (
      '<figure class="tile" data-reveal data-type="' + esc(w.type) + '">' +
        '<button class="tile__open" type="button" data-open="' + i + '" aria-label="Ampliar: ' + esc(w.title || PD.label(w)) + '">' +
          PD.img(w, { sizes: '(min-width: 1024px) 380px, (min-width: 640px) 45vw, 92vw' }) +
        '</button>' +
        '<figcaption class="tile__caption">' +
          '<span class="badge badge--' + esc(w.type) + '">' + esc(PD.label(w)) + '</span>' +
          (w.title ? '<span class="tile__title">' + esc(w.title) + '</span>' : '') +
          (meta.length ? '<span class="tile__meta">' + meta.map(esc).join(' · ') + '</span>' : '') +
          (w.caption ? '<span class="tile__text">' + esc(w.caption) + '</span>' : '') +
        '</figcaption>' +
      '</figure>'
    );
  }

  function filterTypes(items) {
    var counts = {};
    items.forEach(function (w) { counts[w.type] = (counts[w.type] || 0) + 1; });
    var types = Object.keys(counts);
    if (items.length < B.config.portfolio.filterMinTotal || types.length < 2) return [];
    return types.map(function (t) { return { type: t, label: PD.label({ type: t }), count: counts[t] }; });
  }

  var PLURAL = {
    tattoo: 'Tatuagens realizadas',
    flash: 'Flashs autorais',
    drawing: 'Desenhos autorais',
    study: 'Estudos',
    process: 'Processo criativo',
  };

  function renderGallery(root, items) {
    var types = filterTypes(items);
    var active = 'all';

    function draw() {
      var shown = active === 'all' ? items : items.filter(function (w) { return w.type === active; });
      var cols = shown.length >= 3 ? 'many' : shown.length === 2 ? 'two' : 'one';
      var filters = '';
      if (types.length) {
        filters =
          '<div class="filters" role="group" aria-label="Filtrar peças">' +
            '<button type="button" class="filters__btn" data-filter="all" aria-pressed="' + (active === 'all') + '">Tudo</button>' +
            types.map(function (t) {
              return '<button type="button" class="filters__btn" data-filter="' + esc(t.type) + '" aria-pressed="' + (active === t.type) + '">' + esc(PLURAL[t.type] || t.label) + '</button>';
            }).join('') +
          '</div>';
      }
      root.innerHTML =
        filters +
        '<div class="gallery gallery--' + cols + '">' + shown.map(itemHtml).join('') + '</div>';
      B.dom.reveal(root);
    }

    root.addEventListener('click', function (e) {
      var f = e.target.closest('[data-filter]');
      if (f) { active = f.getAttribute('data-filter'); draw(); return; }
      var open = e.target.closest('[data-open]');
      if (open) {
        var shown = active === 'all' ? items : items.filter(function (w) { return w.type === active; });
        B.Lightbox.open(shown, Number(open.getAttribute('data-open')), open);
      }
    });

    draw();
  }

  function render() {
    var t = B.config.text.portfolio;
    var o = B.ornaments;
    return (
      '<div class="container">' +
        '<header class="section__head section__head--center" data-reveal>' +
          '<p class="eyebrow">' + esc(t.eyebrow) + '</p>' +
          '<h2 class="section__title">' + esc(t.title) + '</h2>' +
          '<p class="section__sub">' + esc(t.subtitle) + '</p>' +
          o.divider() +
        '</header>' +
        '<div data-slot="carousel"></div>' +
        '<div data-slot="gallery"></div>' +
        '<div data-slot="empty"></div>' +
      '</div>'
    );
  }

  function init(root) {
    var t = B.config.text.portfolio;
    root.innerHTML = render();

    var carouselItems = PD.carouselItems();
    var galleryItems = PD.galleryItems();
    var total = PD.all().length;

    if (!total) {
      /* ESPAÇOS RESERVADOS — nenhum trabalho publicado ainda.
         >>> SUBSTITUIR: assim que Kim cadastrar a primeira tatuagem em
         >>> assets/js/data/works.js (published: true), estas molduras vazias
         >>> somem sozinhas e entra o carrossel real.
         São apenas molduras neutras (sem imagem, sem texto, não clicáveis);
         não representam trabalhos. */
      var ph = function (pos) {
        return '<figure class="slide" data-pos="' + pos + '"><span class="slide__frame slide__frame--ph">' +
          (pos === 'center' ? B.ornaments.moon(30) : '') + '</span></figure>';
      };
      B.dom.qs('[data-slot="carousel"]', root).innerHTML =
        '<div class="carousel carousel--placeholder" data-peeks="true" aria-hidden="true" data-reveal>' +
          '<div class="carousel__stage">' + ph('prev') + ph('center') + ph('next') + '</div>' +
        '</div>';
    } else {
      B.TattooCarousel.init(B.dom.qs('[data-slot="carousel"]', root), carouselItems);
      if (galleryItems.length) {
        renderGallery(B.dom.qs('[data-slot="gallery"]', root), galleryItems);
        B.dom.qs('[data-slot="gallery"]', root).classList.add('gallery-wrap');
      }
    }
    B.dom.reveal(root);
  }

  return { init: init };
})();
