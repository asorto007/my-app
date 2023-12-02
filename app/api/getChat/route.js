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

    return Response.json({ text: chatGptResponse });
  } catch (error) {
    console.error("Error:", error);
    return Response.error({ error: "Internal Server Error" });
  }
}
