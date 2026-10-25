/* ==========================================================================
   BEHLING TATTOO — CONFIGURAÇÃO CENTRAL
   --------------------------------------------------------------------------
   Este é o ÚNICO arquivo que você precisa editar para:
   • inserir o WhatsApp, Instagram e e-mail;
   • alterar textos do site;
   • trocar as imagens principais.

   As tatuagens e desenhos ficam em:  assets/js/data/works.js
   Os desenhos/estudos do "Universo" ficam em:  assets/js/data/universe.js
   As perguntas frequentes ficam em:  assets/js/data/faq.js

   Regra de ouro: canal em branco ("") = canal NÃO aparece no site.
   ========================================================================== */

window.Behling = window.Behling || {};

window.Behling.config = {
  /* ---------- Marca ---------- */
  brand: {
    name: 'Behling Tattoo',
    artist: 'Kim Behling',
    // Região de atendimento (genérica, sem endereço). Em branco ("") = não aparece.
    region: 'Atendo em Gramado e região',
  },

  /* ---------- Canais de contato ----------
     whatsappNumber: somente números, com país e DDD. Ex.: '5551999999999'
                     (55 = Brasil, 51 = DDD, depois o número).
     instagram:      usuário, com ou sem @. Ex.: 'behlingtattoo'
     email:          Ex.: 'contato@exemplo.com'
     privacyPolicyUrl: só preencha se existir uma política de privacidade publicada. */
  contact: {
    whatsappNumber: '555185710742',
    whatsappGreeting:
      'Olá, Kim! Vim pelo site da Behling Tattoo e gostaria de conversar sobre uma tatuagem.',
    instagram: 'kim_behling',
    email: 'behlingtattoo@gmail.com',
    privacyPolicyUrl: '',
  },

  /* ---------- Imagens principais ---------- */
  images: {
    logo: 'assets/images/logo.png',
    // Versão preta do logotipo, usada no tema claro (papel). O tema escuro usa `logo`.
    logoLight: 'assets/images/logo-preta.png',
    logoAlt: 'Behling Tattoo — logotipo',
    kim: 'assets/images/kim.webp',
    kimAlt: 'Kim Behling, tatuadora e artista, de cabelo preto e piercings, em roupa escura.',
    // Foto da seção "Sobre" (Kim de luvas, diante do seu equipamento)
    about: 'assets/images/kim-sobre.webp',
    aboutAlt: 'Kim Behling de luvas pretas, fazendo um sinal de paz, diante do seu equipamento de tatuagem.',
    aboutWidth: 533,
    aboutHeight: 795,
  },

  /* ---------- Navegação ---------- */
  nav: [
    { label: 'Início', href: '#inicio' },
    { label: 'Portfólio', href: '#portfolio' },
    { label: 'Sobre', href: '#sobre' },
    { label: 'Contato', href: '#contato' },
  ],
  navCta: { label: 'Solicitar orçamento', href: '#orcamento' },

  /* ---------- Textos ---------- */
  text: {
    hero: {
      eyebrow: 'Behling Tattoo · Arte autoral',
      titleLines: ['Arte que encontra', 'a <em>pele.</em>'], // aceita <em> para o itálico
      lead: 'Desenhos, símbolos e histórias transformados em arte permanente.',
      primaryCta: { label: 'Explorar portfólio', href: '#portfolio' },
      secondaryCta: { label: 'Solicitar orçamento', href: '#orcamento' },
      scrollLabel: 'Role',
    },

    portfolio: {
      eyebrow: 'Portfólio',
      title: 'Fragmentos de tinta.',
      subtitle: 'Cada peça é um estudo de forma, contraste e expressão.',
      carouselLabel: 'Destaques do portfólio',
    },

    universe: {
      eyebrow: 'Universo artístico',
      title: 'Antes da tinta, existe uma ideia.',
      text: 'Um espaço para explorar referências, composições e desenhos que nascem no papel antes de encontrar a pele.',
    },

    about: {
      eyebrow: 'Sobre',
      title: 'Por trás da tinta.',
      // Cada item vira um parágrafo. Itens vazios são ignorados.
      paragraphs: [
        'Sou Kim Behling, tatuadora e artista. A Behling Tattoo é o espaço onde reúno meus estudos, desenhos e trabalhos em tatuagem, explorando a relação entre arte, identidade e expressão pessoal.',
        'Este portfólio acompanha minha trajetória artística e reúne trabalhos realizados, desenhos autorais e novas ideias em desenvolvimento.',
      ],
      signature: 'Kim Behling',
    },

    booking: {
      eyebrow: 'Orçamento',
      title: 'Vamos dar forma à sua ideia?',
      text: 'Conte um pouco sobre o que você imagina. Referências, tamanho aproximado e local do corpo ajudam a entender melhor o projeto.',
      steps: [
        'Preencha o formulário com a sua ideia.',
        'Revise a mensagem que será montada para você.',
        'Envie para mim pelo canal que preferir.',
      ],
    },

    faq: {
      eyebrow: 'Dúvidas',
      title: 'Perguntas frequentes.',
    },

    contact: {
      eyebrow: 'Contato',
      title: 'Uma ideia pode começar aqui.',
      text: 'Envie sua referência e conte o que você tem em mente.',
      cta: 'Falar comigo',
    },
  },

  /* ---------- Comportamento do portfólio ---------- */
  portfolio: {
    carouselIntervalMs: 5500, // 4000–6000 recomendado
    // O filtro por categoria só aparece quando há pelo menos esta quantidade
    // de peças no total e em pelo menos duas categorias.
    filterMinTotal: 6,
  },
};
