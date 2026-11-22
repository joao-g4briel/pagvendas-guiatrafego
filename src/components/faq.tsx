import type { ReactNode } from "react";
import { Disclosure } from "@/components/disclosure";
import { TabletMockup } from "@/components/tablet-mockup";
import { formattedPrice, siteConfig, supportWhatsappUrl } from "@/config/site";

function SupportContact() {
  const { email, hours } = siteConfig.support;
  const whatsapp = supportWhatsappUrl();
  if (!email && !whatsapp) {
    return <>O canal de suporte para dúvidas sobre compra e acesso será informado aqui em breve.</>;
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
      question: "Tem videoaulas?",
      answer: `Sim. Além do guia introdutório em ${product.format}, a compra inclui ${product.videoLessons} videoaulas, para estudar no seu ritmo. Não há certificado oficial.`,
    },
    {
      question: "Preciso ter experiência?",
      answer:
        "Não. O guia começa do básico, e dá para estudar sem gastar com anúncios, usando rascunhos e os dados simulados dos exercícios.",
    },
    {
      question: "Como recebo o material?",
      answer: (
        <>
          {checkout.delivery} São o PDF de {product.pages} páginas e as {product.videoLessons} videoaulas, para ver no
          celular ou no computador.
        </>
      ),
    },
    {
      question: "A compra inclui verba para anúncios?",
      answer: `Não. Os ${formattedPrice} pagam o guia. O investimento em anúncios é pago direto à Meta ou ao Google, se e quando você decidir anunciar.`,
    },
    {
      question: "Como funciona o reembolso?",
      answer: (
        <>
          São {refund.legalDays} dias de garantia: se não gostar, você pode desistir da compra e receber de volta 100%
          do valor pago, como prevê o art. 49 do Código de Defesa do Consumidor.{" "}
          {refund.channel ? `Para pedir, ${refund.channel}.` : "O canal para o pedido será informado aqui em breve."}
          {refund.extraConditions ? ` ${refund.extraConditions}` : null}
        </>
      ),
    },
    {
      question: "O guia garante resultados?",
      answer:
        "Não. O guia não promete vendas nem renda: o resultado depende da oferta, do atendimento e da execução. Ele ensina a planejar, medir e decidir com base nos seus números.",
    },
    {
      question: "Tem suporte?",
      answer: (
        <>
          <SupportContact /> O guia não inclui atendimento individual sobre campanhas.
        </>
      ),
    },
  ];

  return (
    <section id="duvidas" aria-labelledby="duvidas-title" className="border-t border-line py-20 sm:py-24 lg:py-28">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="self-start lg:sticky lg:top-24 lg:col-span-5" data-reveal>
          <h2 id="duvidas-title" className="section-title">
            Dúvidas antes de começar?
          </h2>
          <p className="mt-5 max-w-sm text-lg leading-relaxed text-fg-2">
            Entenda o formato e como funciona a compra.
          </p>
          <div className="mt-10 hidden w-[58%] max-w-[15rem] lg:block">
            <TabletMockup
              src={product.coverImage.src}
              width={product.coverImage.width}
              height={product.coverImage.height}
              alt=""
              sizes="240px"
              restTilt={0}
            />
          </div>
        </div>
        <div className="border-t border-line-strong lg:col-span-7">
          {items.map((item, index) => (
            <Disclosure
              key={item.question}
              defaultOpen={index === 0}
              summary={<span className="text-lg font-bold leading-snug sm:text-[1.375rem]">{item.question}</span>}
            >
              <p className="max-w-[60ch] text-[1.0625rem] leading-relaxed text-fg-2">{item.answer}</p>
            </Disclosure>
          ))}
        </div>
      </div>
    </section>
  );
}
