# Guia de Tráfego Pago — página de vendas

Página de vendas do guia em PDF da Metodaria. Next.js 16 (App Router), TypeScript, Tailwind CSS 4 e Motion for React. Todas as rotas são estáticas; pagamento e entrega ficam na Cakto.

## Rodar

```bash
npm install
npm run dev          # http://localhost:3000 (mostra no topo as pendências de configuração)
npm run build        # build de produção
npm start            # serve o build
npm run lint && npm run typecheck
```

Requer Node 20.9 ou mais recente.

## Publicar na Vercel

1. Envie o projeto para um repositório Git e importe-o na Vercel (framework detectado: Next.js).
2. Em *Settings → Environment Variables*, cadastre as variáveis de `.env.example` que for usar. Comece por `NEXT_PUBLIC_SITE_URL`.
3. Faça o deploy. Depois de alterar uma variável `NEXT_PUBLIC_*`, faça um novo deploy: elas entram no código no momento do build.

## Onde editar

| O quê | Onde |
|---|---|
| Preço, nome do produto, checkout, meios de pagamento, texto de entrega | `src/config/site.ts` |
| Vídeo de entrada: arquivo, capa e chave do localStorage | `siteConfig.introVideo` em `src/config/site.ts` |
| Vídeo de entrada: título, botões e comportamento | `src/components/video-gate.tsx` |
| Suporte, vendedor (nome, CPF/CNPJ, endereço), reembolso, datas e retenção das páginas legais | `src/config/site.ts` |
| Valores por ambiente (URL do site, checkout, IDs de medição, contato) | variáveis em `.env.example` |
| Textos da página (situações, módulos, sumário, amostra, públicos, oferta) | `src/content/guia.ts` |
| Dúvidas frequentes | `src/components/faq.tsx` |
| Termos e privacidade | `src/app/termos/page.tsx`, `src/app/privacidade/page.tsx` |

O preço aparece em todos os lugares a partir de `siteConfig.price.amount`. Ele é o total que o comprador paga: na Cakto, o produto custa R$ 28,01 e a taxa de serviço de R$ 0,99 completa os R$ 29,00. Ao mudar o preço na Cakto, mantenha os dois iguais.

### Vídeo de entrada

Só na página de vendas (não em termos e privacidade). Na primeira visita, a aula abre por cima da página e começa muda ("Toque para ativar o som" liga o som e recomeça). O botão de compra, "Ver a página completa", o X e o Esc funcionam desde o início, sem temporizador. Ao fechar, a visita fica salva no localStorage (`mtd_aula_liberada`) e quem volta vê só o botão "Ver a aula grátis". Para ver o vídeo abrir sozinho de novo, apague essa chave no navegador. O vídeo fica em `public/videos/`; para usar uma capa, coloque a imagem lá e preencha `introVideo.poster`.

### Trocar o checkout

Todos os botões de compra (cabeçalho, menu, hero, prévia, oferta, CTA final e barra do celular) usam `siteConfig.checkout.url`. Para trocar o link, mude **uma** destas opções:

- `DEFAULT_CHECKOUT_URL` em `src/config/site.ts` (hoje `https://pay.cakto.com.br/tsduujj_1343853`); ou
- a variável `NEXT_PUBLIC_CHECKOUT_URL` na Vercel.

Se a URL ficar inválida (precisa ser `https://`), a página continua no ar e os botões avisam que as vendas ainda não estão abertas. `NEXT_PUBLIC_CHECKOUT_FORWARD_UTM=true` repassa os `utm_*` da página ao checkout; ative só depois de confirmar que a Cakto aceita esses parâmetros.

### Amostra e imagens

O PDF completo **não** fica no projeto (`*.pdf` está no `.gitignore`). As páginas da amostra, a capa, os ícones e a imagem de compartilhamento saem de:

```bash
pip install pymupdf pillow
python scripts/preparar-ativos.py --pdf "<guia.pdf>" --capa "<capa.png>" --icone "<favicon_512.png>" --fonte "<Montserrat[wght].ttf>"
```

Para mudar as páginas da amostra, edite `PAGINAS_AMOSTRA` no script e `previewPages` em `src/content/guia.ts`.

## Medição (opcional)

**Cliques em comprar, sem configurar nada:** cada clique num botão de compra aparece no Vercel Web Analytics como uma visualização de `/clique-comprar/<botão>` (`topo`, `menu`, `hero`, `previa`, `oferta`, `final`, `barra-celular`, `aula`, este último no vídeo de entrada). Veja em *Analytics → Pages*. O plano gratuito não tem eventos personalizados, por isso a visualização virtual. Efeito no painel: cada clique soma uma visualização e tira o visitante da taxa de rejeição. O Web Analytics não usa cookies, então essa contagem não depende do aviso de consentimento.

Sem IDs, nenhum rastreador é carregado e não aparece aviso de cookies. Com `NEXT_PUBLIC_GA4_ID` e/ou `NEXT_PUBLIC_META_PIXEL_ID`:

