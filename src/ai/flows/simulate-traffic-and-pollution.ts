'use server';
/**
 * @fileOverview Simulates traffic and pollution for a city plan.
 *
 * - simulateTrafficAndPollution - A function that simulates traffic and pollution based on a city plan.
 */

import {ai} from '@/ai/genkit';
import {SimulateTrafficAndPollutionInputSchema, SimulateTrafficAndPollutionOutputSchema, type SimulateTrafficAndPollutionInput, type SimulateTrafficAndPollutionOutput} from '@/ai/schemas';


export async function simulateTrafficAndPollution(input: SimulateTrafficAndPollutionInput): Promise<SimulateTrafficAndPollutionOutput> {
  return simulateTrafficAndPollutionFlow(input);
}

const simulateTrafficAndPollutionPrompt = ai.definePrompt({
  name: 'simulateTrafficAndPollutionPrompt',
  input: {schema: SimulateTrafficAndPollutionInputSchema},
  output: {schema: SimulateTrafficAndPollutionOutputSchema},
  prompt: `You are an expert urban planner specializing in simulating the traffic flow and pollution impact of city plans.

You will receive a city plan as a JSON string.  Your task is to analyze the plan and identify potential issues related to traffic and pollution.

Based on your analysis, provide a list of potential issues and suggestions to address them.

City Plan:
{{{cityPlan}}}

Return your response in JSON format.
`,
});

const simulateTrafficAndPollutionFlow = ai.defineFlow(
  {
    name: 'simulateTrafficAndPollutionFlow',
    inputSchema: SimulateTrafficAndPollutionInputSchema,
    outputSchema: SimulateTrafficAndPollutionOutputSchema,
  },
  async input => {
    const {output} = await simulateTrafficAndPollutionPrompt(input);
    return output!;
  }
);
