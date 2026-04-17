import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import VideoProjects from "@/components/VideoProjects";
import ProjectsSection from "@/components/ProjectsSection";
import HomeTeam from "@/components/HomeTeam";
import HomeNews from "@/components/HomeNews";
import HomeFooter from "@/components/HomeFooter";
import HomeStatsBar from "@/components/HomeStatsBar";
import FeaturedProject from "@/components/FeaturedProject";
import QuoteCarousel from "@/components/QuoteCarousel";
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

  // Let's pick a random high profile mod or project as the featured project
  const featuredProject = mods.length > 0 ? mods[0] : (videos.length > 0 ? videos[0] : null);

  const news = await prisma.news.findMany({ include: { author: true }, orderBy: { createdAt: 'desc' }, take: 4 });
  const team = await prisma.teamMember.findMany({ include: { user: true }, orderBy: { createdAt: 'asc' } });

  return (
    <main className="flex flex-col min-h-screen bg-dublio-dark text-white selection:bg-dublio-purple/30">
      <Navbar />
      <QuoteCarousel />

      <HeroSection />
      
      <HomeStatsBar />

      <HomeNews news={news} />

      <VideoProjects projects={videos} />
      
      <FeaturedProject featuredProject={featuredProject} />

      <ProjectsSection mods={mods} />

      <HomeTeam teamMembers={team} />

      <HomeFooter />
    </main>
  );
}
