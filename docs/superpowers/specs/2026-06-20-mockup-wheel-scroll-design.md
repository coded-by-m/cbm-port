# Scroll do mockup por roda do mouse

**Data:** 2026-06-20
**Status:** Aprovado (design)

## Problema

O `CaseFrameScroll` (v1) mapeava a posição vertical do mouse → posição da
imagem. Como a imagem tall (~9800px) é comprimida num frame pequeno (~370px),
um movimento mínimo do mouse pula centenas de px da imagem: sensível demais,
"rápido e inconsistente".

## Solução

Trocar o modelo para **scroll por roda do mouse**, com amortecimento e passo
normalizado.

### Comportamento
- Cursor sobre o frame + roda → imagem rola por dentro, com inércia (lerp rAF).
- Passo previsível por evento: normaliza `deltaMode` (linha vs pixel) e aplica
  um teto por evento (anti-fling de trackpad). Resolve o "inconsistente".
- **End-release**: no topo/fim da imagem, a roda deixa de ser capturada e a
  página rola normal. No meio, `preventDefault` impede a página de rolar junto.

### Implementação (`components/case/CaseFrameScroll.tsx`)
- Listener `wheel` nativo `{ passive: false }` via ref + `useEffect` (o `onWheel`
  do React é passivo e não permite `preventDefault` confiável).
- `targetRef` (alvo) + `currentRef` (posição suavizada). Loop rAF aproxima
  `current` de `target` (`lerp ~0.18`) e aplica `translateY(-current)`. O loop
  dorme quando assenta (`|target-current| < 0.5`) e acorda no próximo wheel.
- `maxRef = max(0, img.clientHeight - frame.clientHeight)`, recalculado em
  `onLoad` e `resize`.
- Sensibilidade num único parâmetro `SENS` (px de imagem por px de delta),
  fácil de ajustar pelo feel.

### Fallbacks (mantidos da v1)
- `prefers-reduced-motion` → imagem estática no topo, sem captura de roda.
- Touch / `(hover: none)` → auto-scroll suave via `LiveScreenshot`.
- `onError` da imagem → `fallback`.

### Affordance
- Pílula "Role" com ícone de roda; some **após o primeiro scroll**
  (`hasScrolled`), não no hover — com roda, passar o mouse não significa rolar.

## Escopo

Apenas `CaseFrameScroll`. Hero (BrowserFrame) e Responsivo (PhoneFrame)
herdam automaticamente. Sem mudanças em tipo, dados ou outros componentes.

## Critérios de sucesso

1. Roda sobre o mockup rola a imagem suave, com passo consistente.
2. No topo/fim, a página volta a rolar (sem prender o usuário).
3. Touch e reduced-motion mantêm os fallbacks.
4. `npm run build` passa.
