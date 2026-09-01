import { FilmStripDivider } from "@/components/layout/FilmStripDivider";

const DIARY_EVENTS = [
  {
    date: "Ags 2024",
    type: "Pekerjaan",
    title: "Mulai Freelance Developer",
    description: "Menerima berbagai project web dan sistem informasi.",
  },
  {
    date: "Nov 2023",
    type: "Hackathon",
    title: "Juara Web3 Hackfest",
    description: "Membangun sistem GIS desentralisasi.",
  },
  {
    date: "Sep 2022",
    type: "Akademik",
    title: "Sistem Informasi",
    description: "Mulai mendalami dunia pengembangan perangkat lunak.",
  }
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-4xl font-bold uppercase tracking-wide">Diary & Catatan</h1>
      
      <section className="mt-8 mb-12 text-lg leading-relaxed text-text-muted">
        <p>
          Halo! Saya adalah seorang developer sistem informasi berbasis web yang senang bereksplorasi di dunia 
          <strong className="text-accent-blue font-medium"> Hackathon</strong>, 
          <strong className="text-accent-orange font-medium"> Blockchain</strong>, dan 
          <strong className="text-accent-green font-medium"> GIS</strong>.
        </p>
        <p className="mt-4">
          Halaman ini ibarat <em>diary film</em> untuk perjalanan teknis saya—mencatat berbagai pencapaian, project penting, dan milestone karir.
        </p>
      </section>

      <FilmStripDivider />

      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold mb-8">Timeline</h2>
        
        <div className="flex flex-col gap-8">
          {DIARY_EVENTS.map((event, idx) => (
            <div key={idx} className="relative flex gap-6">
              {/* Garis vertikal timeline */}
              <div className="absolute left-[39px] top-8 bottom-[-32px] w-[2px] bg-gradient-to-b from-accent-orange via-accent-green to-accent-blue opacity-20" />
              
              {/* Tanggal */}
              <div className="w-24 shrink-0 pt-1 text-right text-sm font-bold text-text-muted">
                {event.date}
              </div>
              
              {/* Dot / Avatar (Motif 3 warna aksen) */}
              <div className="relative z-10 h-3 w-3 shrink-0 rounded-full border-2 border-base bg-accent-orange mt-2 ring-2 ring-accent-green/50" />
              
              {/* Konten */}
              <div className="flex-1 rounded-poster bg-elevated p-5 shadow-lg border border-text-muted/10">
                <span className="text-xs font-bold uppercase tracking-wider text-accent-blue mb-1 block">
                  {event.type}
                </span>
                <h3 className="font-display text-lg font-bold text-text-primary">
                  {event.title}
                </h3>
                <p className="mt-2 text-sm text-text-muted">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
