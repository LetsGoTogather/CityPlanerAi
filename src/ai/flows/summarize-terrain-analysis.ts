'use server';

/**
 * @fileOverview Summarizes terrain analysis from a satellite image.
 *
 * - summarizeTerrainAnalysis - A function that summarizes terrain analysis.
 */

import {ai} from '@/ai/genkit';
import {SummarizeTerrainAnalysisInputSchema, SummarizeTerrainAnalysisOutputSchema, type SummarizeTerrainAnalysisInput, type SummarizeTerrainAnalysisOutput} from '@/ai/schemas';

export async function summarizeTerrainAnalysis(
  input: SummarizeTerrainAnalysisInput
): Promise<SummarizeTerrainAnalysisOutput> {
  return summarizeTerrainAnalysisFlow(input);
}

const summarizeTerrainAnalysisPrompt = ai.definePrompt({
  name: 'summarizeTerrainAnalysisPrompt',
  input: {schema: SummarizeTerrainAnalysisInputSchema},
  output: {schema: SummarizeTerrainAnalysisOutputSchema},
  prompt: `You are an expert in summarizing terrain analysis reports for urban planners.

  Summarize the following terrain analysis, highlighting key features relevant to city planning.

  Terrain Analysis:
  {{terrainAnalysis}}

  Satellite Image:
  {{media url=satelliteImageDataUri}}
  `,
});

const summarizeTerrainAnalysisFlow = ai.defineFlow(
  {
    name: 'summarizeTerrainAnalysisFlow',
    inputSchema: SummarizeTerrainAnalysisInputSchema,
    outputSchema: SummarizeTerrainAnalysisOutputSchema,
  },
  async input => {
    const {output} = await summarizeTerrainAnalysisPrompt(input);
    return output!;
  }
);
