import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="principal" className="shell flex min-h-[70vh] flex-col justify-center py-24">
        <p className="tabular text-fg-3">Erro 404</p>
        <h1 className="display mt-4 max-w-3xl">Esta página não existe.</h1>
        <p className="mt-6 max-w-md leading-relaxed text-fg-2">
          O endereço pode ter mudado. A página do guia continua no início do site.
        </p>
        <Link href="/" className="btn btn-primary mt-10 self-start">
          Voltar ao início
        </Link>
      </main>
    </>
  );
}
