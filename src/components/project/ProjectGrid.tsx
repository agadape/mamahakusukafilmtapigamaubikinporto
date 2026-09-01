"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Project, ProjectCategory } from "@/lib/supabase/queries";
import { PosterCard } from "./PosterCard";
import {
  scrollRevealContainer,
  scrollRevealVariant,
} from "@/lib/animations/variants";

const FILTERS: { label: string; value: ProjectCategory | "all" }[] = [
  { label: "Semua", value: "all" },
  { label: "Hackathon", value: "hackathon" },
  { label: "Akademik", value: "academic" },
  { label: "Kerja", value: "work" },
  { label: "Personal", value: "personal" },
];

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  const [filter, setFilter] = useState<ProjectCategory | "all">("all");

  const filtered =
    filter === "all" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors duration-200 ${
              filter === f.value
                ? "border-accent-orange text-accent-orange"
                : "border-text-muted/30 text-text-muted hover:border-text-muted/60"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <motion.div
        layout
        variants={scrollRevealContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => (
            <motion.div
              key={project.id}
              layout
              variants={scrollRevealVariant}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              <PosterCard project={project} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
