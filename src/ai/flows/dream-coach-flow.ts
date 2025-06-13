
'use server';
/**
 * @fileOverview A Genkit flow for the AI Dream Coach.
 *
 * - dreamCoach - A function that provides AI coaching based on an idea and user message.
 * - DreamCoachInput - The input type for the dreamCoach function.
 * - DreamCoachOutput - The return type for the dreamCoach function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const DreamCoachInputSchema = z.object({
  ideaTitle: z.string().describe('The title of the dream or idea.'),
  ideaOriginalText: z.string().describe('The original description of the idea.'),
  ideaRefinedText: z.string().optional().describe('The AI-refined version of the idea, if available.'),
  userMessage: z.string().describe("The user's current message or question to the coach."),
  chatHistory: z.array(ChatMessageSchema).optional().describe('The history of the conversation so far, excluding the current userMessage.'),
});
export type DreamCoachInput = z.infer<typeof DreamCoachInputSchema>;

const DreamCoachOutputSchema = z.object({
  coachResponse: z.string().describe("The AI coach's response to the user."),
});
export type DreamCoachOutput = z.infer<typeof DreamCoachOutputSchema>;

export async function dreamCoach(input: DreamCoachInput): Promise<DreamCoachOutput> {
  return dreamCoachFlow(input);
}

// System prompt defines the AI's persona and general instructions.
// Handlebars templating is used here for idea context.
const dreamCoachSystemPrompt = `You are an AI Dream Coach, an expert startup advisor and mentor. Your goal is to help users develop and refine their ideas. Be encouraging, insightful, and practical.

Always use the provided context about the user's idea and the ongoing conversation to give relevant and actionable advice.

Current Idea Context:
Title: {{{ideaTitle}}}
Original Idea: {{{ideaOriginalText}}}
{{#if ideaRefinedText}}
Refined Idea: {{{ideaRefinedText}}}
{{/if}}

Focus on the user's current message within the conversation history. Ask clarifying questions if needed. Keep your responses concise but helpful.
If the chat history is empty, and the user's message is a simple greeting, introduce yourself and offer to help with their idea.`;

const dreamCoachPrompt = ai.definePrompt({
  name: 'dreamCoachPrompt',
  input: {schema: DreamCoachInputSchema},
  output: {schema: DreamCoachOutputSchema},
  system: dreamCoachSystemPrompt, // System prompt provides overall instructions and context
  prompt: (input) => {
    // Construct the messages array for the model
    // This includes the chat history and the current user message
    const messages = [];
    if (input.chatHistory) {
      messages.push(...input.chatHistory.map(msg => ({role: msg.role, content: msg.content})));
    }
    messages.push({role: 'user', content: input.userMessage});
    return messages;
  },
  config: {
    temperature: 0.6, // Slightly more creative but still grounded
  }
});

const dreamCoachFlow = ai.defineFlow(
  {
    name: 'dreamCoachFlow',
    inputSchema: DreamCoachInputSchema,
    outputSchema: DreamCoachOutputSchema,
  },
  async (input) => {
    const {output} = await dreamCoachPrompt(input);
    return output!;
  }
);
