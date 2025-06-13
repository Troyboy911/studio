
"use client";

import type { DreamIdea } from '@/types';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Edit3, Send, CheckCircle, Hourglass, Star, Lock } from 'lucide-react';
import { mockUserIdeas as initialMockIdeas } from '@/lib/mockIdeas';
import { useToast } from "@/hooks/use-toast";

export default function MyIdeasClient() {
  const [ideas, setIdeas] = useState<DreamIdea[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const subStatus = localStorage.getItem('dreamerSubscribed') === 'true';
    setIsSubscribed(subStatus);

    const userSpecificIdeas = initialMockIdeas.filter(idea => idea.status === 'private' || idea.status === 'submitted');
    setIdeas(userSpecificIdeas);
  }, []);

  const handleSubmitToInvestors = (ideaId: string) => {
    if (!isSubscribed) {
      toast({
        title: "Subscription Required",
        description: "Please subscribe to submit your ideas to investors.",
        variant: "destructive",
      });
      return;
    }

    setIdeas(prevIdeas => 
      prevIdeas.map(idea => 
        idea.id === ideaId ? { ...idea, status: 'submitted' as const, updatedAt: new Date() } : idea
      )
    );
    
    const ideaIndex = initialMockIdeas.findIndex(i => i.id === ideaId);
    if (ideaIndex !== -1) {
      initialMockIdeas[ideaIndex].status = 'submitted';
      initialMockIdeas[ideaIndex].updatedAt = new Date();
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
              <Button 
                onClick={() => handleSubmitToInvestors(idea.id)} 
                variant="default" 
                className="bg-accent hover:bg-accent/90"
                disabled={!isSubscribed}
                title={!isSubscribed ? "Subscription required to submit" : "Submit to Investors"}
              >
                {isSubscribed ? <Send className="mr-2 h-4 w-4" /> : <Lock className="mr-2 h-4 w-4" />}
                Submit to Investors
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
       {!isSubscribed && (
         <Card className="mt-6 border-dashed border-accent bg-accent/5">
           <CardHeader>
             <CardTitle className="flex items-center text-accent">
               <Star className="mr-2 h-6 w-6"/> Unlock Investor Submissions
             </CardTitle>
           </CardHeader>
           <CardContent>
             <p className="text-accent/90">
               Want to submit your ideas to our investor network? An active subscription is required.
             </p>
           </CardContent>
           <CardFooter>
             <Button 
                onClick={() => {
                    localStorage.setItem('dreamerSubscribed', 'true');
                    setIsSubscribed(true);
                    window.location.reload();
                }} 
                className="bg-accent hover:bg-accent/80 text-accent-foreground"
             >
               Mock Subscribe Now
             </Button>
           </CardFooter>
         </Card>
       )}
    </div>
  );
}
