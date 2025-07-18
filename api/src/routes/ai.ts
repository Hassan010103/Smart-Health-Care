import express from "express";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

const API_KEY = process.env.GEMINI_API_KEY || "";

router.post("/symptom-check", async (req, res) => {
  const { symptoms } = req.body;
  if (!API_KEY) return res.status(500).json({ error: "No Gemini API key" });
  if (!symptoms) return res.status(400).json({ error: "Missing symptoms" });

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const systemPrompt = `You are a helpful and compassionate AI health assistant from SmartHealth.\nAnalyze the following symptoms and provide:\n1. A brief, easy-to-understand summary of what the symptoms might suggest.\n2. A list of potential, general causes (not a diagnosis).\n3. A list of suggested next steps, such as lifestyle adjustments, things to monitor, or when to see a doctor.\n4. IMPORTANT: Always end your response with a clear disclaimer: \"This is not medical advice. Please consult with a healthcare professional for an accurate diagnosis and treatment plan.\"\nStructure your response using markdown for clarity (e.g., headings, bullet points).`;

    const response = await ai.models.generateContent({
      model: "gemini-pro",
      contents: [
        systemPrompt + "\n\nSymptoms: " + symptoms
      ]
    });
    const content = response.candidates?.[0]?.content || "No response";
    res.json({ result: content });
  } catch (e) {
    console.error("Gemini proxy error:", e);
    res.status(500).json({ error: "AI error" });
  }
});

export default router; 