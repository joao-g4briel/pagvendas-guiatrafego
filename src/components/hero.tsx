import type { CSSProperties } from "react";
import { ArrowIcon, CheckoutCta } from "@/components/checkout-cta";
import { TabletMockup } from "@/components/tablet-mockup";
import { feeNote, formattedPrice, paymentMethodShortLabels, siteConfig } from "@/config/site";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function Hero() {
  const { product, price, checkout, refund } = siteConfig;
  const methods = new Intl.ListFormat("pt-BR", { style: "long", type: "disjunction" }).format(
    checkout.paymentMethods.map((method) => paymentMethodShortLabels[method]),
  );
  const reassurance = [
    checkout.paymentMethods.length > 0 ? methods.charAt(0).toUpperCase() + methods.slice(1) : null,
    `${refund.legalDays} dias de garantia`,
  ]
    .filter(Boolean)
    .join(" · ");
  const stats = [
    { value: product.pages, label: "páginas" },
    { value: product.modules, label: "módulos" },
    { value: product.lessons, label: "lições curtas" },
  ];

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden" data-tilt-zone>
      <div className="shell relative">
        <div className="grid items-center gap-12 pb-14 pt-10 sm:pt-14 md:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] md:gap-10 lg:grid-cols-[minmax(0,1.42fr)_minmax(0,0.58fr)] lg:gap-14 lg:pb-20 lg:pt-16">
          <div>
            <p className="hero-in label text-fg-2" style={delay(0)}>
              Guia prático para pequenos negócios
            </p>
            <h1 id="hero-title" className="display mt-5">
              <span className="line-mask">
                <span style={delay(60)}>Antes de impulsionar,</span>
              </span>{" "}
              <span className="line-mask">
                <span style={delay(150)}>tenha um plano.</span>
              </span>
            </h1>

            <p
              className="hero-in mt-6 max-w-[34rem] text-lg leading-relaxed text-fg-2 sm:text-xl sm:leading-relaxed"
              style={delay(260)}
            >
              Aprenda a planejar anúncios, organizar seu orçamento e acompanhar os resultados do seu negócio.
            </p>

            <div id="hero-compra" className="hero-in mt-8" style={delay(340)}>
              <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 text-xl sm:text-2xl">
                <span className="tabular font-extrabold">{formattedPrice}</span>
                <span className="text-fg-2">· {price.terms}</span>
              </p>
              {feeNote ? <p className="mt-1 text-sm text-fg-2">{feeNote}</p> : null}
              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-7">
                <CheckoutCta location="hero" className="sm:min-w-[17rem]">
                  Quero acessar o guia
                  <ArrowIcon />
                </CheckoutCta>
                <a href="#previa" className="text-link self-center text-fg sm:self-auto">
                  Ver uma prévia
                </a>
              </div>
              <p className="mt-3 text-center text-sm text-fg-2 sm:text-left">{reassurance}</p>
            </div>
          </div>

          {/* tablet sobre o círculo cinza, como na capa */}
          <div className="device-in relative mx-auto w-[66%] max-w-[17rem] sm:max-w-[20rem] md:mr-0 md:w-full md:max-w-[22rem] lg:max-w-[26rem]" style={delay(200)}>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-[18%] top-[6%] aspect-square w-[150%] rounded-full bg-[radial-gradient(circle_at_32%_28%,#2c2c2f_0%,#171718_46%,#0b0b0b_72%)]"
            />
            <div className="relative">
              <TabletMockup
                src={product.coverImage.src}
                width={product.coverImage.width}
                height={product.coverImage.height}
                alt={`Guia ${product.coverTitle} da Metodaria aberto em um tablet`}
                sizes="(min-width: 64rem) 380px, (min-width: 48rem) 300px, 66vw"
                preload
                interactive
              />
            </div>
          </div>
        </div>

        <ul className="hero-in relative grid grid-cols-3 border-y border-line-strong py-5 sm:py-7" style={delay(420)}>
          {stats.map((stat, index) => (
            <li
              key={stat.label}
              className={`flex flex-col items-center gap-1 text-center sm:flex-row sm:justify-center sm:gap-4 ${
                index > 0 ? "border-l border-line-strong" : ""
              }`}
            >
              <span className="tabular text-[2rem] font-extrabold leading-none tracking-[-0.03em] sm:text-5xl lg:text-6xl">
                {stat.value}
              </span>
              <span className="text-sm text-fg-2 sm:text-lg">{stat.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
