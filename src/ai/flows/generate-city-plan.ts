'use server';

/**
 * @fileOverview Generates a comprehensive city plan including a visual map layout.
 *
 * - generateCityPlan - A function that takes terrain analysis and city parameters
 *                        to generate a full city plan with map data.
 */

import { ai } from '@/ai/genkit';
import { GenerateCityPlanInputSchema, GenerateCityPlanOutputSchema, type GenerateCityPlanInput, type GenerateCityPlanOutput } from '@/ai/schemas';
import { imageFromBuffer } from "@genkit-ai/media";

function base64ToBytes(data: string): Uint8Array {
  const cleaned = data.replace(/^data:image\/[a-zA-Z+]+;base64,/, "");
  return Uint8Array.from(Buffer.from(cleaned, "base64"));
}

export async function generateCityPlan(
  base64Image: string,
  input: GenerateCityPlanInput
): Promise<GenerateCityPlanOutput> {

  let mediaArray = [];

  if (base64Image) {
    const bytes = base64ToBytes(base64Image);

    const img = await imageFromBuffer(bytes, {
      mimeType: "image/png", // or detect dynamically
    });

    mediaArray.push(img);
  }

  // Now call the flow with media attached
  return generateCityPlanFlow(input, { media: mediaArray });
}

const prompt = ai.definePrompt({
  name: 'generateCityPlanPrompt',
  input: { schema: GenerateCityPlanInputSchema },
  output: { schema: GenerateCityPlanOutputSchema },
  prompt: `
    Create a detailed city plan for a population of {{{population}}} with budget ₹{{{budget}}}.
    The zone distribution is: {{{zoneDistribution}}}.
    Special requirements: {{{specialRequirements}}}.
    The terrain analysis is: {{{terrainAnalysis}}}.

    Return ONLY pure JSON in this EXACT format, without any other text or markdown.
    Ensure all zone polygons are closed (first and last coordinates are identical).

    {
      "mapData": {
        "roads": [
          {"type": "highway", "coordinates": [[10,20], [30,40], [50,60]], "reason": "Explain why this route was chosen"},
          {"type": "arterial", "coordinates": [[15,25], [35,45]], "reason": "Explain arterial road placement"},
          {"type": "local", "coordinates": [[30,10], [30,90]], "reason": "Local road for residential access"}
        ],
        "zones": [
          {"type": "residential", "coordinates": [[0,0], [40,0], [40,40], [0,40], [0,0]], "density": "medium", "reason": "Explain residential zone location."},
          {"type": "commercial", "coordinates": [[40,0], [80,0], [80,40], [40,40], [40,0]], "reason": "Explain commercial zone location."},
          {"type": "industrial", "coordinates": [[0,40], [40,40], [40,80], [0,80], [0,40]], "reason": "Explain industrial zone location."}
        ],
        "infrastructure": [
          {"type": "power_plant", "coordinates": [70,70], "capacity": "150MW", "reason": "Explain power plant location"},
          {"type": "water_treatment", "coordinates": [20,70], "reason": "Explain water plant location"},
          {"type": "hospital", "coordinates": [50,20], "reason": "Explain hospital location"}
        ]
      },
      "report": {
        "budgetBreakdown": {
          "landAcquisition": "₹200 Cr",
          "roadConstruction": "₹350 Cr",
          "buildingConstruction": "₹300 Cr",
          "utilities": "₹150 Cr",
          "materials": {
            "concrete": "75,000 cubic meters",
            "steel": "15,000 tons",
            "pipes": "200km"
          }
        },
        "timeline": {
          "phase1": "6 months - Land development and basic infrastructure.",
          "phase2": "12 months - Road network and utilities.",
          "phase3": "18 months - Building construction and finishing."
        }
      }
    }
    `,
});

const generateCityPlanFlow = ai.defineFlow(
  {
    name: "generateCityPlanFlow",
    inputSchema: GenerateCityPlanInputSchema,
    outputSchema: GenerateCityPlanOutputSchema,
    media: true, // 🔥 enables media support in this flow
  },
  async (input, { media }) => {
    // Build the prompt text exactly like before
    const builtPrompt = prompt.build(input);

    // Run Gemini with prompt + media
    const { output, usage } = await gemini25Flash.generate({
      prompt: builtPrompt,
      media: media && media.length > 0 ? media : undefined,
    });

    // Logging & fallback behavior (your original code)
    if (!output) {
      console.error("AI response was null or undefined.");
      console.error("Token usage:", usage);
    } else if (!output.mapData || !output.report) {
      console.warn(
        "AI response is missing mapData or report.",
        JSON.stringify(output, null, 2)
      );
    }

    return output!;
  }
);

