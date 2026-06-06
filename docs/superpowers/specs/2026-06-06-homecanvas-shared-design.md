# Design — HomeCanvas compartilhado + morphs de geometria

**Data:** 2026-06-06
**Status:** spec (design travado). Execução em sessão dedicada.
**Pré-requisito atendido:** a Home já está composta (9 capítulos, affordances, transição conectiva por dip). Ver [project-home-assembly-phase] na memória e os commits `4471104` / `c751007`.

---

## Por que (e por que NÃO é urgente)

A `ChapterTransition` (dip na cor da marca entre cenas) **já resolveu o "desconexo"** — as cenas dissolvem através do verde em vez de um corte seco. Este spec é o **upgrade de luxo**: substituir o dip por **morphs de geometria reais** entre as cenas (a marca se desfaz em terreno, o terreno endurece em cubos, a torre vira cards, etc.) e, de quebra, colapsar **8 contextos WebGL em 1**.

**Não é correção.** Só vale executar quando o resto estiver redondo. O risco é alto: é reescrita da camada 3D.

## Estado atual (o que muda)

Hoje **cada zona tem seu próprio `<Canvas>`** (R3F), cada um com câmera, fog, gl settings, controles e loop de scroll próprios. A Home monta/desmonta esses canvas por viewport (`LazySection`). Pico de ~7 contextos simultâneos.

Problemas que o shared canvas resolve:
1. Morphs entre cenas são impossíveis (geometrias vivem em contextos isolados).
2. N contextos WebGL = caro e arriscado em hardware fraco.
3. Câmera não pode transicionar de uma cena pra outra (cada uma tem a sua).

## Arquitetura alvo

### Visão geral

```
<HomeCanvasProvider>            ← estado: chapterProgress, activeChapter, scrollRef
  <Canvas fixed inset-0>        ← UM contexto WebGL, fundo fixo na página
    <CameraRig />               ← interpola a câmera entre os alvos de cada cena
    <ConnectiveSubstrate />     ← terreno + pool de fragmentos PERSISTENTE (o "barro")
    <SceneSwitcher>             ← monta a(s) cena(s) ativa(s) por scroll
      <LogoScene /> <ProblemaScene /> ... (uma por capítulo)
    </SceneSwitcher>
  </Canvas>
  <main>                        ← o DOM/HTML das seções (copy, cards, cues) por cima
    ... LazySection só pro CONTEÚDO HTML agora, não pro canvas ...
  </main>
</HomeCanvasProvider>
```

O `<Canvas>` é **único e fixo** atrás de todo o conteúdo HTML. O HTML de cada seção (copy, cards, headlines, affordances) continua em fluxo de scroll por cima — só a camada 3D é compartilhada.

### Insight-chave: substrato conectivo persistente

Muitas cenas já compartilham o **TerrainLayer** (Paisagem, Lab, Sobre, Processo, Serviços) e o motivo de **fragmentos triangulados**. Em vez de morphar cenas inteiras, o shared canvas mantém:
- **Um terreno persistente** (nunca desmonta; só muda densidade/câmera por capítulo).
- **Um pool único de fragmentos triangulados** (ex.: 80 instâncias via instancing) que **re-targeta posições/escala/rotação por capítulo**.

Os morphs viram então **re-targeting do mesmo pool de fragmentos** (lerp das instâncias entre layouts), não troca de geometria. Isso é o que torna a coisa factível e coerente: os fragmentos SÃO o material que se remodela de cena em cena.

### Componentes novos (`components/home/canvas/`)

| Componente | Responsabilidade |
|------------|------------------|
| `HomeCanvasProvider` | Context com `scrollProgress` global, `activeChapter`, e por-capítulo `localProgress` (0..1). Fonte única; reusa `useActiveChapter` + `useSectionScrollProgress`. |
| `HomeCanvas` | O `<Canvas>` fixo único (fog, gl, dpr). `frameloop="always"` mas com `<AdaptiveDpr>` e pausa em `document.hidden`. |
| `CameraRig` | Lê o capítulo ativo + progresso, interpola posição/target/fov da câmera entre os **alvos declarados por cena** (lerp amortecido, ease-out). Caso especial: Projetos cede controle pro drag orbital quando ativo. |
| `ConnectiveSubstrate` | Terreno persistente + pool de fragmentos instanciado. Expõe API pras cenas re-targetarem fragmentos. |
| `SceneSwitcher` | Monta a cena do capítulo ativo (e a adjacente durante a transição, pra cross-morph). Cada cena é um componente que NÃO cria Canvas/câmera — só geometria. |
| `<XScene>` (uma por capítulo) | A geometria distintiva de cada zona, extraída de dentro do `<Canvas>` atual. |

### Contrato de migração por cena

Cada zona vira uma `<XScene>` que:
1. **Não** renderiza `<Canvas>`, câmera, nem fog (isso é do HomeCanvas).
2. Recebe `localProgress` (0..1 do capítulo) via context.
3. Declara seu **alvo de câmera** (posição, target, fov) que o `CameraRig` consome.
4. Re-targeta o pool de fragmentos compartilhado (quando aplicável) em vez de criar geometria própria.

