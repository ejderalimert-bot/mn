import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  try {
    if (userId) {
      const favs = await prisma.favorite.findMany({ where: { userId } });
      return NextResponse.json(favs.map((f: any) => f.projectId));
    }
    
    const allFavs = await prisma.favorite.findMany();
    // Return mapping { userId: [projectId, ...] }
    const result: any = {};
    for (const f of allFavs) {
      if (!result[f.userId]) result[f.userId] = [];
      result[f.userId].push(f.projectId);
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({});
  }
}

export async function POST(request: Request) {
  try {
    const body: any = await request.json();
    const userId = body.userId;
    const projectId = body.projectId;
    const action = body.action;
    if (!userId || !projectId) {
       return NextResponse.json({ error: 'Missing info' }, { status: 400 });
    }

    if (action === 'add') {
      const proj = await prisma.project.findUnique({ where: { id: projectId }});
      if (proj) {
        await prisma.favorite.upsert({
          where: { userId_projectId: { userId, projectId } },
          create: { userId, projectId },
          update: { userId }
        });
      }
    } else if (action === 'remove') {
      await prisma.favorite.delete({
        where: { userId_projectId: { userId, projectId } }
      }).catch(() => {});
    }
    
    const latestFavs = await prisma.favorite.findMany({ where: { userId } });
    return NextResponse.json(latestFavs.map((f: any) => f.projectId));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update favorites' }, { status: 500 });
  }
}
