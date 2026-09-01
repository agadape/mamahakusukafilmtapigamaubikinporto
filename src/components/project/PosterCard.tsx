"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { Project } from "@/lib/supabase/queries";
import { RatingDots } from "./RatingDots";
import { useReducedMotion } from "@/lib/animations/useReducedMotion";

const CATEGORY_COLOR: Record<Project["category"], string> = {
  hackathon: "border-accent-orange text-accent-orange",
  academic: "border-accent-blue text-accent-blue",
  work: "border-accent-green text-accent-green",
  personal: "border-accent-blue text-accent-blue",
};

interface PosterCardProps {
  project: Project;
}

export function PosterCard({ project }: PosterCardProps) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), {
    stiffness: 150,
    damping: 15,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), {
    stiffness: 150,
    damping: 15,
  });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <Link href={`/projects/${project.slug}`}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ y: -8, boxShadow: "0 12px 24px rgba(0,0,0,0.35)" }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        style={{
          rotateX: reducedMotion ? 0 : rotateX,
          rotateY: reducedMotion ? 0 : rotateY,
        }}
        className="group relative aspect-poster w-full overflow-hidden rounded-poster bg-elevated"
      >
        <motion.img
          src={project.cover_url}
          alt={project.title}
          whileHover={{ scale: reducedMotion ? 1 : 1.05 }}
          transition={{ duration: 0.3 }}
          className="h-full w-full object-cover"
        />

        {/* Vignette — PRD §5.3 */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 120% at 50% 50%, transparent 60%, rgba(20,24,28,0.4) 100%)",
          }}
        />

        {/* Overlay info — muncul saat hover */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-t from-base/95 to-transparent p-4"
        >
          <h3 className="font-display text-sm font-bold text-text-primary">
            {project.title}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {project.tech_stack.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className={`rounded-full border px-2 py-0.5 text-[10px] ${CATEGORY_COLOR[project.category]}`}
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted">{project.year}</span>
            <RatingDots rating={project.rating} />
          </div>
        </motion.div>
      </motion.div>
    </Link>
  );
}
