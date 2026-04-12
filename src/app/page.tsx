import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import VideoProjects from "@/components/VideoProjects";
import ProjectsSection from "@/components/ProjectsSection";
import HomeTeam from "@/components/HomeTeam";
import HomeNews from "@/components/HomeNews";
import { getProjects } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const allProjects = await getProjects();
  const projects = allProjects.map((p: any) => ({
    ...p,
    displayImage: (p.image && p.image2) ? (Math.random() > 0.5 ? p.image : p.image2) : (p.image || p.image2 || p.thumbnail)
  }));
  
  const videos = projects.filter((p: any) => p.category === 'Videolar');
  const mods = projects.filter((p: any) => p.category !== 'Videolar');

  const news = await prisma.news.findMany({ include: { author: true }, orderBy: { createdAt: 'desc' }, take: 4 });
  const team = await prisma.teamMember.findMany({ include: { user: true }, orderBy: { createdAt: 'asc' } });

  // Sizin hazırladığınız logoları buradan kolayca bağlayabilirsiniz:
  const socialLinks = {
    youtube: "https://www.youtube.com/@StarDublajStudiosoffical",
    discord: "https://discord.gg/Sghsbk5RbF"
  };

  return (
    <main className="flex flex-col min-h-screen bg-dublio-dark text-white selection:bg-dublio-purple/30">
      <Navbar />

      <HeroSection />

      <HomeNews news={news} />

      <VideoProjects projects={videos} />

      <ProjectsSection mods={mods} />

      <HomeTeam teamMembers={team} />

      {/* Footer */}
      <footer className="py-24 px-8 bg-[#161313] border-t border-white/5">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-left">
          {/* ... */}
          <div>
            <h4 className="font-black italic uppercase text-white mb-6 tracking-widest">Star Dublaj</h4>
            <ul className="space-y-3 text-dublio-text-dark text-sm font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Haberler</a></li>
              <li><a href="#" className="hover:text-white transition-colors">İstatistikler</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Hakkımızda</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black italic uppercase text-white mb-6 tracking-widest">Keşfet</h4>
            <ul className="space-y-3 text-dublio-text-dark text-sm font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Tüm Modlar</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Tüm Videolar</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Projeler</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black italic uppercase text-white mb-6 tracking-widest">Destek</h4>
            <ul className="space-y-3 text-dublio-text-dark text-sm font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Yardım Merkezi</a></li>
              <li><a href="#" className="hover:text-white transition-colors">İletişim</a></li>
            </ul>
          </div>
          <div className="flex flex-col items-start">
            <h4 className="font-black italic uppercase text-white mb-6 tracking-widest">Sosyal Medya</h4>
            <div className="flex gap-4">
              <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:scale-105 transition-all flex items-center justify-center cursor-pointer shadow-lg p-2.5">
                <img src="/youtube-logo.png?v=1" alt="YT" className="w-full h-full object-contain drop-shadow-md" />
              </a>
              <a href={socialLinks.discord} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:scale-105 transition-all flex items-center justify-center cursor-pointer shadow-lg p-2.5">
                <img src="/discord-logo.png?v=1" alt="DC" className="w-full h-full object-contain drop-shadow-md" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
