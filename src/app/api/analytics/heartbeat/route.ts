import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json();
    if (!sessionId) return NextResponse.json({}, { status: 400 });

    await prisma.activeUser.upsert({
      where: { id: sessionId },
      update: { lastSeen: new Date() },
      create: { id: sessionId, lastSeen: new Date() }
    });

    // Cleanup very old inactive users randomly to keep DB small (older than 10 mins)
    if (Math.random() > 0.9) {
      const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000);
      await prisma.activeUser.deleteMany({
        where: { lastSeen: { lt: tenMinsAgo } }
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
