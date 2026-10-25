/* Canais de contato derivados da configuração. Canal vazio = canal inexistente. */
window.Behling = window.Behling || {};

window.Behling.contact = (function () {
  var cfg = window.Behling.config.contact;

  function whatsappDigits() {
    var d = String(cfg.whatsappNumber || '').replace(/\D/g, '');
    return d.length >= 10 && d.length <= 15 ? d : '';
  }

  function whatsappUrl(message) {
    var d = whatsappDigits();
    if (!d) return '';
    var text = message || cfg.whatsappGreeting || '';
    return 'https://wa.me/' + d + (text ? '?text=' + encodeURIComponent(text) : '');
  }

  function instagramHandle() {
    var h = String(cfg.instagram || '').trim().replace(/^https?:\/\/(www\.)?instagram\.com\//i, '');
    h = h.replace(/^@/, '').replace(/\/+$/, '').split('?')[0];
    return /^[A-Za-z0-9._]{1,30}$/.test(h) ? h : '';
  }

  function instagramUrl() {
    var h = instagramHandle();
    return h ? 'https://instagram.com/' + h : '';
  }

  /* Abre direto a conversa (direct) com a conta. O Instagram NÃO aceita texto
     pré-preenchido em links; por isso o formulário copia a mensagem antes de abrir. */
  function instagramDmUrl() {
    var h = instagramHandle();
    return h ? 'https://ig.me/m/' + h : '';
  }

  function email() {
    var e = String(cfg.email || '').trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) ? e : '';
  }

  /* Lista de canais configurados (usada em Contato e Rodapé). */
  function channels() {
    var list = [];
    if (whatsappDigits()) {
      list.push({ id: 'whatsapp', label: 'WhatsApp', href: whatsappUrl(), icon: 'whatsapp', external: true });
    }
    if (instagramHandle()) {
      list.push({ id: 'instagram', label: 'Instagram', href: instagramUrl(), icon: 'instagram', external: true, detail: '@' + instagramHandle() });
    }
    if (email()) {
      list.push({ id: 'email', label: 'E-mail', href: 'mailto:' + email(), icon: 'mail', external: false, detail: email() });
    }
    return list;
  }

  /* Destino do botão principal "Falar com Kim": WhatsApp → Instagram → e-mail →
     formulário da própria página. Sempre um destino válido. */
  function primary() {
    var list = channels();
    if (list.length) return { href: list[0].href, external: list[0].external, channel: list[0].id };
    return { href: '#orcamento', external: false, channel: 'form' };
  }

  return {
    hasWhatsapp: function () { return !!whatsappDigits(); },
    whatsappUrl: whatsappUrl,
    instagramUrl: instagramUrl,
    instagramDmUrl: instagramDmUrl,
    email: email,
    channels: channels,
    primary: primary,
    privacyUrl: function () { return String(cfg.privacyPolicyUrl || '').trim(); },
  };
})();
