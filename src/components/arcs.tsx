/** Arcos cinza inspirados na capa. Decorativos: ficam atrás do conteúdo e longe do texto. */
export function CoverArcs({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 800 800"
      fill="none"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
    >
      <circle cx="560" cy="620" r="430" stroke="#1d1e20" strokeWidth="92" />
      <circle cx="560" cy="620" r="548" stroke="#262628" strokeWidth="1.2" />
      <circle cx="560" cy="620" r="300" stroke="#18191a" strokeWidth="1.2" />
    </svg>
  );
}
