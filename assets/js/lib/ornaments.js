/* Ornamentos em SVG, inspirados nos detalhes do logotipo (estrelas de quatro
   pontas, lua, filetes). Usados com moderação. */
window.Behling = window.Behling || {};

window.Behling.ornaments = (function () {
  var STAR_PATH =
    'M12 0C12.55 7.1 16.9 11.45 24 12C16.9 12.55 12.55 16.9 12 24C11.45 16.9 7.1 12.55 0 12C7.1 11.45 11.45 7.1 12 0Z';

  function star(size, cls) {
    return (
      '<svg class="orn orn-star ' + (cls || '') + '" width="' + size + '" height="' + size +
      '" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="' + STAR_PATH + '"/></svg>'
    );
  }

  function moon(size, cls) {
    return (
      '<svg class="orn orn-moon ' + (cls || '') + '" width="' + size + '" height="' + size +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" ' +
      'stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20.2 14.6A8.6 8.6 0 1 1 9.4 3.8a6.9 6.9 0 0 0 10.8 10.8Z"/></svg>'
    );
  }

  /* Filete: linha — estrela — linha */
  function divider(cls) {
    return (
      '<div class="divider ' + (cls || '') + '" aria-hidden="true"><span class="divider__line"></span>' +
      star(12, 'divider__star') + '<span class="divider__line"></span></div>'
    );
  }

  function arrowDown() {
    return (
      '<svg class="orn" width="14" height="22" viewBox="0 0 14 22" fill="none" stroke="currentColor" ' +
      'stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      '<path d="M7 1v19M1.5 14.5 7 20l5.5-5.5"/></svg>'
    );
  }

  /* Ícones funcionais (traço fino, mesmo estilo do site). */
  var icons = {
    menu: '<path d="M3 8h18M3 16h18"/>',
    close: '<path d="M5 5l14 14M19 5 5 19"/>',
    prev: '<path d="M15 4 7 12l8 8"/>',
    next: '<path d="m9 4 8 8-8 8"/>',
    play: '<path d="M8 5.5v13l10-6.5-10-6.5Z"/>',
    pause: '<path d="M8.5 5v14M15.5 5v14"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    whatsapp:
      '<path d="M3.5 20.5 5 15.8A8.5 8.5 0 1 1 8.4 19L3.5 20.5Z"/><path d="M9 8.8c.3 2.2 2.2 4.4 4.6 5.4l1.3-1.2c.3-.3.7-.3 1 0l1.2.9c.3.3.3.7.1 1-.6 1-1.7 1.5-2.9 1.2-3.4-.9-6.1-3.6-6.8-7-.2-1 .2-2 1.1-2.6.3-.2.7-.1.9.2l.8 1.2c.2.3.2.7-.1 1L9 8.8Z"/>',
    instagram:
      '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6.5L20.5 7"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4"/>',
    moonicon: '<path d="M20 14.2A8 8 0 0 1 9.8 4 8 8 0 1 0 20 14.2Z"/>',
    copy: '<rect x="8.5" y="8.5" width="11" height="11" rx="2"/><path d="M15.5 8.5V6.5a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2"/>',
  };

  function icon(name, size) {
    var s = size || 20;
    return (
      '<svg class="icon" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      (icons[name] || '') + '</svg>'
    );
  }

  return { star: star, moon: moon, divider: divider, arrowDown: arrowDown, icon: icon };
})();
