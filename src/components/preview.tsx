import { PreviewGallery } from "@/components/preview-gallery";
import { siteConfig } from "@/config/site";
import { previewPages } from "@/content/guia";

export function Preview() {
  const remaining = siteConfig.product.pages - previewPages.length;

  return (
    <section
      id="previa"
      aria-labelledby="previa-title"
      className="paper bg-paper py-20 text-paper-ink sm:py-28 lg:py-36"
    >
      <div className="shell">
        <div className="running-head flex items-center justify-between gap-4 border-b border-paper-line pb-4 text-paper-fg-2">
          <p>Metodaria</p>
          <p>Guia prático de gestão de tráfego</p>
        </div>

        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-12 lg:items-end">
          <h2 id="previa-title" className="section-title lg:col-span-7" data-reveal>
            Folheie quatro páginas do guia
          </h2>
          <p className="max-w-md leading-relaxed text-paper-fg-2 lg:col-span-5 lg:justify-self-end" data-reveal>
            Sumário, abertura do Módulo 01, uma lição sobre WhatsApp e o checklist antes de publicar, do jeito que
            aparecem no PDF. As outras {remaining} páginas ficam no arquivo completo.
          </p>
        </div>

        <div className="mt-14 lg:mt-20">
          <PreviewGallery pages={previewPages} />
        </div>

        <p className="mt-16 border-t border-paper-line pt-5 text-sm text-paper-fg-2">
          {siteConfig.product.edition} · {siteConfig.product.subtitle}
        </p>
      </div>
    </section>
  );
}
