import { HeroReveal } from "@/components/hero/HeroReveal";
import { ProjectGrid } from "@/components/project/ProjectGrid";
import { FilmStripDivider } from "@/components/layout/FilmStripDivider";
import { getProjects } from "@/lib/supabase/queries";

export const revalidate = 60;

export default async function HomePage() {
  const projects = await getProjects();

  return (
    <main>
      <HeroReveal
        name="Agadape"
        tagline="Developer web-based information systems. Setiap project adalah entry dalam diary."
      />
      <FilmStripDivider />
      <div id="projects">
        <ProjectGrid projects={projects} />
      </div>
    </main>
  );
}
