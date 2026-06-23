# Entrega 1 — Prompt otimizado (cole no Lovable)

> Use este texto como prompt único no Lovable. Anexe as imagens de referência e os logos (.png) no mesmo turno em que enviar este prompt. Onde houver `{ref:nome}` substitua pelo nome real do arquivo anexado.

---

**OBJETIVO**
Construa uma Landing Page de vendas (one-pager) para a marca **Thermo Películas**, empresa de instalação de películas nanocerâmicas de controle solar em Volta Redonda/RJ e Sul Fluminense. A LP é destinada a tráfego pago — toda decisão de design e copy deve maximizar conversão (preencher formulário ou clicar em WhatsApp).

**STACK E ARQUITETURA (obrigatório)**

- TanStack Start já configurado neste template. Crie a página em `src/routes/index.tsx` e componha por **componentes modulares** em `src/components/landing/` — um arquivo por seção (`Hero.tsx`, `Problem.tsx`, `Solution.tsx`, `Benefits.tsx`, `Comparison.tsx`, `HowItWorks.tsx`, `Testimonials.tsx`, `Faq.tsx`, `ContactForm.tsx`, `Footer.tsx`).
- Subcomponentes reutilizáveis em `src/components/landing/ui/` (ex.: `GlassCard.tsx`, `StatCounter.tsx`, `SectionShell.tsx`).
- Tokens de design centralizados em `src/styles.css` via `@theme` (cores, fontes, sombras, gradientes, blurs). Nada de cor hardcoded em componentes — use classes Tailwind apontando aos tokens (`bg-brand`, `text-ink`, etc.).
- Use **shadcn/ui** para `Button`, `Input`, `Textarea`, `Accordion` (FAQ), `Carousel` (testemunhos) e `Form` (react-hook-form + zod).
- Animações com **framer-motion** (fade/slide-up no scroll, counter animado nos stats, hover lift nos cards). Use `whileInView` com `viewport={{ once: true }}`.
- Ícones com **lucide-react**.
- Carrossel de depoimentos com **embla-carousel-react** (shadcn Carousel já o usa).

**DESIGN SYSTEM**

- Paleta:
  - `--brand-900: #224366` (azul profundo — títulos, CTAs sólidos, footer)
  - `--brand-400: #7396b4` (azul médio — bordas glass, ícones, gradientes)
  - `--surface: #ffffff` (fundo predominante claro)
  - `--ink: #1a2a3d` (texto principal)
  - `--muted: #5a6b80` (texto secundário)
  - Gradientes suaves de fundo: `linear-gradient(135deg, #ffffff 0%, #eef3f8 50%, #dce7f1 100%)` em algumas seções para realçar glassmorphism.
- Tipografia: **Neulis Sans** (Adobe Fonts). Carregue via `<link rel="stylesheet" href="https://use.typekit.net/glj0dtk.css">` adicionado em `src/routes/__root.tsx` no `head().links` (NÃO use `@import` em CSS). Defina `--font-sans: "neulis-sans", system-ui, sans-serif` no `@theme`. Pesos: 700/800 em headlines, 600 em subtítulos, 400 em corpo.
- **Glassmorphism padrão** (componente `GlassCard`):
  - `background: rgba(255,255,255,0.45)`
  - `backdrop-filter: blur(20px) saturate(140%)` (NÃO escreva prefixo `-webkit-` à mão — Tailwind/Lightning CSS já cuida)
  - `border: 1px solid rgba(255,255,255,0.6)`
  - `box-shadow: 0 8px 32px rgba(34,67,102,0.12)`
  - cantos `rounded-2xl`
- Adicione "blobs" desfocados de cor (`#7396b4` a 30% opacidade, `blur-3xl`, `absolute` apenas dentro do container relativo da seção) atrás dos cards para dar profundidade ao glass. Esse é o único uso autorizado de `absolute`: blobs decorativos `pointer-events-none` dentro de containers `relative`.
- Maior parte do site com fundo claro. Footer pode ser `--brand-900`.

**GRID E RESPONSIVIDADE (obrigatório)**

- Toda seção usa `grid grid-cols-12 grid-rows-[auto] gap-4`.
- Padding lateral por breakpoint: `px-[5vw] xl:px-[5vw] 2xl:px-[10vw]`. Mobile: `px-6`.
- Elementos internos usam **subgrid** (`grid-cols-subgrid col-span-12`) ou flexbox.
- Unidades: `rem` para tipografia/gaps internos, `vw/vh/%` para paddings de seção e blocos grandes. **Não usar `px**` salvo bordas 1px e ícones.
- **Sem `position: absolute**` exceto blobs decorativos descritos acima.
- Headers/linhas com texto + ícones fixos seguem o padrão: `grid grid-cols-[minmax(0,1fr)_auto]` com `min-w-0` no texto e `shrink-0` nos ícones; promovido para `flex` em `sm:`.
- Mobile-first. Teste em 360px, 768px, 1280px, 1920px.

