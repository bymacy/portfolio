import About from '@/components/About';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import ProjectsSection from '@/components/ProjectsSection';
import TechStack from '@/components/TechStack';
import { getProjectSummaries } from '@/lib/projects';

export default function HomePage() {
  // Read once on the server; only card-sized data crosses to the client.
  const projects = getProjectSummaries();

  return (
    <>
      <Hero />
      <About />
      <TechStack />
      <ProjectsSection projects={projects} />
      <Footer />
    </>
  );
}
