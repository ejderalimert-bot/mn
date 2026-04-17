import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const targetUserId = searchParams.get('targetUserId');

    if (!targetUserId) {
        return NextResponse.json({ error: "Hedef kullanıcı gerekli" }, { status: 400 });
    }

    const currentUser: any = await (prisma.user as any).findUnique({ where: { email: session.user.email as string } });
    if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Fetch messages between these two users
    // @ts-ignore
    const messages = await (prisma.message as any).findMany({
        where: {
            OR: [
                { senderId: currentUser.id, receiverId: targetUserId },
                { senderId: targetUserId, receiverId: currentUser.id }
            ]
        },
        orderBy: {
            createdAt: 'asc'
        }
    });

    // Format for widget
    const formattedMessages = messages.map((m: any) => ({
       id: m.id,
       text: m.content,
       isMe: m.senderId === currentUser.id,
       time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));

    return NextResponse.json({ messages: formattedMessages });
  } catch (error) {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function POST(req: Request) {
    try {
      const session = await auth();
      if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const { targetUserId, text } = await req.json();
      if (!targetUserId || !text) return NextResponse.json({ error: "Meksik" }, { status: 400 });
  
      const currentUser: any = await (prisma.user as any).findUnique({ where: { email: session.user.email as string } });
      if (!currentUser) return NextResponse.json({ error: "Oturum hatası" }, { status: 401 });
  
      // Optional: Verify if they are friends
      
      // Create message in Neon DB
      // @ts-ignore
      const message = await (prisma.message as any).create({
          data: {
              senderId: currentUser.id,
              receiverId: targetUserId,
              content: text
          }
      });
  
      const formatted = {
          id: message.id,
          text: message.content,
          isMe: true, // For sender
          time: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
  
      return NextResponse.json({ success: true, message: formatted });
    } catch (err) {
      return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
    }
  }
