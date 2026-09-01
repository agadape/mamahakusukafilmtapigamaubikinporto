// Dekorasi divider bermotif sprocket holes — opacity rendah, tidak mengganggu.
// Spec: PRD §5.3.
export function FilmStripDivider() {
  const holes = Array.from({ length: 40 });

  return (
    <div className="flex items-center justify-center gap-3 py-8 opacity-20" aria-hidden>
      {holes.map((_, i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-text-muted"
        />
      ))}
    </div>
  );
}
