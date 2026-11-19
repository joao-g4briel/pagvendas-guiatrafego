"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { LazyMotion, domAnimation, m, useMotionValue, useSpring, useTransform } from "motion/react";

type CoverMockupProps = {
  src: string;
  width: number;
  height: number;
  alt: string;
  sizes: string;
  preload?: boolean;
};

const SPRING = { stiffness: 110, damping: 18, mass: 0.7 };
/** Movimento só no desktop, com ponteiro preciso e sem pedido de redução de movimento. */
const INTERACTIVE_QUERY = "(min-width: 64rem) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

/**
 * Capa real do guia em perspectiva, com sombra feita em CSS.
 * No desktop, com o ponteiro sobre o hero: inclina até ~6° e flutua 6 px. Os valores do ponteiro
 * vivem em motion values (sem estado React a cada movimento).
 */
export function CoverMockup({ src, width, height, alt, sizes, preload = false }: CoverMockupProps) {
  const zoneRef = useRef<HTMLDivElement>(null);
  const [interactive, setInteractive] = useState(false);
  /** A flutuação só roda com o ponteiro na área: sem movimento automático contínuo. */
  const [hovering, setHovering] = useState(false);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-16, -4]), SPRING);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [7, -3]), SPRING);

  useEffect(() => {
    const query = window.matchMedia(INTERACTIVE_QUERY);
    const update = () => setInteractive(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const zone = zoneRef.current?.closest<HTMLElement>("[data-tilt-zone]") ?? zoneRef.current;
    if (!interactive || !zone) {
      px.set(0);
      py.set(0);
      return;
    }
    const onEnter = (event: PointerEvent) => {
      if (event.pointerType === "mouse") setHovering(true);
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = zone.getBoundingClientRect();
      px.set((event.clientX - rect.left) / rect.width - 0.5);
      py.set((event.clientY - rect.top) / rect.height - 0.5);
    };
    const onLeave = () => {
      px.set(0);
      py.set(0);
      setHovering(false);
    };
    zone.addEventListener("pointerenter", onEnter);
    zone.addEventListener("pointermove", onMove, { passive: true });
    zone.addEventListener("pointerleave", onLeave);
    return () => {
      zone.removeEventListener("pointerenter", onEnter);
      zone.removeEventListener("pointermove", onMove);
      zone.removeEventListener("pointerleave", onLeave);
    };
  }, [interactive, px, py]);

  return (
    <LazyMotion features={domAnimation} strict>
      <div ref={zoneRef} className="relative">
        <m.div
          className="relative will-change-transform"
          style={{ rotateX, rotateY, transformPerspective: 1500 }}
        >
          <m.div
            animate={interactive && hovering ? { y: [0, -6, 0] } : { y: 0 }}
            transition={
              interactive && hovering ? { duration: 5, ease: "easeInOut", repeat: Infinity } : { duration: 0.6 }
            }
          >
            <div className="relative overflow-hidden rounded-[3px] shadow-[0_2px_0_0_rgb(255_255_255/0.06),0_40px_70px_-24px_rgb(0_0_0/0.95),0_18px_30px_-18px_rgb(0_0_0/0.8)] ring-1 ring-white/12">
              <Image
                src={src}
                width={width}
                height={height}
                alt={alt}
                sizes={sizes}
                preload={preload}
                quality={85}
                className="block h-auto w-full"
              />
              {/* reflexo suave de luz sobre a capa */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgb(255_255_255/0.10)_0%,rgb(255_255_255/0.02)_32%,transparent_55%)]"
              />
            </div>
          </m.div>
        </m.div>
      </div>
    </LazyMotion>
  );
}
