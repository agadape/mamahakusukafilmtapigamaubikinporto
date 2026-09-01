import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/supabase/queries";
import { RatingDots } from "@/components/project/RatingDots";

export const revalidate = 60;

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <img
        src={project.cover_url}
        alt={project.title}
        className="aspect-poster w-64 rounded-poster object-cover"
      />

      <h1 className="font-display mt-8 text-4xl font-bold">{project.title}</h1>

      <div className="mt-2 flex items-center gap-4 text-sm text-text-muted">
        <span>{project.year}</span>
        <RatingDots rating={project.rating} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.tech_stack.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-accent-blue px-3 py-1 text-xs text-accent-blue"
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="mt-6 text-text-primary/90">{project.description}</p>

      <div className="mt-8 flex gap-4">
        {project.links?.demo && (
          <a
            href={project.links.demo}
            className="rounded-full bg-accent-orange px-5 py-2 text-sm font-medium text-base"
          >
            Demo
          </a>
        )}
        {project.links?.github && (
          <a
            href={project.links.github}
            className="rounded-full border border-text-muted/40 px-5 py-2 text-sm text-text-primary"
          >
            GitHub
          </a>
        )}
      </div>
    </main>
  );
}
