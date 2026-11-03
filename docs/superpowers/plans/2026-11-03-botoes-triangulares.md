# Botões triangulares: plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans. Spec: `docs/superpowers/specs/2026-11-03-botoes-triangulares-design.md`.

**Goal:** reescrever o MeshButton sobre o X-A e criar o FillButton sobre o X-F, com o contraste do texto provado por teste.

**Global Constraints:**
- `border-radius: 0`.
- Cores só via `cbm()` ou tokens.
- Nada anima em repouso.
- `prefers-reduced-motion` respeitado.
- Não commitar `CookieConsent.tsx`, `WhatsAppFab.tsx` nem `app/posts/machado/`.

### Task 1: núcleo puro + testes (TDD)
- Criar `scripts/buttons.test.mts` com os testes de `meshTris` (determinismo, contagem e área igual a `w·h`) e de contraste (a matriz da spec, nas 4 paletas). Rodar e ver falhar.
- Criar `components/ui/triMesh.ts`, `components/ui/buttonSpec.ts` e `components/ui/useBoxSize.ts`. Rodar e ver passar.
- Commit.

### Task 2: MeshButton reescrito
- Reescrever `components/ui/MeshButton.tsx`. A API continua compatível e ganha `size` e `href`.
- `CaseLiveButton` e `CTASection` passam a usar `href`.
- Atualizar `.design-sync/previews/MeshButton.tsx`.
- Rodar o typecheck e commitar.

### Task 3: FillButton + troca do `.site-cta`
- Criar `components/ui/FillButton.tsx`.
- Trocar o `<a className="site-cta">` no Hero, no ContactSection e no LpCta. Remover `.site-cta:hover` do `globals.css`.
- Criar `.design-sync/previews/FillButton.tsx` e exportar no `entry.tsx`.
- Rodar o typecheck e commitar. Os arquivos com trabalho em andamento do Matheus ficam fora do commit.

### Task 4: lab
- O registro passa a ter o FillButton em Botões.
- Remover a seção X e `app/lab/revisao/prototipos/`.
- Verificar no navegador: hover, Tab, Hero, Contato, LP e case.
- Rodar build, testes e `check-green`, depois commitar.
