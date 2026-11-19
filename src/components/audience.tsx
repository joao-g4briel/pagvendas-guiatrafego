import { audienceFit, audienceNotFit } from "@/content/guia";

export function Audience() {
  return (
    <section aria-labelledby="publico-title" className="border-t border-line py-20 sm:py-28 lg:py-36">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5" data-reveal>
          <h2 id="publico-title" className="section-title">
            Feito para quem está começando a anunciar
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-fg-2">
            O conteúdo é introdutório. Experiência profissional se constrói com execução, análise e prática
            contínua; o guia sugere começar com rascunhos e dados simulados, sem gastar com anúncios.
          </p>
        </div>

        <div className="grid gap-12 sm:grid-cols-2 sm:gap-10 lg:col-span-7">
          <div data-reveal>
            <h3 className="border-b border-line-strong pb-4 text-lg font-semibold">Serve para você se</h3>
            <ul>
              {audienceFit.map((item) => (
                <li key={item} className="flex gap-4 border-b border-line py-5 leading-relaxed">
                  <svg
                    className="mt-1 shrink-0"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path d="m3 8.4 3 3 7-7" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal style={{ ["--rv-d" as string]: "80ms" }}>
            <h3 className="border-b border-line-strong pb-4 text-lg font-semibold text-fg-2">
              Talvez não seja para você se
            </h3>
            <ul>
              {audienceNotFit.map((item) => (
                <li key={item} className="flex gap-4 border-b border-line py-5 leading-relaxed text-fg-2">
                  <svg
                    className="mt-1 shrink-0"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path d="M4 8h8" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
