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
  //console.log({ base64Image, input })
  return generateCityPlanFlow({base64Image, ...input});
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

export const generateCityPlanFlow = ai.defineFlow(
  {
    name: "generateCityPlanFlow",
    inputSchema: GenerateCityPlanInputSchema,
    outputSchema: GenerateCityPlanOutputSchema,
  },
  async (input) => {
    const {
      base64Image,
      population,
      budget,
      zoneDistribution,
      specialRequirements,
      terrainAnalysis,
    } = input;

    // Build the raw text prompt
    const textPrompt = `You are a URBAN PLANNING AI ASSISTANT your task is to 
Create a detailed city plan for a population of ${population} with budget ₹${budget}.
The zone distribution percentages is: ${zoneDistribution}.
Special requirements: ${specialRequirements}.
The terrain analysis is: ${terrainAnalysis}.

## The Assistant shall use the attached photo as a height map of the a region and make his report according to it

## CRITICAL PRINCIPLES:
- **Return ONLY pure JSON** - no markdown, no explanations, no additional text
- **STRICT ADHERENCE** to the exact JSON schema below
- **ALL polygons MUST be closed** (first coordinate = last coordinate)
- You MAY create polygon-shaped zones with ANY number of edges (minimum 3) and Polygons can be irregular to fit the landscape and maximize the area. Each zone must be a CLOSED polygon (first and last coordinates identical). Zone shapes should follow natural contours from the terrain image
- You must follow the Zone Distribution Percentages covering the whole area of the map is not required and must not be forced(ie the persentages are only applicable for the area which comes under the slope limitation rest area is left vacant) but the ratios must be preserved error in this shall come under 10%
- DO NOT place zones or infrastructure on slopes >15% gradient (use image height data)
- Place residential zones on flat, stable terrain

## SUGGESTIONS  
- Hospitals: Centrally located with emergency access routes
- Schools/Parks: Distributed evenly in residential zones
- Highways: Connect major zones with gentle gradients (<6%)
- Roads should follow contour lines to minimize excavation
- Preserve natural drainage and Minimize cut-and-fill earthworks


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
`;

    // Call AI
    const { output, usage } = await ai.generate({
      prompt:[
        {media: { url: base64Image,
                },
        }, // Genkit supports data:image/... in URL
        {text: textPrompt},  
      ],
      output: { schema: GenerateCityPlanOutputSchema },
    });
    // Instead of throwing an error, we just return the (potentially incomplete) output.
    // The frontend action will handle validation.
    if (!output) {
      console.error('AI response was null or undefined.');
      console.error('Token usage:', usage);
    } else if (!output.mapData || !output.report) {
      console.warn('AI response is missing mapData or report.', JSON.stringify(output, null, 2));
    }

    return output!;
  }
);
