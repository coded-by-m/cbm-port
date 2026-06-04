# Paisagem Digital — Simplificação radical

**Data:** 2026-06-04
**Escopo:** segunda rodada de refinamento da Paisagem após teste em browser. Substitui o sistema de câmera com scroll por **vista fixa única** + reorganização espacial dos fragmentos + reforço visual.

Referência: [2026-06-04-landscape-polish-design.md](./2026-06-04-landscape-polish-design.md) (spec anterior).

---

## Problema identificado em teste

A Paisagem tem **dois sistemas independentes brigando**:

1. Câmera dirigida por scroll interno (3 keyframes em `x = -4, 0, +4`)
2. Slideshow auto-rotativo que muda `activeSlug` a cada 6s

Quando o slideshow ativa um fragmento que está fora do enquadramento atual da câmera de scroll, o card abre num ponto fora da tela. O usuário vê "vai e volta + zoom" porque scroll bouncy + slideshow desconectado.

Outras questões: fragmentos em `x = ±7` ficam fora do viewport sem pan, malha off-white se confunde com terreno (mesma cor/textura), scroll interno briga com scroll da página.

## Decisão

**Vista única, fixa, sem scroll.** Slideshow é a única narrativa de movimento.

## Mudanças

### 1. Remoção do sistema de scroll

- Deletar `useProjectScrollCamera.ts`
- Remover de `config.ts`: `CAMERA_KEYFRAMES`, `CameraKeyframe`, `SCROLL_VH`
- `ProjectLandscape.tsx`: remover `wrapperRef`/`contentRef`/`progress`/`useScrollDriver`, simplificar markup pra `<div className="absolute inset-0">` direto contendo o Canvas
- `LandscapeScene.tsx`: remover `progress` prop e chamada de `useProjectScrollCamera`

### 2. Reposicionamento dos fragmentos

Slot positions atuais → novas:

| slot | x antigo | z antigo | scale antigo | x novo | z novo | scale novo |
|------|---------:|---------:|-------------:|-------:|-------:|-----------:|
| left (machado) | -7 | 0 | 2.6 | -3 | -1.5 | 2.4 |
| center (estudio-mendes) | 0 | 0 | 2.6 | 0 | 0 | 2.6 |
| right (rota-clinica) | 7 | 0 | 2.6 | 3 | -1.5 | 2.4 |

**Por quê:** com FOV=42° e câmera em `z=15`, viewport ~`±5` em x=0. Os 3 ficam visíveis simultaneamente. O leve recuo em z dos laterais (`-1.5`) e scale menor (`2.4`) cria profundidade — central avança, laterais recuam.

### 3. "Push" do fragmento ativo

Em vez de mover a câmera pro ativo, **o ativo se move sutilmente em direção à câmera**.

Em `ProjectFragment.tsx`, quando `isActive`:

- `group.position.z += 0.8 * highlight` (avança em direção à câmera)
- `surfaceLift + 0.18 * highlight` (já existe — `highlightLift`, manter)
- `scale × 1.18` (já existe — `highlightScale`, manter)

Resultado: o ativo "sai do fundo", se destaca sem que nada mais se mova.

### 4. Contraste visual com o terreno

Hoje o fragmento off-white se confunde com o terreno (mesma cor, mesma técnica wireframe).

- `FRAGMENT_VISUAL.edgeNormalOpacity`: `0.55 → 0.85`
- `FRAGMENT_VISUAL.nodeNormalOpacity`: `0.7 → 0.95`
- `FRAGMENT_VISUAL.dimMultiplier`: `0.55 → 0.30` (inativos recuam mais)
- `FRAGMENT_VISUAL.edgeWidth`: `1.8 → 2.2` (mais "obra", menos "linha técnica")

### 5. Apex mais alto (silhueta marcante)

- `TOWER.apexHeight`: `0.75 → 0.95`

Torre lê mais vertical, contrasta com o relevo horizontal do terreno.

### 6. Inativos puxam pra cor do terreno

Quando dim, o apex hoje vira off-white (perde vermelho). Estender para edges/nodes também — lerp `#F5F2ED → #6b7a72` (tom de meio do terreno) baseado no dim. Inativos realmente recuam pra paisagem.

Nova constante `FRAGMENT_VISUAL.dimColor = "#6b7a72"`. Aplicado via `material.color.lerpColors(...)` por frame, igual ao apex hoje.

### 7. Base ring de pontos

Sob cada fragmento, um anel discreto de 12 pontos no chão (z plano), raio ~`0.8 * scale`, alinhado à altura do terreno. Cor off-white/25 em base, off-white/55 quando ativo. Ancora o fragmento ao terreno e marca "aqui tem obra".

Novo componente `<FragmentBaseRing slot={...} active={...} />` em `components/lab/ProjectLandscape/FragmentBaseRing.tsx`.

### 8. Active glow

Quando ativo, um sprite circular radial (off-white → transparente) atrás do fragmento, billboard pra câmera. Tamanho ~`2 × scale`, opacity peak 0.18 (sutilíssimo). Fade in junto com highlight.

Pode ser implementado via `<sprite>` com `SpriteMaterial` + textura radial procedural (CanvasTexture). Posicionado em `[0, apexHeight*0.5, -0.3]` (atrás do fragmento, levemente abaixo do meio).

Novo componente `<FragmentGlow active={...} />` filho de `<ProjectFragment>`.

---

## Arquivos afetados

| Arquivo | Mudança |
|---------|---------|
| `useProjectScrollCamera.ts` | **deletar** |
| `config.ts` | remover CAMERA_KEYFRAMES, CameraKeyframe, SCROLL_VH; ajustar slot positions, FRAGMENT_VISUAL valores, TOWER.apexHeight; add dimColor |
| `ProjectLandscape.tsx` | remove wrapper + scroll; simplifica markup |
| `LandscapeScene.tsx` | remove progress prop |
| `ProjectFragment.tsx` | active push z, dim colors edges/nodes, add base ring + glow children |
| `FragmentBaseRing.tsx` | **novo** |
| `FragmentGlow.tsx` | **novo** |

## Verification

- [ ] Type check passa
- [ ] Build passa
- [ ] No browser:
  - [ ] Os 3 fragmentos aparecem na tela ao mesmo tempo
  - [ ] Slideshow muda o ativo; ativo avança em z; outros dimam
  - [ ] Sem scroll/zoom dentro da Paisagem
  - [ ] Fragmento ativo lê claramente sobre o terreno
  - [ ] Base ring visível sob cada fragmento
  - [ ] Glow do ativo presente mas discreto
