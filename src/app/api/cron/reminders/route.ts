import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import webpush from "web-push";
import { Resend } from "resend";
import { format } from "date-fns";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    // Initialize webpush inside handler to avoid build-time env errors
    if (process.env.VAPID_SUBJECT) {
      webpush.setVapidDetails(
        process.env.VAPID_SUBJECT,
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
        process.env.VAPID_PRIVATE_KEY!
      );
    }
    const now = new Date();
    const currentTimeStr = format(now, "HH:mm");

    // 1. Get all medicines that match the current time
    const medicinesRef = collection(db, "medicines");
    const querySnapshot = await getDocs(medicinesRef);
    
    // Filtering complex nested structures is better done in code for small scales or specific time slots
    const medicinesToRemind = querySnapshot.docs.filter(doc => {
      const data = doc.data();
      return data.schedules && data.schedules.some((s: any) => s.time === currentTimeStr);
    });

    for (const medDoc of medicinesToRemind) {
      const med = medDoc.data();
      const userId = med.userId;

      // Fetch user subscriptions
      const subsRef = collection(db, "subscriptions");
      const subQuery = query(subsRef, where("userId", "==", userId));
      const subSnapshot = await getDocs(subQuery);

      for (const subDoc of subSnapshot.docs) {
        const sub = subDoc.data();
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth
              }
            },
            JSON.stringify({
              title: "Time for your medicine",
              body: `Don't forget to take ${med.dosage} of ${med.name}`,
              url: "/dashboard"
            })
          );
        } catch (err) {
          console.error(`Failed to send push for user ${userId}`, err);
        }
      }

      // Note: For email, we would need to fetch the user's email.
      // In a real app, I'd have a 'users' collection with email info.
      // Since Auth is still Prisma for now, I'd need a way to link or move user data to Firestore.
      // I'll skip email for the cron for now or assume user data is in Firestore.
    }

    return NextResponse.json({ 
      success: true, 
      processed: medicinesToRemind.length 
    });
  } catch (error: any) {
    console.error("CRON_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
