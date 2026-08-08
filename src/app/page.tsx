import { PortfolioShell } from "@/components/portfolio/PortfolioShell";
import { SmoothScrollProvider } from "@/components/portfolio/SmoothScrollProvider";
import { certifications, education, experience, navItems, projects, scenes, siteConfig, skills } from "@/data";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <PortfolioShell
        navItems={navItems}
        scenes={scenes}
        site={siteConfig}
        projects={projects}
        skills={skills}
        certifications={certifications}
        education={education}
        experience={experience}
      />
    </SmoothScrollProvider>
  );
}
