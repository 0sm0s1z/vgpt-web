import { Configuration, OpenAIApi } from "openai";

// Instantiate OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  const { messages } = req.body;
  console.log(messages);

  try {
    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
    });

    return res.json({
      message: chatCompletion?.data?.choices[0]?.message?.content ?? "",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error completing chat" });
  }
}
