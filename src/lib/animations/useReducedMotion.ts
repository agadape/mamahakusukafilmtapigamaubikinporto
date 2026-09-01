"use client";

import { useEffect, useState } from "react";

/**
 * Deteksi prefers-reduced-motion.
 * Dipakai untuk mematikan/menyederhanakan animasi non-esensial
 * (tilt 3D, particle, parallax) sesuai PRD §6 & §9.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return reduced;
}
