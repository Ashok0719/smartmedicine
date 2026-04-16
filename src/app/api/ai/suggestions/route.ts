import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = (session.user as any).id;

    // Fetch logs from Firestore
    const logsRef = collection(db, "logs");
    const logsQuery = query(
      logsRef, 
      where("userId", "==", userId), 
      where("status", "==", "missed"),
      orderBy("timestamp", "desc"),
      limit(20)
    );
    const logsSnapshot = await getDocs(logsQuery);

    const medsRef = collection(db, "medicines");
    const medsQuery = query(medsRef, where("userId", "==", userId));
    const medsSnapshot = await getDocs(medsQuery);

    let suggestions = [];

    if (logsSnapshot.size > 5) {
      suggestions.push({
        title: "Dose Timing Optimization",
        description: "We noticed you often miss your early doses. Moving them by 30 minutes might improve your adherence.",
        type: "schedule"
      });
    }

    if (medsSnapshot.size > 3) {
      suggestions.push({
        title: "Simplify Routine",
        description: "You have several medications. Ask your pharmacist if any can be combined to reduce total doses.",
        type: "health"
      });
    }

    if (suggestions.length === 0) {
      suggestions.push({
        title: "Stay Consistent!",
        description: "You're doing a great job following your schedule. Keep it up!",
        type: "praise"
      });
    }

    return NextResponse.json(suggestions);
  } catch (error: any) {
    console.error("AI_SUGGESTIONS_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
