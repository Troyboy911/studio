// src/ai/flows/idea-refinement.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for refining user ideas using AI.
 *
 * - ideaRefinement - A function that takes an initial idea as input and returns a refined idea with suggestions.
 * - IdeaRefinementInput - The input type for the ideaRefinement function.
 * - IdeaRefinementOutput - The output type for the ideaRefinement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdeaRefinementInputSchema = z.object({
  idea: z.string().describe('The initial idea to be refined.'),
});
export type IdeaRefinementInput = z.infer<typeof IdeaRefinementInputSchema>;

const IdeaRefinementOutputSchema = z.object({
  refinedIdea: z.string().describe('The refined idea with suggestions for improvement.'),
  suggestions: z.array(z.string()).describe('Specific suggestions for improving the idea.'),
});
export type IdeaRefinementOutput = z.infer<typeof IdeaRefinementOutputSchema>;

export async function ideaRefinement(input: IdeaRefinementInput): Promise<IdeaRefinementOutput> {
  return ideaRefinementFlow(input);
}

const ideaRefinementPrompt = ai.definePrompt({
  name: 'ideaRefinementPrompt',
  input: {schema: IdeaRefinementInputSchema},
  output: {schema: IdeaRefinementOutputSchema},
  prompt: `You are an AI assistant designed to help users refine their ideas.  Provide a refined version of the idea, along with a few specific suggestions for improvement.

Original Idea: {{{idea}}}

Refined Idea and Suggestions:`, 
});

const ideaRefinementFlow = ai.defineFlow(
  {
    name: 'ideaRefinementFlow',
    inputSchema: IdeaRefinementInputSchema,
    outputSchema: IdeaRefinementOutputSchema,
  },
  async input => {
    const {output} = await ideaRefinementPrompt(input);
    return output!;
  }
);
