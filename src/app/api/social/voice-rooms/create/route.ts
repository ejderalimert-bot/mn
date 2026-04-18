import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { roomName } = await req.json();
    if (!roomName) return NextResponse.json({ error: "Room name required" }, { status: 400 });

    let room = await (prisma as any).voiceRoom.findUnique({ where: { name: roomName } });
    if (!room) {
        room = await (prisma as any).voiceRoom.create({
            data: { name: roomName }
        });
    }

    return NextResponse.json({ room });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