**SEO**

- `head()` da rota `index` com `title`, `description`, `og:title`, `og:description`, `og:image` (use a imagem do hero), `twitter:card=summary_large_image`.
- Schema.org `LocalBusiness` em JSON-LD inserido via `head().scripts` com nome, área de atuação (Volta Redonda, Sul Fluminense), telefone/WhatsApp, aggregateRating baseado nos depoimentos.
- HTML semântico: `<header>`, `<main>`, `<section aria-labelledby>`, `<footer>`. Cada seção com `id` para âncoras (`#solucao`, `#beneficios`, etc.).
- Imagens com `alt` descritivo, `loading="lazy"` (exceto hero, que é `eager` + `fetchpriority="high"`), `width`/`height` para evitar CLS.
- Acessibilidade: contraste AA mínimo, foco visível, `aria-label` em botões-ícone, formulário com `<label>` associado.

**PERFORMANCE**

- Hero image pré-carregada (`<link rel="preload" as="image">` no `head()`).
- Componentes pesados (Carousel, Form) podem ficar abaixo da dobra — sem code-split forçado, mas sem animações que bloqueiem o LCP.
- Preconnect para `use.typekit.net` e `p.typekit.net`.

---

**CONTEÚDO DAS SEÇÕES** (mantenha a ordem e copy)

**1. Header fixo (novo, adicione)**  
Barra translúcida glass no topo com logo horizontal `{ref:Thermopelicula logo-06.png}`, links âncora (Solução, Benefícios, Depoimentos, FAQ) e botão CTA "Orçamento". Ao rolar, aumenta opacidade do fundo glass.

**2. Hero** (`grid-cols-12`, conteúdo em `col-span-12 lg:col-span-6`, imagem em `lg:col-span-6`)

- Lado direito: imagem de fundo de sala sofisticada com janelas grandes e luz natural (referência `{ref:hero}`), com leve overlay gradiente do branco para transparente vindo da esquerda para garantir legibilidade do texto.
- Lado esquerdo: `GlassCard` grande contendo:
  - Headline (H1, `text-4xl md:text-6xl font-extrabold text-brand-900 leading-tight`): **"Você não precisa escolher entre luz natural e conforto térmico."**
  - Subheadline: "Instalamos películas nanocerâmicas que bloqueiam até 99% dos raios UV e rejeitam até 97% da radiação infravermelha (calor). Mais conforto para sua casa, menos esforço para o seu ar-condicionado."
  - CTA primário sólido `--brand-900`: **"Solicitar Orçamento"** (rola até o formulário).
  - CTA secundário outline: "Falar no WhatsApp".
- Sobreposto à imagem, dois mini `GlassCard` flutuantes (posicionados via grid, não absolute) com `StatCounter` animado: **"-99%"** raios UV e **"-97%"** radiação infravermelha. Counter anima de 0 ao valor ao entrar no viewport.

**3. Agitação do Problema**

- Título centralizado H2: "Você reconhece alguma destas situações na sua rotina?"
- 4 cards em `grid grid-cols-1 md:grid-cols-2 gap-6`, cada um glass + ícone lucide (`Thermometer`, `Blinds`, `Sofa`, `PanelTop`):
  1. Ar-condicionado ligado, casa quente — texto sobre radiação infravermelha.
  2. Cortinas sempre fechadas.
  3. Móveis envelhecendo rápido (UV).
  4. Janelas grandes viraram problema.

**4. A Solução (Sobre a Thermo)**

- Subgrid: imagem `{ref:solucao}` em `col-span-12 lg:col-span-5` (rounded-3xl, sombra), texto em `lg:col-span-7`.
- Título H2: "A solução definitiva está nos seus vidros."
- Texto institucional fornecido. Selo glass pequeno: "Atendimento em Volta Redonda e todo o Sul Fluminense".

**5. Benefícios (Por que Nanocerâmica)**

- Grid `md:grid-cols-2 xl:grid-cols-4` de 4 `GlassCard` interativos (hover: leve translate-y + brilho na borda):
  1. Conforto Térmico — `Thermometer`
  2. Proteção Patrimonial e Saúde — `ShieldCheck`
  3. Eficiência Energética — `Zap`
  4. Privacidade e Estética — `Eye`

**6. Comparativo Com vs. Sem**

