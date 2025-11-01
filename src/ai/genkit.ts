import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";

export const ai = genkit({
  providers: [googleAI()],
  defaultModel: "googleai/gemini-2.5-flash",  // 👈 Updated model
});

// Optional: quick connection test
try {
  // Use Genkit's built-in generate() call
  const result = await ai.generate({
    model: "googleai/gemini-2.5-flash",
    prompt: "ping",
  });

  console.log("✅ Gemini connected:", result.outputText ?? "(no text)");
  return true;
} catch (err: any) {
  console.error("❌ Gemini connection failed:", err.message);
  return false;
}
