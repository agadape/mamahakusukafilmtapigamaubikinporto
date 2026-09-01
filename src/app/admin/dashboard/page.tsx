"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { ProjectCategory } from "@/lib/supabase/queries";

// Form field mengikuti TECHSPEC §7 point 3. UI sengaja plain/brutal — bukan prioritas (PRD §8).
export default function AdminDashboardPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ProjectCategory>("personal");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [techStack, setTechStack] = useState("");
  const [rating, setRating] = useState<number | "">("");
  const [demoLink, setDemoLink] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  function slugify(text: string) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);

    const { error } = await supabase.from("projects").insert({
      title,
      slug: slugify(title),
      description,
      category,
      year,
      tech_stack: techStack.split(",").map((t) => t.trim()).filter(Boolean),
      rating: rating === "" ? null : rating,
      links: { demo: demoLink || undefined, github: githubLink || undefined },
      is_published: isPublished,
      cover_url: "", // TODO: upload ke bucket project-covers, isi URL hasil upload
    });

    setStatus(error ? `Error: ${error.message}` : "Project tersimpan.");
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-16">
      <h1 className="mb-6 text-2xl font-bold">Tambah Project</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          placeholder="Judul (maks 80 karakter)"
          maxLength={80}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded border border-text-muted/30 bg-elevated px-3 py-2"
          required
        />
        <textarea
          placeholder="Deskripsi"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded border border-text-muted/30 bg-elevated px-3 py-2"
          rows={4}
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as ProjectCategory)}
          className="rounded border border-text-muted/30 bg-elevated px-3 py-2"
        >
          <option value="hackathon">Hackathon</option>
          <option value="academic">Akademik</option>
          <option value="work">Kerja</option>
          <option value="personal">Personal</option>
        </select>
        <input
          type="number"
          placeholder="Tahun"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="rounded border border-text-muted/30 bg-elevated px-3 py-2"
          required
        />
        <input
          placeholder="Tech stack (pisahkan koma)"
          value={techStack}
          onChange={(e) => setTechStack(e.target.value)}
          className="rounded border border-text-muted/30 bg-elevated px-3 py-2"
        />
        <input
          type="number"
          min={1}
          max={5}
          placeholder="Rating (1-5, opsional)"
          value={rating}
          onChange={(e) => setRating(e.target.value === "" ? "" : Number(e.target.value))}
          className="rounded border border-text-muted/30 bg-elevated px-3 py-2"
        />
        <input
          placeholder="Link demo (opsional)"
          value={demoLink}
          onChange={(e) => setDemoLink(e.target.value)}
          className="rounded border border-text-muted/30 bg-elevated px-3 py-2"
        />
        <input
          placeholder="Link GitHub (opsional)"
          value={githubLink}
          onChange={(e) => setGithubLink(e.target.value)}
          className="rounded border border-text-muted/30 bg-elevated px-3 py-2"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
          Publish sekarang
        </label>

        {/* TODO: input upload cover_url ke Supabase Storage bucket project-covers */}

        {status && <p className="text-sm text-text-muted">{status}</p>}

        <button
          type="submit"
          className="rounded bg-accent-orange px-4 py-2 font-medium text-base"
        >
          Simpan
        </button>
      </form>
    </main>
  );
}
