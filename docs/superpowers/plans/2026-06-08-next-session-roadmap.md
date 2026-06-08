# Roadmap — próxima sessão

**Estado em 2026-06-08:** Home composta (9 capítulos) + polish seção-por-seção,
passe de perf (congelar canvases), passe responsivo completo (#1–#6 + rodada 2),
favicon da marca, descritor "Web Design & Desenvolvimento" na intro, cues
enxutas, e o Convite reescrito como seção travada (forma sozinho → footer).
Tudo commitado e no `origin/main`.

---

## Prioridade ALTA

### 1. Metadados de produção / SEO  ⭐ (lacuna mais concreta)
`app/layout.tsx` ainda tem os placeholders da fase de lab:
- title: "Coded by M — Experience Lab"
- description: "Laboratório técnico… experimentos… **antes da Home final**."

A Home **é** o site final agora. Falta:
- title/description reais (estúdio de web design & desenvolvimento).
- **Open Graph + Twitter cards** (preview ao compartilhar no WhatsApp/Insta) —
  via `metadata.openGraph` / `metadata.twitter` no `layout.tsx` ou `page.tsx`.
- **OG image** (1200×630) — a marca + tagline sobre o fundo escuro. Atenção: o
  `ImageResponse`/`next/og` não rodou no sandbox do dev (fonte pela rede
  bloqueada) — gerar como asset estático em `public/` ou validar o `opengraph-image`
  em build real.
- `lang="pt-BR"` (já está) · canonical · `metadataBase`.
- **apple-icon.png** (180×180) pra tela inicial do iOS (export estático da marca
  em `app/apple-icon.png` — o Next detecta).

### 2. Validação em device real (mobile)
Itens que o Playwright (GPU desktop / sem touch real) não confirma:
- **WebGL Context Lost** (`<ReleaseContext/>`) — só reproduz em GPU mobile.
- **Projetos**: snap-ao-arrastar (gira e trava no fragmento) + zoom recuado.
- **Convite**: swipe ↓ → footer; forma na entrada.
- **Touch/lock** das seções (1 gesto = 1 ação) nos beat-steppers.

---

## Prioridade MÉDIA

### 3. Limpeza de código (visual-neutra)
- `hooks/useSectionScrollProgress.ts` pode ter ficado **órfão** após o Convite
  deixar de ser scroll-driven — checar usos e remover se não houver mais.
- `gsap` no CTASection foi removido; varrer outros imports/dead code.
- Ver [[feedback-preservar-visual-atual]]: refactor sem mudar o visual.

### 4. Acessibilidade
- Foco visível + ordem de tabulação na navegação por capítulos.
- `prefers-reduced-motion`: cobrir as cenas 3D pesadas e os steppers.
- Contraste das cues/labels discretas (muitas em opacity baixa).
- `aria-live` nos beats/steps que trocam conteúdo.

---

## Prioridade BAIXA / polimento

### 5. Performance
- Lighthouse mobile (TTI, LCP, CLS) — a Home tem muitos canvases.
- Revisitar cap de DPR no mobile (o passe responsivo deixou o dispose; o cap de
  DPR ficou de fora a pedido do usuário — reavaliar se a perf pedir).
- Otimizar assets (fontes Fontshare via `<link>` → avaliar `next/font`).

### 6. Conteúdo / copy
- Revisão final de textos das seções.
- Cases reais (hoje há "em breve" nos fragmentos da vitrine).

---

## Notas de armadilhas (pra não reaprender)
- **Scroll fight**: as `LazySection` mudam de altura ao montar/desmontar →
  `window.scrollY`/`scrollIntoView` ficam não-monotônicos (o footer chega a
  ~87–175px do topo, não 0). Funcional, mas medir scroll por screenshot/visual,
  não por `scrollY`.
- **`next/og` ImageResponse** crasha no dev sandbox (busca fonte pela rede).
- **gsap `onComplete`** não disparou no CTASection (motivo não esclarecido) →
  preferir rAF auto-contido pra animações de progresso que destravam estado.
- **Navegação no Playwright**: `#projetos` é flaky; usar tecla numérica (1–9 →
  capítulo) após a intro; o wipe cobre os primeiros screenshots (recapturar).
