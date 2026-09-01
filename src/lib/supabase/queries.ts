import { supabase } from "./client";

export type ProjectCategory = "hackathon" | "academic" | "work" | "personal";

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover_url: string;
  gallery: string[] | null;
  tech_stack: string[];
  category: ProjectCategory;
  rating: number | null;
  year: number;
  links: { demo?: string; github?: string } | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// Hanya mengembalikan project yang published — ditegakkan juga oleh RLS di Supabase.
export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("year", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) return null;
  return data;
}
