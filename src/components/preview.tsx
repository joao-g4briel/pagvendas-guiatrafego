import { ArrowIcon, CheckoutCta } from "@/components/checkout-cta";
import { PreviewGallery } from "@/components/preview-gallery";
import { includedHighlights, previewPages } from "@/content/guia";

export function Preview() {
  return (
    <section id="previa" aria-labelledby="previa-title" className="paper bg-paper py-20 text-paper-ink sm:py-24 lg:py-28">
      <div className="shell">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5" data-reveal>
            <h2 id="previa-title" className="display text-[clamp(2.5rem,1.3rem+3.6vw,4.5rem)]!">
              Veja o guia por dentro.
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-paper-fg-2 sm:text-xl">
              Conheça uma amostra do conteúdo antes de comprar.
            </p>
            <p className="mt-5 text-lg font-bold">Guia introdutório em PDF.</p>
            <CheckoutCta location="preview" variant="dark" className="mt-8 w-full sm:w-auto">
              Quero acessar o guia
              <ArrowIcon />
            </CheckoutCta>
          </div>

          <div className="lg:col-span-7">
            <PreviewGallery pages={previewPages} />
          </div>
        </div>

        <ul className="mt-16 grid border-t border-paper-line pt-10 sm:grid-cols-3 lg:mt-20">
          {includedHighlights.map((item, index) => (
            <li
              key={item.title}
              className={`py-4 sm:py-0 ${index > 0 ? "border-paper-line max-sm:border-t sm:border-l sm:pl-8" : "sm:pr-8"} ${
                index === 1 ? "sm:pr-8" : ""
              }`}
              data-reveal
              style={{ ["--rv-d" as string]: `${index * 70}ms` }}
            >
              <h3 className="text-2xl font-extrabold tracking-[-0.02em] sm:text-[1.75rem]">{item.title}</h3>
              <p className="mt-1.5 text-lg text-paper-fg-2">{item.description}</p>
              <p className="tabular mt-2 text-sm font-medium text-paper-fg-2">{item.where}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
