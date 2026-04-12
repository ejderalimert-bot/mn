import Navbar from "@/components/Navbar";
import ProjectsSection from "@/components/ProjectsSection";
import { getProjects } from "@/lib/data";

export default async function ModsPage() {
  const projects = await getProjects();
  const mods = projects.filter((p: any) => p.category !== 'Videolar');

  return (
    <main className="flex flex-col min-h-screen bg-dublio-dark text-white selection:bg-dublio-purple/30">
      <Navbar />
      
      <div className="pt-32 pb-10 text-center px-6">
        <h1 className="text-5xl font-black italic tracking-tighter uppercase mb-4 text-dublio-cyan">MODLAR VE YAMALAR</h1>
        <p className="text-white/50 text-xl font-medium max-w-2xl mx-auto">Tüm oyun modlarımıza, yamalarımıza ve yeni projelerimize buradan göz atabilirsiniz.</p>
      </div>

      <ProjectsSection mods={mods} />
    </main>
  );
}
