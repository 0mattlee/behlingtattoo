/* Orçamento: formulário que NÃO finge enviar nada.
   Fluxo: preencher → validar → revisar a mensagem → enviar pelo WhatsApp
   (quando configurado) ou copiar a mensagem. Nenhum dado sai deste site
   sem uma ação explícita do visitante, e nada é armazenado. */
window.Behling = window.Behling || {};

window.Behling.BookingSection = (function () {
  var B = window.Behling;
  var esc = B.dom.esc;

  var SIZES = ['Pequeno (até 5 cm)', 'Médio (5 a 15 cm)', 'Grande (mais de 15 cm)', 'Ainda não sei'];
  var PREFS = ['WhatsApp', 'Instagram', 'E-mail'];

  function field(id, label, control, opts) {
    opts = opts || {};
    return (
      '<div class="field' + (opts.full ? ' field--full' : '') + '" data-field="' + id + '">' +
        '<label class="field__label" for="f-' + id + '">' + esc(label) +
          (opts.required ? ' <span class="field__req" aria-hidden="true">*</span>' : ' <span class="field__opt">(opcional)</span>') +
        '</label>' +
        control +
        (opts.hint ? '<p class="field__hint" id="h-' + id + '">' + esc(opts.hint) + '</p>' : '') +
        '<p class="field__error" id="e-' + id + '" role="alert" hidden></p>' +
      '</div>'
    );
  }

  function input(id, attrs) {
    return '<input class="input" id="f-' + id + '" name="' + id + '" ' + (attrs || '') + '>';
  }

  function formHtml() {
    return (
      '<form class="form" novalidate>' +
        '<div class="form__grid">' +
          field('nome', 'Nome', input('nome', 'type="text" autocomplete="name" maxlength="80"'), { required: true }) +
          field('contato', 'Seu WhatsApp ou contato', input('contato', 'type="text" autocomplete="tel" maxlength="120" placeholder="(00) 00000-0000"'), { required: true }) +
          field('preferencia', 'Como prefere ser contatado', '<select class="input" id="f-preferencia" name="preferencia">' +
            PREFS.map(function (p) { return '<option>' + esc(p) + '</option>'; }).join('') + '</select>') +
          field('tamanho', 'Tamanho aproximado', '<select class="input" id="f-tamanho" name="tamanho"><option value="">Selecione</option>' +
            SIZES.map(function (s) { return '<option>' + esc(s) + '</option>'; }).join('') + '</select>') +
          field('ideia', 'Sua ideia', '<textarea class="input input--area" id="f-ideia" name="ideia" rows="5" maxlength="1500" aria-describedby="h-ideia e-ideia" placeholder="Conte o que você imagina."></textarea>', { required: true, full: true, hint: 'Quanto mais detalhes, melhor.' }) +
          field('regiao', 'Região do corpo', input('regiao', 'type="text" maxlength="80" placeholder="Ex.: antebraço"')) +
          field('estilo', 'Estilo ou referências', input('estilo', 'type="text" maxlength="160"')) +
          field('link', 'Link de uma referência', input('link', 'type="url" inputmode="url" maxlength="300" placeholder="https://" autocapitalize="off"'), { full: true }) +
        '</div>' +
        '<div class="consent" data-field="consent">' +
          '<label class="consent__label">' +
            '<input type="checkbox" id="f-consent" name="consent" aria-describedby="e-consent">' +
            '<span class="consent__box" aria-hidden="true"></span>' +
            '<span>Concordo em usar estas informações para montar uma mensagem de contato comigo. <span class="field__req" aria-hidden="true">*</span></span>' +
          '</label>' +
          '<p class="field__error" id="e-consent" role="alert" hidden></p>' +
        '</div>' +
        '<p class="form__privacy">Privacidade: este formulário não envia nem guarda nada neste site. Os dados ficam no seu navegador e só seguem adiante se você escolher enviar a mensagem.' +
          (B.contact.privacyUrl() ? ' <a href="' + esc(B.contact.privacyUrl()) + '" target="_blank" rel="noopener noreferrer">Política de privacidade</a>.' : '') +
        '</p>' +
        '<button class="btn btn--solid form__submit" type="submit">Revisar mensagem</button>' +
      '</form>'
    );
  }

  function reviewHtml() {
    return (
      '<div class="review" hidden>' +
        '<h3 class="review__title">Revise antes de enviar</h3>' +
        '<p class="review__lead">Esta é a mensagem montada com as suas respostas. Você pode ajustá-la antes de seguir.</p>' +
        '<label class="sr-only" for="review-text">Mensagem</label>' +
        '<textarea class="input input--area review__text" id="review-text" rows="11"></textarea>' +
        '<p class="review__notice" data-notice></p>' +
        '<div class="review__actions" data-actions></div>' +
        '<p class="review__status" role="status" aria-live="polite" data-status></p>' +
        '<button class="link-btn review__back" type="button">← Voltar e editar</button>' +
      '</div>'
    );
  }

  function buildMessage(v) {
    var lines = ['Olá, Kim! Vim pelo site da Behling Tattoo e gostaria de pedir um orçamento.', ''];
    lines.push('Nome: ' + v.nome);
    lines.push('Contato: ' + v.contato + (v.preferencia ? ' (prefiro ' + v.preferencia + ')' : ''));
    lines.push('Ideia: ' + v.ideia);
    if (v.estilo) lines.push('Estilo ou referências: ' + v.estilo);
    if (v.tamanho) lines.push('Tamanho aproximado: ' + v.tamanho);
    if (v.regiao) lines.push('Região do corpo: ' + v.regiao);
    if (v.link) lines.push('Link de referência: ' + v.link);
    return lines.join('\n');
  }

  function normalizeUrl(raw) {
    var s = String(raw || '').trim();
    if (!s) return '';
    if (!/^https?:\/\//i.test(s)) s = 'https://' + s;
    try {
      var u = new URL(s);
      return /\./.test(u.hostname) ? u.href : null;
    } catch (e) {
      return null;
    }
  }

  function init(root) {
    var cfg = B.config;
    var t = cfg.text.booking;
    var dom = B.dom;

    root.innerHTML =
      '<div class="container booking__grid">' +
        '<div class="booking__intro" data-reveal>' +
          '<p class="eyebrow">' + esc(t.eyebrow) + '</p>' +
          '<h2 class="section__title">' + esc(t.title) + '</h2>' +
          '<p class="booking__text">' + esc(t.text) + '</p>' +
          '<ol class="steps">' +
            t.steps.map(function (s, i) {
              return '<li class="steps__item"><span class="steps__no" aria-hidden="true">' + (i + 1) + '</span><span>' + esc(s) + '</span></li>';
            }).join('') +
          '</ol>' +
          B.WhatsAppContactButton.render({ label: 'Chamar no WhatsApp', className: 'btn--ghost booking__wa' }) +
        '</div>' +
        '<div class="booking__panel" data-reveal>' + formHtml() + reviewHtml() + '</div>' +
      '</div>';

    var form = dom.qs('.form', root);
    var review = dom.qs('.review', root);
    var reviewText = dom.qs('#review-text', root);
    var notice = dom.qs('[data-notice]', root);
    var actions = dom.qs('[data-actions]', root);
    var status = dom.qs('[data-status]', root);
    var currentValues = null;

    function val(name) { return (form.elements[name].value || '').trim(); }

    function setError(id, msg) {
      var holder = dom.qs('[data-field="' + id + '"]', form);
      var control = id === 'consent' ? form.elements.consent : form.elements[id];
      var err = dom.qs('#e-' + id, form);
      if (msg) {
        err.textContent = msg; err.hidden = false;
        control.setAttribute('aria-invalid', 'true');
        var describedby = (control.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
        if (describedby.indexOf('e-' + id) === -1) describedby.push('e-' + id);
        control.setAttribute('aria-describedby', describedby.join(' '));
        holder.classList.add('has-error');
      } else {
        err.hidden = true; err.textContent = '';
        control.removeAttribute('aria-invalid');
        holder.classList.remove('has-error');
      }
    }

    function validate() {
      var v = {
        nome: val('nome'), contato: val('contato'), preferencia: val('preferencia'),
        ideia: val('ideia'), estilo: val('estilo'), tamanho: val('tamanho'),
        regiao: val('regiao'), link: val('link'),
      };
      var firstBad = null;
      function bad(id, msg) { setError(id, msg); if (!firstBad) firstBad = id; }

      setError('nome'); setError('contato'); setError('ideia'); setError('link'); setError('consent');
      if (v.nome.length < 2) bad('nome', 'Informe o seu nome.');
      if (v.contato.length < 5) bad('contato', 'Informe um WhatsApp ou outro contato para retorno.');
      if (v.ideia.length < 10) bad('ideia', 'Conte um pouco mais sobre a sua ideia (ao menos uma frase).');
      if (v.link) {
        var u = normalizeUrl(v.link);
        if (u === null) bad('link', 'Esse link não parece válido. Confira ou deixe em branco.');
        else v.link = u;
      }
      if (!form.elements.consent.checked) bad('consent', 'Para continuar, marque a concordância.');

      if (firstBad) {
        var el = firstBad === 'consent' ? form.elements.consent : form.elements[firstBad];
        el.focus();
        return null;
      }
      return v;
    }

    function renderActions(message) {
      var html = '';
      var channels = B.contact.channels();
      var hasWa = B.contact.hasWhatsapp();

      if (hasWa) {
        html += '<a class="btn btn--solid" data-wa href="' + esc(B.contact.whatsappUrl(message)) + '" target="_blank" rel="noopener noreferrer">' +
          B.ornaments.icon('whatsapp', 18) + '<span>Enviar pelo WhatsApp</span></a>';
        notice.textContent = 'Ao tocar em enviar, o WhatsApp abre com esta mensagem pronta. Nada é enviado antes disso.' +
          (B.contact.instagramDmUrl() ? ' No Instagram, a mensagem é copiada e o direct abre para você colar.' : '');
      } else if (channels.length) {
        notice.textContent = 'O envio direto pelo WhatsApp não está disponível neste site. Copie a mensagem e envie pelo canal abaixo.';
      } else {
        notice.textContent = 'Nenhum canal de contato foi publicado neste site ainda. Você pode copiar a mensagem e guardá-la para enviar assim que houver um canal.';
      }

      channels.forEach(function (c) {
        if (c.id === 'whatsapp') return;
        var href = c.href;
        var label = c.id === 'email' ? 'Enviar por e-mail' : 'Abrir ' + esc(c.label);
        if (c.id === 'instagram') {
          href = B.contact.instagramDmUrl() || c.href;
          label = 'Copiar e abrir o direct';
        }
        if (c.id === 'email') {
          href = 'mailto:' + B.contact.email() + '?subject=' + encodeURIComponent('Orçamento de tatuagem') + '&body=' + encodeURIComponent(message);
        }
        html += '<a class="btn btn--ghost" data-' + c.id + ' href="' + esc(href) + '"' + (c.external ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' +
          B.ornaments.icon(c.icon, 18) + '<span>' + label + '</span></a>';
      });

      html += '<button class="btn btn--ghost" type="button" data-copy>' + B.ornaments.icon('copy', 18) + '<span>Copiar mensagem</span></button>';
      actions.innerHTML = html;
    }

    function copyText(text) {
      if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
      }
      return new Promise(function (resolve, reject) {
        try {
          reviewText.focus(); reviewText.select();
          document.execCommand('copy') ? resolve() : reject();
        } catch (e) { reject(e); }
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = validate();
      if (!v) return;
      currentValues = v;
      var message = buildMessage(v);
      reviewText.value = message;
      renderActions(message);
      status.textContent = '';
      form.hidden = true;
      review.hidden = false;
      review.scrollIntoView({ behavior: dom.prefersReducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
      dom.qs('.review__title', review).setAttribute('tabindex', '-1');
      dom.qs('.review__title', review).focus({ preventScroll: true });
    });

    // Limpa o erro do campo ao digitar
    form.addEventListener('input', function (e) {
      var name = e.target.name;
      if (name && dom.qs('#e-' + name, form) && !dom.qs('#e-' + name, form).hidden) setError(name);
    });
    form.addEventListener('change', function (e) {
      if (e.target.name === 'consent') setError('consent');
    });

    // Mantém o link do WhatsApp igual ao texto revisado
    reviewText.addEventListener('input', function () {
      var wa = dom.qs('[data-wa]', review);
      if (wa) wa.href = B.contact.whatsappUrl(reviewText.value);
      var mail = dom.qs('[data-email]', review);
      if (mail && B.contact.email()) {
        mail.href = 'mailto:' + B.contact.email() + '?subject=' + encodeURIComponent('Orçamento de tatuagem') + '&body=' + encodeURIComponent(reviewText.value);
      }
    });

    review.addEventListener('click', function (e) {
      if (e.target.closest('[data-instagram]')) {
        // Não cancela o clique: o direct abre em nova aba enquanto a mensagem é copiada.
        copyText(reviewText.value).then(
          function () { status.textContent = 'Mensagem copiada. Cole na conversa do Instagram e envie.'; },
          function () { status.textContent = 'Não foi possível copiar automaticamente. Copie o texto acima antes de colar no Instagram.'; }
        );
      } else if (e.target.closest('[data-copy]')) {
        copyText(reviewText.value).then(
          function () { status.textContent = 'Mensagem copiada.'; },
          function () { status.textContent = 'Não foi possível copiar automaticamente. Selecione o texto acima e copie manualmente.'; }
        );
      } else if (e.target.closest('.review__back')) {
        review.hidden = true;
        form.hidden = false;
        form.elements.nome.focus();
      }
    });

    dom.reveal(root);
  }

  return { init: init };
})();
