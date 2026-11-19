"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CheckoutCta } from "@/components/checkout-cta";

type NavLink = { readonly href: string; readonly label: string };

/** Menu do celular como disclosure: não bloqueia a página nem prende o scroll. */
export function MobileMenu({ links }: { links: readonly NavLink[] }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 64rem)");
    const onResize = () => desktop.matches && setOpen(false);

    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={toggleRef}
        type="button"
        className="-mr-2 inline-flex min-h-11 items-center gap-2.5 rounded px-2 text-[0.9375rem] font-medium text-fg"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Fechar" : "Menu"}
        <span aria-hidden="true" className="relative block h-3 w-5">
          <span
            className={`absolute left-0 h-px w-5 bg-current transition-transform duration-300 ease-out-expo ${
              open ? "top-1.5 rotate-45" : "top-0.5"
            }`}
          />
          <span
            className={`absolute left-0 h-px w-5 bg-current transition-transform duration-300 ease-out-expo ${
              open ? "top-1.5 -rotate-45" : "top-2.5"
            }`}
          />
        </span>
      </button>

      <div
        ref={panelRef}
        id={panelId}
        inert={!open}
        className={`absolute inset-x-0 top-full border-b border-line bg-ink duration-300 ease-out-expo ${
          open
            ? "visible translate-y-0 opacity-100 transition-[opacity,transform]"
            : "invisible -translate-y-2 opacity-0 transition-[opacity,transform,visibility]"
        }`}
      >
        <nav aria-label="Menu" className="shell pb-6 pt-2">
          <ul>
            {links.map((link) => (
              <li key={link.href} className="border-b border-line">
                <a
                  href={link.href}
                  className="flex min-h-14 items-center text-xl font-medium text-fg no-underline"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <CheckoutCta location="menu" className="mt-6 w-full">
            Comprar guia
          </CheckoutCta>
        </nav>
      </div>
    </div>
  );
}