- Dois blocos lado a lado (`md:grid-cols-2`), um avermelhado-suave (X), outro azul-claro (✓), ambos glass. Lista com ícones `XCircle` (red-500/70) e `CheckCircle2` (`--brand-900`). Conteúdo conforme briefing.

**7. Como Funciona**

- Título: "Instalação Rápida e Sem Quebra-quebra."
- 4 passos em `grid-cols-1 md:grid-cols-4` com numerador grande em outline `--brand-400` e descrição curta. Linha conectora sutil entre passos em desktop (pseudo-border).

**8. Depoimentos (Carrossel)**

- Título: "Quem protege a casa com a Thermo Películas comprova a eficiência."
- shadcn `Carousel` com auto-play (4s, pausa no hover), navegação por dots e setas. Cada slide é um `GlassCard` com 5 estrelas (`Star` preenchidas em `--brand-900`), citação, autor + cidade. 4 depoimentos fornecidos.

**9. FAQ**

- shadcn `Accordion` (type single, collapsible). 3 perguntas fornecidas. Item glass.

**10. Formulário + CTA Final**

- Título: "Casas inteligentes não sofrem com o calor. Faça uma escolha inteligente."
- Subgrid: formulário em `lg:col-span-7`, painel lateral em `lg:col-span-5` com WhatsApp, telefone, área de atendimento, mini-mapa estilizado opcional.
- Form (react-hook-form + zod): **Nome** (min 2), **WhatsApp** (máscara `(00) 00000-0000`, validação), **Bairro/Cidade** (texto). Botão: "Falar com um especialista".
- Submit envia para um `createServerFn` em `src/lib/lead.functions.ts` que por enquanto loga e retorna sucesso (placeholder para integração futura). Mostrar toast (sonner) de sucesso.

**11. Footer**

- Fundo `--brand-900`, texto claro. Logo `{ref:Thermopelicula logo-08.png}`, dados de contato, área de atuação, redes sociais (placeholders), copyright.

---

**REGRAS FINAIS NÃO NEGOCIÁVEIS**

1. Código limpo, modular, tipado, com props explícitas. Sem `any`.
2. Zero cor hardcoded em JSX — só tokens.
3. Zero `position: absolute` exceto blobs decorativos.
4. Mobile responsivo perfeito em 360px.
5. Lighthouse alvo: Performance ≥ 90, SEO ≥ 95, A11y ≥ 95.
6. Respeite a ordem e o copy das seções literalmente.

---

# Entrega 2 — Plano de implementação técnica

**Etapa 1 — Fundação**

- Instalar deps: `framer-motion`, `embla-carousel-react`, `react-hook-form`, `@hookform/resolvers`, `zod`, `react-imask` (máscara WhatsApp).
- Adicionar shadcn: `button`, `input`, `textarea`, `form`, `accordion`, `carousel`, `sonner`.
- `src/routes/__root.tsx`: adicionar `<link>` Typekit + preconnect + preload da hero image; manter `<Outlet />`.
- `src/styles.css`: definir `@theme` com tokens (cores, font, shadows, gradient), `@utility glass-card`, mapear cores existentes do shadcn em `@theme inline`.

**Etapa 2 — Componentes base**

- `src/components/landing/ui/SectionShell.tsx` — wrapper com `<section>` + grid 12 cols + paddings responsivos.
- `GlassCard.tsx` — variantes (`default`, `subtle`, `accent`).
- `StatCounter.tsx` — framer-motion `useInView` + `animate` numérico.
- `BackgroundBlobs.tsx` — blobs decorativos reutilizáveis.

**Etapa 3 — Seções (uma a uma)**
Implementar `Header → Hero → Problem → Solution → Benefits → Comparison → HowItWorks → Testimonials → Faq → ContactForm → Footer`, cada um isolado, com mock de imagem (placeholder) onde os anexos ainda não chegaram.

**Etapa 4 — Rota e SEO**

- `src/routes/index.tsx` compõe todas as seções, define `head()` com meta + JSON-LD `LocalBusiness`.

**Etapa 5 — Formulário backend**

- `src/lib/lead.functions.ts` com `createServerFn` que valida payload (zod) e por ora apenas loga. Deixar TODO para integração futura (Cloud / e-mail / WhatsApp API).

**Etapa 6 — Polimento**

- Animações de entrada por seção, hover states, foco acessível, revisão de contraste, teste responsivo em 4 breakpoints, ajuste do LCP.

**Pendências do usuário antes de "Implementar plano":**

- Anexar nesta conversa: imagens de referência estética, foto do hero, foto da seção Solução, e os 5 arquivos de logo citados.
- Confirmar número de WhatsApp real (para link `wa.me/`) ou indicar placeholder.