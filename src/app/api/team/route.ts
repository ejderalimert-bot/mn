import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'users') {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        include: { teamMember: true }
      });
      return NextResponse.json(users);
    }
    
    // Default to 'team'
    const team = await prisma.teamMember.findMany({
      include: { user: true },
      orderBy: { createdAt: 'asc' }
    });
    return NextResponse.json(team);
    
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch team data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId, roleTitle } = await request.json();
    if (!userId || !roleTitle) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const member = await prisma.teamMember.upsert({
      where: { userId },
      update: { roleTitle },
      create: { userId, roleTitle }
    });
    return NextResponse.json(member);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    await prisma.teamMember.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to remove team member' }, { status: 500 });
  }
}
