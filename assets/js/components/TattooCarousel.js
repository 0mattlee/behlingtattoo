/* Carrossel automático de tatuagens realizadas.
   • 1 imagem  → apresentação editorial estática (sem controles);
   • 2 imagens → uma por vez, com transição de opacidade;
   • 3+        → composição central com prévia da anterior e da seguinte (desktop).
   Nunca duplica imagens para preencher espaço. */
window.Behling = window.Behling || {};

window.Behling.TattooCarousel = (function () {
  var B = window.Behling;
  var esc = B.dom.esc;
  var PD = B.portfolioData;

  function captionHtml(w) {
    var meta = [PD.label(w)].concat(PD.metaParts(w));
    return (
      '<figcaption class="slide__caption">' +
        (w.title ? '<span class="slide__title">' + esc(w.title) + '</span>' : '') +
        '<span class="slide__meta">' + meta.map(esc).join(' · ') + '</span>' +
        (w.caption ? '<span class="slide__text">' + esc(w.caption) + '</span>' : '') +
      '</figcaption>'
    );
  }

  function renderSingle(w) {
    return (
      '<figure class="feature" data-reveal>' +
        '<button class="feature__open" type="button" data-open="0" aria-label="Ampliar imagem">' +
          '<span class="feature__frame">' + PD.img(w, { sizes: '(min-width: 900px) 460px, 86vw' }) + '</span>' +
        '</button>' +
        captionHtml(w) +
      '</figure>'
    );
  }

  function renderMulti(list, label) {
    var n = list.length;
    var slides = list
      .map(function (w, i) {
        return (
          '<figure class="slide" data-index="' + i + '">' +
            '<button class="slide__open" type="button" data-open="' + i + '" aria-label="Ampliar imagem ' + (i + 1) + ' de ' + n + '">' +
              '<span class="slide__frame">' + PD.img(w, { cover: true, sizes: '(min-width: 900px) 440px, 80vw' }) + '</span>' +
            '</button>' +
            captionHtml(w) +
          '</figure>'
        );
      })
      .join('');

    var dots = list
      .map(function (w, i) {
        return '<button class="carousel__dot" type="button" data-go="' + i + '" aria-label="Ir para a imagem ' + (i + 1) + ' de ' + n + '"></button>';
      })
      .join('');

    return (
      '<div class="carousel" role="region" aria-roledescription="carrossel" aria-label="' + esc(label) + '" tabindex="0" ' +
        'data-count="' + n + '" data-peeks="' + (n >= 3 ? 'true' : 'false') + '">' +
        '<div class="carousel__stage">' + slides + '</div>' +
        '<div class="carousel__controls">' +
          '<button class="carousel__btn carousel__prev" type="button" aria-label="Imagem anterior">' + B.ornaments.icon('prev', 20) + '</button>' +
          '<div class="carousel__dots">' + dots + '</div>' +
          '<button class="carousel__btn carousel__play" type="button" aria-label="Pausar rotação automática">' +
            '<span class="play__pause">' + B.ornaments.icon('pause', 18) + '</span>' +
            '<span class="play__play">' + B.ornaments.icon('play', 18) + '</span>' +
          '</button>' +
          '<button class="carousel__btn carousel__next" type="button" aria-label="Próxima imagem">' + B.ornaments.icon('next', 20) + '</button>' +
        '</div>' +
        '<p class="sr-only" aria-live="polite" data-live></p>' +
      '</div>'
    );
  }

  function init(root, list) {
    var dom = B.dom;
    var n = list.length;
    if (!n) { root.innerHTML = ''; return; }

    if (n === 1) {
      root.innerHTML = renderSingle(list[0]);
      root.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-open]');
        if (btn) B.Lightbox.open(list, 0, btn);
      });
      return;
    }

    root.innerHTML = renderMulti(list, B.config.text.portfolio.carouselLabel);

    var carousel = dom.qs('.carousel', root);
    var stage = dom.qs('.carousel__stage', root);
    var slides = dom.qsa('.slide', root);
    var dots = dom.qsa('.carousel__dot', root);
    var playBtn = dom.qs('.carousel__play', root);
    var live = dom.qs('[data-live]', root);

    var reduce = dom.prefersReducedMotion();
    var interval = Math.max(3000, Number(B.config.portfolio.carouselIntervalMs) || 5500);
    var current = 0;
    var timer = null;
    var wantsPlay = !reduce;   // preferência do visitante (botão pausar/continuar)
    var hovering = false;
    var focusing = false;
    var visible = true;

    function norm(d) {
      // distância circular mínima: -n/2 … n/2
      var h = n / 2;
      d = ((d % n) + n) % n;
      return d > h ? d - n : d;
    }

    function layout() {
      var peeks = carousel.getAttribute('data-peeks') === 'true';
      slides.forEach(function (s, i) {
        var d = norm(i - current);
        var pos;
        if (d === 0) pos = 'center';
        else if (peeks && d === 1) pos = 'next';
        else if (peeks && d === -1) pos = 'prev';
        else pos = d > 0 ? 'far-next' : 'far-prev';
        s.setAttribute('data-pos', pos);
        var isCenter = pos === 'center';
        s.setAttribute('aria-hidden', isCenter ? 'false' : 'true');
        var open = dom.qs('.slide__open', s);
        open.tabIndex = isCenter ? 0 : -1;
      });
      dots.forEach(function (d, i) {
        if (i === current) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
      });
    }

    function go(i, announce) {
      current = ((i % n) + n) % n;
      layout();
      if (announce) live.textContent = 'Imagem ' + (current + 1) + ' de ' + n;
      restart();
    }

    function next() { go(current + 1, true); }
    function prev() { go(current - 1, true); }

    function shouldRun() {
      return wantsPlay && !hovering && !focusing && visible && !document.hidden && !reduce;
    }
    function clear() { if (timer) { clearTimeout(timer); timer = null; } }
    function restart() {
      clear();
      if (shouldRun()) timer = setTimeout(function () { go(current + 1, false); }, interval);
    }

    function syncPlayButton() {
      var playing = wantsPlay && !reduce;
      carousel.classList.toggle('is-playing', playing);
      playBtn.setAttribute('aria-label', playing ? 'Pausar rotação automática' : 'Retomar rotação automática');
    }

    /* Controles */
    dom.qs('.carousel__prev', root).addEventListener('click', prev);
    dom.qs('.carousel__next', root).addEventListener('click', next);
    dots.forEach(function (d) {
      d.addEventListener('click', function () { go(Number(d.getAttribute('data-go')), true); });
    });
    playBtn.addEventListener('click', function () {
      if (reduce) { reduce = false; wantsPlay = true; } else { wantsPlay = !wantsPlay; }
      syncPlayButton();
      restart();
    });

    /* Teclado */
    carousel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
      else if (e.key === 'Home') { e.preventDefault(); go(0, true); }
      else if (e.key === 'End') { e.preventDefault(); go(n - 1, true); }
    });

    /* Pausa ao interagir */
    carousel.addEventListener('mouseenter', function () { hovering = true; clear(); });
    carousel.addEventListener('mouseleave', function () { hovering = false; restart(); });
    carousel.addEventListener('focusin', function () { focusing = true; clear(); });
    carousel.addEventListener('focusout', function (e) {
      if (!carousel.contains(e.relatedTarget)) { focusing = false; restart(); }
    });
    document.addEventListener('visibilitychange', restart);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        restart();
      }, { threshold: 0.2 }).observe(carousel);
    }

    /* Gesto de deslizar + clique (sem confundir arrastar com tocar) */
    var startX = 0, startY = 0, dx = 0, tracking = false, moved = false, pointerId = null;
    stage.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      tracking = true; moved = false; dx = 0;
      startX = e.clientX; startY = e.clientY; pointerId = e.pointerId;
      hovering = hovering || e.pointerType !== 'mouse';
      clear();
    });
    stage.addEventListener('pointermove', function (e) {
      if (!tracking || e.pointerId !== pointerId) return;
      dx = e.clientX - startX;
      if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(e.clientY - startY)) moved = true;
    });
    function endPointer(e) {
      if (!tracking || (e && e.pointerId !== pointerId)) return;
      tracking = false;
      if (e && e.pointerType !== 'mouse') hovering = false;
      if (moved && Math.abs(dx) > 40) { if (dx < 0) next(); else prev(); }
      else restart();
    }
    stage.addEventListener('pointerup', endPointer);
    stage.addEventListener('pointercancel', endPointer);

    stage.addEventListener('click', function (e) {
      if (moved) { moved = false; e.preventDefault(); return; }
      var slide = e.target.closest('.slide');
      if (!slide) return;
      var i = Number(slide.getAttribute('data-index'));
      if (i === current) {
        B.Lightbox.open(list, i, dom.qs('.slide__open', slide));
      } else {
        go(i, true);
      }
    });

    syncPlayButton();
    layout();
    restart();
  }

  return { init: init };
})();
