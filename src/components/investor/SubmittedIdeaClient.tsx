"use client";

import type { DreamIdea } from '@/types';
import { useState, useEffect } from 'react';
import { mockUserIdeas } from '@/lib/mockIdeas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import InvestmentOfferForm from './InvestmentOfferForm';
import { ArrowLeft, Lightbulb, Sparkles, Target, Clock } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface SubmittedIdeaClientProps {
  ideaId: string;
}

export default function SubmittedIdeaClient({ ideaId }: SubmittedIdeaClientProps) {
  const [idea, setIdea] = useState<DreamIdea | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundIdea = mockUserIdeas.find(i => i.id === ideaId && i.status === 'submitted');
    if (foundIdea) {
      setIdea(foundIdea);
    }
    setLoading(false);
  }, [ideaId]);

  if (loading) {
    return <p className="text-center py-10">Loading idea details...</p>;
  }

  if (!idea) {
    return (
      <Alert variant="destructive" className="max-w-xl mx-auto">
        <AlertTitle>Idea Not Found</AlertTitle>
        <AlertDescription>
          This idea may not be available for investment or the link is incorrect.
        </AlertDescription>
         <Button variant="link" asChild className="mt-2 pl-0">
            <Link href="/investor"><ArrowLeft className="mr-2 h-4 w-4"/> Back to Investor Dashboard</Link>
        </Button>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <Button variant="outline" asChild>
        <Link href="/investor">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Link>
      </Button>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-xl">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-3xl text-primary flex items-center">
                  <Lightbulb className="mr-3 h-8 w-8" /> {idea.title}
                </CardTitle>
                <Badge variant="default" className="bg-accent text-accent-foreground text-sm px-3 py-1">
                    Ready for Investment
                </Badge>
              </div>
              <CardDescription>
                Submitted: {new Date(idea.updatedAt).toLocaleDateString()} {/* Assuming submission updates this date */}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-accent" />
                  Refined Proposal
                </h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{idea.refinedText || "No refined text available."}</p>
              </div>
              {idea.suggestions && idea.suggestions.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground/80 mt-2">Key Strengths / AI Suggestions:</h4>
                  <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1">
                    {idea.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          { (idea.goals?.length > 0 || idea.meetings?.length > 0) &&
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Project Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {idea.goals && idea.goals.length > 0 && (
                        <div>
                        <h4 className="font-semibold text-foreground/90 flex items-center mb-1"><Target className="mr-2 h-5 w-5 text-primary"/> Key Goals:</h4>
                        <ul className="list-disc list-inside text-muted-foreground ml-4">
                            {idea.goals.map(goal => <li key={goal.id} className={goal.completed ? "line-through" : ""}>{goal.text}</li>)}
                        </ul>
                        </div>
                    )}
                    {idea.goals?.length > 0 && idea.meetings?.length > 0 && <Separator className="my-3"/>}
                    {idea.meetings && idea.meetings.length > 0 && (
                        <div>
                        <h4 className="font-semibold text-foreground/90 flex items-center mb-1"><Clock className="mr-2 h-5 w-5 text-primary"/> Scheduled Milestones:</h4>
                        <ul className="list-disc list-inside text-muted-foreground ml-4">
                            {idea.meetings.map(meeting => <li key={meeting.id}>{meeting.title} - {new Date(meeting.date).toLocaleDateString()}</li>)}
                        </ul>
                        </div>
                    )}
                </CardContent>
            </Card>
          }

        </div>

        <div className="lg:col-span-1">
          <InvestmentOfferForm idea={idea} />
        </div>
      </div>
    </div>
  );
}
