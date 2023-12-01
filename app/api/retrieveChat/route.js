import { auth, app, db } from "@/app/firebase/config";

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  getDocs,
} from "firebase/firestore";

export const dynamic = "force-dynamic";

export async function GET(req, res) {
  try {
    console.log("Got to the the get function");
    const temp = [];

    const email = req.headers.get("Content-Type");
    // const email = "skarn5@uic.edu";

    const emailsCollection = collection(db, "/emails");
    const emailCollection = doc(emailsCollection, email);
    const days = collection(emailCollection, "/days");

    const daysSnapshot = await getDocs(days);

    daysSnapshot.forEach((doc) => {
      const date = doc.id;
      const entries = doc.data().entries;
      temp.push({ date: date, messages: entries });
    });

    return new Response(JSON.stringify(temp), {
      status: 200,
    });
  } catch (error) {
    console.error("Error:", error);
    return Response.error({ error: "Internal Server Error" });
  }
}
