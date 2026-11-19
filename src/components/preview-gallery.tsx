"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PreviewPage } from "@/content/guia";

/**
 * Miniaturas da amostra e lightbox em <dialog> nativo: foco preso no diálogo,
 * Escape fecha, setas navegam e o foco volta para a miniatura de origem.
 */
export function PreviewGallery({ pages }: { pages: PreviewPage[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const closeRef = useRef<HTMLButtonElement>(null);
  /** Miniatura que abriu o lightbox: recebe o foco de volta ao fechar. */
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const [index, setIndex] = useState<number | null>(null);

  const open = (i: number) => {
    openerRef.current = triggerRefs.current[i] ?? null;
    setIndex(i);
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    // foco no botão fechar, previsível para teclado e leitor de tela
    requestAnimationFrame(() => closeRef.current?.focus());
  };

  const close = useCallback(() => dialogRef.current?.close(), []);

  const step = useCallback(
    (delta: number) => setIndex((current) => (current === null ? current : (current + delta + pages.length) % pages.length)),
    [pages.length],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      setIndex(null);
      openerRef.current?.focus();
      openerRef.current = null;
    };
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  const current = index === null ? null : pages[index];

  return (
    <>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
        {pages.map((page, i) => (
          <li key={page.page} data-reveal style={{ ["--rv-d" as string]: `${i * 70}ms` }}>
            <button
              ref={(node) => {
                triggerRefs.current[i] = node;
              }}
              type="button"
              onClick={() => open(i)}
              className="group block w-full text-left"
              aria-label={`Ampliar página ${page.page}: ${page.title}`}
            >
              <span className="relative block overflow-hidden rounded-xs bg-white shadow-[0_1px_2px_rgb(0_0_0/0.08),0_14px_30px_-14px_rgb(0_0_0/0.35)] ring-1 ring-black/10 transition-[transform,box-shadow] duration-300 ease-out-expo group-hover:-translate-y-1 group-hover:shadow-[0_2px_4px_rgb(0_0_0/0.08),0_22px_40px_-16px_rgb(0_0_0/0.4)]">
                <Image
                  src={page.src}
                  width={1406}
                  height={1988}
                  alt={page.alt}
                  sizes="(min-width: 64rem) 280px, (min-width: 40rem) 45vw, 46vw"
                  className="block h-auto w-full"
                />
                <span
                  aria-hidden="true"
                  className="absolute bottom-3 right-3 grid size-9 place-items-center rounded-full bg-paper-ink text-paper opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M7 2.5v9M2.5 7h9M11 11l3 3" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </span>
              </span>
            </button>
            <p className="mt-4 flex items-baseline justify-between gap-3">
              <span className="font-semibold leading-snug text-paper-ink">{page.title}</span>
              <span className="tabular shrink-0 text-sm text-paper-fg-2">p. {page.page}</span>
            </p>
            <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-paper-fg-2">{page.caption}</p>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-labelledby="lightbox-title"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            step(1);
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            step(-1);
          }
        }}
        onClick={(event) => {
          // clique fora da página, dos botões e dos textos fecha (atalho de mouse; teclado usa Escape ou Fechar)
          if (!(event.target as Element).closest("img, button, p")) close();
        }}
      >
        {current && index !== null ? (
          <div className="lightbox-frame flex h-full flex-col">
            <div className="shell flex items-center justify-between gap-4 py-4">
              <p id="lightbox-title" className="min-w-0 text-[0.9375rem]">
                <span className="tabular text-fg-2">
                  {index + 1} de {pages.length} · p. {current.page}
                </span>{" "}
                <span className="font-semibold">{current.title}</span>
              </p>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                className="btn btn-ghost btn-compact shrink-0"
              >
                Fechar
                <span className="sr-only"> a amostra</span>
              </button>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center px-14 pb-4 sm:px-20">
              <Image
                key={current.src}
                src={current.src}
                width={1406}
                height={1988}
                alt={current.alt}
                sizes="(min-width: 64rem) 900px, 100vw"
                quality={85}
                className="page-swap block h-auto max-h-full w-auto max-w-full rounded-xs bg-white object-contain shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)]"
              />
              <button
                type="button"
                onClick={() => step(-1)}
                className="absolute left-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-line-strong bg-ink text-fg transition-colors hover:border-fg sm:left-5"
                aria-label="Página anterior da amostra"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M11 4 6 9l5 5" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-line-strong bg-ink text-fg transition-colors hover:border-fg sm:right-5"
                aria-label="Próxima página da amostra"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="m7 4 5 5-5 5" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </button>
            </div>

            <p className="shell pb-5 text-center text-sm text-fg-2" style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}>
              {current.caption} <span className="hidden sm:inline">Use as setas do teclado para navegar.</span>
            </p>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
