"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { pageWipeVariant } from "@/lib/animations/variants";

// Bungkus {children} di layout.tsx untuk transisi "film-wipe" antar halaman.
// Spec: PRD §6, TECHSPEC §6.
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageWipeVariant}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
