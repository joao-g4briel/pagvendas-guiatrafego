/**
 * Conteúdo da página, extraído do PDF "Guia de Gestão de Tráfego — Edição 1.0".
 * O PDF é a fonte de verdade: ao revisar o guia, revise também este arquivo.
 */

export type Problem = {
  situation: string;
  answer: string;
  where: string;
};

/** Situações comuns de quem começa, cada uma ligada à lição que trata dela. */
export const problems: Problem[] = [
  {
    situation: "Você impulsionou uma publicação e não sabe dizer se valeu a pena.",
    answer:
      "Antes de abrir o Gerenciador, o guia pede uma frase com o objetivo comercial e um resultado principal, como pedidos pagos ou reuniões qualificadas. Depois mostra como escolher objetivo, destino e meta de desempenho de acordo com esse resultado.",
    where: "Módulos 01 e 04 · p. 5 e 11",
  },
  {
    situation: "O painel mostra CPM, CTR e CPC, e nenhum desses números diz se você vendeu.",
    answer:
      "Uma tabela explica o cálculo e o denominador de cada métrica, e o módulo ensina a cruzar o painel com as vendas que você registra.",
    where: "Módulo 12 · p. 27",
  },
  {
    situation: "O orçamento acaba antes de você entender o que funcionou.",
    answer:
      "Você define a perda máxima aceitável, o prazo e a pergunta que o teste precisa responder. O exemplo do guia parte de um teto de R$ 420 para 14 dias, com uma estrutura pequena e um cenário sem vendas.",
    where: "Módulo 06 · p. 16",
  },
  {
    situation: "Chegam muitas mensagens no WhatsApp e poucas viram venda.",
    answer:
      "Na simulação do guia, R$ 300 geram 50 conversas e cinco vendas: cada conversa custa R$ 6 e o resultado após os anúncios fica R$ 90 negativo. O módulo mostra como registrar contato qualificado, venda e motivo de perda.",
    where: "Módulo 08 · p. 20",
  },
];

export type ContentBlock = {
  modules: string;
  title: string;
  topics: string[];
};

/** Os 16 módulos agrupados em seis blocos. */
export const contentBlocks: ContentBlock[] = [
  {
    modules: "Módulos 01 a 03",
    title: "Planejamento e oferta",
    topics: [
      "Margem de contribuição, CPA desejado e ROAS de equilíbrio",
      "Portfólio empresarial, conta de anúncios e acessos sem compartilhar senha",
      "Briefing, pesquisa na Biblioteca de Anúncios e oferta clara",
    ],
  },
  {
    modules: "Módulos 04 e 05",
    title: "Campanhas e públicos",
    topics: [
      "Objetivo, local de conversão e meta de desempenho",
      "Estrutura de campanha, conjunto e anúncio, com nomes que descrevem a hipótese",
      "Região, públicos personalizados e semelhantes, remarketing para negócio local",
    ],
  },
  {
    modules: "Módulos 06 e 07",
    title: "Orçamento e criativos",
    topics: [
      "Como o leilão influencia a entrega",
      "Orçamento definido pelo que o teste precisa responder",
      "Textos, roteiro de vídeo de 20 segundos e matriz de testes criativos",
    ],
  },
  {
    modules: "Módulos 08 e 09",
    title: "WhatsApp, leads e vendas no site",
    topics: [
      "Primeira campanha de WhatsApp em rascunho, passo a passo",
      "Formulário de qualificação e campanha de vendas para e-commerce",
      "Catálogo e retorno de interessados",
    ],
  },
  {
    modules: "Módulos 10 a 13",
    title: "Mensuração e análise",
    topics: [
      "Pixel, API de Conversões, deduplicação e privacidade",
      "GA4, Google Tag Manager e UTMs",
      "Métricas, atribuição, testes e diagnóstico do gargalo",
    ],
  },
  {
    modules: "Módulos 14 a 16",
    title: "Escala, Google Ads e operação",
    topics: [
      "Quando aumentar a verba e quando não escalar",
      "Introdução à campanha de Pesquisa no Google Ads",
      "Projeto com cliente, cálculo do seu preço e projeto final",
    ],
  },
];

export type TocModule = {
  number: string;
  title: string;
  page: number;
  lessons: string[];
};

