import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Total Accounts Created (Users table from PrismaAdapter)
    const totalAccounts = await (prisma as any).user.count();

    // 2. Active Users (Seen in the last 1 minute)
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const activeUsers = await (prisma as any).activeUser.count({
      where: { lastSeen: { gt: oneMinuteAgo } }
    });

    // 3. Projects Aggregates (Views, Downloads)
    const projects = await prisma.project.findMany({
      select: { views: true, downloads: true }
    });
    let totalViews = 0;
    let totalDownloads = 0;
    projects.forEach(p => {
      totalViews += parseInt(p.views) || 0;
      totalDownloads += parseInt(p.downloads) || 0;
    });

    // 4. Monthly visits (PageView) - Aggregate by month for the current year
    const currentYear = new Date().getFullYear();
    const pageViews = await (prisma as any).pageView.findMany({
      where: {
        createdAt: {
          gte: new Date(`${currentYear}-01-01`),
          lte: new Date(`${currentYear}-12-31`)
        }
      },
      select: { createdAt: true }
    });

    const monthlyTraffic = Array(12).fill(0);
    // @ts-ignore
    pageViews.forEach((v: any) => {
      const monthIndex = v.createdAt.getMonth();
      monthlyTraffic[monthIndex]++;
    });

    return NextResponse.json({
      totalAccounts,
      activeUsers,
      totalViews,
      totalDownloads,
      monthlyTraffic
    });
  } catch (error) {
    return NextResponse.json({ error: 'Analytics fetch failed' }, { status: 500 });
  }
}

// Global hook to track page views
export async function POST(request: Request) {
  try {
    const { path } = await request.json();
    await (prisma as any).pageView.create({
      data: { path: path || '/' }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
