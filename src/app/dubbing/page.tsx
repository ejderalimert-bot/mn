import Navbar from "@/components/Navbar";
import VideoProjects from "@/components/VideoProjects";
import { getProjects } from "@/lib/data";

export default async function DubbingPage() {
  const projects = await getProjects();
  const videos = projects.filter((p: any) => p.category === 'Videolar');

  return (
    <main className="flex flex-col min-h-screen bg-dublio-dark text-white selection:bg-dublio-purple/30">
      <Navbar />
      
      <div className="pt-32 pb-10 text-center px-6">
        <h1 className="text-5xl font-black italic tracking-tighter uppercase mb-4 text-red-500">TÜRKÇE DUBLAJ</h1>
        <p className="text-white/50 text-xl font-medium max-w-2xl mx-auto">En çok sevilen YouTube ve Shorts konseptleri yepyeni seslendirmelerimizle.</p>
      </div>

      <VideoProjects projects={videos} />
    </main>
  );
}