/** Sumário completo, conforme a página 2 do PDF. */
export const tocModules: TocModule[] = [
  {
    number: "01",
    title: "Fundamentos e economia do anúncio",
    page: 5,
    lessons: [
      "1.1 O trabalho de um gestor de tráfego",
      "1.2 O caminho entre anúncio e receita",
      "1.3 Quanto você pode pagar por uma venda",
    ],
  },
  {
    number: "02",
    title: "Contas, ativos e acesso profissional",
    page: 7,
    lessons: [
      "2.1 Entender as ferramentas da Meta",
      "2.2 Preparar sua própria estrutura",
      "2.3 Trabalhar com clientes sem compartilhar senha",
    ],
  },
  {
    number: "03",
    title: "Pesquisa, briefing e oferta",
    page: 9,
    lessons: [
      "3.1 Fazer as perguntas que mudam a campanha",
      "3.2 Pesquisar concorrentes e demanda",
      "3.3 Transformar produto em proposta clara",
    ],
  },
  {
    number: "04",
    title: "Objetivos e estrutura de campanha",
    page: 11,
    lessons: [
      "4.1 Escolher o objetivo pelo resultado",
      "4.2 Separar objetivo, destino e meta de desempenho",
      "4.3 Organizar campanha, conjunto e anúncio",
    ],
  },
  {
    number: "05",
    title: "Públicos e segmentação",
    page: 13,
    lessons: [
      "5.1 Começar pela região e pela necessidade",
      "5.2 Públicos personalizados, semelhantes e dados próprios",
      "5.3 Tratar negócios locais e remarketing",
    ],
  },
  {
    number: "06",
    title: "Leilão, orçamento e posicionamentos",
    page: 15,
    lessons: [
      "6.1 Como o leilão influencia a entrega",
      "6.2 Posicionamentos e estratégia de lance",
      "6.3 Definir orçamento pelo que é possível aprender",
    ],
  },
  {
    number: "07",
    title: "Criativos, texto e vídeo",
    page: 17,
    lessons: [
      "7.1 Escrever para uma decisão específica",
      "7.2 Produzir um vídeo com recursos simples",
      "7.3 Montar uma matriz de testes criativos",
    ],
  },
  {
    number: "08",
    title: "Primeira campanha de WhatsApp",
    page: 19,
    lessons: [
      "8.1 Preparar o atendimento antes do anúncio",
      "8.2 Configurar em rascunho passo a passo",
      "8.3 Medir qualidade além das conversas",
    ],
  },
  {
    number: "09",
    title: "Leads, formulários e vendas no site",
    page: 21,
    lessons: [
      "9.1 Construir um formulário de qualificação",
      "9.2 Preparar campanhas de vendas para e-commerce",
      "9.3 Catálogo e retorno de interessados",
    ],
  },
  {
    number: "10",
    title: "Pixel, API de Conversões e privacidade",
    page: 23,
    lessons: [
      "10.1 Definir o que cada evento significa",
      "10.2 Instalar, testar e impedir duplicações",
      "10.3 Integrar mensuração com proteção de dados",
    ],
  },
  {
    number: "11",
    title: "GA4, Google Tag Manager e UTMs",
    page: 25,
    lessons: [
      "11.1 Configurar a base do Google Analytics",
      "11.2 Criar eventos no Tag Manager e verificá-los",
      "11.3 Identificar campanhas com UTMs",
    ],
  },
  {
    number: "12",
    title: "Métricas, análise e atribuição",
    page: 27,
    lessons: [
      "12.1 Montar um relatório que ajude a decidir",
      "12.2 Avaliar leads pelo custo até o cliente",
      "12.3 Entender atribuição e diferença entre plataformas",
    ],
  },
  {
    number: "13",
    title: "Testes, diagnóstico e otimização",
    page: 29,
    lessons: [
      "13.1 Desenhar um teste que possa responder algo",
      "13.2 Localizar o gargalo antes de alterar",
      "13.3 Manter, corrigir, pausar ou encerrar",
    ],
  },
  {
    number: "14",
    title: "Escala, rotina e automação",
    page: 31,
    lessons: [
      "14.1 Aumentar investimento com critério",
      "14.2 Organizar a rotina e renovar anúncios",
      "14.3 Usar n8n sem automatizar decisões às cegas",
    ],
  },
  {
    number: "15",
    title: "Introdução prática ao Google Ads",
    page: 33,
    lessons: [
      "15.1 Entender intenção e palavras-chave",
      "15.2 Montar uma campanha de Pesquisa em rascunho",
      "15.3 Aprender com termos de pesquisa e qualidade",
    ],
  },
  {
    number: "16",
    title: "Operação profissional e projeto final",
    page: 35,
    lessons: [
      "16.1 Iniciar um projeto com um cliente",
      "16.2 Calcular seu preço e apresentar resultados",
      "16.3 Apresentar o projeto final e continuar estudando",
    ],
  },
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

export const tocIntro = [
  { title: "Como usar este guia", page: 3 },
  { title: "Roteiro de oito semanas", page: 4 },
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
    page: 5,
    src: "/amostra/pagina-05.png",
    title: "Abertura do Módulo 01",
    caption: "Lições 1.1 a 1.3: o papel do gestor, o funil real e quanto pagar por uma venda.",
    alt: "Página 5 do guia: início do Módulo 01, Fundamentos e economia do anúncio.",
  },
  {
    page: 20,
    src: "/amostra/pagina-20.png",
    title: "Lição 8.3 e mapa da campanha",
    caption: "Como medir qualidade além das conversas, com simulação e mapa de configuração.",
    alt: "Página 20 do guia: Lição 8.3, Medir qualidade além das conversas, e mapa de configuração da campanha.",
  },
  {
    page: 43,
    src: "/amostra/pagina-43.png",
    title: "Checklist antes de publicar",
    caption: "Anexo D: revisão de negócio, de conta e campanha, de medição e operação.",
    alt: "Página 43 do guia: Anexo D, Checklist antes de publicar.",
  },
];

