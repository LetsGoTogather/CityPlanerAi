'use server';
import { GoogleGenerativeAI } from "@google/generative-ai";

import type { CityParams, FullReport, MapData, Simulation, CityPlan } from '@/lib/types';
import { generateCityPlan } from '@/ai/flows/generate-city-plan';
import { simulateTrafficAndPollution } from '@/ai/flows/simulate-traffic-and-pollution';
import { optimizeZoneDistribution } from '@/ai/flows/optimize-zone-distribution';
import { summarizeTerrainAnalysis } from '@/ai/flows/summarize-terrain-analysis';

// This function now generates a reliable mock report instead of calling the AI.
// This ensures the app is 100% functional and avoids API errors.
function generateMockFullReport(cityParams: CityParams): FullReport {
  const { population, budget } = cityParams;
  const budgetInCrores = (budget / 10000000).toFixed(2);
  const residentialCapacity = Math.round(population * 1.2);
  const commercialJobs = Math.round(population * 0.3);


  const mapData: MapData = {
    roads: [
      { type: 'highway', coordinates: [[5, 5], [95, 5]], reason: "Northern perimeter highway for external connectivity and freight transport" },
      { type: 'arterial', coordinates: [[5, 50], [95, 50]], reason: "Central arterial road dividing city into north-south sectors" },
      { type: 'arterial', coordinates: [[50, 5], [50, 95]], reason: "East-west arterial road for cross-city connectivity" }
    ],
    zones: [
      { type: 'residential', coordinates: [[5, 5], [45, 5], [45, 45], [5, 45]], reason: "Northwest residential sector with schools, parks, and community centers. Away from industrial areas." },
      { type: 'commercial', coordinates: [[55, 5], [95, 5], [95, 45], [55, 45]], reason: "Northeast commercial district with shopping malls, offices, and business parks. Direct highway access." },
      { type: 'industrial', coordinates: [[5, 55], [45, 55], [45, 95], [5, 95]], reason: "Southwest industrial zone with manufacturing units and warehouses. Downwind from residential areas." },
      { type: 'publicServices', coordinates: [[55, 55], [95, 55], [95, 95], [55, 95]], reason: "Southeast mixed-use development with residential-commercial integration and public transit hub" }
    ],
    infrastructure: [
      { type: 'power_plant', coordinates: [80, 80], capacity: "200MW", reason: "Solar power plant with battery storage. Located in southeast for optimal sunlight and safety." },
      { type: 'water_treatment', coordinates: [20, 80], reason: "Water treatment plant with 50 MLD capacity. Near proposed river source for efficient supply." },
      { type: 'hospital', coordinates: [30, 30], reason: "500-bed multi-specialty hospital in residential zone for quick emergency access." },
      { type: 'school', coordinates: [20, 20], reason: "Educational complex with schools and college in peaceful residential area." },
      { type: 'metro_station', coordinates: [50, 50], reason: "Central metro station at city crossroads for maximum public transit coverage." }
    ]
  };

  const cityPlan: CityPlan = {
    overview: `Smart city designed for ${population.toLocaleString()} residents with sustainable infrastructure and modern amenities.`,
    roadNetwork: {
      highways: ["Northern perimeter highway for external connectivity and freight transport"],
      arterialRoads: ["Central arterial road dividing city into north-south sectors", "East-west arterial road for cross-city connectivity"],
      localRoads: ["Grid-based local roads within each zone for last-mile connectivity."],
      reasoning: "The road network is designed hierarchically to separate high-speed transit traffic from local residential traffic, ensuring safety and efficiency."
    },
    zoning: {
        residential: { areas: ["Northwest"], reasoning: "Northwest residential sector with schools, parks, and community centers. Away from industrial areas." },
        commercial: { areas: ["Northeast"], reasoning: "Northeast commercial district with shopping malls, offices, and business parks. Direct highway access." },
        industrial: { areas: ["Southwest"], reasoning: "Southwest industrial zone with manufacturing units and warehouses. Downwind from residential areas." },
        mixedUse: { areas: ["Southeast"], reasoning: "Southeast mixed-use development with residential-commercial integration and public transit hub" }
    },
    infrastructure: {
        powerSupply: { locations: ["Southeast"], type: "Solar", capacity: "200MW", reasoning: "Solar power plant with battery storage. Located in southeast for optimal sunlight and safety." },
        waterSupply: { treatmentPlants: ["Southwest"], pipelineNetwork: "A city-wide grid ensuring 24/7 water supply.", reasoning: "Water treatment plant with 50 MLD capacity. Near proposed river source for efficient supply." },
        sewageSystem: { treatmentPlants: ["Southwest"], network: "Underground network parallel to roads.", reasoning: "Advanced sewage treatment with 80% water recycling capability." }
    },
    budgetBreakdown: {
      landAcquisition: `₹${(budget * 0.15 / 10000000).toFixed(2)} Cr`,
      roadConstruction: `₹${(budget * 0.25 / 10000000).toFixed(2)} Cr`,
      buildingConstruction: `₹${(budget * 0.40 / 10000000).toFixed(2)} Cr`,
      utilities: `₹${(budget * 0.20 / 10000000).toFixed(2)} Cr`,
      materials: JSON.stringify({
        concrete: `${Math.round(population * 3.0)} cubic meters`,
        steel: `${Math.round(population * 0.5)} tons`,
        pipes: `${Math.round(population * 0.008)} km`,
        asphalt: `${Math.round(population * 0.004)} tons`,
        bricks: `${Math.round(population * 2.0)} units`
      })
    },
    timeline: {
        phase1: "Months 1-6: Land acquisition, surveying, and basic infrastructure setup",
        phase2: "Months 7-12: Road network construction and utility installation", 
        phase3: "Months 13-18: Building construction and public facility development",
        phase4: "Months 19-24: Interior work, landscaping, and community establishment"
    }
  };

  const simulation: Simulation = {
    trafficAnalysis: "The arterial roads are well-planned, but the central metro station at (50,50) will be critical to manage peak hour traffic. Smart traffic signaling is recommended.",
    pollutionAnalysis: "Industrial zone placement is optimal (downwind). Green spaces and a solar power plant will ensure low pollution levels.",
    potentialIssues: ["Risk of budget overrun during the utility installation phase.", "Potential delays in land acquisition could shift the timeline."],
    suggestions: ["Secure all land permits before starting Phase 2.", "Use pre-fabricated building materials to reduce construction time and cost."]
  };

  return { cityPlan, simulation, cityParams, mapData };
}


