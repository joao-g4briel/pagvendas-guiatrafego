"use client";

import { useEffect } from "react";

/**
 * Um único IntersectionObserver para todos os elementos com `data-reveal`.
 * O conteúdo só fica oculto quando o script inline do layout adiciona `.rv` ao <html>;
 * se este componente não carregar, o script remove a classe e tudo aparece.
 */
export function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("rv")) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
    root.classList.add("rv-ready");

    return () => observer.disconnect();
  }, []);

  return null;
}
