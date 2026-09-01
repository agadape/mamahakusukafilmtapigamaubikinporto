// Reusable Framer Motion variants — parameter mengikuti TECHSPEC.md §6

export const heroWordVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const heroContainerVariant = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

export const posterHoverLift = {
  rest: { y: 0, boxShadow: "0 0 0 rgba(0,0,0,0)" },
  hover: {
    y: -8,
    boxShadow: "0 12px 24px rgba(0,0,0,0.35)",
    transition: { duration: 0.22, ease: "easeOut" },
  },
};

export const posterCoverZoom = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.3 } },
};

export const overlayInfoVariant = {
  rest: { opacity: 0, y: 10 },
  hover: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, delay: 0.05 },
  },
};

export const scrollRevealVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export const scrollRevealContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

// Film-wipe page transition — clip-path menyapu dari satu sisi
export const pageWipeVariant = {
  initial: { clipPath: "inset(0 100% 0 0)" },
  animate: {
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: 0.25, ease: [0.65, 0, 0.35, 1] },
  },
  exit: {
    clipPath: "inset(0 0 0 100%)",
    transition: { duration: 0.25, ease: [0.65, 0, 0.35, 1] },
  },
};

// Dipakai untuk override semua transition di atas saat reduced-motion aktif
export const reducedMotionOverride = {
  transition: { duration: 0.15 },
};
