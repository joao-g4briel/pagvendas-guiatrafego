/**
 * Fonte única de configuração da página.
 *
 * Preço, checkout, contatos, vendedor e medição saem daqui. Valores de implantação
 * podem ser sobrescritos por variáveis de ambiente NEXT_PUBLIC_* (veja .env.example).
 * Campos `null` estão pendentes: a página esconde o que depende deles e
 * `getPendingItems()` lista o que falta antes de abrir as vendas.
 */

export type PaymentMethod = "pix" | "cartao" | "boleto";

/** Checkout da Cakto fornecido no briefing. Para trocar, edite aqui ou use NEXT_PUBLIC_CHECKOUT_URL. */
const DEFAULT_CHECKOUT_URL = "https://pay.cakto.com.br/tsduujj_1343853";

function clean(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/** Aceita apenas URLs https válidas; qualquer outra coisa conta como checkout ausente. */
function httpsUrl(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function matchOrNull(value: string | undefined, pattern: RegExp): string | null {
  return value && pattern.test(value) ? value : null;
}

const checkoutEnv = clean(process.env.NEXT_PUBLIC_CHECKOUT_URL);
const supportWhatsapp = matchOrNull(clean(process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP), /^\d{12,13}$/);

export const siteConfig = {
  brand: "Metodaria",
  siteUrl: httpsUrl(clean(process.env.NEXT_PUBLIC_SITE_URL)) ?? "http://localhost:3000",
  locale: "pt-BR",

  product: {
    name: "Guia de Tráfego Pago",
    subtitle: "Meta Ads e fundamentos de aquisição",
    coverTitle: "Guia de Tráfego Pago",
    format: "PDF",
    pages: 53,
    modules: 16,
    lessons: 48,
    edition: "Edição 1.0 · novembro de 2026",
    coverImage: { src: "/capa/guia-trafego-pago.png", width: 1024, height: 1536 },
  },

  price: {
    /**
     * Total que o comprador paga. Conferido no checkout em 21/11/2026: produto a R$ 28,01
     * + R$ 0,99 de taxa de serviço da Cakto = R$ 29,00. Se mudar o preço na Cakto, mantenha os dois iguais.
     */
    amount: 29,
    currency: "BRL",
    terms: "pagamento único",
  },

  checkout: {
    provider: "Cakto",
    /** Todos os botões de compra consomem esta URL. `null` = vendas fechadas. */
    url: checkoutEnv === undefined ? httpsUrl(DEFAULT_CHECKOUT_URL) : httpsUrl(checkoutEnv),
    /** Encaminha utm_* da página ao checkout. Ative só após confirmar o formato aceito pela Cakto. */
    forwardUtm: clean(process.env.NEXT_PUBLIC_CHECKOUT_FORWARD_UTM) === "true",
    /**
     * Meios de pagamento conferidos manualmente no checkout. Enquanto estiver vazio,
     * a página não menciona Pix, cartão ou boleto.
     * Conferido em 20/11/2026: o checkout oferece cartão de crédito, Pix e cartão + Pix.
     */
    paymentMethods: ["pix", "cartao"] as PaymentMethod[],
    /** Texto de entrega exibido na oferta e no FAQ. Revise conforme a configuração do produto na Cakto. */
    delivery:
      "O pagamento e a entrega acontecem na Cakto. Depois da confirmação do pagamento, a plataforma libera o acesso ao PDF conforme a configuração do produto, normalmente pelo e-mail informado na compra.",
  },

  /** Vídeo de entrada da página de vendas (src/components/video-gate.tsx). Os tempos ficam no componente. */
  introVideo: {
    src: "/videos/aula-primeira-campanha_COM-VOZ.mp4",
    /** Imagem mostrada até o primeiro quadro. Ainda não há capa em public/videos. */
    poster: null as string | null,
    /** Chave do localStorage de quem já liberou a página. Também lida pelo script do <head> em layout.tsx. */
    storageKey: "mtd_aula_liberada",
  },

  support: {
    email: matchOrNull(clean(process.env.NEXT_PUBLIC_SUPPORT_EMAIL), /^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    whatsapp: supportWhatsapp,
    /** Ex.: "segunda a sexta, das 9h às 18h". */
    hours: null as string | null,
  },

  /** Identificação do vendedor exigida para comércio eletrônico. Não invente: preencha com os dados reais. */
  seller: {
    legalName: null as string | null,
    /** CPF ou CNPJ formatado. */
    document: null as string | null,
    address: null as string | null,
  },

  refund: {
    /** Prazo legal de arrependimento para compras pela internet (CDC, art. 49). */
    legalDays: 7,
    /** Canal para pedir cancelamento/reembolso. Ex.: "pelo e-mail suporte@..." ou "pela própria Cakto". */
    channel: null as string | null,
    /** Condições adicionais oferecidas pelo vendedor, se houver (ex.: prazo maior). Revise com o responsável. */
    extraConditions: null as string | null,
  },

  legal: {
    /** Data da última revisão dos termos e da política, no formato "19 de novembro de 2026". */
    termsUpdatedAt: null as string | null,
    privacyUpdatedAt: null as string | null,
    /** Por quanto tempo os dados de contato e de pedidos são guardados. Defina com o responsável. */
    retention: null as string | null,
  },

  analytics: {
    ga4Id: matchOrNull(clean(process.env.NEXT_PUBLIC_GA4_ID), /^G-[A-Z0-9]{4,}$/),
    metaPixelId: matchOrNull(clean(process.env.NEXT_PUBLIC_META_PIXEL_ID), /^\d{10,20}$/),
  },
} as const;

export type SiteConfig = typeof siteConfig;

const priceFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: siteConfig.price.currency,
});

/** "R$ 29,00" (com espaço inseparável). */
export const formattedPrice = priceFormatter.format(siteConfig.price.amount);

export const hasTracking = Boolean(siteConfig.analytics.ga4Id || siteConfig.analytics.metaPixelId);

export function supportWhatsappUrl(): string | null {
  return siteConfig.support.whatsapp ? `https://wa.me/${siteConfig.support.whatsapp}` : null;
}

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  pix: "Pix",
  cartao: "cartão de crédito",
  boleto: "boleto",
};

