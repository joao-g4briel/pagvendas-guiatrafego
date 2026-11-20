/**
 * Conteúdo da página, extraído do PDF "Guia de Gestão de Tráfego — Edição 1.0".
 * O PDF é a fonte de verdade: ao revisar o guia, revise também este arquivo.
 */

export type Situation = {
  question: string;
  answer: string;
  where: string;
};

/** Situações comuns de quem começa, cada uma ligada à parte do guia que trata dela. */
export const situations: Situation[] = [
  {
    question: "Impulsionou e não sabe se valeu a pena?",
    answer: "O guia começa definindo o resultado que importa para o negócio, como pedidos pagos ou reuniões.",
    where: "Módulos 01 e 04",
  },
  {
    question: "As métricas não dizem se você vendeu?",
    answer: "Você aprende o que CPM, CTR e CPC calculam e como cruzar o painel com as vendas registradas.",
    where: "Módulo 12",
  },
  {
    question: "O orçamento acaba antes de você aprender?",
    answer: "Você define limite de gasto, prazo e a pergunta que o teste precisa responder antes de publicar.",
    where: "Módulo 06",
  },
  {
    question: "Muitas conversas no WhatsApp e poucas vendas?",
    answer: "O guia mostra como medir o custo por venda, além do custo por conversa.",
    where: "Módulo 08",
  },
];

export type LearnIcon = "target" | "chat" | "users" | "chart" | "image" | "search";

export type LearnItem = {
  icon: LearnIcon;
  title: string;
  description: string;
  modules: string;
};

/** Os 16 módulos resumidos em seis temas. */
export const learnItems: LearnItem[] = [
  {
    icon: "target",
    title: "Planejamento e oferta",
    description: "Organize objetivos, margem e o que você vai anunciar.",
    modules: "Módulos 01 a 04",
  },
  {
    icon: "chat",
    title: "Campanhas para WhatsApp",
    description: "Entenda o caminho do anúncio até a conversa e a venda.",
    modules: "Módulos 08 e 09",
  },
  {
    icon: "users",
    title: "Públicos e orçamento",
    description: "Defina quem alcançar e quanto investir em cada teste.",
    modules: "Módulos 05 e 06",
  },
  {
    icon: "chart",
    title: "Métricas e análise",
    description: "Acompanhe os dados para decidir com base nas suas vendas.",
    modules: "Módulos 10 a 14",
  },
  {
    icon: "image",
    title: "Criativos e mensagem",
    description: "Prepare imagens, vídeos e textos para seus anúncios.",
    modules: "Módulo 07",
  },
  {
    icon: "search",
    title: "Fundamentos de Google Ads",
    description: "Conheça os primeiros conceitos de anúncios na busca.",
    modules: "Módulo 15",
  },
];

export type TocModule = {
  number: string;
  title: string;
  page: number;
};

/** Sumário completo, conforme a página 2 do PDF. */
export const tocModules: TocModule[] = [
  { number: "01", title: "Fundamentos e economia do anúncio", page: 5 },
  { number: "02", title: "Contas, ativos e acesso profissional", page: 7 },
  { number: "03", title: "Pesquisa, briefing e oferta", page: 9 },
  { number: "04", title: "Objetivos e estrutura de campanha", page: 11 },
  { number: "05", title: "Públicos e segmentação", page: 13 },
  { number: "06", title: "Leilão, orçamento e posicionamentos", page: 15 },
  { number: "07", title: "Criativos, texto e vídeo", page: 17 },
  { number: "08", title: "Primeira campanha de WhatsApp", page: 19 },
  { number: "09", title: "Leads, formulários e vendas no site", page: 21 },
  { number: "10", title: "Pixel, API de Conversões e privacidade", page: 23 },
  { number: "11", title: "GA4, Google Tag Manager e UTMs", page: 25 },
  { number: "12", title: "Métricas, análise e atribuição", page: 27 },
  { number: "13", title: "Testes, diagnóstico e otimização", page: 29 },
  { number: "14", title: "Escala, rotina e automação", page: 31 },
  { number: "15", title: "Introdução prática ao Google Ads", page: 33 },
  { number: "16", title: "Operação profissional e projeto final", page: 35 },
];

export type TocAnnex = { letter: string; title: string; page: number };

export const tocAnnexes: TocAnnex[] = [
  { letter: "A", title: "Modelos para planejar e registrar", page: 37 },
  { letter: "B", title: "Fórmulas e exercícios financeiros", page: 39 },
  { letter: "C", title: "Laboratório com dados simulados", page: 41 },
  { letter: "D", title: "Checklist antes de publicar", page: 43 },
  { letter: "E", title: "Roteiros de anúncios e atendimento", page: 44 },
  { letter: "F", title: "Relatório e proposta de serviço", page: 46 },
  { letter: "G", title: "Guia de decisões por cenário", page: 47 },
  { letter: "H", title: "Avaliação e gabarito", page: 48 },
  { letter: "I", title: "Glossário de consulta rápida", page: 50 },
  { letter: "J", title: "Fontes oficiais e pesquisa complementar", page: 51 },
];

export type PreviewPage = {
  page: number;
  src: string;
  title: string;
  caption: string;
  alt: string;
};

/**
 * Páginas liberadas como amostra. As imagens são geradas por scripts/preparar-ativos.py;
 * o PDF completo não fica no projeto.
 */
export const previewPages: PreviewPage[] = [
  {
    page: 2,
    src: "/amostra/pagina-02.png",
    title: "Sumário",
    caption: "Os 16 módulos e os anexos A a J, com o número de cada página.",
    alt: "Página 2 do guia: sumário com módulos 01 a 16 e anexos A a J.",
  },
  {
    page: 37,
    src: "/amostra/pagina-37.png",
    title: "Modelo de planejamento",
    caption: "Anexo A: briefing com 15 campos e plano de campanha em uma página.",
    alt: "Página 37 do guia: Anexo A, modelos para planejar e registrar, com briefing preenchível.",
  },
];

/** O que acompanha o guia. Tudo faz parte do mesmo PDF. */
export const includedHighlights = [
  { title: "Exercícios resolvidos", description: "Aprenda com exemplos e gabaritos.", where: "Anexos B, C e H" },
  { title: "Checklists", description: "Confira o que preparar antes de publicar.", where: "Anexo D" },
  { title: "Modelos de trabalho", description: "Organize suas próximas ações.", where: "Anexos A, E e F" },
];

/** Itens do card de oferta. */
export const offerItems = [
  "Guia completo em PDF",
  "53 páginas e 16 módulos",
  "48 lições curtas",
  "Exercícios, checklists e modelos",
];
