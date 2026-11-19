import type { CSSProperties } from "react";
import { CoverArcs } from "@/components/arcs";
import { ArrowIcon, CheckoutCta } from "@/components/checkout-cta";
import { CoverMockup } from "@/components/cover-mockup";
import { formattedPrice, siteConfig } from "@/config/site";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function Hero() {
  const { product, price } = siteConfig;

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden" data-tilt-zone>
      <CoverArcs className="pointer-events-none absolute bottom-[-6%] right-[-58%] w-[150%] max-w-none sm:right-[-30%] sm:w-[110%] lg:bottom-[-34%] lg:right-[-14%] lg:w-[64%]" />

      <div className="shell relative">
        <div
          className="hero-in running-head flex items-center justify-between gap-4 border-b border-line py-4 text-fg-2"
          style={delay(0)}
        >
          <p>Guia prático para pequenos negócios</p>
          <p className="tabular hidden sm:block">{product.edition}</p>
        </div>

        <div className="grid gap-14 pb-20 pt-10 sm:pt-14 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] md:items-center md:gap-10 lg:grid-cols-[minmax(0,1.34fr)_minmax(0,0.66fr)] lg:gap-12 lg:pb-28 lg:pt-16">
          <div>
            <h1 id="hero-title" className="display">
              <span className="line-mask">
                <span style={delay(60)}>Antes de impulsionar,</span>
              </span>{" "}
              <span className="line-mask">
                <span style={delay(150)}>tenha um plano.</span>
              </span>
            </h1>

            <p
              className="hero-in mt-7 max-w-[35rem] text-lg leading-relaxed text-fg-2 sm:text-xl sm:leading-relaxed"
              style={delay(260)}
            >
              Entenda como planejar anúncios, organizar seu orçamento e acompanhar resultados com um guia prático
              de tráfego pago para quem está começando.
            </p>

            <div id="hero-compra" className="hero-in mt-9" style={delay(340)}>
              <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="tabular text-[2rem] font-bold leading-none tracking-[-0.02em]">{formattedPrice}</span>
                <span className="text-fg-2">· {price.terms}</span>
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <CheckoutCta location="hero">
                  Quero acessar o guia
                  <ArrowIcon />
                </CheckoutCta>
                <a href="#previa" className="btn btn-ghost">
                  Ver uma prévia
                </a>
              </div>
              <p className="mt-6 text-[0.9375rem] text-fg-3">
                {product.format} · {product.pages} páginas · exercícios e checklists
              </p>
            </div>
          </div>

          <div
            className="cover-in relative mx-auto w-[64%] max-w-[16rem] sm:max-w-[19rem] md:mr-0 md:w-full md:max-w-[15rem] lg:max-w-[25rem]"
            style={delay(220)}
          >
            <CoverMockup
              src={product.coverImage.src}
              width={product.coverImage.width}
              height={product.coverImage.height}
              alt={`Capa do guia ${product.coverTitle}, ${product.subtitle}, da Metodaria`}
              sizes="(min-width: 64rem) 400px, (min-width: 48rem) 240px, (min-width: 40rem) 304px, 64vw"
              preload
            />
          </div>
        </div>
      </div>
    </section>
  );
}
