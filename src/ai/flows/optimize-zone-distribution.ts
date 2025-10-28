'use server';

/**
 * @fileOverview Optimizes the zone distribution for a city plan based on terrain analysis,
 *               population, and budget constraints.
 *
 * - optimizeZoneDistribution - A function that takes terrain analysis, population, and budget
 *                              as input and suggests an optimized zone distribution.
 */

import {ai} from '@/ai/genkit';
import {OptimizeZoneDistributionInputSchema, OptimizeZoneDistributionOutputSchema, type OptimizeZoneDistributionInput, type OptimizeZoneDistributionOutput} from '@/ai/schemas';

export async function optimizeZoneDistribution(input: OptimizeZoneDistributionInput): Promise<OptimizeZoneDistributionOutput> {
  return optimizeZoneDistributionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeZoneDistributionPrompt',
  input: {schema: OptimizeZoneDistributionInputSchema},
  output: {schema: OptimizeZoneDistributionOutputSchema},
  prompt: `You are an expert urban planner with 20 years of experience.

Based on the terrain analysis, population, and budget provided, suggest an optimized zone distribution for the city.

Terrain Analysis: {{{terrainAnalysis}}}
Population: {{{population}}}
Budget: {{{budget}}}

Consider the following factors when determining the zone distribution:

*   The need for residential areas to house the population.
*   The need for commercial areas to provide jobs and services.
*   The need for industrial areas to support the economy.
*   The need for green spaces to provide recreation and improve the environment.
*   The need for public services such as schools, hospitals, and police stations.

Return the zone distribution as a JSON object with the following keys:

*   residential: The percentage of land allocated to residential areas.
*   commercial: The percentage of land allocated to commercial areas.
*   industrial: The percentage of land allocated to industrial areas.
*   greenSpaces: The percentage of land allocated to green spaces.
*   publicServices: The percentage of land allocated to public services.

Also, include a detailed reasoning behind the suggested zone distribution.

Output format:{
  "zoneDistribution": {
    "residential": 40,
    "commercial": 20,
    "industrial": 15,
    "greenSpaces": 15,
    "publicServices": 10
  },
  "reasoning": "Detailed reasoning here..."
}`,
});

const optimizeZoneDistributionFlow = ai.defineFlow(
  {
    name: 'optimizeZoneDistributionFlow',
    inputSchema: OptimizeZoneDistributionInputSchema,
    outputSchema: OptimizeZoneDistributionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
