"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
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

  // Fisika rotasi yang lebih "gereget" (stiff tapi bouncy)
  const springConfig = { stiffness: 300, damping: 20 };
  
  // Angle rotasi dinaikkan dari 8 menjadi 18 derajat untuk efek dramatis
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [18, -18]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-18, 18]), springConfig);

  // Kalkulasi efek pantulan cahaya (glare) yang mengikuti kursor
  const glareX = useSpring(useTransform(x, [-0.5, 0.5], [10, 90]), springConfig);
  const glareY = useSpring(useTransform(y, [-0.5, 0.5], [10, 90]), springConfig);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.25) 0%, transparent 60%)`;

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
    <Link href={`/projects/${project.slug}`} className="block" style={{ perspective: "1200px" }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ y: -12, scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.6)" }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{
          rotateX: reducedMotion ? 0 : rotateX,
          rotateY: reducedMotion ? 0 : rotateY,
          transformStyle: "preserve-3d", // Penting untuk depth 3D
        }}
        className="group relative aspect-poster w-full overflow-hidden rounded-poster bg-elevated ring-1 ring-white/10 transition-all hover:ring-2 hover:ring-accent-green hover:ring-offset-4 hover:ring-offset-base"
      >
        <motion.img
          src={project.cover_url}
          alt={project.title}
          whileHover={{ scale: reducedMotion ? 1 : 1.1 }} // Zoom in gambar lebih dalam
          transition={{ duration: 0.4 }}
          className="h-full w-full object-cover"
        />

        {/* Dynamic Glare Overlay (pantulan cahaya) */}
        {!reducedMotion && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: glareBackground }}
          />
        )}

        {/* Vignette — PRD §5.3 */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "radial-gradient(120% 120% at 50% 50%, transparent 60%, rgba(20,24,28,0.5) 100%)",
          }}
        />

        {/* Overlay info — muncul saat hover */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{ translateZ: 30 }} // Bikin teks terlihat melayang (3D pop out)
          className="absolute inset-x-0 bottom-0 z-30 flex flex-col gap-2 bg-gradient-to-t from-base/95 to-transparent p-5"
        >
          <h3 className="font-display text-sm font-bold text-text-primary drop-shadow-md">
            {project.title}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {project.tech_stack.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className={`rounded-full border px-2 py-0.5 text-[10px] drop-shadow-md ${CATEGORY_COLOR[project.category]}`}
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider text-text-muted drop-shadow-md">{project.year}</span>
            <RatingDots rating={project.rating} />
          </div>
        </motion.div>
      </motion.div>
    </Link>
  );
}
