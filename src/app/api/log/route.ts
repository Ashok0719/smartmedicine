export const runtime = 'nodejs';
import { NextResponse } from "next/server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { medicineId, status } = await req.json();

    if (!medicineId || !status) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const userId = (session.user as any).id;
    
    const log = await prisma.log.create({
      data: {
        userId,
        medicineId,
        status, // taken, missed, skipped
      },
    });

    return NextResponse.json(log, { status: 201 });
  } catch (error: any) {
    console.error("PRISMA_LOG_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = (session.user as any).id;
    const logs = await prisma.log.findMany({
      where: { userId },
      orderBy: { timestamp: "desc" },
      take: 50,
      include: {
        medicine: true,
      },
    });

    return NextResponse.json(logs);
  } catch (error: any) {
    console.error("PRISMA_GET_LOGS_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