/** Versão curta, para a linha logo abaixo do botão do hero. */
export const paymentMethodShortLabels: Record<PaymentMethod, string> = {
  pix: "Pix",
  cartao: "cartão",
  boleto: "boleto",
};

const shortMethods = new Intl.ListFormat("pt-BR", { style: "long", type: "disjunction" }).format(
  siteConfig.checkout.paymentMethods.map((method) => paymentMethodShortLabels[method]),
);

/** "Pix ou cartão" (inicial maiúscula), para as linhas curtas de garantia. Vazio se os meios não foram conferidos. */
export const paymentMethodsShort = shortMethods.charAt(0).toUpperCase() + shortMethods.slice(1);

/** O que falta para abrir as vendas com segurança. Usado no README, no aviso de desenvolvimento e nas páginas legais. */
export function getPendingItems(): string[] {
  const pending: string[] = [];
  const { checkout, support, seller, refund, legal, analytics } = siteConfig;
  if (!checkout.url) pending.push("URL do checkout (vendas fechadas)");
  if (siteConfig.siteUrl.startsWith("http://localhost"))
    pending.push("Domínio final em NEXT_PUBLIC_SITE_URL (metadados e Open Graph)");
  if (checkout.paymentMethods.length === 0)
    pending.push("Meios de pagamento conferidos no checkout (checkout.paymentMethods)");
  if (!support.email && !support.whatsapp) pending.push("Canal de suporte (e-mail ou WhatsApp)");
  if (!seller.legalName) pending.push("Nome ou razão social do vendedor");
  if (!seller.document) pending.push("CPF ou CNPJ do vendedor");
  if (!seller.address) pending.push("Endereço do vendedor");
  if (!refund.channel) pending.push("Canal para pedir cancelamento e reembolso");
  if (!legal.termsUpdatedAt || !legal.privacyUpdatedAt)
    pending.push("Revisão e data dos termos e da política de privacidade");
  if (!legal.retention) pending.push("Prazos de retenção de dados (política de privacidade)");
  if (!analytics.ga4Id && !analytics.metaPixelId) pending.push("IDs de GA4 e/ou Meta Pixel (opcional)");
  return pending;
}
