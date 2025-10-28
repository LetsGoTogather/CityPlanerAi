import { z } from 'genkit';

// Schemas for generate-city-plan.ts
const CoordinateSchema = z.array(z.number()).length(2);

const RoadSchema = z.object({
  type: z.enum(['highway', 'arterial', 'local']),
  coordinates: z.array(CoordinateSchema),
  reason: z.string(),
});

const ZoneSchema = z.object({
  type: z.enum(['residential', 'commercial', 'industrial', 'greenSpaces', 'publicServices']),
  coordinates: z.array(CoordinateSchema),
  density: z.string().optional(),
  reason: z.string(),
});

const InfrastructureSchema = z.object({
  type: z.string(), // e.g., 'power_plant', 'hospital', 'school'
  coordinates: CoordinateSchema,
  reason: z.string(),
  capacity: z.string().optional(),
});

export const MapDataSchema = z.object({
  roads: z.array(RoadSchema),
  zones: z.array(ZoneSchema),
  infrastructure: z.array(InfrastructureSchema),
});

const CityPlanReportSchema = z.object({
  overview: z.string().optional(), // Made optional to simplify AI response
  roadNetwork: z.object({
    highways: z.array(z.string()),
    arterialRoads: z.array(z.string()),
    localRoads: z.array(z.string()),
    reasoning: z.string(),
  }).optional(),
  zoning: z.string().describe("A JSON string representing the zoning details.").optional(),
  infrastructure: z.object({
    powerSupply: z.object({ locations: z.array(z.string()), type: z.string(), capacity: z.string(), reasoning: z.string() }),
    waterSupply: z.object({ treatmentPlants: z.array(z.string()), pipelineNetwork: z.string(), reasoning: z.string() }),
    sewageSystem: z.object({ treatmentPlants: z.array(z.string()), network: z.string(), reasoning: z.string() }),
  }).optional(),
  budgetBreakdown: z.object({
    landAcquisition: z.string(),
    roadConstruction: z.string(),
    buildingConstruction: z.string(),
    utilities: z.string(),
    materials: z.string().describe("A JSON string detailing required materials and quantities."),
  }),
  timeline: z.object({
    phase1: z.string(),
    phase2: z.string(),
    phase3: z.string(),
  }),
});

export const GenerateCityPlanOutputSchema = z.object({
  mapData: MapDataSchema,
  report: CityPlanReportSchema,
});
export type GenerateCityPlanOutput = z.infer<typeof GenerateCityPlanOutputSchema>;

export const GenerateCityPlanInputSchema = z.object({
    terrainAnalysis: z.string(),
    population: z.number(),
    budget: z.number(),
    zoneDistribution: z.string(),
    specialRequirements: z.string(),
});
export type GenerateCityPlanInput = z.infer<typeof GenerateCityPlanInputSchema>;


// Schemas for optimize-zone-distribution.ts
export const OptimizeZoneDistributionInputSchema = z.object({
  terrainAnalysis: z
    .string()
    .describe('The analysis of the terrain, soil, water bodies, and topography from the satellite image.'),
  population: z.number().describe('The target population of the city.'),
  budget: z.number().describe('The budget for the city in local currency.'),
});
export type OptimizeZoneDistributionInput = z.infer<typeof OptimizeZoneDistributionInputSchema>;

export const OptimizeZoneDistributionOutputSchema = z.object({
  zoneDistribution: z.object({
    residential: z.number().describe('The percentage of land allocated to residential areas.'),
    commercial: z.number().describe('The percentage of land allocated to commercial areas.'),
    industrial: z.number().describe('The percentage of land allocated to industrial areas.'),
    greenSpaces: z.number().describe('The percentage of land allocated to green spaces.'),
    publicServices: z.number().describe('The percentage of land allocated to public services.'),
  }).describe('The optimized zone distribution for the city.'),
  reasoning: z.string().describe('The detailed reasoning behind the suggested zone distribution.'),
});
export type OptimizeZoneDistributionOutput = z.infer<typeof OptimizeZoneDistributionOutputSchema>;


// Schemas for simulate-traffic-and-pollution.ts
export const SimulateTrafficAndPollutionInputSchema = z.object({
  cityPlan: z.string().describe('The city plan as a JSON string.'),
});
export type SimulateTrafficAndPollutionInput = z.infer<typeof SimulateTrafficAndPollutionInputSchema>;

export const SimulateTrafficAndPollutionOutputSchema = z.object({
  trafficAnalysis: z.string().describe('An analysis of the traffic flow in the city, identifying potential congestion points.'),
  pollutionAnalysis: z.string().describe('An analysis of the pollution impact of the city, identifying potential problem areas.'),
  potentialIssues: z.array(z.string()).describe('A list of potential issues identified by the simulation.'),
  suggestions: z.array(z.string()).describe('A list of suggestions to address the potential issues.'),
});
export type SimulateTrafficAndPollutionOutput = z.infer<typeof SimulateTrafficAndPollutionOutputSchema>;


// Schemas for summarize-terrain-analysis.ts
export const SummarizeTerrainAnalysisInputSchema = z.object({
  satelliteImageDataUri: z
    .string()
    .describe(
      "A satellite image of the land, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  terrainAnalysis: z
    .string()
    .describe('The raw terrain analysis to be summarized.'),
});
export type SummarizeTerrainAnalysisInput = z.infer<typeof SummarizeTerrainAnalysisInputSchema>;

export const SummarizeTerrainAnalysisOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the terrain analysis.'),
});
export type SummarizeTerrainAnalysisOutput = z.infer<typeof SummarizeTerrainAnalysisOutputSchema>;
