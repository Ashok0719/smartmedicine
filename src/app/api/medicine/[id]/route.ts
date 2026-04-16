export const runtime = 'nodejs';
import { NextResponse } from "next/server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const medicine = await prisma.medicine.findUnique({
      where: { id },
    });

    if (!medicine) {
      return NextResponse.json({ error: "Medicine not found" }, { status: 404 });
    }

    if (medicine.userId !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.medicine.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Medicine deleted" });
  } catch (error: any) {
    console.error("PRISMA_DELETE_MEDICINE_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
