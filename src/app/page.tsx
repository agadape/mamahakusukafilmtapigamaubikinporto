import { HeroReveal } from "@/components/hero/HeroReveal";
import { ProjectGrid } from "@/components/project/ProjectGrid";
import { FilmStripDivider } from "@/components/layout/FilmStripDivider";
import { dummyProjects } from "@/lib/data/dummyProjects";
// Setelah Supabase disambung (TECHSPEC §8 step 5), ganti dummyProjects
// dengan: const projects = await getProjects();

export default function HomePage() {
  return (
    <main>
      <HeroReveal
        name="Agadape"
        tagline="Developer web-based information systems. Setiap project adalah entry dalam diary."
      />
      <FilmStripDivider />
      <div id="projects">
        <ProjectGrid projects={dummyProjects} />
      </div>
    </main>
  );
}
