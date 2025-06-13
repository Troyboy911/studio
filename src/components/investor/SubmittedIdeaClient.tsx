
"use client";

import type { DreamIdea, Message } from '@/types';
import { useState, useEffect, type FormEvent } from 'react';
import { mockUserIdeas, INVESTOR_MOCK_ID, INVESTOR_MOCK_NAME } from '@/lib/mockIdeas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import InvestmentOfferForm from './InvestmentOfferForm';
import { ArrowLeft, Lightbulb, Sparkles, Target, Clock, Send, MessagesSquare, MailWarning, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from "@/hooks/use-toast";
import { Label } from '../ui/label';

interface SubmittedIdeaClientProps {
  ideaId: string;
}

export default function SubmittedIdeaClient({ ideaId }: SubmittedIdeaClientProps) {
  const [idea, setIdea] = useState<DreamIdea | null>(null);
  const [loading, setLoading] = useState(true);
  const [newInvestorMessage, setNewInvestorMessage] = useState('');
  const [displayedIdeaMessages, setDisplayedIdeaMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Simulating a fetch. In a real app, this might be an API call.
    // For now, we directly use and potentially modify mockUserIdeas.
    const foundIdea = mockUserIdeas.find(i => i.id === ideaId && (i.status === 'submitted' || i.status === 'reviewing_offers' || i.status === 'funded' || i.status === 'acquired'));
    if (foundIdea) {
      setIdea(foundIdea); // Set the initial idea state
      
      const initialMessages = [...(foundIdea.communications || [])].sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      setDisplayedIdeaMessages(initialMessages);

      // Mark messages from dreamer as read (if not already)
      let messagesUpdated = false;
      const updatedMessages = initialMessages.map(msg => {
        if (msg.senderId !== INVESTOR_MOCK_ID && !msg.read) {
          messagesUpdated = true;
          return { ...msg, read: true };
        }
        return msg;
      });

      if (messagesUpdated) {
        const ideaIndexGlobal = mockUserIdeas.findIndex(i => i.id === foundIdea.id);
        if (ideaIndexGlobal !== -1) {
          mockUserIdeas[ideaIndexGlobal].communications = updatedMessages;
        }
        // Update local state for UI consistency if needed immediately, though reading from mockUserIdeas should reflect it
         setIdea(prevIdea => prevIdea ? { ...prevIdea, communications: updatedMessages } : null);
         setDisplayedIdeaMessages(updatedMessages);
      }

    }
    setLoading(false);
  }, [ideaId]);

  const handleSendInvestorMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!newInvestorMessage.trim() || !idea) return;

    const messageToSend: Message = {
      id: `msg-${idea.id}-${Date.now()}`,
      ideaId: idea.id,
      senderId: INVESTOR_MOCK_ID,
      senderName: INVESTOR_MOCK_NAME, 
      content: newInvestorMessage.trim(),
      timestamp: new Date(),
      read: false, 
    };

    // Update the mockUserIdeas array directly
    const ideaIndex = mockUserIdeas.findIndex(i => i.id === idea.id);
    if (ideaIndex !== -1) {
      const currentIdea = mockUserIdeas[ideaIndex];
      const updatedCommunications = [...(currentIdea.communications || []), messageToSend];
      mockUserIdeas[ideaIndex].communications = updatedCommunications;
      mockUserIdeas[ideaIndex].updatedAt = new Date(); 
      
      // Update local state for immediate UI refresh
      setIdea(mockUserIdeas[ideaIndex]); 
      setDisplayedIdeaMessages(updatedCommunications.sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()));
    }

    setNewInvestorMessage('');
    toast({
      title: "Message Sent!",
      description: "Your message has been sent to the dreamer.",
    });
  };


  if (loading) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"><Loader2 className="h-12 w-12 animate-spin text-primary" /><p className="ml-2">Loading idea details...</p></div>;
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
  
  const canMakeOffer = idea.status === 'submitted' || idea.status === 'reviewing_offers';

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
                <Badge 
                    variant={idea.status === 'funded' || idea.status === 'acquired' ? 'default' : (idea.status === 'reviewing_offers' ? 'secondary' : 'outline')}
                    className={`text-sm px-3 py-1 whitespace-nowrap ${idea.status === 'funded' ? 'bg-green-600 text-white' : idea.status === 'acquired' ? 'bg-purple-600 text-white' : idea.status === 'reviewing_offers' ? 'bg-blue-500 text-white' : 'bg-accent text-accent-foreground'}`}
                >
                    {idea.status.charAt(0).toUpperCase() + idea.status.slice(1).replace('_', ' ')}
                </Badge>
              </div>
              <CardDescription>
                Submitted: {new Date(idea.updatedAt).toLocaleDateString()}
                 {idea.category && ` | Category: ${idea.category}`}
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
                    <CardTitle className="text-xl">Project Plan Overview</CardTitle>
                     <CardDescription>Key milestones and objectives set by the dreamer.</CardDescription>
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
           <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <MessagesSquare className="mr-2 h-6 w-6 text-primary" /> Communications with Dreamer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-h-96 overflow-y-auto space-y-3 p-3 border rounded-md bg-muted/20">
                {displayedIdeaMessages.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No messages yet. Start the conversation!</p>
                ) : (
                  displayedIdeaMessages.map(msg => (
                    <div key={msg.id} className={`flex flex-col ${msg.senderId === INVESTOR_MOCK_ID ? 'items-end' : 'items-start'}`}>
                      <div className={`p-3 rounded-lg max-w-[75%] shadow-sm ${msg.senderId === INVESTOR_MOCK_ID ? 'bg-primary/30 text-primary-foreground self-end' : 'bg-card'}`}>
                        <p className="text-sm font-semibold flex items-center">
                            {msg.senderName} 
                            {msg.senderId === INVESTOR_MOCK_ID && !msg.read && <MailWarning className="ml-2 h-4 w-4 text-muted-foreground" title="Sent, unread by dreamer"/>}
                        </p>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(msg.timestamp).toLocaleTimeString()} - {new Date(msg.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={handleSendInvestorMessage} className="space-y-3">
                <div>
                  <Label htmlFor="investorMessage" className="sr-only">Your Message</Label>
                  <Textarea
                    id="investorMessage"
                    value={newInvestorMessage}
                    onChange={(e) => setNewInvestorMessage(e.target.value)}
                    placeholder="Type your message to the dreamer..."
                    rows={3}
                    required
                    className="text-base"
                  />
                </div>
                <Button type="submit" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                  <Send className="mr-2 h-4 w-4" /> Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

        </div>

        <div className="lg:col-span-1 space-y-6">
          {canMakeOffer ? (
            <InvestmentOfferForm idea={idea} />
          ) : (
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Offer Stage Closed</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        This idea is currently {idea.status === 'funded' ? 'funded' : 'acquired'} and no longer accepting new offers.
                    </p>
                </CardContent>
            </Card>
          )}
          <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="text-lg">About the Dreamer</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">(Dreamer profile information will be displayed here once available and shared by the dreamer.)</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

