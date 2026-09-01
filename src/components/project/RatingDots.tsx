"use client";

interface RatingDotsProps {
  rating: number | null; // 1-5
  max?: number;
}

// Dots terisi = accent-orange, dots kosong = outline text-muted.
// Sesuai PRD §5.3 — tidak render apa pun kalau rating kosong.
export function RatingDots({ rating, max = 5 }: RatingDotsProps) {
  if (rating === null) return null;

  return (
    <div className="flex gap-1" aria-label={`Rating ${rating} dari ${max}`}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < rating;
        return (
          <span
            key={i}
            className={`h-2 w-2 rounded-full transition-colors duration-150 ${
              filled ? "bg-accent-orange" : "border border-text-muted/40 bg-transparent"
            }`}
          />
        );
      })}
    </div>
  );
}
