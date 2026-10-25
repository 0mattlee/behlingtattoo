/* Perguntas frequentes em acordeão acessível (botões + regiões). */
window.Behling = window.Behling || {};

window.Behling.FAQSection = (function () {
  var B = window.Behling;
  var esc = B.dom.esc;

  function init(root) {
    var t = B.config.text.faq;
    var items = (Array.isArray(B.faq) ? B.faq : []).filter(function (f) {
      return f && f.published === true && f.q && f.a;
    });

    if (!items.length) { root.hidden = true; return; }

    root.innerHTML =
      '<div class="container faq__grid">' +
        '<header class="faq__head" data-reveal>' +
          '<p class="eyebrow">' + esc(t.eyebrow) + '</p>' +
          '<h2 class="section__title">' + esc(t.title) + '</h2>' +
        '</header>' +
        '<div class="accordion" data-reveal>' +
          items.map(function (f, i) {
            return (
              '<div class="acc">' +
                '<h3 class="acc__h"><button class="acc__btn" type="button" aria-expanded="false" aria-controls="faq-p-' + i + '" id="faq-b-' + i + '">' +
                  '<span>' + esc(f.q) + '</span><span class="acc__icon" aria-hidden="true">' + B.ornaments.icon('plus', 18) + '</span>' +
                '</button></h3>' +
                '<div class="acc__panel" id="faq-p-' + i + '" role="region" aria-labelledby="faq-b-' + i + '"><div class="acc__inner"><p>' + esc(f.a) + '</p></div></div>' +
              '</div>'
            );
          }).join('') +
        '</div>' +
      '</div>';

    root.addEventListener('click', function (e) {
      var btn = e.target.closest('.acc__btn');
      if (!btn) return;
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      btn.closest('.acc').classList.toggle('is-open', !open);
    });
    B.dom.reveal(root);
  }

  return { init: init };
})();
