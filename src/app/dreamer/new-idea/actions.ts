
"use server";

import { ideaRefinement, type IdeaRefinementInput, type IdeaRefinementOutput } from "@/ai/flows/idea-refinement";
import { z } from "zod";

const RefineSchema = z.object({
  idea: z.string().min(10, "Idea must be at least 10 characters long."),
});

export interface RefineIdeaState {
  originalIdea?: string; // Added to pass original idea back
  refinedIdea?: string;
  suggestions?: string[];
  error?: string;
  fieldErrors?: {
    idea?: string[];
  };
}

export async function refineIdeaAction(
  prevState: RefineIdeaState,
  formData: FormData
): Promise<RefineIdeaState> {
  const rawIdea = formData.get("idea");

  const validatedFields = RefineSchema.safeParse({
    idea: rawIdea,
  });

  if (!validatedFields.success) {
    return {
      error: "Invalid input.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const input: IdeaRefinementInput = { idea: validatedFields.data.idea };

  try {
    const result: IdeaRefinementOutput = await ideaRefinement(input);
    return {
      originalIdea: validatedFields.data.idea, // Return the original idea
      refinedIdea: result.refinedIdea,
      suggestions: result.suggestions,
    };
  } catch (e: any) {
    console.error("Error refining idea:", e);
    return { error: e.message || "Failed to refine idea. Please try again." };
  }
}
