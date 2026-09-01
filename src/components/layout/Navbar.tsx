import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-base/80 px-4 py-4 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <Link href="/" className="font-display flex items-center gap-2 text-xl font-bold tracking-wide">
          <span className="flex gap-1">
            <span className="h-2 w-2 rounded-full bg-accent-orange"></span>
            <span className="h-2 w-2 rounded-full bg-accent-green"></span>
            <span className="h-2 w-2 rounded-full bg-accent-blue"></span>
          </span>
          AGADAPE
        </Link>
        <nav className="flex gap-6 text-sm font-medium text-text-muted">
          <Link href="/" className="hover:text-text-primary transition-colors">
            PORTFOLIO
          </Link>
          <Link href="/about" className="hover:text-text-primary transition-colors">
            DIARY
          </Link>
        </nav>
      </div>
    </header>
  );
}
