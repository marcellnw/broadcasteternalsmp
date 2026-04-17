import { GoogleGenerativeAI } from "@google/generative-ai";

export async function handleAiRequest(req: any, res: any) {
  const { message, systemPrompt } = req.body;

  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API Key not configured in environment variables." });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: systemPrompt || "You are a helpful assistant for EternalSMP."
    });

    const result = await model.generateContent(message);
    const response = await result.response;
    return res.json({ response: response.text() });

  } catch (error: any) {
    console.error("AI Error:", error);
    res.status(500).json({ error: error.message || "Failed to process AI request" });
  }
}