As cenas atuais (`GenericGrid`, `ProcessJourney`, `CTAFormation`, `LandscapeScene`, `TerrainLayer`, `TriangleScene`, etc.) já têm a lógica interna; a migração é **extrair o conteúdo de dentro do `<Canvas>`** e parametrizar câmera/progresso.

## Os 8 morphs (mecanismo por transição)

| # | De → Para | Mecanismo | Tipo |
|---|-----------|-----------|------|
| 1 | Logo → Manifesto | A marca (TriangleScene) dispersa nos pontos do terreno do manifesto | terreno + pontos |
| 2 | Manifesto → Problema | Terreno endurece/quantiza na grade de cubos | terreno → cubos |
| 3 | Problema → Serviços | Faces da torre se desdobram nos 3 mini-cenas dos cards | **morph de geometria** (o mais difícil — mini-scenes hoje são canvas por-card; rever) |
| 4 | Serviços → Projetos | Cards/fragmentos espalham como fragmentos de projeto na paisagem | pool de fragmentos re-target |
| 5 | Projetos → Processo | Fragmentos orbitais se alinham na linha das 4 estações | pool de fragmentos re-target |
| 6 | Processo → Laboratório | Nó final floresce no campo residual do lab | pool de fragmentos re-target |
| 7 | Laboratório → Sobre | Fragmentos do lab se aquietam no terreno do Sobre | terreno + fragmentos |
| 8 | Sobre → Convite | Símbolo CbM explode nos 60 fragmentos da CTAFormation (fecha a simetria com #1) | **morph de geometria** (símbolo do Sobre hoje é CSS — precisa virar 3D ou aproximar) |

**Maioria (4,5,6,7) = re-targeting do pool de fragmentos** (factível e elegante). **#3 e #8 são os caros** (geometrias muito diferentes; #8 exige o símbolo do Sobre em 3D). **#1, #2, #7** apoiam no terreno persistente.

## Ordem de migração (incremental, NÃO-destrutiva)

Construir atrás de um flag, sem remover os canvas por-zona até ter paridade:

1. **Scaffold isolado:** `HomeCanvas` + `CameraRig` + `ConnectiveSubstrate` (terreno + pool) renderizando vazio, atrás de `?homecanvas=1` ou env flag. Home atual intacta.
2. **Migrar 1 cena simples** (ex.: Sobre — terreno residual estático) pro shared canvas. Validar câmera + substrato.
3. **Migrar as cenas de fragmento** (Projetos, Lab, Processo) — provam o re-targeting do pool. Implementar morphs 4,5,6.
4. **Migrar Problema + Manifesto + Logo** — morphs 1,2.
5. **Os caros:** Serviços (#3) e Convite + Sobre-símbolo-3D (#8).
6. **Trocar o flag por default**, remover os `<Canvas>` por-zona, deletar a `ChapterTransition` (o dip) — os morphs substituem.
7. **Limpeza:** o `LazySection` passa a gerenciar só o conteúdo HTML; o gate `active`/`frameloop` e o dedup do Serviços ficam obsoletos (1 canvas só).

Cada passo é verificável no Playwright (já configurado) e reversível (flag).

## Riscos e mitigações

| Risco | Mitigação |
|-------|-----------|
| Câmera única quebra o drag orbital do Projetos | `CameraRig` cede controle total pro orbital quando Projetos é o capítulo ativo; retoma o lerp ao sair |
| `transform` em ancestral quebra `sticky`/`fixed` | O canvas é `fixed` próprio; o HTML scroll-driven não recebe transform |
| Mini-scenes do Serviços (canvas por-card) não cabem no modelo | Avaliar: ou viram parte do SceneSwitcher, ou Serviços fica como exceção HTML+mini-canvas (morph #3 vira fade) |
| Símbolo do Sobre é CSS, não 3D (morph #8) | Recriar o símbolo CbM como geometria 3D no shared canvas, OU aproximar o morph (fade + fragmentos emergindo) |
| Regressão no /lab | As `<XScene>` são novas; os componentes originais (com Canvas) ficam pro /lab. Não deletar até paridade |
| Build pela metade | Flag + ordem incremental: a Home default nunca depende do shared canvas até o passo 6 |

## Critérios de sucesso

- [ ] 1 contexto WebGL na Home (vs ~7 hoje).
- [ ] Câmera transiciona suave entre capítulos; drag orbital do Projetos intacto.
- [ ] Pelo menos os morphs de fragmento (4,5,6) re-targetando um pool único.
- [ ] Morphs #1, #2 (terreno) e #8 (bookend símbolo→formação) implementados.
- [ ] `/lab` intacto.
- [ ] Sem regressão de perf vs a Home atual (medir FPS no Playwright).

## Fora de escopo

- Reescrever as cenas do /lab (elas ficam como estão pro lab).
- Mobile pass dedicado do shared canvas (sessão própria).
- Post-processing global (bloom etc.) — avaliar depois.

## Decisão de quando executar

Só depois de o usuário rolar a Home atual inteira e confirmar que quer os morphs de geometria (não só o dip). O dip conectivo é suficiente pra sensação de continuidade; isto é ambição visual. Estimativa honesta: **múltiplas sessões**, com os passos 1–4 sendo o grosso e 5 (#3, #8) o mais arriscado.
