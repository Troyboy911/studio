
"use client";

import type { DreamIdea, Goal, Meeting, ResearchLink, Contact, Message } from '@/types';
import { useState, useEffect, type FormEvent, useActionState, useRef } from 'react';
import { mockUserIdeas, DREAMER_MOCK_ID, DREAMER_MOCK_NAME, INVESTOR_MOCK_ID } from '@/lib/mockIdeas'; 
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import GoalChecklist from './GoalChecklist';
import MeetingScheduler from './MeetingScheduler';
import { ArrowLeft, Lightbulb, Sparkles, Send, CheckCircle, Lock, Star, Link as LinkIcon, Users, BookOpen, MessageSquare, Edit, Trash2, PlusCircle, Wand2, Save, MessagesSquare, MailWarning, Tag, Loader2, Bot } from 'lucide-react';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { askCoachAction, type AskCoachState } from '@/app/dreamer/my-dreams/coach-actions';

interface DreamDetailClientProps {
  ideaId: string;
}

const ideaCategories = ["Technology", "Social Impact", "Sustainability", "Education", "Healthcare", "Arts & Culture", "E-commerce", "Finance", "Other"];

interface CoachChatMessage {
  role: 'user' | 'model';
  content: string;
}

export default function DreamDetailClient({ ideaId }: DreamDetailClientProps) {
  const [idea, setIdea] = useState<DreamIdea | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const [showAddLinkForm, setShowAddLinkForm] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkDescription, setNewLinkDescription] = useState('');

  const [showAddContactForm, setShowAddContactForm] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactNotes, setNewContactNotes] = useState('');
  
  const [editableResearchNotes, setEditableResearchNotes] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  const [newDreamerReply, setNewDreamerReply] = useState('');
  const [displayedIdeaMessages, setDisplayedIdeaMessages] = useState<Message[]>([]);

  // AI Coach State
  const initialCoachState: AskCoachState = {};
  const [coachState, coachFormAction, isCoachPending] = useActionState(askCoachAction, initialCoachState);
  const [coachChatHistory, setCoachChatHistory] = useState<CoachChatMessage[]>([]);
  const [coachUserInput, setCoachUserInput] = useState('');
  const coachChatContainerRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const subStatus = localStorage.getItem('dreamerSubscribed') === 'true';
    setIsSubscribed(subStatus);

    const foundIdea = mockUserIdeas.find(i => i.id === ideaId);
    if (foundIdea) {
      setIdea(foundIdea);
      setEditableResearchNotes(foundIdea.researchNotes || '');
      setSelectedCategory(foundIdea.category || undefined);
      
      const initialMessages = [...(foundIdea.communications || [])].sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      setDisplayedIdeaMessages(initialMessages);

      let messagesUpdated = false;
      const updatedMessages = initialMessages.map(msg => {
        if (msg.senderId !== DREAMER_MOCK_ID && !msg.read) {
          messagesUpdated = true;
          return { ...msg, read: true };
        }
        return msg;
      });
      
      if (messagesUpdated) {
        const ideaIndex = mockUserIdeas.findIndex(i => i.id === foundIdea.id);
        if (ideaIndex !== -1) {
          mockUserIdeas[ideaIndex].communications = updatedMessages;
           setIdea(prevIdea => prevIdea ? {...prevIdea, communications: updatedMessages} : null);
           setDisplayedIdeaMessages(updatedMessages);
        }
      }
      // Initialize AI Coach chat
      setCoachChatHistory([{ role: 'model', content: `Hello! I'm your AI Dream Coach. How can I help you with "${foundIdea.title}" today?`}]);


    }
    setLoading(false);
  }, [ideaId]);

  // AI Coach: Handle response from server action
  useEffect(() => {
    if (coachState?.coachResponse) {
      setCoachChatHistory(prev => [...prev, { role: 'model', content: coachState.coachResponse as string }]);
      // If the user's message was part of the state, we can use it to confirm which message this response is for
      // For now, we assume it's for the last user message added optimistically.
    }
    if (coachState?.error) {
      toast({ title: "AI Coach Error", description: coachState.error, variant: "destructive" });
      // Optionally remove the optimistic user message if the call failed.
      // Or add an error message from the 'model'.
      setCoachChatHistory(prev => [...prev, {role: 'model', content: `Sorry, I encountered an error: ${coachState.error}`}]);
    }
  }, [coachState, toast]);

  // AI Coach: Scroll to bottom of chat
  useEffect(() => {
    if (coachChatContainerRef.current) {
      coachChatContainerRef.current.scrollTop = coachChatContainerRef.current.scrollHeight;
    }
  }, [coachChatHistory]);
  
  const handleDataChange = (section: keyof DreamIdea, data: any, friendlySectionName?: string) => {
    if (idea) {
      const newIdeaState = { ...idea, [section]: data, updatedAt: new Date() };
      setIdea(newIdeaState); 
      const ideaIndex = mockUserIdeas.findIndex(i => i.id === ideaId);
      if (ideaIndex !== -1) {
        mockUserIdeas[ideaIndex] = newIdeaState; 
      }
      toast({ title: `${friendlySectionName || section.toString().charAt(0).toUpperCase() + section.slice(1)} Updated`, description: `Your project ${friendlySectionName?.toLowerCase() || section.toString().replace(/([A-Z])/g, ' $1').toLowerCase()} have been saved.` });
    }
  };

  const handleCategoryChange = (newCategory: string) => {
    setSelectedCategory(newCategory);
    handleDataChange('category', newCategory, "Idea Category");
  };

  const handleGoalsChange = (updatedGoals: Goal[]) => handleDataChange('goals', updatedGoals, "Goals");
  const handleMeetingsChange = (updatedMeetings: Meeting[]) => handleDataChange('meetings', updatedMeetings, "Meetings");

  const handleAddResearchLink = (e: FormEvent) => {
    e.preventDefault();
    if (!newLinkTitle.trim() || !newLinkUrl.trim() || !idea) return;
    const newLink: ResearchLink = {
      id: `link-${Date.now()}`,
      title: newLinkTitle,
      url: newLinkUrl,
      description: newLinkDescription || undefined,
    };
    const updatedLinks = [...(idea.researchLinks || []), newLink];
    handleDataChange('researchLinks', updatedLinks, "Research Links");
    setNewLinkTitle('');
    setNewLinkUrl('');
    setNewLinkDescription('');
    setShowAddLinkForm(false);
  };

  const handleAddContact = (e: FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !idea) return;
    const newContact: Contact = {
      id: `contact-${Date.now()}`,
      name: newContactName,
      email: newContactEmail || undefined,
      phone: newContactPhone || undefined,
      notes: newContactNotes || undefined,
    };
    const updatedContacts = [...(idea.contacts || []), newContact];
    handleDataChange('contacts', updatedContacts, "Contacts");
    setNewContactName('');
    setNewContactEmail('');
    setNewContactPhone('');
    setNewContactNotes('');
    setShowAddContactForm(false);
  };

  const handleSaveResearchNotes = () => {
    if (!idea) return;
    handleDataChange('researchNotes', editableResearchNotes, "Research Notes");
  };

  const handleSendDreamerReply = (e: FormEvent) => {
    e.preventDefault();
    if (!newDreamerReply.trim() || !idea) return;

    const replyToSend: Message = {
      id: `msg-${idea.id}-${Date.now()}`,
      ideaId: idea.id,
      senderId: DREAMER_MOCK_ID,
      senderName: DREAMER_MOCK_NAME,
      content: newDreamerReply.trim(),
      timestamp: new Date(),
      read: false, 
    };

    const ideaIndex = mockUserIdeas.findIndex(i => i.id === idea.id);
    if (ideaIndex !== -1) {
      const currentIdea = mockUserIdeas[ideaIndex];
      currentIdea.communications = [...(currentIdea.communications || []), replyToSend];
      currentIdea.updatedAt = new Date();
      
      setIdea(currentIdea); 
      setDisplayedIdeaMessages(prevMessages => 
        [...(prevMessages || []), replyToSend].sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      );
    }
    
    setNewDreamerReply('');
    toast({
      title: "Reply Sent!",
      description: "Your reply has been sent to the investor.",
    });
  };

  const handleSubmitToInvestors = () => {
     if (!isSubscribed) {
      toast({
        title: "Subscription Required",
        description: "Please subscribe to submit your ideas to investors.",
        variant: "destructive",
      });
      return;
    }
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

  const handleAskCoachSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!coachUserInput.trim() || !idea) return;

    // Optimistically add user's message to chat
    setCoachChatHistory(prev => [...prev, { role: 'user', content: coachUserInput.trim() }]);
    
    const formData = new FormData(event.currentTarget);
    formData.set('userMessage', coachUserInput.trim()); // ensure current input is used
    formData.set('ideaId', idea.id);
    formData.set('ideaTitle', idea.title);
    formData.set('ideaOriginalText', idea.originalText);
    if (idea.refinedText) formData.set('ideaRefinedText', idea.refinedText);
    
    // Pass only previous messages, not the current user input which is in formData
    const historyForAction = coachChatHistory.filter(msg => msg.role === 'model' || (msg.role === 'user' && msg.content !== coachUserInput.trim()));
    formData.set('chatHistory', JSON.stringify(historyForAction));
    
    coachFormAction(formData);
    setCoachUserInput(''); // Clear input after submission attempt
  };


  if (loading) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"><Loader2 className="h-12 w-12 animate-spin text-primary" /><p className="ml-2">Loading dream details...</p></div>;
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
            <p className="text-muted-foreground mb-1 text-base"><span className="font-medium text-foreground/80">Original Concept:</span> {idea.originalText}</p>
            {idea.refinedText && <p className="text-muted-foreground mb-1 text-base"><span className="font-medium text-foreground/80">Refined Version:</span> {idea.refinedText}</p>}
            {idea.suggestions && idea.suggestions.length > 0 && (
              <div>
                <h4 className="font-medium text-foreground/80 mt-2 text-base">AI Suggestions:</h4>
                <ul className="list-disc list-inside text-muted-foreground ml-4 text-base">
                  {idea.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}
          </div>
          
          {idea.status === 'private' && (
            <div className="flex justify-end">
              <Button 
                onClick={handleSubmitToInvestors} 
                className="bg-accent hover:bg-accent/90"
                disabled={!isSubscribed}
                title={!isSubscribed ? "Subscription required to submit" : "Submit to Investors"}
              >
                {isSubscribed ? <Send className="mr-2 h-4 w-4" /> : <Lock className="mr-2 h-4 w-4" />}
                Submit to Investors
              </Button>
            </div>
          )}
          {idea.status === 'submitted' && (
             <Alert className="border-accent bg-accent/5 text-accent-foreground">
              <CheckCircle className="h-5 w-5 text-accent" />
              <AlertTitle>Submitted to Investors!</AlertTitle>
              <AlertDescription>
                This idea is currently visible to investors. You may receive offers soon.
              </AlertDescription>
            </Alert>
          )}
           {idea.status === 'reviewing_offers' && (
             <Alert className="border-primary bg-primary/5 text-primary-foreground">
              <CheckCircle className="h-5 w-5 text-primary" />
              <AlertTitle>Offers Received!</AlertTitle>
              <AlertDescription>
                You have received one or more offers for this idea. Check communications and manage offers below.
              </AlertDescription>
            </Alert>
          )}


        </CardContent>
      </Card>

        <Card>
            <CardHeader>
                <CardTitle className="text-xl flex items-center">
                <Tag className="mr-2 h-5 w-5 text-primary" /> Idea Category
                </CardTitle>
                <CardDescription>
                    Categorize your idea to help investors find it and for better organization.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isSubscribed ? (
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="w-full md:w-[280px]">
                    <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                    {ideaCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                ) : (
                <p className="text-muted-foreground">
                    {selectedCategory ? `Category: ${selectedCategory}` : 'No category set. Subscribe to categorize.'}
                </p>
                )}
                 {!isSubscribed && (
                    <Alert className="mt-4 border-accent/50 bg-accent/10">
                        <Star className="h-4 w-4 text-accent" />
                        <AlertDescription className="text-accent/90">
                        Subscribe to IDream Premium to categorize your ideas.
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>


       {!isSubscribed && (idea.status === 'private' || !selectedCategory) && (
         <Card className="mt-6 border-dashed border-accent bg-accent/5">
           <CardHeader>
             <CardTitle className="flex items-center text-accent">
               <Star className="mr-2 h-6 w-6"/> Unlock Full Dream Planner &amp; Investor Submissions
             </CardTitle>
           </CardHeader>
           <CardContent>
             <p className="text-accent/90 text-base">
               To access the detailed Dream Planner (Goals, Meetings, Research, Contacts, AI Coach, Investor Communications), categorize your idea, and submit this idea to our investor network, an active subscription is required.
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

      {isSubscribed && (
        <>
          <Separator className="my-8" />
          <h2 className="text-2xl font-semibold text-foreground mb-4">Dream Planner Dashboard</h2>
          
          {(idea.status === 'submitted' || idea.status === 'reviewing_offers' || (idea.communications && idea.communications.length > 0)) && (
            <Card className="mb-8 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <MessagesSquare className="mr-2 h-6 w-6 text-primary" /> Investor Communications
                </CardTitle>
                 <CardDescription>
                  View messages from and send replies to interested investors.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-96 overflow-y-auto space-y-3 p-3 border rounded-md bg-muted/20">
                  {displayedIdeaMessages.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No messages from investors yet.</p>
                  ) : (
                    displayedIdeaMessages.map(msg => (
                      <div key={msg.id} className={`flex flex-col ${msg.senderId === DREAMER_MOCK_ID ? 'items-end' : 'items-start'}`}>
                        <div className={`p-3 rounded-lg max-w-[75%] ${msg.senderId === DREAMER_MOCK_ID ? 'bg-primary/20 text-primary-foreground self-end' : 'bg-card'}`}>
                          <p className="text-sm font-semibold flex items-center">
                            {msg.senderName}
                            {msg.senderId !== DREAMER_MOCK_ID && !msg.read && <MailWarning className="ml-2 h-4 w-4 text-accent" title="Unread"/>}
                          </p>
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          <p className="text-xs text-muted-foreground mt-1">{new Date(msg.timestamp).toLocaleTimeString()} - {new Date(msg.timestamp).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <form onSubmit={handleSendDreamerReply} className="space-y-3">
                  <div>
                    <Label htmlFor="dreamerReply" className="sr-only">Your Reply</Label>
                    <Textarea
                      id="dreamerReply"
                      value={newDreamerReply}
                      onChange={(e) => setNewDreamerReply(e.target.value)}
                      placeholder="Type your reply to an investor..."
                      rows={3}
                      required
                      className="text-base"
                    />
                  </div>
                  <Button type="submit" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                    <Send className="mr-2 h-4 w-4" /> Send Reply
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            <GoalChecklist initialGoals={idea.goals} onGoalsChange={handleGoalsChange} />
            <MeetingScheduler initialMeetings={idea.meetings} onMeetingsChange={handleMeetingsChange} />
          </div>

          <div className="space-y-8 mt-8">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="text-xl flex items-center"><LinkIcon className="mr-2 h-5 w-5 text-primary" /> Research &amp; Useful Links</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setShowAddLinkForm(!showAddLinkForm)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Link
                </Button>
              </CardHeader>
              <CardContent>
                {showAddLinkForm && (
                  <form onSubmit={handleAddResearchLink} className="mb-4 p-4 border rounded-md space-y-3 bg-muted/20">
                    <div>
                      <Label htmlFor="linkTitle">Link Title</Label>
                      <Input id="linkTitle" value={newLinkTitle} onChange={(e) => setNewLinkTitle(e.target.value)} placeholder="E.g., Market Analysis Report" required />
                    </div>
                    <div>
                      <Label htmlFor="linkUrl">URL</Label>
                      <Input id="linkUrl" type="url" value={newLinkUrl} onChange={(e) => setNewLinkUrl(e.target.value)} placeholder="https://example.com" required />
                    </div>
                    <div>
                      <Label htmlFor="linkDesc">Description (Optional)</Label>
                      <Textarea id="linkDesc" value={newLinkDescription} onChange={(e) => setNewLinkDescription(e.target.value)} placeholder="Brief note about the link" />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" size="sm">Save Link</Button>
                      <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddLinkForm(false)}>Cancel</Button>
                    </div>
                  </form>
                )}
                {!idea.researchLinks || idea.researchLinks.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No research links added yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {idea.researchLinks.map(link => (
                      <li key={link.id} className="p-3 border rounded-md hover:bg-muted/30">
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">{link.title}</a>
                        {link.description && <p className="text-xs text-muted-foreground mt-1">{link.description}</p>}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="text-xl flex items-center"><Users className="mr-2 h-5 w-5 text-primary" /> Key Contacts</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setShowAddContactForm(!showAddContactForm)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Contact
                </Button>
              </CardHeader>
              <CardContent>
                {showAddContactForm && (
                   <form onSubmit={handleAddContact} className="mb-4 p-4 border rounded-md space-y-3 bg-muted/20">
                     <div>
                       <Label htmlFor="contactName">Name</Label>
                       <Input id="contactName" value={newContactName} onChange={(e) => setNewContactName(e.target.value)} placeholder="E.g., Jane Doe" required />
                     </div>
                     <div>
                       <Label htmlFor="contactEmail">Email (Optional)</Label>
                       <Input id="contactEmail" type="email" value={newContactEmail} onChange={(e) => setNewContactEmail(e.target.value)} placeholder="jane.doe@example.com" />
                     </div>
                     <div>
                       <Label htmlFor="contactPhone">Phone (Optional)</Label>
                       <Input id="contactPhone" type="tel" value={newContactPhone} onChange={(e) => setNewContactPhone(e.target.value)} placeholder="+1234567890" />
                     </div>
                     <div>
                       <Label htmlFor="contactNotes">Notes (Optional)</Label>
                       <Textarea id="contactNotes" value={newContactNotes} onChange={(e) => setNewContactNotes(e.target.value)} placeholder="E.g., Potential Advisor" />
                     </div>
                     <div className="flex gap-2">
                       <Button type="submit" size="sm">Save Contact</Button>
                       <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddContactForm(false)}>Cancel</Button>
                     </div>
                   </form>
                )}
                {!idea.contacts || idea.contacts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No contacts added yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {idea.contacts.map(contact => (
                      <li key={contact.id} className="p-3 border rounded-md hover:bg-muted/30">
                        <p className="font-semibold">{contact.name}</p>
                        {contact.email && <p className="text-xs text-muted-foreground">Email: {contact.email}</p>}
                        {contact.phone && <p className="text-xs text-muted-foreground">Phone: {contact.phone}</p>}
                        {contact.notes && <p className="text-xs text-muted-foreground mt-1">Notes: {contact.notes}</p>}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="text-xl flex items-center"><BookOpen className="mr-2 h-5 w-5 text-primary" /> Research Notes</CardTitle>
                 <Button variant="outline" size="sm" onClick={handleSaveResearchNotes}>
                   <Save className="mr-2 h-4 w-4" /> Save Notes
                 </Button>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={editableResearchNotes}
                  onChange={(e) => setEditableResearchNotes(e.target.value)}
                  placeholder="Jot down your research findings, brainstorming, competitor analysis, etc."
                  rows={10}
                  className="text-base"
                />
              </CardContent>
            </Card>
          </div>

          <Separator className="my-8" />
          
          <Card className="mt-8 bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl flex items-center text-primary">
                <Bot className="mr-2 h-6 w-6" /> AI Dream Coach
              </CardTitle>
              <CardDescription>Get personalized advice, refine your plan, and overcome hurdles.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div ref={coachChatContainerRef} className="h-96 overflow-y-auto space-y-4 p-4 border rounded-md bg-muted/20">
                {coachChatHistory.map((msg, index) => (
                  <div key={index} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-3 rounded-lg max-w-[85%] shadow-sm ${msg.role === 'user' ? 'bg-primary/30 text-primary-foreground self-end' : 'bg-card'}`}>
                      <p className="text-sm font-semibold capitalize">{msg.role === 'model' ? 'AI Coach' : 'You'}</p>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isCoachPending && (
                  <div className="flex items-start">
                     <div className="p-3 rounded-lg max-w-[85%] shadow-sm bg-card flex items-center">
                        <Loader2 className="h-5 w-5 animate-spin mr-2 text-primary" />
                        <span className="text-sm text-muted-foreground">AI Coach is typing...</span>
                    </div>
                  </div>
                )}
                 {coachState?.fieldErrors?.userMessage && (
                    <p className="text-xs text-destructive mt-1">{coachState.fieldErrors.userMessage.join(", ")}</p>
                  )}
              </div>
              <form onSubmit={handleAskCoachSubmit} className="flex items-start gap-2">
                <Textarea
                  name="userMessageInput" // Name distinct from form data 'userMessage' to avoid conflicts if needed
                  value={coachUserInput}
                  onChange={(e) => setCoachUserInput(e.target.value)}
                  placeholder="Ask your AI coach..."
                  rows={2}
                  className="flex-grow text-base"
                  disabled={isCoachPending}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      // Safely cast target to HTMLFormElement if the form is the direct parent
                      const form = e.currentTarget.closest('form');
                      if (form) {
                        // Create a submit event (or directly call the submit handler)
                        // form.requestSubmit(); // Modern way
                        // For broader compatibility or if direct call is simpler:
                        handleAskCoachSubmit(e as unknown as React.FormEvent<HTMLFormElement>); // This might need refinement for type safety
                      }
                    }
                  }}
                />
                <Button type="submit" disabled={isCoachPending || !coachUserInput.trim()} className="bg-primary hover:bg-primary/90 text-primary-foreground h-auto py-3">
                  {isCoachPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  <span className="sr-only">Send message</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
