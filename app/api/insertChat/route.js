import { auth, app, db } from "@/app/firebase/config";

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";


export async function POST(req, res) {
    try {
        const userInput = await req.json();

        // console.log(`Received user input part 2: ${userInput.prompt.user}`);
        const userResponse = userInput.prompt.user;
        const chatGptResponse = userInput.prompt.ChatGPT;
        const dateOfMsg = userInput.prompt.date;
        const email = userInput.prompt.email;

        const emailsCollection = collection(db, "/emails");
        const emailCollection = doc(emailsCollection, email);
        const days = collection(emailCollection, "/days");
        const specificDay = doc(days, dateOfMsg);

        setDoc(emailCollection, {});
        // setDoc(specificDay, {});

        const newObject = {user: userResponse, ChatGPT: chatGptResponse};

        const specificDaySnapshot = await getDoc(specificDay);

        // if (specificDaySnapshot.exists()) {
        //   console.log("Multiple entries found");
        //   const currentEntries = specificDaySnapshot.data()?.entries || [];
        //   currentEntries.push(newObject);
        //   setDoc(specificDay, {entries: currentEntries});
        // } else {
        //   console.log("One entry only");
        //   setDoc(specificDay, {entries: [newObject]});
        // }
        if (specificDaySnapshot.exists()) {
            console.log("Multiple entries found");
            await updateDoc(specificDay, {
                entries: arrayUnion(newObject),
            });
        } else {
            console.log("One entry found");
            setDoc(specificDay, {entries: [newObject]});
        }

        return new Response("Chats have been added", { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return Response.error({ error: "Internal Server Error" });
    }
}