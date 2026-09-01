import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/5 bg-elevated/30 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 px-4 md:flex-row">
        <div className="flex gap-4 text-sm font-medium text-text-muted">
          <Link href="/about" className="hover:text-text-primary transition-colors">About</Link>
          <a href="#" className="hover:text-text-primary transition-colors">Pro</a>
          <a href="#" className="hover:text-text-primary transition-colors">Journal</a>
          <a href="#" className="hover:text-text-primary transition-colors">Podcast</a>
        </div>
        
        <div className="text-center text-xs text-text-muted/60 md:text-right">
          <p>© {new Date().getFullYear()} Agadape. Letterboxd-inspired portfolio.</p>
          <p className="mt-1">Film data from TMDb. Wait, no, project data from Supabase.</p>
        </div>
      </div>
    </footer>
  );
}
