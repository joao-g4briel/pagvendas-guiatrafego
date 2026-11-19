"use client";

import { useId, useState, type ReactNode } from "react";

type DisclosureProps = {
  /** Conteúdo do botão (título da pergunta ou do módulo). */
  summary: ReactNode;
  children: ReactNode;
  headingLevel?: 3 | 4;
  defaultOpen?: boolean;
};

/**
 * Item de accordion acessível: botão com aria-expanded dentro de um heading,
 * painel com role="region". O painel fechado fica inerte (fora do foco e da leitura).
 */
export function Disclosure({ summary, children, headingLevel = 3, defaultOpen = false }: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const buttonId = `${id}-trigger`;
  const panelId = `${id}-panel`;
  const Heading = headingLevel === 3 ? "h3" : "h4";

  return (
    <div className="border-b border-line">
      <Heading className="m-0">
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className="group flex w-full items-center gap-5 py-5 text-left text-fg transition-colors duration-150 hover:text-white"
        >
          <span className="min-w-0 flex-1">{summary}</span>
          <span
            aria-hidden="true"
            className="relative grid size-9 shrink-0 place-items-center rounded-full border border-line-strong transition-colors duration-200 group-hover:border-fg"
          >
            <span className="absolute h-px w-3.5 bg-current" />
            <span
              className={`absolute h-3.5 w-px bg-current transition-transform duration-300 ease-out-expo ${
                open ? "scale-y-0" : "scale-y-100"
              }`}
            />
          </span>
        </button>
      </Heading>
      <div className="accordion-panel" data-open={open}>
        <div id={panelId} role="region" aria-labelledby={buttonId} inert={!open}>
          <div className="pb-7 pr-14">{children}</div>
        </div>
      </div>
    </div>
  );
}
