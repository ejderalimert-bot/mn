import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let rooms = await (prisma as any).voiceRoom.findMany({ orderBy: { createdAt: 'asc' } });
    
    // Create default rooms if empty
    if (rooms.length === 0) {
      await (prisma as any).voiceRoom.createMany({
        data: [
          { name: "Genel Lobi" },
          { name: "Dublaj Odası" },
          { name: "Kayıt Odası" },
          { name: "AFK" }
        ]
      });
      rooms = await (prisma as any).voiceRoom.findMany({ orderBy: { createdAt: 'asc' } });
    }

    // Filter out inactive members from rooms (lastSeen > 10s ago)
    const now = Date.now();
    const updatedRooms = [];
    
    for (const room of rooms) {
      let changed = false;
      let members = [];
      try {
        members = JSON.parse(room.members);
      } catch(e) {}
      
      const activeMembers = members.filter((m: any) => now - m.lastSeen < 15000);
      
      if (activeMembers.length !== members.length) {
        await (prisma as any).voiceRoom.update({
          where: { id: room.id },
          data: { members: JSON.stringify(activeMembers) }
        });
        changed = true;
      }
      
      updatedRooms.push({
        ...room,
        members: changed ? JSON.stringify(activeMembers) : room.members
      });
    }

    return NextResponse.json({ rooms: updatedRooms });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
