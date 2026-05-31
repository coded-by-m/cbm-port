# Case System V1 — Design Spec

**Sprint:** 04  
**Data:** 2026-05-31  
**Status:** Aprovado para implementação  
**Rota:** `/cases/[slug]`  
**Primeiro case:** Machado Plataformas (`/cases/machado-plataformas`)

---

## Contexto

O Case System é o destino final dos projetos da Paisagem Digital. O usuário chega via Project Overlay (que linka para `/cases/[slug]`) e retorna à Paisagem Digital ao final do case. A experiência deve ser editorial, premium e cinematográfica — coerente com a identidade da Coded by M.

---

## Decisões de design

### Layout geral

Abordagem B: UI Lab (componentes) + rota `/cases/[slug]` funcional com dados do Machado Plataformas como amostra.

### Hero (Seção 01)

**Split 50/50:** texto à esquerda, collage visual à direita.

**Lado esquerdo — hierarquia editorial:**
- Eyebrow: `font-display text-[9px] tracking-[0.4em] uppercase text-cbm-red/75` com linha vermelha à esquerda
- Título: `font-display font-black text-[clamp(36px,4.5vw,60px)] tracking-[-0.03em] leading-[0.95] uppercase text-cbm-white`
- Descrição: `font-body font-light text-[14px] leading-[1.78] text-cbm-gray-400 max-w-[360px]`
- Project Facts: grid 2×2, separado por `border-t` em `rgba(245,242,237,0.06)`
- CTA: Text Link CTA já aprovado do Button System V1

**Lado direito — collage de 5 painéis:**
- Grid: `grid-template-columns: 3fr 2fr; grid-template-rows: 2fr 1.1fr 1.1fr`
- Gaps: `3px` em `#000F08` (os gaps são a malha estrutural)
- `heroImages[0]` → Painel 1: tall, spans 2 rows — print principal (hero do site)
- `heroImages[1]` → Painel 2: top right — detalhe ou seção secundária
- `heroImages[2]` → Painel 3: mid right — tipografia ou componente
- `heroImages[3]` → Painel 4: bottom wide — seção de features ou rodapé
- `heroImages[4]` → Painel 5: bottom right — detalhe mínimo
- Se `heroImages[i]` for string vazia ou ausente: painel renderiza fundo `#070B08` com `LogoMark` centralizado em `opacity-20`

**Project Facts (dentro do hero):**
- 4 campos apenas: Cliente, Setor, Tipo, Ano
- Grid 2×2, `gap: 20px 32px`
- Label: `font-body text-[8px] tracking-[0.3em] uppercase text-cbm-gray-600`
- Valor: `font-body text-[13px] font-medium text-cbm-gray-100`

---

### Visão Geral (Seção 02)

Duas colunas: texto editorial à esquerda + bloco de desafio à direita.

**Coluna esquerda:**
- Eyebrow com linha vermelha
- Heading: `font-display text-[clamp(24px,3vw,36px)] font-bold tracking-[-0.02em]`
- Body: `font-body font-light text-[14px] leading-[1.78] text-cbm-gray-400`, máximo 3 parágrafos, `max-w-[520px]`

**Coluna direita (bloco de desafio):**
- Container com `border border-cbm-gray-800 p-6`
- Label: `DESAFIO` em micro uppercase
- Texto: `font-body font-light text-[13px] text-cbm-gray-400 leading-[1.75]`
- Largura fixa: `w-[280px]` no desktop

---

### Galeria (Seção 03)

Grid assimétrico de prints do projeto — mesmo padrão de gaps do hero.

- Grid: `grid-template-columns: 2fr 1fr 1fr; grid-template-rows: auto auto`
- Painel maior spans 2 rows (print principal)
- Gaps: `3px` em `#000F08`
- Mínimo 5 imagens
- Label de seção: `font-body text-[9px] tracking-[0.35em] uppercase text-cbm-gray-600 mb-[16px]`

---

### Retorno à Paisagem Digital (Seção 04)

CTA centrado. Não linka para próximo case — o usuário escolhe o ritmo na Paisagem Digital.

- Eyebrow: `CONTINUAR EXPLORANDO` em vermelho/60
- Título: `font-display font-black text-[clamp(28px,3.5vw,44px)]` — "Voltar à Paisagem Digital"
- Subtexto: `font-body font-light text-[14px] text-cbm-gray-400 max-w-[320px]`
- CTA: Ghost button com texto `← Explorar a Paisagem`, link para `/`

---

## Arquitetura de dados

### `types/case.ts`

```typescript
interface CaseProject {
  slug: string
  eyebrow: string
  title: string
  description: string
  meta: {
    cliente: string
    setor: string
    tipo: string
    ano: string
  }
  heroImages: string[]    // 5 itens — os painéis do collage
  overview: {
    heading: string
    body: string[]        // array de parágrafos, máx 3
    challenge: string
  }
  gallery: string[]       // mínimo 5 URLs
}
```

### `data/cases.ts`

Arquivo com array `CaseProject[]`. Primeiro item: Machado Plataformas. Os campos `heroImages` e `gallery` iniciam com strings vazias `''` — o componente renderiza o estado placeholder automaticamente (fundo escuro + LogoMark). Não criar arquivos de imagem fake: a ausência de URL é o sinal de placeholder.

---

## Estrutura de arquivos

```
app/
  cases/
    [slug]/
      page.tsx              ← rota dinâmica, busca case por slug

components/
  case/
    CaseHero.tsx            ← orquestra o split hero
    CaseHeroCollage.tsx     ← 5 painéis assimétricos (reutilizável)
    ProjectFacts.tsx        ← grade 2×2 de metadados
    CaseOverview.tsx        ← seção 02
    CaseGallery.tsx         ← seção 03
    CaseReturnCTA.tsx       ← seção 04

data/
  cases.ts                  ← fonte de dados estática

types/
  case.ts                   ← interface CaseProject
```

### UI Lab

Nova seção `06 — Case System` adicionada ao `/ui-lab`, com:
- Preview do Case Hero V1
- Preview do Project Facts
- Preview do Case Layout Foundation (scroll simulado)
- Preview do CaseReturnCTA
- Status: `progress`

---

## Conexão com sistemas existentes

| Sistema | Conexão |
|---|---|
| Project Overlay | `data.cta` linka para `/cases/[slug]` |
| Button System V1 | Text Link CTA reutilizado no hero |
| Paisagem Digital | CaseReturnCTA volta para `/` onde o 3D está |
| LabNav | Link `← Home` aponta para a raiz correta |

---

## Fora do escopo do V1

- Animações de entrada/saída entre Paisagem Digital e Case
- Filtros ou índice de cases
- Modo de leitura / tipografia expandida
- Breadcrumbs ou navegação entre cases sequenciais
- Compartilhamento ou metadados Open Graph

---

## Critérios de aprovação

1. Case Hero V1 visualmente aprovado no UI Lab
2. `/cases/machado-plataformas` renderiza sem erros
3. Project Overlay linka para o case e a rota existe
4. Retorno à Paisagem Digital funciona (`/`)
5. Componentes exportáveis sem retrabalho estrutural
