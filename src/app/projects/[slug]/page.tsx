import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/supabase/queries";
import { RatingDots } from "@/components/project/RatingDots";

export const revalidate = 60;

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  return (
    <main className="min-h-screen pb-16">
      {/* Cinematic Backdrop */}
      <div className="relative h-[45vh] w-full lg:h-[55vh]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm"
          style={{ backgroundImage: `url(${project.cover_url})` }}
        />
        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-base via-base/80 to-base/20" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-32 flex flex-col items-start gap-8 md:-mt-48 md:flex-row md:gap-12">
          
          {/* Poster Container */}
          <div className="group relative w-48 shrink-0 md:w-64">
            <div className="aspect-poster overflow-hidden rounded-poster bg-elevated shadow-2xl ring-1 ring-white/10">
              <img
                src={project.cover_url}
                alt={project.title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Details Container */}
          <div className="flex-1 pt-2 md:pt-16">
            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
                {project.title}
              </h1>
              <span className="text-xl text-text-muted">{project.year}</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {project.tech_stack.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-elevated px-2 py-1 text-xs font-semibold tracking-wider text-accent-blue ring-1 ring-inset ring-accent-blue/30"
                >
                  {tag.toUpperCase()}
                </span>
              ))}
              <span className="rounded bg-elevated px-2 py-1 text-xs font-semibold tracking-wider text-accent-orange ring-1 ring-inset ring-accent-orange/30">
                {project.category.toUpperCase()}
              </span>
            </div>

            {/* Letterboxd Review Block */}
            <div className="mt-8 rounded-lg border border-white/5 bg-elevated/40 p-6 shadow-inner">
              <div className="mb-4 flex items-center gap-3 border-b border-white/5 pb-4">
                <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-gradient-to-tr from-accent-orange to-accent-green">
                  <span className="flex h-full w-full items-center justify-center font-display text-sm font-bold text-base">
                    A
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-text-muted">
                    Review by <strong className="text-text-primary">Agadape</strong>
                  </p>
                  <div className="mt-0.5">
                    <RatingDots rating={project.rating} />
                  </div>
                </div>
              </div>
              <p className="whitespace-pre-line text-base leading-relaxed text-text-primary/90">
                {project.description}
              </p>
            </div>

            <div className="mt-10 flex gap-4">
              {project.links?.demo && (
                <a
                  href={project.links.demo.startsWith("http") ? project.links.demo : `https://${project.links.demo}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded bg-accent-green px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-base transition-transform hover:scale-105"
                >
                  Live Demo
                </a>
              )}
              {project.links?.github && (
                <a
                  href={project.links.github.startsWith("http") ? project.links.github : `https://${project.links.github}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded bg-elevated px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-text-primary ring-1 ring-inset ring-white/20 transition-colors hover:bg-white/10"
                >
                  Source Code
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
