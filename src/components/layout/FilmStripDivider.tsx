"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/animations/useReducedMotion";

export function FilmStripDivider() {
  const reducedMotion = useReducedMotion();
  // Gandakan array agar animasinya mulus dan nyambung (looping)
  const holes = Array.from({ length: 80 });

  return (
    <div className="relative flex w-full overflow-hidden py-12 opacity-20" aria-hidden>
      <motion.div
        className="flex w-max shrink-0 items-center"
        animate={{ x: reducedMotion ? "0%" : ["0%", "-50%"] }}
        transition={{
          duration: 30, // Sangat pelan agar tidak pusing
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {/* Render 2 set holes untuk ilusi infinite loop */}
        {[...holes, ...holes].map((_, i) => (
          <span
            key={i}
            className="mx-[3px] h-3 w-[8px] shrink-0 rounded-[1px] bg-white/40"
          />
        ))}
      </motion.div>
    </div>
  );
}
