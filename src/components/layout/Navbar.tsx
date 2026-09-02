import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#14181c] px-4 py-3 border-b border-white/5 shadow-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        
        {/* Left: Logo */}
        <Link href="/" className="font-display flex items-center gap-2 text-2xl font-bold tracking-tight text-white hover:text-white/90">
          <span className="flex gap-0.5">
            <span className="h-4 w-4 rounded-full bg-accent-orange"></span>
            <span className="h-4 w-4 rounded-full bg-accent-green"></span>
            <span className="h-4 w-4 rounded-full bg-accent-blue"></span>
          </span>
          Agadape
        </Link>
        
        {/* Right: Nav Links + Log Button */}
        <div className="flex items-center gap-4 sm:gap-6">
          <nav className="hidden md:flex gap-5 text-[11px] font-bold tracking-widest text-text-muted">
            <Link href="/" className="hover:text-white transition-colors uppercase">Projects</Link>
            <Link href="/about" className="hover:text-white transition-colors uppercase">Diary</Link>
            <a href="https://github.com/agadape" target="_blank" rel="noreferrer" className="hover:text-white transition-colors uppercase">Members</a>
          </nav>
          
          <Link 
            href="/admin/smart-log" 
            className="flex items-center rounded bg-accent-green px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-base hover:bg-accent-green/90 transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
          >
            <span className="mr-1 font-bold text-sm leading-none">+</span> Log
          </Link>
        </div>

      </div>
    </header>
  );
}
