---
name: Guia de Tráfego Pago — Metodaria
description: Página de vendas editorial e monocromática, construída como o próprio guia aberto.
colors:
  ink: "#080808"
  surface: "#141414"
  surface-2: "#1b1b1b"
  line: "#262626"
  line-strong: "#3a3a3a"
  arc: "#1f2022"
  fg: "#f5f5f5"
  fg-2: "#a6a6a6"
  fg-3: "#8c8c8c"
  paper: "#f4f4f2"
  paper-line: "#d4d4cf"
  paper-ink: "#111111"
  paper-fg-2: "#555555"
typography:
  display:
    fontFamily: "Montserrat, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 1rem + 4.6vw, 4.75rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  section:
    fontFamily: "Montserrat, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.15rem + 2.9vw, 3.75rem)"
    fontWeight: 800
    lineHeight: 1.06
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Montserrat, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Montserrat, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "0em"
  running-head:
    fontFamily: "Montserrat, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: "0.14em"
  folio:
    fontFamily: "Montserrat, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: "0em"
rounded:
  xs: "2px"
  sm: "3px"
  md: "8px"
  lg: "16px"
  full: "9999px"
spacing:
  gutter-mobile: "16px"
  gutter-tablet: "32px"
  gutter-desktop: "48px"
  section-mobile: "80px"
  section-tablet: "112px"
  section-desktop: "144px"
components:
  button-primary:
    backgroundColor: "{colors.fg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "12px 22px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
  button-ghost:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.fg}"
    rounded: "{rounded.md}"
    padding: "12px 22px"
    height: "48px"
  field:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.fg}"
    rounded: "{rounded.md}"
    padding: "10px 14px 10px 44px"
    height: "48px"
  panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.fg}"
    rounded: "{rounded.md}"
    padding: "48px"
---

# Design System: Guia de Tráfego Pago — Metodaria

## Overview

**Creative North Star: "O guia aberto"**

A página apresenta o guia como produto digital: o PDF aparece num tablet desenhado em CSS sobre um círculo cinza, e a seção clara mostra o miolo. A gramática vem do arquivo, com cabeçalho corrido em caixa alta sobre uma linha fina, referências de página ("Módulo 06 · p. 15"), sumário com pontilhado até o número da página e tabelas de duas ou três colunas separadas só por linhas horizontais. O arco cinza largo da capa reaparece cortado pela borda das seções escuras.

O tom é editorial e contido. A energia vem da escala tipográfica (o título em caixa alta chega a 84 px) e do contraste preto e branco, não de cor. Não há gradientes coloridos, neon nem cartões iguais em fileira.

**Key Characteristics:**
- Monocromia estrita: preto, branco e cinzas neutros, com uma única seção clara (a amostra).
- Montserrat em toda a interface, a mesma família dos criativos de anúncio, para o visitante reconhecer o que clicou.
- Linhas de 1 px como estrutura; superfícies elevadas só para a calculadora, a oferta e o checklist.
- Números em algarismos tabulares sempre que comparam valores ou páginas.

## Colors

### Primary
- **Branco de capa** (fg): texto principal e fundo do botão de compra. É a cor de ação da página.

### Neutral
- **Preto de capa** (ink): fundo de todas as seções escuras.
- **Superfície** (surface) e **superfície 2** (surface-2): painéis da calculadora, da oferta e do checklist.
- **Linha** (line) e **linha forte** (line-strong): divisórias de tabela, sumário e campos.
- **Arco** (arc): os arcos decorativos da capa.
- **Cinza de apoio** (fg-2) para texto secundário e **cinza de fólio** (fg-3) para referências de página e rótulos; ambos passam de 5:1 sobre o preto.
- **Papel** (paper), **linha de papel** (paper-line), **tinta** (paper-ink) e **cinza de papel** (paper-fg-2): exclusivos da seção de amostra.

### Named Rules
**The One Paper Rule.** O fundo claro aparece só na seção que mostra o miolo do guia. Qualquer outra seção é preta.

**The No Accent Rule.** Não existe cor de destaque. Hierarquia e ação vêm de escala, peso e do botão branco.

## Typography

### Hierarchy
- **Display** (display): o H1 do hero e o título da prévia, em caixa de frase e peso 800.
- **Section** (section): títulos de seção em caixa de frase.
- **Title** (title): títulos de bloco, de grupo e do painel (24–30 px, 700).
- **Body** (body): texto corrido em 16–20 px, medida até 65 caracteres.
- **Running head** (running-head): cabeçalhos corridos do hero e da amostra e rótulos de coluna de tabela.
- **Folio** (folio): referências "p. 15", "Módulos 01 a 03", "Anexo D · p. 43", sempre tabulares.

