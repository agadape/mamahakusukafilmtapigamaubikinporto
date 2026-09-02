"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* 3 Warna Letterboxd (Orange, Green, Blue) Menyapu Layar Sebagai Transisi! */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1], delay: 0.15 }}
        className="fixed inset-0 z-[100] bg-accent-orange origin-right pointer-events-none"
      />
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1], delay: 0.075 }}
        className="fixed inset-0 z-[101] bg-accent-green origin-right pointer-events-none"
      />
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
        className="fixed inset-0 z-[102] bg-[#14181c] origin-right pointer-events-none flex items-center justify-center"
      >
        <span className="flex gap-2">
          <span className="h-4 w-4 rounded-full bg-accent-orange"></span>
          <span className="h-4 w-4 rounded-full bg-accent-green"></span>
          <span className="h-4 w-4 rounded-full bg-accent-blue"></span>
        </span>
      </motion.div>

      {/* Konten Halaman Menggunakan Efek Wipe Favoritmu */}
      <motion.div
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: "inset(0 0% 0 0)" }}
        transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1], delay: 0.2 }}
      >
        {children}
      </motion.div>
    </>
  );
}
