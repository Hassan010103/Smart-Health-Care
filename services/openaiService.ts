// This function uses Puter.js to call Gemini 2.0 Flash for free, no API key needed.
declare const puter: any;

export async function getSymptomAnalysis(symptoms: string): Promise<string> {
  if (typeof window === "undefined" || typeof (window as any).puter === "undefined") {
    throw new Error("Puter.js is not loaded. Make sure <script src='https://js.puter.com/v2/'></script> is in your index.html.");
  }

  const systemPrompt = `You are a helpful and compassionate AI health assistant from SmartHealth.\nAnalyze the following symptoms and provide:\n1. A brief, easy-to-understand summary of what the symptoms might suggest.\n2. A list of potential, general causes (not a diagnosis).\n3. A list of suggested next steps, such as lifestyle adjustments, things to monitor, or when to see a doctor.\n4. IMPORTANT: Always end your response with a clear disclaimer: \"This is not medical advice. Please consult with a healthcare professional for an accurate diagnosis and treatment plan.\"\nStructure your response using markdown for clarity (e.g., headings, bullet points).`;

  const prompt = `${systemPrompt}\n\nSymptoms: ${symptoms}`;

  // Use Gemini 2.0 Flash Lite (fast, free, reliable)
  const response = await (window as any).puter.ai.chat(prompt, {
    model: 'google/gemini-2.0-flash-lite-001'
  });

  // The response is in response.message.content
  return response?.message?.content || "No response from AI.";
} 