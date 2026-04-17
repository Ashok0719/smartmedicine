export const runtime = 'nodejs';
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  let userId = (session?.user as any)?.id;

  if (!userId) {
    const defaultUser = await prisma.user.findFirst({
      orderBy: { createdAt: 'asc' }
    });
    userId = defaultUser?.id;
    console.log("GUEST_MODE_ACTIVE", { userId, userName: defaultUser?.name });
  }

  if (!userId) {
    console.error("GET_MEDICINES_FAIL: No User Found");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const medicines = await prisma.medicine.findMany({
      where: { userId },
      include: {
        schedules: true,
      },
      orderBy: { createdAt: "desc" },
    });

    console.log(`GET_MEDICINES_SUCCESS: Found ${medicines.length} for user ${userId}`);
    return NextResponse.json(medicines);
  } catch (error: any) {
    console.error("PRISMA_GET_MEDICINES_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  let userId = (session?.user as any)?.id;

  if (!userId) {
    const defaultUser = await prisma.user.findFirst();
    userId = defaultUser?.id;
  }

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, dosage, frequency, startDate, endDate, schedules } = await req.json();

    if (!name || !dosage || !frequency || !schedules || schedules.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const medicine = await prisma.medicine.create({
      data: {
        userId,
        name,
        dosage,
        frequency,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        schedules: {
          create: schedules.map((time: string) => ({ time })),
        },
      },
      include: {
        schedules: true,
      },
    });

    return NextResponse.json(medicine, { status: 201 });
  } catch (error: any) {
    console.error("PRISMA_ADD_MEDICINE_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
