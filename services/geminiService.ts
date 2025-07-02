import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Use Vite environment variable for Gemini API key
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const systemInstruction = `You are a helpful and compassionate AI health assistant from SmartHealth.
Your goal is to provide preliminary insights based on user-provided symptoms.
Analyze the symptoms and provide:
1. A brief, easy-to-understand summary of what the symptoms might suggest.
2. A list of potential, general causes (not a diagnosis).
3. A list of suggested next steps, such as lifestyle adjustments, things to monitor, or when to see a doctor.
4. IMPORTANT: Always end your response with a clear disclaimer: "This is not medical advice. Please consult with a healthcare professional for an accurate diagnosis and treatment plan."
Structure your response using markdown for clarity (e.g., headings, bullet points). Do not use \`\`\`json ... \`\`\` markdown.
`;

// This function will now handle the case where the API key is not present gracefully.
export async function getSymptomAnalysis(symptoms: string): Promise<AsyncGenerator<GenerateContentResponse>> {
  
  // This is the mock data fallback for the demo environment.
  async function* mockStream(): AsyncGenerator<GenerateContentResponse> {
      await new Promise(res => setTimeout(res, 500));
      const mockResponse = `
### Preliminary Symptom Analysis

Based on your description of a "throbbing headache and sensitivity to light", here are some potential insights:

### Potential Causes Could Include:
*   Migraines
*   Tension headaches
*   Dehydration
*   Eye strain from screens

### Suggested Next Steps:
*   Rest in a quiet, dark room.
*   Apply a cold compress to your forehead.
*   Ensure you are drinking plenty of water.
*   Take a break from screens if you've been using them for a long time.

---
**Disclaimer:** This is not medical advice. Please consult with a healthcare professional for an accurate diagnosis and treatment plan.
  `;
      for (const char of mockResponse) {
          await new Promise(res => setTimeout(res, 5));
          const mockChunk = { text: char } as unknown;
          yield mockChunk as GenerateContentResponse;
      }
  }

  // If there's no API key, immediately return the mock stream without trying to initialize the library.
  if (!API_KEY) {
    return mockStream();
  }

  try {
    // Only initialize the AI client if there is an API key. This prevents the crash.
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const responseStream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash-preview-04-17",
      contents: symptoms,
      config: {
        systemInstruction: systemInstruction,
      }
    });
    return responseStream;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // If the API call fails for any other reason, it will throw an error.
    throw new Error("Failed to get analysis from AI. Please try again later.");
  }
}
