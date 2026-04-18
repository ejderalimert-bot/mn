import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { roomId, peerId, profile } = await req.json();
    if (!roomId) return NextResponse.json({ error: "Room ID required" }, { status: 400 });

    const room = await (prisma as any).voiceRoom.findUnique({ where: { id: roomId } });
    if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

    let members = [];
    try {
      members = JSON.parse(room.members);
    } catch (e) {}

    const now = Date.now();
    
    // Remove if already exists to update lastSeen and peerId
    members = members.filter((m: any) => m.userId !== session.user.id && (now - m.lastSeen < 15000));
    
    if (peerId) {
       // Join logic (update heartbeat)
       members.push({
         userId: session.user.id,
         username: profile?.username || session.user.name || "User",
         image: profile?.image,
         peerId,
         lastSeen: now,
       });
    }

    await (prisma as any).voiceRoom.update({
      where: { id: roomId },
      data: { members: JSON.stringify(members) }
    });

    return NextResponse.json({ success: true, members });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
