/* Visualização ampliada (lightbox) acessível:
   Escape fecha, setas navegam, foco preso no diálogo e devolvido ao fechar.
   Mostra a imagem inteira (sem cortes), usando `full` quando existir. */
window.Behling = window.Behling || {};

window.Behling.Lightbox = (function () {
  var B = window.Behling;
  var esc = B.dom.esc;

  var root, dialog, stage, caption, counter, btnPrev, btnNext, btnClose;
  var items = [];
  var index = 0;
  var lastFocus = null;
  var isOpen = false;
  var touchX = null;

  function build() {
    root = document.getElementById('lightbox-root');
    root.innerHTML =
      '<div class="lightbox" hidden>' +
        '<div class="lightbox__backdrop" data-close></div>' +
        '<div class="lightbox__dialog" role="dialog" aria-modal="true" aria-label="Imagem ampliada" tabindex="-1">' +
          '<button class="lightbox__btn lightbox__close" type="button" aria-label="Fechar">' + B.ornaments.icon('close', 22) + '</button>' +
          '<button class="lightbox__btn lightbox__prev" type="button" aria-label="Imagem anterior">' + B.ornaments.icon('prev', 24) + '</button>' +
          '<button class="lightbox__btn lightbox__next" type="button" aria-label="Próxima imagem">' + B.ornaments.icon('next', 24) + '</button>' +
          '<figure class="lightbox__figure">' +
            '<div class="lightbox__stage"></div>' +
            '<figcaption class="lightbox__caption"></figcaption>' +
          '</figure>' +
          '<p class="lightbox__counter" aria-live="polite"></p>' +
        '</div>' +
      '</div>';

    var wrap = root.firstChild;
    dialog = B.dom.qs('.lightbox__dialog', wrap);
    stage = B.dom.qs('.lightbox__stage', wrap);
    caption = B.dom.qs('.lightbox__caption', wrap);
    counter = B.dom.qs('.lightbox__counter', wrap);
    btnPrev = B.dom.qs('.lightbox__prev', wrap);
    btnNext = B.dom.qs('.lightbox__next', wrap);
    btnClose = B.dom.qs('.lightbox__close', wrap);

    btnClose.addEventListener('click', close);
    B.dom.qs('[data-close]', wrap).addEventListener('click', close);
    btnPrev.addEventListener('click', function () { go(-1); });
    btnNext.addEventListener('click', function () { go(1); });

    document.addEventListener('keydown', onKey);

    dialog.addEventListener('touchstart', function (e) {
      touchX = e.touches.length === 1 ? e.touches[0].clientX : null;
    }, { passive: true });
    dialog.addEventListener('touchend', function (e) {
      if (touchX == null || items.length < 2) return;
      var dx = e.changedTouches[0].clientX - touchX;
      touchX = null;
      if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  function onKey(e) {
    if (!isOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowLeft') { go(-1); }
    else if (e.key === 'ArrowRight') { go(1); }
    else if (e.key === 'Tab') { trapFocus(e); }
  }

  function trapFocus(e) {
    var focusables = B.dom.qsa('button:not([hidden]):not([disabled])', dialog);
    if (!focusables.length) return;
    var first = focusables[0];
    var last = focusables[focusables.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  function show() {
    var w = items[index];
    var src = w.full || w.src;
    var meta = [B.portfolioData.label(w)].concat(B.portfolioData.metaParts(w));
    var lines = '';
    if (w.title) lines += '<span class="lightbox__title">' + esc(w.title) + '</span>';
    lines += '<span class="lightbox__meta">' + meta.map(esc).join(' · ') + '</span>';
    if (w.caption) lines += '<span class="lightbox__text">' + esc(w.caption) + '</span>';

    stage.innerHTML =
      '<img class="lightbox__img" src="' + esc(src) + '" alt="' + esc(B.portfolioData.altText(w)) + '" decoding="async">';
    caption.innerHTML = lines;

    var multi = items.length > 1;
    btnPrev.hidden = !multi;
    btnNext.hidden = !multi;
    counter.textContent = multi ? (index + 1) + ' / ' + items.length : '';
  }

  function go(step) {
    if (items.length < 2) return;
    index = (index + step + items.length) % items.length;
    show();
  }

  function open(list, startIndex, trigger) {
    if (!list || !list.length) return;
    if (!root) build();
    items = list;
    index = Math.max(0, Math.min(startIndex || 0, list.length - 1));
    lastFocus = trigger || document.activeElement;
    show();
    var wrap = root.firstChild;
    wrap.hidden = false;
    isOpen = true;
    document.documentElement.classList.add('is-locked');
    requestAnimationFrame(function () {
      wrap.classList.add('is-open');
      btnClose.focus();
    });
  }

  function close() {
    if (!isOpen) return;
    var wrap = root.firstChild;
    isOpen = false;
    wrap.classList.remove('is-open');
    document.documentElement.classList.remove('is-locked');
    var finish = function () {
      if (!isOpen) { wrap.hidden = true; stage.innerHTML = ''; }
    };
    if (B.dom.prefersReducedMotion()) finish(); else setTimeout(finish, 220);
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  return { open: open, close: close };
})();
