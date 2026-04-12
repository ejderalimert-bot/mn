import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  try {
    if (userId) {
      const likes = await prisma.like.findMany({ where: { userId } });
      return NextResponse.json(likes.map((l: any) => l.projectId));
    }
    
    const allLikes = await prisma.like.findMany();
    // Return mapping { userId: [projectId, ...] }
    const result: any = {};
    for (const l of allLikes) {
      if (!result[l.userId]) result[l.userId] = [];
      result[l.userId].push(l.projectId);
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
        await prisma.like.upsert({
          where: { userId_projectId: { userId, projectId } },
          create: { userId, projectId },
          update: { userId }
        });
      }
    } else if (action === 'remove') {
      await prisma.like.delete({
        where: { userId_projectId: { userId, projectId } }
      }).catch(() => {});
    }
    
    const latestLikes = await prisma.like.findMany({ where: { userId } });
    return NextResponse.json(latestLikes.map((l: any) => l.projectId));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update likes' }, { status: 500 });
  }
}
