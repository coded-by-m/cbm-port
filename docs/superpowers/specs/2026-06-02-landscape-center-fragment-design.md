# Digital Landscape — Centro Fixo com Fragmento Único

## Problema

A arquitetura atual move a câmera 3D pelo terreno via scroll (Lenis + ScrollTrigger + SCROLL_POSES). A câmera perspectiva, o lerp do Lenis e a projeção 3D→2D criam camadas de indireção que tornam impossível manter fragmentos e cards centalizados na viewport de forma confiável.

## Solução

Câmera fixa com drift cinematográfico. Um único fragmento 3D sempre no centro da cena. O scroll (wheel com cooldown) troca qual projeto está ativo — o fragmento faz fade out, regenera com novo seed, fade in. Card HTML centralizado via CSS. Dots clicáveis para navegação direta.

## Arquitetura

### Componentes

#### 1. `DigitalLandscape` (refatorado)

Container principal. Sem Lenis, sem scroll real, sem `useScrollDriver`.

- Estado React: `activeIndex` (0..N-1), controlado por wheel handler com cooldown de 1.2s.
- Canvas: terrain layers + câmera cinematográfica + fragmento central.
- HTML overlay: card centralizado + dots nav + connector SVG.
- Ao final (último projeto + scroll down): chama `onComplete` se existir.

```
<div (wheel handler)>
  <Canvas>
    <fog />
    <LandscapeScene activeIndex={activeIndex} />
  </Canvas>
  <CenteredCard activeIndex={activeIndex} />
  <DotsNav activeIndex={activeIndex} onGo={setActiveIndex} />
</div>
```

#### 2. `LandscapeScene` (simplificado)

Remove: `useScrollCamera`, `useScrollNarrative`, 9x `ScrollFragment`.
Adiciona: `useCinematicCamera` (já existe), 1x `CenterFragment`.

```tsx
function LandscapeScene({ activeIndex }) {
  useCinematicCamera();
  useResponsiveFit(fitRef, FIT_RADIUS);

  return (
    <group ref={fitRef}>
      {LAYERS.map(layer => <TerrainLayer key={layer.name} layer={layer} />)}
      <group position={[HOST_LAYER.xOffset, HOST_LAYER.yOffset, HOST_LAYER.zOffset]}>
        <CenterFragment
          seed={LANDSCAPE_CARDS[activeIndex].seed}
          isActive={true}
        />
      </group>
    </group>
  );
}
```

#### 3. `CenterFragment` (novo)

Posição fixa: `[0, surfaceY(0, 0, t), 0]` — centro calmo do terreno.

- Recebe `seed` como prop. Quando `seed` muda:
  1. Presença fade out (0→0 em 0.3s via lerp no useFrame)
  2. Geometria é reconstruída com novo seed (`buildFragment(seed)`)
  3. Presença fade in (0→1 em 0.5s)
- Usa `buildFragment()` existente de `ProjectFragments/geometry`.
- Rotação yaw lenta, bob sutil (mesmos params de `FRAGMENT_MOTION`).
- Não precisa de envelope de visibilidade nem projeção 3D→2D.
- Não posiciona o card — o card é HTML puro centralizado.

Estrutura interna:
```tsx
function CenterFragment({ seed }: { seed: number }) {
  const [currentSeed, setCurrentSeed] = useState(seed);
  const presence = useRef(1);
  const targetPresence = useRef(1);

  // Quando seed muda: fade out → swap → fade in
  useEffect(() => {
    if (seed !== currentSeed) {
      targetPresence.current = 0; // fade out
      // após 0.3s, swap seed e fade in
      const timer = setTimeout(() => {
        setCurrentSeed(seed);
        targetPresence.current = 1; // fade in
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [seed, currentSeed]);

  const geom = useMemo(() => buildFragment(currentSeed), [currentSeed]);

  useFrame((_, delta) => {
    // lerp presence toward target
    presence.current += (targetPresence.current - presence.current) * Math.min(1, delta * 6);
    // apply presence to opacity, scale
    // update position Y from sampleHeight(0, 0, t)
    // rotate yaw
  });
}
```

#### 4. `CenteredCard` (novo ou adaptado)

Card HTML com posição CSS fixa no centro da viewport. Sem projeção 3D.

