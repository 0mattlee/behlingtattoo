/* Botão de WhatsApp. Só existe quando o número está configurado
   em assets/js/config/site-config.js (contact.whatsappNumber). */
window.Behling = window.Behling || {};

window.Behling.WhatsAppContactButton = (function () {
  var B = window.Behling;

  function render(opts) {
    opts = opts || {};
    if (!B.contact.hasWhatsapp()) return '';
    var url = B.contact.whatsappUrl(opts.message);
    return (
      '<a class="btn ' + (opts.className || 'btn--ghost') + '" href="' + B.dom.esc(url) + '" target="_blank" rel="noopener noreferrer">' +
        B.ornaments.icon('whatsapp', 18) + '<span>' + B.dom.esc(opts.label || 'Chamar no WhatsApp') + '</span>' +
      '</a>'
    );
  }

  return { render: render };
})();
