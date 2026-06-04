# Assets do case Machado Plataformas

Dropar os seguintes arquivos aqui:

- `desktop-tall.webp` — screenshot da home completa em viewport 1600px
  - Resolução: ~1600×6000px
  - Peso alvo: <300KB
- `mobile-tall.webp` — screenshot da home completa em viewport 400px
  - Resolução: ~400×2400px
  - Peso alvo: <150KB

PNG também aceito — neste caso, ajustar extensão em [data/cases.ts](../../../data/cases.ts).

## Como gerar

1. Abrir o site Machado em Chrome no viewport desejado (DevTools device mode)
2. Cmd+Shift+P → "Capture full size screenshot"
3. Converter o PNG resultante para WebP (qualidade 80–85) usando [squoosh.app](https://squoosh.app) ou `cwebp`

## Fallback

Se os arquivos não existirem, o card cai automaticamente no placeholder triangulado (`CardMeshPlaceholder`). Site não quebra.
