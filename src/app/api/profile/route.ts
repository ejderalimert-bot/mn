import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, image, publicFavorites } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        name: name !== undefined ? name : undefined,
        image: image !== undefined ? image : undefined,
        publicFavorites: publicFavorites !== undefined ? publicFavorites : undefined
      }
    });

    if (name !== undefined || image !== undefined) {
      await prisma.comment.updateMany({
        where: { userId: session.user.id },
        data: {
          ...(name !== undefined ? { userName: name } : {}),
          ...(image !== undefined ? { userAvatar: image } : {})
        }
      });
    }

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: error.message || "Failed to update profile" }, { status: 500 });
  }
}
