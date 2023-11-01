import openai from "openai";

const apiUrl = process.env.API_URL;
const apiKey = process.env.API_KEY;

// openai.apiKey = apiKey;

const openaiInstance = new openai.OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  try {
    const { userInput } = req.body;

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

    res.status(200).json({ text: chatGptResponse });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// export default async function handler(req, res) {
//   try {
//     console.log("Received request at /response");

//     const response = await openaiInstance.chat.completions.create({
//       messages: [{ role: "system", content: "You are a helpful assistant." }],
//       model: "gpt-3.5-turbo",
//     });

//     console.log("responses", response.choices[0].message);
//     res.status(200).json({ text: response.choices[0].message.content });
//   } catch (error) {
//     console.error("error", error);
//     res.status(500).json({ error: error.message });
//   }
// }
