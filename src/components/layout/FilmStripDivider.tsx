// Dekorasi divider bermotif sprocket holes — opacity rendah, tidak mengganggu.
// Spec: PRD §5.3.
export function FilmStripDivider() {
  const holes = Array.from({ length: 50 });

  return (
    <div className="flex items-center justify-between overflow-hidden py-12 opacity-15" aria-hidden>
      {holes.map((_, i) => (
        <span
          key={i}
          className="mx-[2px] h-3 w-[6px] shrink-0 rounded-[1px] bg-text-muted"
        />
      ))}
    </div>
  );
}
