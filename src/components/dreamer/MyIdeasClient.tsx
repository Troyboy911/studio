"use client";

import type { DreamIdea } from '@/types';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Edit3, Send, CheckCircle, Hourglass } from 'lucide-react';
import { mockUserIdeas as initialMockIdeas } from '@/lib/mockIdeas'; // Using a separate mock file
import { useToast } from "@/hooks/use-toast";

export default function MyIdeasClient() {
  const [ideas, setIdeas] = useState<DreamIdea[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching ideas. In a real app, this would be an API call.
    // We filter to only show 'private' or current user's 'submitted' ideas.
    const userSpecificIdeas = initialMockIdeas.filter(idea => idea.status === 'private' || idea.status === 'submitted');
    setIdeas(userSpecificIdeas);
  }, []);

  const handleSubmitToInvestors = (ideaId: string) => {
    setIdeas(prevIdeas => 
      prevIdeas.map(idea => 
        idea.id === ideaId ? { ...idea, status: 'submitted' as const } : idea
      )
    );
    // In a real app, this would also trigger an API call.
    // For now, also update the global mock for other parts of the app.
    const ideaIndex = initialMockIdeas.findIndex(i => i.id === ideaId);
    if (ideaIndex !== -1) {
      initialMockIdeas[ideaIndex].status = 'submitted';
    }

    toast({
      title: "Idea Submitted!",
      description: "Your idea has been successfully submitted to the investor portal.",
      variant: "default",
    });
  };

  if (ideas.length === 0) {
    return (
      <div className="text-center py-10">
        <Hourglass className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-foreground">No Dreams Yet?</h3>
        <p className="text-muted-foreground mb-4">It looks like you haven't started any dreams or all your dreams are with investors.</p>
        <Button asChild>
          <Link href="/dreamer/new-idea">
            <Edit3 className="mr-2 h-4 w-4" /> Start Your First Dream
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {ideas.map((idea) => (
        <Card key={idea.id} className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-2xl text-primary">{idea.title}</CardTitle>
              <Badge variant={idea.status === 'submitted' ? 'default' : 'secondary'} className={idea.status === 'submitted' ? 'bg-accent text-accent-foreground' : ''}>
                {idea.status === 'private' && <Edit3 className="mr-1 h-3 w-3" />}
                {idea.status === 'submitted' && <CheckCircle className="mr-1 h-3 w-3" />}
                {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
              </Badge>
            </div>
            <CardDescription>
              {idea.refinedText ? idea.refinedText.substring(0, 150) + '...' : idea.originalText.substring(0, 150) + '...'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date(idea.updatedAt).toLocaleDateString()}
            </p>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <Button variant="outline" asChild>
              <Link href={`/dreamer/my-dreams/${idea.id}`}>
                View & Edit Details <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            {idea.status === 'private' && (
              <Button onClick={() => handleSubmitToInvestors(idea.id)} variant="default" className="bg-accent hover:bg-accent/90">
                Submit to Investors <Send className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