### Named Rules
**The Folio Rule.** Referências de módulo e página ficam ao lado ou abaixo do título, como fólio. Nunca como etiqueta acima de um título.

**The Uppercase Budget Rule.** Caixa alta só na marca e na etiqueta do hero. Títulos ficam em caixa de frase.

## Layout

Contêiner de até 82rem, com margens laterais de 16 px (celular), 32 px (tablet) e 48 px (desktop). Seções escuras com respiro vertical de 80, 112 e 144 px. Grade de 12 colunas no desktop: título em 7–8 colunas e texto de apoio em 4, alinhado pela base.

- O hero fica em duas colunas a partir de 768 px (texto 1,3fr, capa 0,7fr) e empilha no celular, com título, preço e CTA acima da dobra.
- As colunas de título do sumário e das dúvidas ficam fixas (sticky) no desktop enquanto a lista rola.
- Tabelas viram blocos empilhados abaixo de 1024 px; os rótulos de coluna somem e cada linha mantém a ordem situação, resposta, fólio.
- Abaixo de 1024 px, uma barra de compra fixa aparece depois do hero, respeita a safe area e some quando a oferta ou o CTA final estão visíveis.

## Elevation & Depth

Profundidade quase sempre por linha e tom, não por sombra. Sombras macias e escuras só em objetos: a capa (deslocamento vertical grande, desfoque de 70 px) e as miniaturas da amostra sobre o papel. A capa recebe um contorno branco de 12% para se separar do fundo preto.

### Named Rules
**The Object Shadow Rule.** Só objetos do mundo (capa, páginas) projetam sombra. Painéis e botões ficam planos.

## Shapes

Botões com 8 px de raio, cards de oferta e de CTA final com 16 px, páginas da amostra com cantos quase retos. Círculos só nos controles de abrir/fechar do accordion e nas setas do lightbox. O arco grande da capa é a única forma orgânica.

## Components

### Buttons
- **Primário**: branco com texto preto, 52 px de altura, 8 px de raio. No hover sobe 2 px, fica branco puro e ganha um brilho suave; a seta interna avança 3 px.
- **Fantasma**: transparente com borda cinza forte; no hover a borda fica branca e o fundo ganha 6% de branco.
- Foco visível em todos: contorno branco de 2 px com afastamento de 3 px (preto na seção de papel).

### Cards / Containers
- **Painel** (calculadora, oferta, checklist): superfície com borda de linha e 4 px de raio. Nunca aninhado.

### Inputs / Fields
- Campo monetário com prefixo "R$" interno, fundo preto, borda cinza forte, números tabulares; foco com contorno branco.

### Navigation
- Cabeçalho de 64 px com a marca em caixa alta espaçada, três links cinza que clareiam no hover e o botão de compra compacto. No celular, um menu em disclosure abre abaixo do cabeçalho com links de 56 px de altura.

### Sumário (signature)
- Linha com rótulo do módulo, título, pontilhado e "p. N". O accordion anima a altura por grid, com o sinal de mais virando menos.

### Tablet (signature)
- Moldura de tablet em CSS (gradiente cinza, câmera, reflexo do vidro, luz no piso) em volta da capa real. No hero fica inclinado e reage ao ponteiro no desktop; na oferta e nas dúvidas fica de frente.

### Card de oferta
- Superfície com borda forte e 16 px de raio: nome, preço em 72 px, quatro itens com check, botão de largura total "Comprar por R$ 29,90" e, abaixo, pagamento e prazo de 7 dias.

## Do's and Don'ts

### Do:
- **Do** usar linhas de 1 px para estruturar tabelas, índices e listas.
- **Do** colocar referências de página como fólio, em algarismos tabulares.
- **Do** mostrar a capa real dentro do tablet em CSS; nunca redesenhar o texto da capa.
- **Do** reservar o fundo claro para mostrar páginas do guia.
- **Do** fazer as divisórias se desenharem da esquerda para a direita quando a seção revela, e desligar tudo com redução de movimento.

### Don't:
- **Don't** adicionar cor de destaque, gradiente colorido ou neon.
- **Don't** colocar etiquetas em caixa alta acima de títulos de seção.
- **Don't** usar fileiras de cartões iguais com ícone, título e texto.
- **Don't** apresentar o guia como livro impresso: o produto é um PDF.
- **Don't** usar selos, logotipos ou cores de Meta e Google.
