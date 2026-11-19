import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

/** Marca visível para campos ainda não preenchidos em src/config/site.ts. */
export function Pending({ value, label }: { value: string | null | undefined; label: string }) {
  if (value) return <>{value}</>;
  return (
    <mark className="rounded-[2px] bg-fg px-1.5 py-0.5 font-medium text-ink">[pendente: {label}]</mark>
  );
}

type LegalPageProps = {
  title: string;
  updatedAt: string | null;
  hasPending: boolean;
  children: ReactNode;
};

export function LegalPage({ title, updatedAt, hasPending, children }: LegalPageProps) {
  return (
    <>
      <SiteHeader />
      <main id="principal" className="shell py-16 sm:py-24">
        <article className="mx-auto max-w-[70ch]">
          <h1 className="section-title">{title}</h1>
          <p className="mt-4 text-fg-3">
            Última atualização: <Pending value={updatedAt} label="data da revisão" />
          </p>
          {hasPending ? (
            <p className="mt-8 rounded border border-line-strong bg-surface p-5 leading-relaxed text-fg">
              Rascunho para revisão do responsável. Os campos marcados como pendentes precisam ser preenchidos em{" "}
              <code className="text-fg-2">src/config/site.ts</code> e o texto deve ser revisado antes da publicação
              comercial.
            </p>
          ) : null}
          <div className="legal mt-12 space-y-5 leading-relaxed text-fg-2 [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-[-0.02em] [&_h2]:text-fg [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1 [&_strong]:text-fg [&_ul]:space-y-2">
            {children}
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
