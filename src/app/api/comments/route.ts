import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');
  
  try {
    if (projectId) {
      const comments = await prisma.comment.findMany({ 
        where: { projectId }, 
        orderBy: { date: 'desc' } 
      });
      return NextResponse.json(comments);
    }
    
    // Group all comments dynamically matching legacy map pattern mapping ids structurally.
    const allComments = await prisma.comment.findMany({ orderBy: { date: 'desc' } });
    const result: any = {};
    for (const c of allComments) {
      if (!result[c.projectId]) result[c.projectId] = [];
      result[c.projectId].push(c);
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({});
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.projectId) return NextResponse.json({ error: 'projectId required' }, { status: 400 });
    
    const created = await prisma.comment.create({
      data: {
        projectId: body.projectId,
        userId: body.userId,
        userName: body.userName,
        userAvatar: body.userAvatar || null,
        text: body.text
      }
    });
    return NextResponse.json(created);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to post comment. Make sure the project exists.' }, { status: 500 });
  }
}
