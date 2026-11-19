import type { ReactNode } from "react";
import { Disclosure } from "@/components/disclosure";
import { formattedPrice, siteConfig, supportWhatsappUrl } from "@/config/site";

function SupportContact() {
  const { email, hours } = siteConfig.support;
  const whatsapp = supportWhatsappUrl();
  if (!email && !whatsapp) {
    return <>O canal de suporte para dúvidas sobre compra e acesso será informado aqui antes da abertura das vendas.</>;
  }
  return (
    <>
      Para dúvidas sobre compra e acesso, fale com a Metodaria
      {email ? (
        <>
          {" "}
          pelo e-mail{" "}
          <a href={`mailto:${email}`} className="text-fg underline">
            {email}
          </a>
        </>
      ) : null}
      {email && whatsapp ? " ou" : null}
      {whatsapp ? (
        <>
          {" "}
          pelo{" "}
          <a href={whatsapp} className="text-fg underline" rel="noopener">
            WhatsApp
          </a>
        </>
      ) : null}
      {hours ? `, ${hours}` : null}.
    </>
  );
}

export function Faq() {
  const { product, checkout, refund } = siteConfig;

  const items: { question: string; answer: ReactNode }[] = [
    {
      question: "Como recebo o guia depois de pagar?",
      answer: (
        <>
          {checkout.delivery} O arquivo é um PDF de {product.pages} páginas: abre no celular, no tablet ou no
          computador, e você pode imprimir.
        </>
      ),
    },
    {
      question: "Preciso ter experiência com anúncios?",
      answer:
        "Não. O guia foi escrito para quem está começando e parte do básico: definir o resultado que interessa ao negócio e calcular quanto se pode pagar por uma venda. Dá para estudar sem gastar com anúncios, usando rascunhos na plataforma e os dados simulados dos exercícios.",
    },
    {
      question: "É um curso em vídeo?",
      answer:
        "Não. É um guia em PDF, sem videoaulas, atendimento individual ou certificação oficial da Meta ou do Google. As lições são curtas, com passos numerados, atividades e critérios de conclusão.",
    },
    {
      question: "O valor inclui o dinheiro para os anúncios?",
      answer: `Não. Os ${formattedPrice} pagam o guia. O investimento em anúncios é pago diretamente à Meta ou ao Google, se e quando você decidir anunciar. O Módulo 06 ensina a definir um limite de gasto e um prazo antes de publicar.`,
    },
    {
      question: "O guia serve para o meu tipo de negócio?",
      answer:
        "O foco é Meta Ads (Facebook, Instagram e WhatsApp), com uma introdução ao Google Ads de Pesquisa. Os exemplos acompanham dois casos simulados, uma loja de acessórios e uma agência de serviços, e os modelos podem ser adaptados a outros negócios. Segmentos sensíveis, formatos avançados e integrações próprias exigem estudo adicional.",
    },
    {
      question: "O guia garante resultados?",
      answer:
        "Não. O material não promete vendas nem renda. O resultado de uma campanha depende da oferta, do atendimento, do orçamento e da execução. O guia ensina a planejar, medir e decidir com base nos seus números.",
    },
    {
      question: "O conteúdo está atualizado?",
      answer:
        "Esta é a edição 1.0, de novembro de 2026. Os procedimentos foram conferidos na documentação oficial, com 34 fontes listadas no Anexo J, sem validação integral em uma conta real. Botões e opções das plataformas mudam com o tempo, e o guia indica onde confirmar cada ponto.",
    },
    {
      question: "Tem suporte?",
      answer: (
        <>
          <SupportContact /> O guia não inclui atendimento individual sobre as suas campanhas.
        </>
      ),
    },
    {
      question: "Posso cancelar e pedir reembolso?",
      answer: (
        <>
          Sim. Pelo art. 49 do Código de Defesa do Consumidor, compras feitas pela internet podem ser canceladas em
          até {refund.legalDays} dias, contados da compra ou do recebimento do produto, com devolução imediata do
          valor pago.{" "}
          {refund.channel
            ? `Para pedir, ${refund.channel}.`
            : "O canal para fazer o pedido será informado aqui antes da abertura das vendas."}
          {refund.extraConditions ? ` ${refund.extraConditions}` : null}
        </>
      ),
    },
    {
      question: "Posso compartilhar o arquivo?",
      answer:
        "O exemplar é para leitura e impressão de quem comprou. Você pode adaptar os modelos ao seu trabalho e a projetos de clientes, mas a compra não autoriza redistribuir ou revender o arquivo.",
    },
  ];

  return (
    <section id="duvidas" aria-labelledby="duvidas-title" className="border-t border-line py-20 sm:py-28 lg:py-36">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="self-start lg:sticky lg:top-24 lg:col-span-4" data-reveal>
          <h2 id="duvidas-title" className="section-title">
            Dúvidas frequentes
          </h2>
          <p className="mt-6 max-w-sm leading-relaxed text-fg-2">
            Formato, acesso, investimento em anúncios, suporte e reembolso.
          </p>
        </div>
        <div className="border-t border-line-strong lg:col-span-8">
          {items.map((item) => (
            <Disclosure
              key={item.question}
              summary={<span className="text-lg font-semibold leading-snug sm:text-xl">{item.question}</span>}
            >
              <p className="max-w-[65ch] leading-relaxed text-fg-2">{item.answer}</p>
            </Disclosure>
          ))}
        </div>
      </div>
    </section>
  );
}
