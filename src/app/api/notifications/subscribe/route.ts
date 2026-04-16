import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { db } from "@/lib/firebase";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  setDoc,
  doc,
  Timestamp 
} from "firebase/firestore";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const subscription = await req.json();

    if (!subscription.endpoint || !subscription.keys?.p256dh || !subscription.keys?.auth) {
      return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
    }

    const userId = (session.user as any).id;
    
    // Use endpoint as a unique key (base64 encoded perhaps, or just search)
    const subsRef = collection(db, "subscriptions");
    const q = query(subsRef, where("endpoint", "==", subscription.endpoint));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      await addDoc(subsRef, {
        userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        createdAt: Timestamp.now(),
      });
    } else {
      const docId = snapshot.docs[0].id;
      await setDoc(doc(db, "subscriptions", docId), {
        userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        updatedAt: Timestamp.now(),
      }, { merge: true });
    }

    return NextResponse.json({ message: "Subscribed successfully" });
  } catch (error: any) {
    console.error("FIREBASE_SUBSCRIBE_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
