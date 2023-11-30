import openai from "openai";
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

// const apiUrl = process.env.API_URL;
// const apiKey = process.env.API_KEY;

// openai.apiKey = apiKey;

const openaiInstance = new openai.OpenAI({
  apiKey: process.env.OPENAIAPI_KEY,
});

// export const runtime = "edge";

export async function POST(req, res) {
  try {
    const userInput = await req.json();
    // const { userInput } = body;
    // console.log("req", req);
    // console.log("userInput", req.body);
    console.log(`Received user input: ${userInput}`);

    const response = await openaiInstance.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for mental health.",
        },
        { role: "user", content: userInput },
      ],
      model: "gpt-3.5-turbo",
    });

    const chatGptResponse = response.choices[0].message.content;

    // const emailsCollection = collection(db, "/emails");
    // const email = "skarn5@uic.edu";
    // const emailCollection = doc(emailsCollection, email);
    // const days = collection(emailCollection, "/days");
    // const specificDay = doc(days, "2023-11-01");

    // setDoc(emailCollection, {});
    // setDoc(specificDay, {});

    // const newObject = {user: userInput, ChatGPT: chatGptResponse}

    // const specificDaySnapshot = await getDoc(specificDay);
    // if (specificDaySnapshot.exists()) {

    // }


    return Response.json({ text: chatGptResponse });
  } catch (error) {
    console.error("Error:", error);
    return Response.error({ error: "Internal Server Error" });
  }
}

// export default async function handler(req, res) {
// try {
//   const { userInput } = req.body;

//   console.log(`Received user input: ${userInput}`);

//   const response = await openaiInstance.chat.completions.create({
//     messages: [
//       {
//         role: "system",
//         content: "You are a helpful assistant for mental health.",
//       },
//       { role: "user", content: userInput },
//     ],
//     model: "gpt-3.5-turbo",
//   });

//   const chatGptResponse = response.choices[0].message.content;

//   res.status(200).json({ text: chatGptResponse });
// } catch (error) {
//   console.error("Error:", error);
//   res.status(500).json({ error: "Internal Server Error" });
// }
// }
