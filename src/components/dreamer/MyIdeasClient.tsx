
"use client";

import type { DreamIdea } from '@/types';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { ArrowRight, Edit3, Send, CheckCircle, Hourglass, Star, Lock, Zap, CreditCard } from 'lucide-react';
import { mockUserIdeas as initialMockIdeas } from '@/lib/mockIdeas';
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from 'date-fns';

function MockPremierPaymentDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  ideaTitle 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onConfirm: () => void, 
  ideaTitle?: string 
}) {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(openState) => !openState && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Zap className="mr-3 h-6 w-6 text-yellow-500" /> Feature Your Dream
          </DialogTitle>
          <DialogDescription className="pt-2">
            Make "<strong>{ideaTitle || 'Your Dream'}</strong>" stand out to investors for 24 hours.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <p className="text-center font-semibold text-lg">Premier Feature (24h)</p>
              <p className="text-center text-3xl font-bold text-yellow-500 mt-2">$4.99</p>
              <p className="text-center text-xs text-muted-foreground mt-1">(Mock Price - No Real Charge)</p>
            </CardContent>
          </Card>
        </div>
        <DialogFooter className="gap-2 sm:justify-between">
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={onConfirm} className="bg-yellow-500 hover:bg-yellow-500/90 text-yellow-foreground">
            <CreditCard className="mr-2 h-4 w-4" /> Confirm & Feature (Mock)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export default function MyIdeasClient() {
  const [ideas, setIdeas] = useState<DreamIdea[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showPremierPaymentDialog, setShowPremierPaymentDialog] = useState(false);
  const [selectedIdeaForPremier, setSelectedIdeaForPremier] = useState<DreamIdea | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const subStatus = localStorage.getItem('dreamerSubscribed') === 'true';
    setIsSubscribed(subStatus);
    setIdeas([...initialMockIdeas]);
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

  const openPremierPaymentDialog = (idea: DreamIdea) => {
    setSelectedIdeaForPremier(idea);
    setShowPremierPaymentDialog(true);
  };

  const handleConfirmPremierPayment = () => {
    if (!selectedIdeaForPremier) return;

    const ideaId = selectedIdeaForPremier.id;
    setIdeas(prevIdeas =>
      prevIdeas.map(idea =>
        idea.id === ideaId ? {
          ...idea,
          isPremier: true,
          premierUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), 
          updatedAt: new Date()
        } : idea
      )
    );
    const ideaIndex = initialMockIdeas.findIndex(i => i.id === ideaId);
    if (ideaIndex !== -1) {
      initialMockIdeas[ideaIndex].isPremier = true;
      initialMockIdeas[ideaIndex].premierUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
      initialMockIdeas[ideaIndex].updatedAt = new Date();
    }
    toast({
      title: "Dream Featured!",
      description: `"${selectedIdeaForPremier.title}" will be featured as Premier for 24 hours.`,
    });
    setShowPremierPaymentDialog(false);
    setSelectedIdeaForPremier(null);
  };

  const activeUserIdeas = ideas.filter(idea => idea.status === 'private' || idea.status === 'submitted' || idea.status === 'reviewing_offers');


  if (activeUserIdeas.length === 0 && ideas.length > 0) {
    return (
      <div className="text-center py-10">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <h3 className="text-xl font-semibold text-foreground">All Dreams Accounted For!</h3>
        <p className="text-muted-foreground mb-4">It looks like all your current dreams are either funded or acquired. Congratulations!</p>
        <Button asChild>
          <Link href="/dreamer/new-idea">
            <Edit3 className="mr-2 h-4 w-4" /> Start a New Dream
          </Link>
        </Button>
      </div>
    );
  }


  if (activeUserIdeas.length === 0) {
    return (
      <div className="text-center py-10">
        <Hourglass className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-foreground">No Dreams Yet?</h3>
        <p className="text-muted-foreground mb-4">It looks like you haven't started any dreams.</p>
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
      {activeUserIdeas.map((idea) => {
        const isCurrentlyPremier = idea.isPremier && idea.premierUntil && new Date(idea.premierUntil) > new Date();
        const canBeMadePremier = (idea.status === 'private' || idea.status === 'submitted');

        return (
          <Card key={idea.id} className={`shadow-lg hover:shadow-xl transition-shadow ${isCurrentlyPremier ? 'border-2 border-yellow-500 bg-yellow-50/30' : ''}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl text-primary flex items-center">
                  {isCurrentlyPremier && <Zap className="mr-2 h-6 w-6 text-yellow-500" />}
                  {idea.title}
                </CardTitle>
                <Badge variant={idea.status === 'submitted' || idea.status === 'reviewing_offers' ? 'default' : 'secondary'} className={idea.status === 'submitted' || idea.status === 'reviewing_offers' ? 'bg-accent text-accent-foreground' : ''}>
                  {idea.status === 'private' && <Edit3 className="mr-1 h-3 w-3" />}
                  {(idea.status === 'submitted' || idea.status === 'reviewing_offers') && <CheckCircle className="mr-1 h-3 w-3" />}
                  {idea.status.charAt(0).toUpperCase() + idea.status.slice(1).replace('_', ' ')}
                </Badge>
              </div>
              <CardDescription>
                {idea.refinedText ? idea.refinedText.substring(0, 150) + '...' : idea.originalText.substring(0, 150) + '...'}
              </CardDescription>
              {isCurrentlyPremier && idea.premierUntil && (
                <Badge variant="outline" className="mt-2 w-fit border-yellow-600 text-yellow-700">
                  Premier active for {formatDistanceToNow(new Date(idea.premierUntil), { addSuffix: true })}
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date(idea.updatedAt).toLocaleDateString()}
              </p>
            </CardContent>
            <CardFooter className="flex flex-wrap justify-between items-center gap-2">
              <Button variant="outline" asChild>
                <Link href={`/dreamer/my-dreams/${idea.id}`}>
                  View & Edit Details <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <div className="flex gap-2 flex-wrap">
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
                {canBeMadePremier && !isCurrentlyPremier && (
                  <Button
                    onClick={() => openPremierPaymentDialog(idea)}
                    variant="outline"
                    className="border-yellow-500 text-yellow-600 hover:bg-yellow-100 hover:text-yellow-700"
                  >
                    <Zap className="mr-2 h-4 w-4" /> Feature as Premier (24h)
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        );
      })}
       {!isSubscribed && (
         <Card className="mt-6 border-dashed border-accent bg-accent/5">
           <CardHeader>
             <CardTitle className="flex items-center text-accent">
               <Star className="mr-2 h-6 w-6"/> Unlock Investor Submissions & More
             </CardTitle>
           </CardHeader>
           <CardContent>
             <p className="text-accent/90">
               Want to submit your ideas to our investor network and access all planner features? An active subscription is required.
             </p>
           </CardContent>
           <CardFooter>
             <Button
                onClick={() => {
                    localStorage.setItem('dreamerSubscribed', 'true');
                    setIsSubscribed(true);
                    setIdeas(prev => [...prev]); 
                }}
                className="bg-accent hover:bg-accent/80 text-accent-foreground"
             >
               Mock Subscribe Now
             </Button>
           </CardFooter>
         </Card>
       )}
        <MockPremierPaymentDialog 
            isOpen={showPremierPaymentDialog}
            onClose={() => {
                setShowPremierPaymentDialog(false);
                setSelectedIdeaForPremier(null);
            }}
            onConfirm={handleConfirmPremierPayment}
            ideaTitle={selectedIdeaForPremier?.title}
        />
    </div>
  );
}
