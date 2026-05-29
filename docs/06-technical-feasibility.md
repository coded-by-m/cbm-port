# 06 — Technical Feasibility

# Coded by M — Viabilidade Técnica

## Objetivo

Transformar a experiência definida nos documentos anteriores em um plano técnico possível de executar.

Este documento responde:

- o que pode ser feito em HTML
- o que deve ser feito em Three.js
- onde usar GSAP
- onde usar Lenis
- onde usar React Three Fiber
- o que pode afetar performance
- o que deve ser testado em laboratório antes do site final

---

# Stack Recomendada

## Base do Site

- Next.js
- TypeScript
- Tailwind CSS

## Motion

- GSAP
- ScrollTrigger
- Lenis
- Framer Motion, apenas para microinterações simples se necessário

## 3D

- Three.js
- React Three Fiber
- Drei

## Modelagem e Protótipo

- Blender
- Spline, apenas para prototipagem visual rápida
- Figma para wireframes e UI

---

# Estratégia Técnica Principal

O site deve ser híbrido.

Não deve ser tudo Three.js.

Não deve ser tudo HTML.

A regra é:

Tudo que precisa de SEO, acessibilidade e manutenção deve ficar em HTML.

Tudo que precisa de imersão, profundidade e ambiente deve ficar em Three.js.

---

# Camadas Técnicas

## Camada 01 — Site Tradicional

Responsável por:

- SEO
- conteúdo
- textos
- botões
- cards
- contato
- projetos
- serviços
- sobre

Tecnologia:

- Next.js
- TypeScript
- Tailwind

---

## Camada 02 — Motion Layer

Responsável por:

- scroll narrativo
- transições
- entrada e saída de elementos
- pinagem de seções
- timelines
- sincronização entre texto e 3D

Tecnologia:

- GSAP
- ScrollTrigger
- Lenis

---

## Camada 03 — 3D Layer

Responsável por:

- loading
- hero
- paisagem digital
- malha triangulada
- partículas
- linhas
- CTA final

Tecnologia:

- React Three Fiber
- Three.js
- Drei

---

## Camada 04 — Overlay Layer

Responsável por:

- cards de projeto
- modais
- textos sobre a cena
- filtros
- CTAs
- elementos acessíveis

Tecnologia:

- HTML
- CSS
- Tailwind
- GSAP

---

# Regra Técnica Principal

Textos e cards não devem ser renderizados dentro do canvas.

Eles devem ser HTML.

Motivos:

- melhor SEO
- melhor acessibilidade
- melhor responsividade
- melhor manutenção
- melhor legibilidade
- menor complexidade

O canvas deve servir como camada visual e imersiva.

---

# Análise Cena por Cena

## Loading

### Complexidade

Média.

### Tecnologia

- React Three Fiber
- Three.js
- GSAP

### Descrição

- pontos
- linhas
- construção do triângulo
- rotação lenta
- transição para intro

### Observação

Não precisa de Blender.

Pode ser procedural.

---

## Intro

### Complexidade

Média.

### Tecnologia

- R3F
- GSAP
- ScrollTrigger

### Descrição

Estrutura nasce e se expande.

O scroll controla a evolução da cena.

---

## Hero

### Complexidade

Baixa a média.

### Tecnologia

- HTML
- Tailwind
- GSAP
- R3F ao fundo

### Regra

Texto principal deve ser HTML.

Canvas apenas no background.

---

## Problema

### Complexidade

Baixa.

### Tecnologia

- HTML
- GSAP

### Possível 3D

Opcional.

Pode usar a malha do background apenas como continuidade visual.

---

## Serviços

### Complexidade

Baixa.

### Tecnologia

- HTML
- Tailwind
- GSAP

### Observação

Não precisa de Three.js dedicado.

---

## Paisagem Digital

### Complexidade

Muito alta.

### Tecnologia

- React Three Fiber
- Three.js
- Instanced Meshes
- possível uso de shaders
- GSAP
- HTML Overlay

### Função

Principal assinatura visual do site.

### Riscos

- performance
- responsividade
- navegação mobile
- excesso de complexidade
- dificuldade de manutenção

### Recomendação

Criar protótipo separado antes do site final.

---

## Projetos Dentro da Paisagem

### Complexidade

Alta.

### Tecnologia

- R3F para terreno e hotspots
- HTML Overlay para cards
- GSAP para entrada e saída
- raycasting para interação desktop
- eventos de toque no mobile

### Regra

Cards de projeto são HTML.

Fragmentos visuais são 3D.

---

## Laboratório

### Complexidade

Média.

### Tecnologia

- HTML
- GSAP
- possivelmente pequenos elementos 3D reutilizados

### Observação

Não precisa ser tão complexo quanto a Paisagem Digital.

---

## Processo

### Complexidade

Baixa.

### Tecnologia

- HTML
- GSAP

### Possível visual

Linhas SVG ou CSS podem construir a estrutura.

Não precisa de canvas dedicado.

---

## Sobre

### Complexidade

Baixa.

### Tecnologia

- HTML
- Tailwind

### Observação

Menos animação.

Mais clareza.

---

## CTA Final

### Complexidade

Alta.

### Tecnologia

- R3F
- GSAP
- HTML Overlay

### Descrição

Fragmentos convergem.

Linhas se conectam.

Símbolo da Coded by M se forma.

---

# Experience Lab

Antes de desenvolver o site final, criar um laboratório técnico separado.

Nome sugerido:

codedbym-experience-lab

## Objetivo

Testar riscos técnicos antes da implementação principal.

## Experimentos

1. Triangle Loader
2. Triangle Lines
3. Terrain Mesh
4. Project Fragments
5. HTML Overlay on 3D
6. Scroll Camera
7. CTA Logo Formation

---

# Ordem de Testes

## Teste 01 — Triangle Loader

- três pontos
- linhas conectando
- triângulo wireframe
- rotação lenta
- GSAP controlando animação

## Teste 02 — Triangle Lines

- linhas desenhando formas
- variações de triângulos
- múltiplas conexões

## Teste 03 — Terrain Mesh

- malha triangulada procedural
- movimento orgânico sutil
- performance estável

## Teste 04 — Project Fragments

- fragmentos triangulares
- hover desktop
- toque mobile
- reação visual

## Teste 05 — HTML Overlay

- card HTML ancorado a posição 3D
- acessibilidade
- responsividade

## Teste 06 — Scroll Camera

- câmera controlada por scroll
- GSAP ScrollTrigger
- Lenis
- transições suaves

## Teste 07 — CTA Formation

- fragmentos convergindo
- símbolo sendo formado
- final cinematográfico

---

# O Que Evitar

- fazer o site inteiro antes dos testes
- colocar textos dentro do canvas
- usar Spline como base principal
- exagerar em shaders no início
- criar cenas pesadas demais no mobile
- depender de animações para explicar o serviço
- sacrificar SEO pela experiência

---

# MVP Técnico

A primeira versão funcional deve validar:

- loading com triângulo construído
- hero com background 3D
- paisagem digital simples
- fragmentos clicáveis
- overlay HTML
- scroll suave
- CTA funcional

Depois evoluir para:

- shaders
- refinamento de câmera
- motion avançado
- transições mais complexas
- microinterações premium

---

# Regra Final

A tecnologia deve servir à percepção da marca.

Se uma implementação aumenta complexidade sem aumentar percepção de valor, deve ser descartada.
