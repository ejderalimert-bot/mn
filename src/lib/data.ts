import { prisma } from './prisma';

export async function getProjects() {
  try {
    const projects = await prisma.project.findMany({ orderBy: { id: 'desc' } });
    return projects.map((p: any) => ({
      ...p,
      gallery: p.gallery ? JSON.parse(p.gallery) : [],
      tags: p.tags ? JSON.parse(p.tags) : [],
      audioDemos: p.audioDemos ? JSON.parse(p.audioDemos) : [],
      videoDemos: p.videoDemos ? JSON.parse(p.videoDemos) : []
    }));
  } catch (e) {
    console.error("Failed to fetch projects from DB:", e);
    return [];
  }
}
