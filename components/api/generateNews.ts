import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req, res) {
  const ai = new GoogleGenAI({
    apiKey: process.env.API_KEY,
  });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: req.body.prompt,
    config: req.body.config,
  });

  res.status(200).json(response);
}
