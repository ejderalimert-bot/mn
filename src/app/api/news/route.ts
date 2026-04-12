import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParams = searchParams.get('limit');
    
    let args: any = {
      include: { author: { select: { name: true, image: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    };
    if (limitParams) args.take = parseInt(limitParams);

    const news = await prisma.news.findMany(args);
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    // Find author by email
    const author = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!author) return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    
    const { title, content, image, video } = await request.json();
    if (!title || !content) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const newsData = await prisma.news.create({
      data: {
        title,
        content,
        image: image || null,
        video: video || null,
        authorId: author.id
      },
      include: { author: true }
    });
    return NextResponse.json(newsData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to post news' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    await prisma.news.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 });
  }
}
