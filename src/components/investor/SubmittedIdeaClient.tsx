
"use client";

import type { DreamIdea, Message } from '@/types';
import { useState, useEffect, type FormEvent } from 'react';
import { mockUserIdeas, INVESTOR_MOCK_ID, INVESTOR_MOCK_NAME } from '@/lib/mockIdeas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import InvestmentOfferForm from './InvestmentOfferForm';
import { ArrowLeft, Lightbulb, Sparkles, Target, Clock, Send, MessagesSquare, MailWarning } from 'lucide-react';
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
    const foundIdea = mockUserIdeas.find(i => i.id === ideaId && (i.status === 'submitted' || i.status === 'reviewing_offers'));
    if (foundIdea) {
      setIdea(foundIdea);
      const initialMessages = [...(foundIdea.communications || [])].sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      setDisplayedIdeaMessages(initialMessages);

      // Mark messages from dreamer as read
      let messagesUpdated = false;
      const updatedMessages = initialMessages.map(msg => {
        if (msg.senderId !== INVESTOR_MOCK_ID && !msg.read) {
          messagesUpdated = true;
          return { ...msg, read: true };
        }
        return msg;
      });

      if (messagesUpdated) {
        const ideaIndex = mockUserIdeas.findIndex(i => i.id === foundIdea.id);
        if (ideaIndex !== -1) {
          mockUserIdeas[ideaIndex].communications = updatedMessages;
          setDisplayedIdeaMessages(updatedMessages); // Update displayed messages if read status changed
        }
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
      read: false, // Dreamer hasn't read it yet
    };

    const ideaIndex = mockUserIdeas.findIndex(i => i.id === idea.id);
    if (ideaIndex !== -1) {
      const currentIdea = mockUserIdeas[ideaIndex];
      currentIdea.communications = [...(currentIdea.communications || []), messageToSend];
      currentIdea.updatedAt = new Date(); // Update idea's last activity
      
      // Update local state for immediate UI refresh
      setIdea(currentIdea); 
      setDisplayedIdeaMessages(prevMessages => 
        [...(prevMessages || []), messageToSend].sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      );
    }

    setNewInvestorMessage('');
    toast({
      title: "Message Sent!",
      description: "Your message has been sent to the dreamer.",
    });
  };


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
                    {idea.status === 'reviewing_offers' ? 'Reviewing Offers' : 'Ready for Investment'}
                </Badge>
              </div>
              <CardDescription>
                Submitted: {new Date(idea.updatedAt).toLocaleDateString()}
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
           {/* Messaging Section */}
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
                      <div className={`p-3 rounded-lg max-w-[75%] ${msg.senderId === INVESTOR_MOCK_ID ? 'bg-primary/20 text-primary-foreground self-end' : 'bg-card'}`}>
                        <p className="text-sm font-semibold">{msg.senderName}</p>
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
          <InvestmentOfferForm idea={idea} />
          {/* Placeholder for Dreamer Profile Snippet - Future Feature */}
          <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="text-lg">About the Dreamer</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">(Dreamer profile information will be displayed here once available and shared.)</p>
                {/* 
                <Avatar>
                    <AvatarImage src={idea.dreamer?.avatarUrl} />
                    <AvatarFallback>{idea.dreamer?.name?.substring(0,1) || 'D'}</AvatarFallback>
                </Avatar>
                <p className="font-semibold">{idea.dreamer?.name}</p>
                <p className="text-xs text-muted-foreground">{idea.dreamer?.bio?.substring(0,100)}...</p>
                 */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
