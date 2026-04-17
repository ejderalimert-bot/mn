import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET profile
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email;
    // @ts-ignore
    const dbUser: any = await (prisma.user as any).findUnique({
      where: { email: email as string },
      select: { id: true, name: true, email: true, image: true, username: true }
    });

    return NextResponse.json(dbUser);
  } catch (error) {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

// UPDATE profile (set username)
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { username } = body;

    if (!username || username.length < 3) {
      return NextResponse.json({ error: "Kullanıcı adı en az 3 karakter olmalı" }, { status: 400 });
    }

    // Check if username already exists
    // @ts-ignore
    const existing: any = await (prisma.user as any).findFirst({
      where: { 
        username: { equals: username, mode: 'insensitive' },
        NOT: { email: session.user.email as string }
      }
    });

    if (existing) {
      return NextResponse.json({ error: "Aboo! Bu kullanıcı adı çoktan alınmış." }, { status: 400 });
    }

    const email = session.user.email;
    
    // Update user
    // @ts-ignore
    const updated: any = await (prisma.user as any).update({
      where: { email: email as string },
      data: { username }
    });

    return NextResponse.json({ success: true, username: updated.username });
  } catch (error) {
    return NextResponse.json({ error: "Kullanıcı kayıt edilemedi." }, { status: 500 });
  }
}
