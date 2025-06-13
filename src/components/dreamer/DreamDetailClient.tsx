"use client";

import type { DreamIdea, Goal, Meeting } from '@/types';
import { useState, useEffect } from 'react';
import { mockUserIdeas } from '@/lib/mockIdeas'; // Using a separate mock file
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import GoalChecklist from './GoalChecklist';
import MeetingScheduler from './MeetingScheduler';
import { ArrowLeft, Lightbulb, Sparkles, Send } from 'lucide-react';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";

interface DreamDetailClientProps {
  ideaId: string;
}

export default function DreamDetailClient({ ideaId }: DreamDetailClientProps) {
  const [idea, setIdea] = useState<DreamIdea | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching the specific idea.
    const foundIdea = mockUserIdeas.find(i => i.id === ideaId);
    if (foundIdea) {
      setIdea(foundIdea);
    }
    setLoading(false);
  }, [ideaId]);

  const handleGoalsChange = (updatedGoals: Goal[]) => {
    if (idea) {
      const newIdeaState = { ...idea, goals: updatedGoals, updatedAt: new Date() };
      setIdea(newIdeaState);
      // In a real app, save this change to the backend / update mockUserIdeas for persistence across app
      const ideaIndex = mockUserIdeas.findIndex(i => i.id === ideaId);
      if (ideaIndex !== -1) {
        mockUserIdeas[ideaIndex] = newIdeaState;
      }
      toast({ title: "Goals Updated", description: "Your project goals have been saved." });
    }
  };

  const handleMeetingsChange = (updatedMeetings: Meeting[]) => {
    if (idea) {
      const newIdeaState = { ...idea, meetings: updatedMeetings, updatedAt: new Date() };
      setIdea(newIdeaState);
      const ideaIndex = mockUserIdeas.findIndex(i => i.id === ideaId);
      if (ideaIndex !== -1) {
        mockUserIdeas[ideaIndex] = newIdeaState;
      }
      toast({ title: "Meetings Updated", description: "Your meeting schedule has been saved." });
    }
  };
  
  const handleSubmitToInvestors = () => {
    if (idea) {
      const newIdeaState = { ...idea, status: 'submitted' as const, updatedAt: new Date() };
      setIdea(newIdeaState);
      const ideaIndex = mockUserIdeas.findIndex(i => i.id === ideaId);
      if (ideaIndex !== -1) {
        mockUserIdeas[ideaIndex] = newIdeaState;
      }
      toast({
        title: "Idea Submitted!",
        description: `${idea.title} has been sent to the investor portal.`,
      });
    }
  };


  if (loading) {
    return <p>Loading dream details...</p>;
  }

  if (!idea) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Could not find the specified dream. It might have been deleted or does not exist.</AlertDescription>
        <Button variant="link" asChild className="mt-2">
            <Link href="/dreamer/my-dreams"><ArrowLeft className="mr-2 h-4 w-4"/> Back to My Dreams</Link>
        </Button>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <Button variant="outline" asChild>
        <Link href="/dreamer/my-dreams">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Dreams
        </Link>
      </Button>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl text-primary flex items-center">
            <Lightbulb className="mr-3 h-8 w-8" /> {idea.title}
          </CardTitle>
          <CardDescription>
            Created: {new Date(idea.createdAt).toLocaleDateString()} | Last Updated: {new Date(idea.updatedAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2 text-foreground flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-accent" />
              Idea Overview
            </h3>
            <p className="text-muted-foreground mb-1"><span className="font-medium text-foreground/80">Original Concept:</span> {idea.originalText}</p>
            {idea.refinedText && <p className="text-muted-foreground mb-1"><span className="font-medium text-foreground/80">Refined Version:</span> {idea.refinedText}</p>}
            {idea.suggestions && idea.suggestions.length > 0 && (
              <div>
                <h4 className="font-medium text-foreground/80 mt-2">AI Suggestions:</h4>
                <ul className="list-disc list-inside text-muted-foreground ml-4">
                  {idea.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}
          </div>
          
          {idea.status === 'private' && (
            <div className="flex justify-end">
              <Button onClick={handleSubmitToInvestors} className="bg-accent hover:bg-accent/90">
                Submit to Investors <Send className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
          {idea.status === 'submitted' && (
             <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Submitted to Investors!</AlertTitle>
              <AlertDescription>
                This idea is currently visible to investors. You may receive offers soon.
              </AlertDescription>
            </Alert>
          )}

        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <GoalChecklist initialGoals={idea.goals} onGoalsChange={handleGoalsChange} />
        <MeetingScheduler initialMeetings={idea.meetings} onMeetingsChange={handleMeetingsChange} />
      </div>
    </div>
  );
}
