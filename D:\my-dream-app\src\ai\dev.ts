import { config } from 'dotenv';
config();

import '@/ai/flows/idea-refinement.ts';
import '@/ai/flows/dream-coach-flow.ts';
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const helloFlow = ai.defineFlow(
  {
    name: 'helloFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (name) => {
    const { text } = await ai.generate({
      prompt: `Hello Gemini, my name is ${name}`,
    });
    return text;
  }
);

// When running `genkit:dev`, this will execute and log the output to the terminal.
helloFlow('Chris').then((response) => {
  console.log('Response from helloFlow:', response);
});
