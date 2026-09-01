"use client";

import { motion } from "framer-motion";
import {
  heroContainerVariant,
  heroWordVariant,
} from "@/lib/animations/variants";

interface HeroRevealProps {
  name: string;
  tagline: string;
}

export function HeroReveal({ name, tagline }: HeroRevealProps) {
  const nameWords = name.split(" ");

  return (
    <section className="relative flex min-h-[80vh] flex-col items-start justify-center overflow-hidden px-4">
      <HeroBackgroundDots />

      <motion.div
        variants={heroContainerVariant}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-4xl"
      >
        <div className="mb-6 flex items-center gap-6">
          <motion.div variants={heroWordVariant} className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-gradient-to-tr from-accent-orange via-accent-green to-accent-blue p-1 shadow-lg">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-base text-2xl font-bold text-text-primary">
              A
            </div>
          </motion.div>
          <motion.div variants={heroWordVariant} className="flex gap-4 sm:gap-8">
            <div className="text-center">
              <span className="block font-display text-2xl font-bold text-text-primary">14</span>
              <span className="text-xs uppercase tracking-wider text-text-muted">Projects</span>
            </div>
            <div className="text-center">
              <span className="block font-display text-2xl font-bold text-text-primary">5</span>
              <span className="text-xs uppercase tracking-wider text-text-muted">Hackathons</span>
            </div>
          </motion.div>
        </div>

        <h1 className="font-display flex flex-wrap gap-x-4 text-5xl font-bold sm:text-7xl">
          {nameWords.map((word, i) => (
            <motion.span key={i} variants={heroWordVariant} className="inline-block">
              {word}
            </motion.span>
          ))}
        </h1>
        <motion.p
          variants={heroWordVariant}
          className="mt-4 max-w-lg text-lg text-text-muted"
        >
          {tagline}
        </motion.p>
        <motion.a
          variants={heroWordVariant}
          href="#projects"
          className="mt-8 inline-block rounded-full border border-accent-orange px-6 py-2.5 text-sm font-medium text-accent-orange transition-colors hover:bg-accent-orange hover:text-base"
        >
          Lihat Diary Project
        </motion.a>
      </motion.div>
    </section>
  );
}

// Dots melayang perlahan, 3 warna aksen — dimatikan otomatis via CSS reduced-motion (globals.css)
function HeroBackgroundDots() {
  const colors = ["var(--accent-orange)", "var(--accent-green)", "var(--accent-blue)"];
  const dots = Array.from({ length: 18 });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((_, i) => {
        const color = colors[i % colors.length];
        const size = 4 + (i % 3) * 2;
        const left = (i * 37) % 100;
        const top = (i * 53) % 100;
        const duration = 6 + (i % 5);

        return (
          <motion.span
            key={i}
            className="absolute rounded-full opacity-40"
            style={{
              backgroundColor: color,
              width: size,
              height: size,
              left: `${left}%`,
              top: `${top}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}
