import { GoogleGenAI } from "@google/genai";
const API_KEY = "AIzaSyDOgki2mGoRjpw95bxY1J6H56agnB4JzJ8";
async function testGemini() {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-pro", // <-- FIXED
    contents: "Say hello in a friendly way.",
  });
  console.log(response);
}
testGemini().catch(console.error);