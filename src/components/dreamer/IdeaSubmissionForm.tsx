
"use client";

import { useActionState, useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter
import { refineIdeaAction, type RefineIdeaState } from "@/app/dreamer/new-idea/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Sparkles, Lightbulb, Save, CheckCircle, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import type { DreamIdea } from "@/types";
import { mockUserIdeas } from "@/lib/mockIdeas";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto bg-accent hover:bg-accent/90">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Refining...
        </>
      ) : (
        <>
          Refine My Idea <Sparkles className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
}

export default function IdeaSubmissionForm() {
  const initialState: RefineIdeaState = {};
  const [state, formAction, isPending] = useActionState(refineIdeaAction, initialState);
  const { toast } = useToast();
  const router = useRouter(); // Initialize router
  const [dreamTitle, setDreamTitle] = useState("");
  // isDreamSaved is no longer needed for primary flow if we redirect
  // const [isDreamSaved, setIsDreamSaved] = useState(false); 
  const [formKey, setFormKey] = useState(Date.now()); 

  // Effect to clear title if new refinement happens (useful if user comes back to this form)
  useEffect(() => {
    if (state?.refinedIdea) {
      setDreamTitle(""); 
    }
  }, [state?.refinedIdea]);


  const handleSaveDream = () => {
    if (!dreamTitle.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your dream.",
        variant: "destructive",
      });
      return;
    }

    if (!state || !state.originalIdea || !state.refinedIdea) {
      toast({
        title: "Error",
        description: "No refined idea data to save. Please refine an idea first.",
        variant: "destructive",
      });
      return;
    }

    const newDream: DreamIdea = {
      id: `idea-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      title: dreamTitle.trim(),
      originalText: state.originalIdea,
      refinedText: state.refinedIdea,
      suggestions: state.suggestions || [],
      goals: [],
      meetings: [],
      status: 'private', // Dreams start as private
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockUserIdeas.push(newDream); 

    toast({
      title: "Dream Saved!",
      description: `"${newDream.title}" is ready. Taking you to the Dream Planner...`,
    });
    
    // Redirect to the dream detail page
    router.push(`/dreamer/my-dreams/${newDream.id}`);
    
    // setIsDreamSaved(true); // No longer needed if redirecting
    // We might not need to reset the form here if we redirect immediately.
    // If the user navigates back, formKey reset would handle it.
  };

  // This function is still useful if the user explicitly wants to start fresh without submitting
  const startNewIdea = () => {
    setFormKey(Date.now()); 
    setDreamTitle("");
    // If you had `state` from `useActionState` and wanted to clear its visual output:
    // A common pattern is to also reset the `initialState` or pass it to `formAction` if the API allows,
    // or rely on the `key` prop on the form to fully remount and reset.
    // For this case, re-keying the form is effective for visual reset of form fields and displayed state.
  };


  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl flex items-center">
          <Lightbulb className="mr-3 h-8 w-8 text-accent" />
          Let's Polish Your Dream
        </CardTitle>
        <CardDescription>
          Enter your initial idea below. Our AI will help you refine it, offering suggestions to make it stronger and more compelling.
        </CardDescription>
      </CardHeader>
      {/* If formAction has completed and resulted in a redirect, this form might not be visible long enough for state.refinedIdea to be a factor */}
      <form action={formAction} key={formKey}> 
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="idea" className="text-lg font-semibold">Your Brilliant Idea</Label>
            <Textarea
              id="idea"
              name="idea"
              placeholder="E.g., A platform that connects local artists with coffee shops for exhibitions..."
              rows={6}
              className="resize-none"
              aria-describedby="idea-error"
              disabled={isPending} // Only disable while refining
            />
            {state?.fieldErrors?.idea && !isPending && (
              <p id="idea-error" className="text-sm text-destructive">{state.fieldErrors.idea.join(", ")}</p>
            )}
          </div>

          {state?.error && !state.fieldErrors && !isPending && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-2">
           <Button onClick={startNewIdea} variant="outline" className="w-full sm:w-auto">
               <PlusCircle className="mr-2 h-4 w-4" /> Start Another Idea
           </Button>
           <SubmitButton />
        </CardFooter>
      </form>

      {!isPending && state?.refinedIdea && (
        <CardContent className="mt-6 border-t pt-6 space-y-6">
          <div>
            <h3 className="text-2xl font-semibold mb-3 text-primary flex items-center">
              <Sparkles className="mr-2 h-6 w-6 text-primary" />
              Refined Idea & Suggestions
            </h3>
            <div className="bg-primary/5 p-4 rounded-md space-y-4">
              <div>
                <h4 className="font-semibold text-lg text-foreground">Refined Concept:</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">{state.refinedIdea}</p>
              </div>
              {state.suggestions && state.suggestions.length > 0 && (
                <div>
                  <h4 className="font-semibold text-lg text-foreground">Suggestions for Improvement:</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    {state.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Save Dream Section */}
          <div className="space-y-4 p-4 border rounded-md shadow-sm bg-card">
            <h3 className="text-xl font-semibold text-foreground">Save This Dream to Planner</h3>
            <div className="space-y-2">
              <Label htmlFor="dreamTitle" className="font-medium">Dream Title</Label>
              <Input
                id="dreamTitle"
                name="dreamTitle"
                placeholder="Enter a catchy title for your dream"
                value={dreamTitle}
                onChange={(e) => setDreamTitle(e.target.value)}
                className="bg-background"
              />
            </div>
            <Button onClick={handleSaveDream} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
              <Save className="mr-2 h-4 w-4" /> Save and Go to Dream Planner
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
