"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function SmartLogPage() {
  const [rawText, setRawText] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  function slugify(text: string) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setStatus("🧠 Sedang dianalisis oleh AI Gemini...");
    setResult(null);

    try {
      // 1. Kirim teks ke API AI
      const aiRes = await fetch("/api/ai-parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw_text: rawText }),
      });

      if (!aiRes.ok) {
        const err = await aiRes.json();
        throw new Error(err.error || "Gagal menghubungi AI");
      }

      const aiData = await aiRes.json();
      setStatus("✨ AI selesai membaca! Menyimpan ke Supabase...");

      // 2. Generate Cover URL dari API Poster kita
      const techQuery = aiData.tech_stack?.join(",") || "";
      // Gunakan URL absolute Vercel jika nanti di-deploy, untuk sekarang pakai origin
      const baseUrl = window.location.origin;
      const coverUrl = `${baseUrl}/api/generate-poster?title=${encodeURIComponent(aiData.title)}&tech=${encodeURIComponent(techQuery)}`;

      // 3. Simpan ke database
      const { error } = await supabase.from("projects").insert({
        title: aiData.title,
        slug: slugify(aiData.title),
        description: aiData.description,
        tech_stack: aiData.tech_stack || [],
        rating: aiData.rating || null,
        category: "personal", // Default category
        year: new Date().getFullYear(),
        cover_url: coverUrl,
        source_raw_text: rawText,
        source_type: "smart_log",
        is_published: isPublished,
      });

      if (error) throw error;

      setResult(aiData);
      setStatus("✅ Berhasil! Draf LinkedIn-mu sudah disulap jadi poster film.");
      setRawText("");
    } catch (err: any) {
      setStatus(`❌ Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white flex items-center gap-2">
          <span className="text-accent-green">✦</span> Smart Log
        </h1>
        <p className="mt-2 text-text-muted">
          Paste *caption* LinkedIn-mu di sini. AI akan otomatis menebak judul, deskripsi, tech stack, memberi rating, dan membuatkan poster filmnya.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          placeholder="Tulis atau paste draf LinkedIn-mu di sini... (Contoh: Baru saja menyelesaikan pembuatan aplikasi E-Commerce dengan Next.js dan Tailwind. Cukup menantang karena harus integrasi payment gateway Midtrans dalam 3 hari.)"
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          className="rounded-lg border border-white/10 bg-elevated px-4 py-4 min-h-[200px] text-white placeholder:text-white/30 focus:border-accent-green focus:outline-none focus:ring-1 focus:ring-accent-green"
          required
        />
        
        <label className="flex items-center gap-2 text-sm text-text-muted cursor-pointer">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="rounded border-white/20 bg-base text-accent-green focus:ring-accent-green"
          />
          Langsung tayangkan di profil (Publish)
        </label>

        {status && (
          <div className="rounded bg-white/5 p-3 text-sm text-white/90 border border-white/10">
            {status}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || rawText.length < 10}
          className="rounded bg-accent-green px-4 py-3 font-bold uppercase tracking-widest text-base hover:bg-accent-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {isLoading ? "Memproses..." : "Log to Portfolio"}
        </button>
      </form>

      {result && (
        <div className="mt-12 p-6 rounded-lg border border-white/10 bg-elevated/50">
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-4">Hasil Analisis AI</h3>
          <div className="space-y-4">
            <div>
              <span className="text-xs text-text-muted block">Judul Terdeteksi</span>
              <span className="text-lg font-bold text-white">{result.title}</span>
            </div>
            <div>
              <span className="text-xs text-text-muted block">Deskripsi</span>
              <span className="text-white/80">{result.description}</span>
            </div>
            <div>
              <span className="text-xs text-text-muted block">Tech Stack</span>
              <div className="flex gap-2 mt-1 flex-wrap">
                {result.tech_stack.map((t: string) => (
                  <span key={t} className="text-xs px-2 py-1 rounded bg-accent-blue/20 text-accent-blue border border-accent-blue/30">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs text-text-muted block">Rating Otomatis</span>
              <span className="text-accent-orange font-bold text-xl">{result.rating} / 5.0</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
