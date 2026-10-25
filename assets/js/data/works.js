/* ==========================================================================
   PORTFÓLIO — tatuagens e desenhos
   --------------------------------------------------------------------------
   COMO ADICIONAR UMA PEÇA
   1. Coloque a foto em  assets/images/works/  (veja o README para otimizar).
   2. Copie o modelo abaixo, cole dentro da lista e preencha.
   3. Troque  published: false  por  published: true  quando quiser exibir.

   Só aparece no site o que tem  published: true  e um  type  válido.

   type (obrigatório) — define o selo exibido na peça:
     'tattoo'   → "Tatuagem realizada"   (tatuagem feita em uma pessoa)
     'flash'    → "Flash autoral"        (desenho ainda não tatuado)
     'drawing'  → "Desenho autoral"
     'study'    → "Estudo"

   Campos:
     id        identificador único, sem espaços (ex.: 'peca-001')
     type      veja acima
     src       caminho da imagem usada no site
     alt       descrição da imagem para leitores de tela (obrigatório, seja objetiva)
     full      (opcional) imagem em tamanho maior para a ampliação
     title     (opcional) só se Kim quiser dar nome à peça
     style     (opcional) só se o estilo for confirmado por Kim
     bodyArea  (opcional) só se a região do corpo puder ser divulgada
     caption   (opcional) legenda curta
     width / height   (opcional, recomendado) tamanho em pixels da imagem `src`
     focus     (opcional) ponto de foco do enquadramento no carrossel, ex.: '50% 30%'
     featured  (opcional) false = não aparece no carrossel (só na galeria)

   Campos vazios nunca aparecem no site.

   IMPORTANTE: nunca publique tatuagens de outras pessoas como se fossem de Kim,
   nem desenhos como se fossem tatuagens realizadas.
   ========================================================================== */

window.Behling = window.Behling || {};

window.Behling.works = [
  /* ----- MODELO (copie, cole e preencha) -----
  {
    id: 'peca-001',
    type: 'tattoo',
    src: 'assets/images/works/peca-001.webp',
    full: 'assets/images/works/peca-001-grande.webp',
    alt: 'Descreva o que se vê na foto',
    title: '',
    style: '',
    bodyArea: '',
    caption: '',
    width: 1200,
    height: 1500,
    focus: '50% 50%',
    published: false,
  },
  ------------------------------------------- */
];
