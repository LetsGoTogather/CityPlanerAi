import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";

export const ai = genkit({
  providers: [googleAI()],
  defaultModel: "googleai/gemini-2.5-flash",  // 👈 Updated model
});

// Optional: quick connection test
ai.prompt({ prompt: "ping" })
  .then(() => console.log("✅ Connected to Gemini 2.5 Flash"))
  .catch(err => console.error("❌ Gemini connection error:", err.message));