```tsx
function CenteredCard({ activeIndex }) {
  const card = LANDSCAPE_CARDS[activeIndex];
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="pointer-events-auto translate-y-[8vh]">
        {/* card content: type, title, description, CTA */}
      </div>
    </div>
  );
}
```

Transição entre cards: GSAP timeline (fade out current → fade in next), mesmo padrão da PhilosophySection.

O card fica ligeiramente abaixo do centro (`translate-y-[8vh]`) para não sobrepor o fragmento.

#### 5. `DotsNav`

Dots clicáveis + barra de progresso. Posição: bottom center.

```tsx
function DotsNav({ count, activeIndex, onGo }) {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
      <div className="h-px w-32 bg-white/10">
        <div style={{ width: `${((activeIndex + 1) / count) * 100}%` }}
             className="h-full bg-[#FB3640]/60 transition-all duration-500" />
      </div>
      <div className="flex gap-3">
        {Array.from({ length: count }, (_, i) => (
          <button key={i} onClick={() => onGo(i)}
            className="h-1.5 w-1.5 rounded-full transition-all"
            style={{
              backgroundColor: i === activeIndex ? '#FB3640' : '#F5F2ED',
              opacity: i === activeIndex ? 1 : 0.25,
              transform: i === activeIndex ? 'scale(1.5)' : 'scale(1)',
            }} />
        ))}
      </div>
    </div>
  );
}
```

### Dados

`LANDSCAPE_CARDS` continua como fonte dos projetos (títulos, descrições, seeds). Remove:
- `SCROLL_POSITIONS` — fragmentos não têm posições individuais
- `SCROLL_POSES` — câmera é fixa
- `VISIBILITY_ENVELOPES` — presença controlada por `activeIndex`, não por progress
- `ACTIVE_RANGES` — idem

### Navegação

| Input | Ação |
|-------|------|
| Wheel down | `activeIndex++` (com cooldown 1.2s) |
| Wheel up | `activeIndex--` (com cooldown 1.2s) |
| Arrow right/down | `activeIndex++` |
| Arrow left/up | `activeIndex--` |
| Dot click | `goTo(index)` |
| Último projeto + wheel down | `onComplete()` |

### Fluxo de Transição

```
trigger (wheel/key/dot)
  → cooldown ativo por 1.2s
  → activeIndex muda
  → CenterFragment: targetPresence = 0 (fade out 0.3s)
  → após 0.3s: seed swap → targetPresence = 1 (fade in 0.5s)
  → CenteredCard: GSAP timeline exit/enter (0.4s total)
  → DotsNav: progress bar anima (CSS transition)
```

### Câmera

Usa `useCinematicCamera` existente (config `CAMERA`). Drift extremamente lento em X/Y/Z. A câmera nunca se move para os fragmentos — os fragmentos é que estão no centro calmo.

Posição base: `[0, 3.4, 7.6]`, target `[0, -0.1, -0.6]`, FOV 42.

### Archivos Eliminados / Não Utilizados

Estes hooks/componentes deixam de ser usados pelo DigitalLandscape (mas podem continuar existindo para outros experimentos do lab):

- `useScrollCamera` — substituído por `useCinematicCamera`
- `useScrollDriver` — sem scroll real
- `useScrollNarrative` — substituído por `activeIndex` direto
- `ScrollFragment` — substituído por `CenterFragment`
- `SCROLL_POSES`, `VISIBILITY_ENVELOPES`, `ACTIVE_RANGES`, `SCROLL_POSITIONS` — não utilizados

### Mobile (compact)

No mobile, o card vira painel inferior (já existe essa lógica no `ProjectCard` atual via `isCompact`). Os dots ficam acima do card. O fragmento 3D continua centrado no Canvas.

## Critérios de Sucesso

1. O fragmento 3D está sempre centrado na viewport, independente do tamanho da tela.
2. O card está sempre centrado (ou em painel inferior no mobile).
3. Scroll/wheel avança entre projetos com transição suave e sem saltos.
4. O terrain mesh permanece visível e vivo durante toda a experiência.
5. Dots permitem navegação direta a qualquer projeto.
6. Performance: sem re-render React a cada frame (refs para animação).
