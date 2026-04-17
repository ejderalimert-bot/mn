import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser: any = await (prisma.user as any).findUnique({
      where: { email: session.user.email as string },
      // @ts-ignore - VSCode might not have picked up generated Prisma client yet
      include: {
        userFriends: {
          include: { friend: { select: { id: true, name: true, username: true, image: true } } }
        },
        friendUsers: {
          include: { user: { select: { id: true, name: true, username: true, image: true } } }
        }
      }
    }) as any;

    if (!currentUser) return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });

    // Both sent requests and received requests
    const friendsList = [
      ...(currentUser.userFriends || []).map((f: any) => ({ ...f, type: 'sent', profile: f.friend })),
      ...(currentUser.friendUsers || []).map((f: any) => ({ ...f, type: 'received', profile: f.user }))
    ];

    return NextResponse.json({ friends: friendsList, self: { id: currentUser.id, username: currentUser.username } });
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

    const { targetUsername } = await req.json();
    if (!targetUsername) return NextResponse.json({ error: "Kullanıcı adı gerekli" }, { status: 400 });

    const currentUser: any = await (prisma.user as any).findUnique({ where: { email: session.user.email as string } });
    if (!currentUser) return NextResponse.json({ error: "Oturum hatası" }, { status: 401 });

    if (currentUser.username?.toLowerCase() === targetUsername.toLowerCase()) {
      return NextResponse.json({ error: "Kendinize istek yollayamazsınız!" }, { status: 400 });
    }

    // @ts-ignore
    const targetUser: any = await (prisma.user as any).findFirst({
      where: { username: { equals: targetUsername, mode: 'insensitive' } }
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Bu kullanıcı adına sahip kimse bulunamadı" }, { status: 404 });
    }

    // Check existing
    // @ts-ignore
    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { userId: currentUser.id, friendId: targetUser.id },
          { userId: targetUser.id, friendId: currentUser.id }
        ]
      }
    });

    if (existing) {
      return NextResponse.json({ error: "Zaten ekli veya istek beklemede!" }, { status: 400 });
    }

    // @ts-ignore
    const newFriendship = await prisma.friendship.create({
      data: {
        userId: currentUser.id,
        friendId: targetUser.id,
        status: "PENDING"
      }
    });

    return NextResponse.json({ success: true, message: "İstek başarıyla gönderildi!" });
  } catch (err) {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
    try {
      const session = await auth();
      if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
      const { friendshipId, status } = await req.json(); // status: 'ACCEPTED' or 'REJECTED'
      const currentUser: any = await (prisma.user as any).findUnique({ where: { email: session.user.email as string } });
      
      if (!currentUser) return NextResponse.json({ error: "Oturum hatası" }, { status: 401 });
  
      // @ts-ignore
      const friendship = await prisma.friendship.findUnique({ where: { id: friendshipId } });
      if (!friendship) return NextResponse.json({ error: "İstek bulunamadı" }, { status: 404 });
  
      if (friendship.friendId !== currentUser.id && friendship.userId !== currentUser.id) {
          return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
      }
  
      if (status === 'REJECTED') {
          // @ts-ignore
          await prisma.friendship.delete({ where: { id: friendshipId } });
          return NextResponse.json({ success: true, message: "İstek reddedildi/silindi" });
      }
  
      if (status === 'ACCEPTED') {
          // @ts-ignore
          await prisma.friendship.update({
              where: { id: friendshipId },
              data: { status: 'ACCEPTED' }
          });
          return NextResponse.json({ success: true, message: "İstek kabul edildi" });
      }
  
      return NextResponse.json({ error: "Geçersiz işlem" }, { status: 400 });
    } catch (err) {
      return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
    }
}