/** Trechos reais do Anexo D, exibidos na seção "O que acompanha". */
export const checklistExcerpt = [
  "Página, formulário ou WhatsApp testados no celular.",
  "Objetivo, local de conversão e meta de desempenho documentados.",
  "Datas, orçamento e limite financeiro conferidos no resumo.",
  "Não há compra registrada apenas por clique ou pedido não confirmado.",
  "UTMs funcionam e não contêm dados pessoais.",
  "Você sabe como pausar a campanha e resolver incidentes.",
];

export type IncludedGroup = {
  title: string;
  items: { label: string; detail: string }[];
};

export const includedGroups: IncludedGroup[] = [
  {
    title: "Exercícios resolvidos",
    items: [
      {
        label: "Anexo B",
        detail:
          "Fórmulas de contribuição, CPA desejado, ROAS e CPL, com um exercício resolvido e outro para você resolver, com gabarito.",
      },
      {
        label: "Anexo C",
        detail:
          "Quatro casos com dados simulados: e-commerce, leads de serviços, termos de pesquisa e divergência entre painel e pedidos.",
      },
      {
        label: "Anexo H",
        detail: "Vinte perguntas de revisão com gabarito comentado e rubrica de 100 pontos para o projeto final.",
      },
    ],
  },
  {
    title: "Modelos de trabalho",
    items: [
      {
        label: "Anexo A",
        detail: "Briefing com 15 campos, plano de campanha em uma página, diário de decisões e plano de eventos.",
      },
      { label: "Anexo E", detail: "Roteiros de anúncios e uma sequência de atendimento em sete passos." },
      { label: "Anexo F", detail: "Relatório semanal e proposta de piloto para apresentar a um cliente." },
      { label: "Anexo G", detail: "Decisões para dez cenários, do link quebrado ao painel que não bate com o CRM." },
    ],
  },
];

export const audienceFit = [
  "Tem um pequeno negócio ou atende como autônomo e quer anunciar com um limite de gasto definido antes de começar.",
  "Vende pelo WhatsApp, por formulário ou pelo site e quer saber quanto custa cada venda, além de cada conversa.",
  "Estuda marketing e quer montar um portfólio com estudos identificados como simulação.",
];

export const audienceNotFit = [
  "Procura videoaulas, acompanhamento individual ou certificado oficial da Meta ou do Google.",
  "Já gerencia Shopping, Performance Max ou integrações próprias. O guia trata esses formatos apenas como próximos estudos.",
  "Espera uma fórmula com resultado garantido. O guia não promete vendas nem renda.",
];

/** Itens da oferta. Todos fazem parte do mesmo PDF. */
export const offerItems = [
  "PDF com 53 páginas, para ler no celular, no computador ou imprimir",
  "16 módulos e 48 lições curtas, com passos numerados, atividades e critérios de conclusão",
  "Exercícios resolvidos e laboratório com dados simulados",
  "Checklist antes de publicar e perguntas para aplicar no seu projeto",
  "Modelos de briefing, plano de campanha, relatório e proposta",
  "Roteiro sugerido de oito semanas e glossário com 25 termos",
];
