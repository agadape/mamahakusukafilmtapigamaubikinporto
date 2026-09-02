"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/lib/supabase/queries";
import { PosterCard } from "./PosterCard";
import {
  scrollRevealContainer,
  scrollRevealVariant,
} from "@/lib/animations/variants";

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">


      <motion.div
        layout
        variants={scrollRevealContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
      >
        <AnimatePresence mode="popLayout">
          {projects.map((project) => (
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
