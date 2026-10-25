# Behling Tattoo — site-portfólio de Kim Behling

Site estático (HTML + CSS + JavaScript puro). **Não precisa instalar nada nem compilar.**

## Ver o site no computador

Dentro desta pasta, rode um servidor local simples e abra o endereço no navegador:

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

(ou `npx serve .`). Abrir o `index.html` com duplo clique também funciona na maior parte dos casos.

## Publicar

Envie a pasta inteira para qualquer hospedagem de site estático (Netlify, Vercel, Cloudflare Pages, GitHub Pages…). Depois de publicar, em `index.html` troque `assets/images/og-image.jpg` (nas metatags `og:image`) pelo endereço completo da imagem, por exemplo `https://seudominio.com/assets/images/og-image.jpg`, para que o preview em redes sociais funcione.

---

## O que falta preencher (nada foi inventado)

Tudo é feito em **`assets/js/config/site-config.js`**:

| Campo | O que colocar | Se ficar vazio |
|---|---|---|
| `contact.whatsappNumber` | Só números, com país e DDD. Ex.: `'5551999999999'` | Nenhum botão/link de WhatsApp aparece; o formulário só permite **copiar** a mensagem |
| `contact.instagram` | Usuário, com ou sem `@` | Instagram não aparece |
| `contact.email` | E-mail de contato | E-mail não aparece |
| `contact.privacyPolicyUrl` | Link da política, **só se existir** | Link não aparece no rodapé |

Regra geral: **campo em branco = não aparece no site.** Mudando o número uma única vez, todos os botões (hero, orçamento, contato, rodapé) são atualizados.

Os textos do site (títulos, subtítulos, "Sobre", etapas do orçamento) estão no mesmo arquivo, em `text`. O texto de "Sobre" é editável e não é uma biografia definitiva.

---

## Como adicionar tatuagens e desenhos

1. Prepare a foto (veja "Otimizar imagens" abaixo) e coloque em `assets/images/works/`.
2. Abra `assets/js/data/works.js`, copie o modelo comentado e preencha.
3. Troque `published: false` por `published: true`.

O campo **`type`** é obrigatório e define o selo exibido:

| `type` | Selo no site |
|---|---|
| `'tattoo'` | Tatuagem realizada |
| `'flash'` | Flash autoral |
| `'drawing'` | Desenho autoral |
| `'study'` | Estudo |

Só aparece o que tem `published: true`. Campos opcionais vazios (`title`, `style`, `bodyArea`, `caption`) nunca aparecem. **Só preencha `style` e `bodyArea` com informação confirmada.**

### Como o portfólio se adapta à quantidade de peças

- **Carrossel**: reúne apenas `type: 'tattoo'` (fotos de tatuagens realizadas). Nunca duplica imagens para preencher espaço.
  - Nenhuma peça publicada → aparecem três molduras vazias (sem imagem, sem texto, não clicáveis) no mesmo formato do carrossel. Elas somem sozinhas quando a primeira tatuagem for publicada.
  - Só flashs/desenhos, sem tatuagens → não há carrossel; apenas a galeria, com o selo de cada tipo.
  - 1 tatuagem → apresentação editorial estática.
  - 2 tatuagens → carrossel de uma imagem por vez.
  - 3 ou mais → composição com imagem central e laterais parcialmente visíveis (desktop).
- **Galeria "Fragmentos de tinta"**: aparece quando há peças; flashs, desenhos e estudos ficam só aqui (com o selo correspondente). Use `featured: false` para tirar uma tatuagem do carrossel.
- **Filtros por categoria**: só aparecem com pelo menos 6 peças e 2 categorias (`portfolio.filterMinTotal` no config). Categorias vazias nunca são mostradas.

### Universo artístico

Funciona igual, em `assets/js/data/universe.js` (tipos: `flash`, `drawing`, `study`, `process`). Enquanto estiver vazio, a seção mostra três molduras vazias (não clicáveis), que somem quando a primeira peça for publicada.

### Perguntas frequentes

Em `assets/js/data/faq.js`. As respostas são genéricas e não afirmam preço, sinal, cancelamento, idade mínima ou disponibilidade. Para uma pergunta ficar oculta até Kim confirmar, use `published: false` no item.

---

## Otimizar imagens

Guarde os arquivos originais em `originals/works/` (não são publicados) e exporte versões para o site:

- **Formato**: WebP (ou JPG), qualidade ~80.
- **Tamanho para `src`**: lado maior ~1200 px. Para a ampliação, uma versão `full` com lado maior ~2000 px.
- Informe `width` e `height` do `src` no cadastro: evita que a página "pule" enquanto carrega.
- Escreva sempre um `alt` objetivo (descreve o que se vê na foto).

Exemplo com ImageMagick:

```bash
magick originals/works/foto.jpg -resize 1200x1200 -quality 80 assets/images/works/peca-001.webp
magick originals/works/foto.jpg -resize 2000x2000 -quality 82 assets/images/works/peca-001-grande.webp
```

---

## Formulário de orçamento (sem backend)

O site **não tem servidor**, então o formulário não envia nada sozinho e **não finge** que enviou. Fluxo:

1. A pessoa preenche; os campos obrigatórios (nome, contato, ideia, concordância) são validados.
2. O site monta uma mensagem que a pessoa pode **revisar e editar**.
3. Com Instagram configurado: botão "Copiar e abrir o direct" — o Instagram não aceita texto pré-preenchido em links, então a mensagem é copiada e o direct (`ig.me`) abre para colar. Funciona melhor com conta profissional/criadora.
4. Com WhatsApp configurado: botão "Enviar pelo WhatsApp" abre a conversa com a mensagem pronta. Sem canal configurado: só "Copiar mensagem", com aviso claro.

Os dados ficam apenas no navegador de quem preenche; nada é guardado em serviço externo.

---

## Estrutura

```
index.html                    página única (metatags, SEO, favicon, fontes)
assets/css/                   estilos por área (base, hero, portfólio, seções, orçamento/FAQ/contato, lightbox)
assets/images/                logotipo original, foto de Kim, favicon, imagem de compartilhamento
assets/images/works/          fotos do portfólio  (adicionar aqui)
assets/images/universe/       desenhos e estudos  (adicionar aqui)
assets/js/config/             site-config.js  ← único arquivo de contatos e textos
assets/js/data/               works.js, universe.js, faq.js
assets/js/components/         Header, HeroSection, TattooCarousel, PortfolioGallery, ArtworkSection,
                              AboutSection, BookingSection, FAQSection, ContactSection, Footer,
                              Lightbox, WhatsAppContactButton
assets/js/lib/                utilitários (DOM, ornamentos, dados do portfólio, contato)
originals/                    fotos originais, em alta (não publicadas)
```

## Acessibilidade e desempenho

HTML semântico, link "pular para o conteúdo", foco visível, navegação por teclado (carrossel: setas; lightbox: setas e Esc, foco preso no diálogo), `prefers-reduced-motion` respeitado (sem autoplay e sem animações), `loading="lazy"` fora da primeira dobra, logotipo e foto do hero pré-carregados. Se as fontes do Google não carregarem, o site usa fontes do sistema.

## Regras de conteúdo (importante)

- Nunca publicar tatuagens de outras pessoas como se fossem de Kim.
- Nunca marcar um desenho como `tattoo` — é o que separa "Tatuagem realizada" de "Flash autoral".
- Há apenas a região de atendimento (`brand.region`, genérica). Não há endereço, mapa, avaliações, depoimentos, prêmios, preços ou especialidades no site, e nada disso deve ser adicionado sem confirmação de Kim.
