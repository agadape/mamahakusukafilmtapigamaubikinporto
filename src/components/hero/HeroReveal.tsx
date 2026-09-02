"use client";

import { motion } from "framer-motion";

interface HeroRevealProps {
  name: string;
  tagline: string;
  projectCount: number;
  hackathonCount: number;
  githubUser?: {
    avatar_url: string;
    followers: number;
    location: string;
    bio: string;
  } | null;
}

export function HeroReveal({ name, tagline, projectCount, hackathonCount, githubUser }: HeroRevealProps) {
  return (
    <section className="relative w-full pt-16 pb-8 px-4 overflow-hidden">
      <HeroBackgroundDots />
      
      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Header Flex */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          
          {/* Left: Avatar & Info */}
          <div className="flex gap-4 sm:gap-6 items-start">
            {/* Avatar */}
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border border-white/10 shrink-0 bg-elevated shadow-lg">
              {githubUser?.avatar_url ? (
                <img src={githubUser.avatar_url} alt={name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-accent-orange via-accent-green to-accent-blue flex items-center justify-center text-3xl sm:text-4xl font-display font-bold text-white">
                  {name.charAt(0)}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col pt-1">
              <div className="flex items-center gap-3">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">{name}</h1>
                <button className="hidden sm:block px-3 py-1 text-[11px] font-semibold tracking-widest text-text-muted bg-white/10 rounded hover:bg-white/20 transition-colors uppercase">
                  Edit Profile
                </button>
                <button className="hidden sm:flex items-center justify-center w-7 h-7 text-text-muted bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                  <span className="leading-none pb-2">...</span>
                </button>
              </div>
              <p className="mt-1 text-sm sm:text-base text-text-muted/80">{githubUser?.bio || tagline}</p>
              <p className="mt-2 flex items-center gap-1 text-xs sm:text-sm text-text-muted/60">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                </svg>
                {githubUser?.location || "Indonesia"}
              </p>
            </div>
          </div>

          {/* Right: Stats */}
          <div className="flex items-center border-t md:border-t-0 border-white/5 pt-6 md:pt-2">
            <div className="flex flex-col items-center px-3 sm:px-5">
              <span className="font-display text-xl sm:text-2xl font-bold text-white">{projectCount}</span>
              <span className="text-[9px] sm:text-[10px] text-text-muted/60 tracking-wider">PROJECTS</span>
            </div>
            <div className="flex flex-col items-center px-3 sm:px-5 border-l border-white/10">
              <span className="font-display text-xl sm:text-2xl font-bold text-white">{hackathonCount}</span>
              <span className="text-[9px] sm:text-[10px] text-text-muted/60 tracking-wider">HACKATHONS</span>
            </div>
            <div className="flex flex-col items-center px-3 sm:px-5 border-l border-white/10">
              <span className="font-display text-xl sm:text-2xl font-bold text-white">{new Date().getFullYear()}</span>
              <span className="text-[9px] sm:text-[10px] text-text-muted/60 tracking-wider">THIS YEAR</span>
            </div>
            <div className="flex flex-col items-center pl-3 sm:pl-5 border-l border-white/10">
              <span className="font-display text-xl sm:text-2xl font-bold text-white">{githubUser?.followers || 0}</span>
              <span className="text-[9px] sm:text-[10px] text-text-muted/60 tracking-wider">FOLLOWERS</span>
            </div>
          </div>

        </div>

        {/* Sub-nav Tabs (Letterboxd box menu) */}
        <div className="mt-10 border border-white/10 rounded flex items-center px-2 sm:px-4 py-3 gap-4 sm:gap-6 text-sm text-text-muted overflow-x-auto no-scrollbar shadow-sm bg-base">
          <a href="#" className="text-white border-b-2 border-accent-green pb-[11px] -mb-3 font-medium px-2">Profile</a>
          <a href="#" className="hover:text-white transition-colors px-2">Activity</a>
          <a href="#projects" className="hover:text-white transition-colors px-2">Projects</a>
          <a href="/about" className="hover:text-white transition-colors px-2">Diary</a>
          <a href="#" className="hover:text-white transition-colors px-2">Reviews</a>
          <a href="#" className="hover:text-white transition-colors px-2">Watchlist</a>
        </div>
      </div>
    </section>
  );
}

// Dots melayang perlahan, 3 warna aksen — dimatikan otomatis via CSS reduced-motion (globals.css)
export function HeroBackgroundDots() {
  const colors = ["var(--accent-orange)", "var(--accent-green)", "var(--accent-blue)"];
  const dots = Array.from({ length: 36 });

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {dots.map((_, i) => {
        const color = colors[i % colors.length];
        const size = 4 + (i % 3) * 2;
        const left = (i * 23) % 100;
        const top = (i * 17) % 100;
        const duration = 8 + (i % 5);
        const delay = (i % 3) * 2;

        return (
          <motion.span
            key={i}
            className="absolute rounded-full opacity-30"
            style={{
              backgroundColor: color,
              width: size,
              height: size,
              left: `${left}%`,
              top: `${top}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}