export async function analyzeImage(base64Image: string, terrainAnalysis: string): Promise<string> {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Prepare the image for Gemini
    const mimeMatch = base64Image.match(/^data:(image\/[a-zA-Z+]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
    
    // Strip the base64 header
    const base64Data = base64Image.replace(/^data:image\/[a-zA-Z+]+;base64,/, "");
    
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType,
      },
    };

    const prompt = `You are an expert urban planner AI.
    Analyze this aerial or satellite land image and describe the terrain features. 
          
    CRITICAL RULES:
    - If this shows ANY geographical data (satellite map, height map, topographic map, terrain, elevation, contour lines, aerial photography) respond starting with EXACTLY: "AI analysis complete:"
    - If this is NOT geographical data, respond with ONLY: "Error"
    - Scenery Images of any kind and landscape are invalid, respond with ONLY: "Error"
    
    TERRAIN ANALYSIS:
    After "AI analysis complete:", provide detailed analysis of:
    - Elevation patterns and slopes
    - Water bodies and drainage
    - Vegetation coverage
    - Soil stability
    - Construction suitability
    - Specific directions (northwest, southeast, etc.)
    - Specific features (hills, valleys, plains, etc.)
    
    Example: "AI analysis complete: The terrain is mostly flat with a slight elevation in the northwest. A small water body is present in the southwest, suitable for a water treatment plant. The soil appears stable and suitable for high-rise construction."
    
    Now analyze this image:`;

    const result = await model.generateContent([prompt, imagePart]);
    const text = result.response.text().trim();

    console.log(text.slice(0,1000))

    // Simple safeguard if model returns something invalid
    if (!text.toLowerCase().startsWith("ai analysis complete") && text !== "Error") {
      return "Error";
    }

    return text;
  } catch (err) {
    console.error("Gemini terrain analysis error:", err);
    return "Error";
  }
}


export async function getOptimizedZones(
  terrainSummary: string,
  population: number,
  budget: number
) {
   // Return a stable, mock optimized zone distribution.
   return {
      zoneDistribution: {
        residential: 45,
        commercial: 20,
        industrial: 15,
        greenSpaces: 10,
        publicServices: 10,
      },
      reasoning: "Based on the flat terrain and budget, this distribution balances residential needs with economic and green spaces. The commercial zone is placed centrally for accessibility."
   }
}


export async function generatePlanAndSimulate(
  terrainSummaryInput: string,
  cityParams: CityParams,
  imageData: string | null
): Promise<FullReport> {
  // We are calling the mock data function directly to ensure the app works without real AI calls.
  // This makes the app stable for Vercel deployment.
  const { population, budget, specialRequirements } = cityParams;
  console.log("Generating MOCK city plan with parameters:", cityParams);
  const terrainSummary = await summarizeTerrainAnalysis({ terrainAnalysis: terrainSummaryInput, satelliteImageDataUri: imageData });
  console.log("tarrainsummary done");
  const zoneDistribution = await optimizeZoneDistribution({ terrainAnalysis: terrainSummary.summary, population, budget });
  console.log("zonedistribution");
  const cityPlan = await generateCityPlan(base64Image:imageData,{ population, budget,
                                           zoneDistribution: JSON.stringify(zoneDistribution.zoneDistribution || zoneDistribution), 
                                           terrainAnalysis: terrainSummary.summary,
                                           specialRequirements: JSON.stringify(specialRequirements)});
  //console.log("City plan being sent to AI:", JSON.stringify(cityPlan).slice(0, 1000));
  //await new Promise(resolve => setTimeout(resolve, 60000));
  const simulation = await simulateTrafficAndPollution({cityPlan:JSON.stringify( cityPlan )});
  console.log("simulation done");
  //console.log("Generated MOCK city plan", typeof cityPlan , typeof simulation , { cityPlan, simulation });
  return {  cityPlan:cityPlan.report || null, simulation, cityParams, mapData: cityPlan.mapData || null};
}
