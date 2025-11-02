import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";

export const ai = genkit({
  providers: [googleAI()],
  defaultModel: "gemini-2.5-flash",
});

export async function testAIConnection(): Promise<boolean> {
  try {
    const result = await ai.generate({
      model: "gemini-2.5-flash",
      prompt: "ping",
    });

    console.log("✅ Gemini connected:", result.outputText ?? "(no text)");
    return true;
  } catch (err) {
    console.error("❌ Gemini connection failed:", err instanceof Error ? err.message : err);
    return false;
  }
}
testAIConnection()