- um aviso pede consentimento; GA4 e Meta Pixel só carregam depois de "Aceitar medição". A escolha pode ser revista no rodapé;
- eventos desta página, sem dados pessoais:
  - GA4: `page_view`, `view_item` e `checkout_click` (parâmetro `cta_location`);
  - Meta: `PageView`, `ViewContent` e o personalizado `CheckoutClick`;
  - Meta, no vídeo de entrada: `AulaSomAtivado` e `AulaCliqueCompra` (personalizados).

`checkout_click` e `CheckoutClick` medem **intenção**. Não marque esses eventos como conversão principal para lances.

**Compra (Purchase) não é disparada por esta página.** Ela acontece no domínio da Cakto e precisa ser registrada após o pagamento confirmado, pela integração da própria Cakto (pixel no checkout ou webhook para a API de Conversões). Não verifiquei quais integrações sua conta Cakto oferece; confira nas configurações do produto. Duas regras:

- Se a Cakto já envia `InitiateCheckout`/`Purchase` ao Meta, não crie um segundo emissor desses eventos.
- Se Purchase sair do navegador e do servidor, os dois precisam do mesmo nome de evento e do mesmo `event_id` (por exemplo, o ID do pedido), para deduplicação.

Limite estrutural: o identificador de clique do anúncio (cookie deste domínio) não atravessa para o checkout da Cakto, então parte das vendas pode chegar sem atribuição. Medição só no navegador costuma perder uma parcela das conversões (bloqueadores, cookies do Safari), tipicamente entre 10% e 30%.

Para conferir em 5 minutos depois de cadastrar os IDs:

1. Abra a página, aceite a medição e clique em um botão de compra.
2. GA4 → *Admin → DebugView*: devem aparecer `view_item` e `checkout_click`.
3. Meta → *Events Manager → Test Events*: devem aparecer `PageView`, `ViewContent` e `CheckoutClick`.

## Testes

Com o build rodando em `npx next start -p 3100`:

```bash
pip install playwright
python tests/interacoes.py --url http://localhost:3100   # CTAs, dúvidas, sumário, lightbox, menu, barra móvel, vídeo de entrada, reduced motion
python tests/capturas.py --url http://localhost:3100     # capturas em 360, 390, 768 e 1440 px (tests/artifacts/)
```

Os scripts usam o Edge instalado (`channel="msedge"`); troque para `chrome` se preferir. A navegação ao checkout é interceptada: nenhuma compra é feita. Para o cenário sem checkout, gere um build com `NEXT_PUBLIC_CHECKOUT_URL=desativado` e rode `tests/interacoes.py --closed`.

## Pendências antes de abrir as vendas

- [x] Meios de pagamento conferidos no checkout em 20/11/2026 (cartão, Pix e cartão + Pix) e preenchidos em `checkout.paymentMethods`.
- [x] Checkout da Cakto alinhado em 20/11/2026: produto e oferta renomeados para "Guia de Tráfego Pago — Metodaria" e cronômetro de "oferta por tempo limitado" removido (desktop e celular).
- [x] Taxa de serviço da Cakto embutida no preço desde 21/11/2026: produto a R$ 28,01 + R$ 0,99 = R$ 29,00 no checkout, o mesmo valor da página.
- [ ] Revisar o texto de entrega (`checkout.delivery`) conforme a configuração do produto na Cakto.
- [ ] Preencher a identificação do vendedor: nome ou razão social, CPF/CNPJ e endereço (exigidos pelo Decreto 7.962/2013).
- [ ] Definir o canal de suporte (e-mail e/ou WhatsApp).
- [ ] Definir o canal de cancelamento e reembolso e eventuais condições além do prazo legal de 7 dias.
- [ ] Revisar termos e política de privacidade com o responsável e preencher as datas e os prazos de retenção. Enquanto houver campos pendentes, essas páginas mostram um aviso de rascunho.
- [ ] Definir `NEXT_PUBLIC_SITE_URL` com o domínio final.
- [ ] Opcional: IDs de GA4 e Meta Pixel e a integração de compra da Cakto, conferidos com os passos acima.

Fornecer a URL do checkout não comprova que pagamento, entrega ou medição foram testados. Faça uma compra de teste pela própria Cakto antes de anunciar.

## Estrutura

```
src/
  app/            layout, página, termos, privacidade, ícones e imagem de compartilhamento
  components/     seções (Server Components) e ilhas cliente: menu, accordion,
                  lightbox, tablet com inclinação, barra móvel, consentimento
  config/site.ts  configuração central
  content/guia.ts textos extraídos do PDF
  lib/analytics.ts consentimento e eventos
scripts/          preparação dos ativos a partir dos arquivos originais
tests/            Playwright (Python)
```

`PRODUCT.md` e `DESIGN.md` registram o contexto do produto e o sistema visual para futuras alterações.
