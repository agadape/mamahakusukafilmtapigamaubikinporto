import { HeroReveal } from "@/components/hero/HeroReveal";
import { ProjectGrid } from "@/components/project/ProjectGrid";
import { FilmStripDivider } from "@/components/layout/FilmStripDivider";
import { getProjects } from "@/lib/supabase/queries";

async function getGithubProfile(username: string) {
  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

export const revalidate = 60;

export default async function HomePage() {
  const projects = await getProjects();
  const hackathonCount = projects.filter((p) => p.category === "hackathon").length;
  
  const githubUser = await getGithubProfile("agadape");

  return (
    <main>
      <HeroReveal
        name="Agadape"
        tagline="Developer web-based information systems. Setiap project adalah entry dalam diary."
        projectCount={projects.length}
        hackathonCount={hackathonCount}
        githubUser={githubUser}
      />
      <FilmStripDivider />
      <div id="projects">
        <ProjectGrid projects={projects} />
      </div>
    </main>
  );
}
