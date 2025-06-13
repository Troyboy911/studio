
"use server";

import { dreamCoach, type DreamCoachInput, type DreamCoachOutput } from "@/ai/flows/dream-coach-flow";
import { z } from "zod";

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const AskCoachSchema = z.object({
  ideaId: z.string(),
  ideaTitle: z.string(),
  ideaOriginalText: z.string(),
  ideaRefinedText: z.string().optional(),
  userMessage: z.string().min(1, "Message cannot be empty."),
  // chatHistory is expected to be a JSON string from the client
  chatHistory: z.string().transform((str, ctx) => {
    try {
      if (!str) return [];
      const parsed = JSON.parse(str);
      const result = z.array(ChatMessageSchema).safeParse(parsed);
      if (!result.success) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid chat history format." });
        return z.NEVER;
      }
      return result.data;
    } catch (e) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Chat history is not valid JSON." });
      return z.NEVER;
    }
  }),
});

export interface AskCoachState {
  coachResponse?: string;
  userMessage?: string; // To help clear input on success
  error?: string;
  fieldErrors?: {
    userMessage?: string[];
    chatHistory?: string[];
  };
}

export async function askCoachAction(
  prevState: AskCoachState,
  formData: FormData
): Promise<AskCoachState> {
  const rawData = {
    ideaId: formData.get("ideaId"),
    ideaTitle: formData.get("ideaTitle"),
    ideaOriginalText: formData.get("ideaOriginalText"),
    ideaRefinedText: formData.get("ideaRefinedText") || undefined, // Ensure undefined if empty
    userMessage: formData.get("userMessage"),
    chatHistory: formData.get("chatHistory"),
  };

  const validatedFields = AskCoachSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      error: "Invalid input.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const input: DreamCoachInput = {
    ideaTitle: validatedFields.data.ideaTitle,
    ideaOriginalText: validatedFields.data.ideaOriginalText,
    ideaRefinedText: validatedFields.data.ideaRefinedText,
    userMessage: validatedFields.data.userMessage,
    chatHistory: validatedFields.data.chatHistory,
  };

  try {
    const result: DreamCoachOutput = await dreamCoach(input);
    return {
      coachResponse: result.coachResponse,
      userMessage: validatedFields.data.userMessage, // Pass back user message for client to use
    };
  } catch (e: any) {
    console.error("Error with AI Coach:", e);
    return { error: e.message || "Failed to get response from AI Coach. Please try again." };
  }
}
