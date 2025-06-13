"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { refineIdeaAction, type RefineIdeaState } from "@/app/dreamer/new-idea/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Sparkles, Lightbulb } from "lucide-react";

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
  const [state, formAction] = useActionState(refineIdeaAction, initialState);

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
      <form action={formAction}>
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
            />
            {state?.fieldErrors?.idea && (
              <p id="idea-error" className="text-sm text-destructive">{state.fieldErrors.idea.join(", ")}</p>
            )}
          </div>

          {state?.error && !state.fieldErrors && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <SubmitButton />
        </CardFooter>
      </form>

      {state?.refinedIdea && (
        <CardContent className="mt-6 border-t pt-6">
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
        </CardContent>
      )}
    </Card>
  );
}
