"use client";

import type { DreamIdea, Goal, Meeting, ResearchLink, Contact, Message, InvestmentOffer } from '@/types';
import { useState, useEffect, type FormEvent, useActionState, useRef } from 'react';
import { mockUserIdeas, DREAMER_MOCK_ID, DREAMER_MOCK_NAME } from '@/lib/mockIdeas';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import GoalChecklist from './GoalChecklist';
import MeetingScheduler from './MeetingScheduler';
import { ArrowLeft, Lightbulb, Sparkles, Send, CheckCircle, Lock, Star, Link as LinkIcon, Users, BookOpen, MessageSquare, Edit, Trash2, PlusCircle, Wand2, Save, MessagesSquare, MailWarning, Tag, Loader2, Bot, Briefcase, FileText, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { askCoachAction, type AskCoachState } from '@/app/dreamer/my-dreams/coach-actions';
import { useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

interface DreamDetailClientProps {
  ideaId: string;
}

const ideaCategories = ["Technology", "Social Impact", "Sustainability", "Education", "Healthcare", "Arts & Culture", "E-commerce", "Finance", "Other"];

interface CoachChatMessage {
  role: 'user' | 'model';
  content: string;
}

export default function DreamDetailClient({ ideaId }: DreamDetailClientProps) {
  const searchParams = useSearchParams();
  const routerTab = searchParams.get('tab');

  const [idea, setIdea] = useState<DreamIdea | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false); // Layout handles actual gating, this is for UI hints if needed
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

  const initialCoachState: AskCoachState = {};
  const [coachState, coachFormAction, isCoachPending] = useActionState(askCoachAction, initialCoachState);
  const [coachChatHistory, setCoachChatHistory] = useState<CoachChatMessage[]>([]);
  const [coachUserInput, setCoachUserInput] = useState('');
  const coachChatContainerRef = useRef<HTMLDivElement>(null);
  
  const [activeTab, setActiveTab] = useState("planner");

  useEffect(() => {
    // Determine default tab based on URL query param
    if (routerTab === 'offers' || routerTab === 'messages') {
      setActiveTab('investor-hub');
    } else {
      setActiveTab('planner');
    }
  }, [routerTab]);


  useEffect(() => {
    const subStatus = localStorage.getItem('dreamerSubscribed') === 'true';
    setIsSubscribed(subStatus); // Though layout handles gating, local state can be useful

    const foundIdea = mockUserIdeas.find(i => i.id === ideaId);
    if (foundIdea) {
      setIdea(foundIdea);
      setEditableResearchNotes(foundIdea.researchNotes || '');
      setSelectedCategory(foundIdea.category || undefined);

      const initialMessages = [...(foundIdea.communications || [])].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
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
          setIdea(prevIdea => prevIdea ? { ...prevIdea, communications: updatedMessages } : null);
          setDisplayedIdeaMessages(updatedMessages);
        }
      }
      setCoachChatHistory([{ role: 'model', content: `Hello! I'm your AI Dream Coach. How can I help you with "${foundIdea.title}" today?` }]);
    }
    setLoading(false);
  }, [ideaId]);

  useEffect(() => {
    if (coachState?.coachResponse) {
      setCoachChatHistory(prev => [...prev, { role: 'model', content: coachState.coachResponse as string }]);
    }
    if (coachState?.error) {
      toast({ title: "AI Coach Error", description: coachState.error, variant: "destructive" });
      setCoachChatHistory(prev => [...prev, { role: 'model', content: `Sorry, I encountered an error: ${coachState.error}` }]);
    }
  }, [coachState, toast]);

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
  
  const handleOfferDecision = (offerId: string, decision: 'accepted' | 'rejected') => {
    if (!idea || !idea.offers) return;

    let newIdeaStatus = idea.status;
    const updatedOffers = idea.offers.map(offer => {
      if (offer.id === offerId) {
        if (decision === 'accepted') {
          newIdeaStatus = 'funded';
        }
        return { ...offer, status: decision, updatedAt: new Date() };
      }
      // If one offer is accepted, other pending offers could be auto-rejected or left as is. For now, just update the target offer.
      return offer;
    });

    const updatedIdea = { ...idea, offers: updatedOffers, status: newIdeaStatus, updatedAt: new Date() };
    setIdea(updatedIdea);
    
    const ideaIndex = mockUserIdeas.findIndex(i => i.id === ideaId);
    if (ideaIndex !== -1) {
      mockUserIdeas[ideaIndex] = updatedIdea;
    }

    toast({
      title: `Offer ${decision.charAt(0).toUpperCase() + decision.slice(1)}!`,
      description: `You have ${decision} the offer from ${updatedOffers.find(o=>o.id === offerId)?.investorName}.`,
    });
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
    const newLink: ResearchLink = { id: `link-${Date.now()}`, title: newLinkTitle, url: newLinkUrl, description: newLinkDescription || undefined };
    const updatedLinks = [...(idea.researchLinks || []), newLink];
    handleDataChange('researchLinks', updatedLinks, "Research Links");
    setNewLinkTitle(''); setNewLinkUrl(''); setNewLinkDescription(''); setShowAddLinkForm(false);
  };

  const handleAddContact = (e: FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !idea) return;
    const newContact: Contact = { id: `contact-${Date.now()}`, name: newContactName, email: newContactEmail || undefined, phone: newContactPhone || undefined, notes: newContactNotes || undefined };
    const updatedContacts = [...(idea.contacts || []), newContact];
    handleDataChange('contacts', updatedContacts, "Contacts");
    setNewContactName(''); setNewContactEmail(''); setNewContactPhone(''); setNewContactNotes(''); setShowAddContactForm(false);
  };

  const handleSaveResearchNotes = () => {
    if (!idea) return;
    handleDataChange('researchNotes', editableResearchNotes, "Research Notes");
  };

  const handleSendDreamerReply = (e: FormEvent) => {
    e.preventDefault();
    if (!newDreamerReply.trim() || !idea) return;
    const replyToSend: Message = { id: `msg-${idea.id}-${Date.now()}`, ideaId: idea.id, senderId: DREAMER_MOCK_ID, senderName: DREAMER_MOCK_NAME, content: newDreamerReply.trim(), timestamp: new Date(), read: false };
    const ideaIndex = mockUserIdeas.findIndex(i => i.id === idea.id);
    if (ideaIndex !== -1) {
      const currentIdea = mockUserIdeas[ideaIndex];
      currentIdea.communications = [...(currentIdea.communications || []), replyToSend];
      currentIdea.updatedAt = new Date();
      setIdea(currentIdea);
      setDisplayedIdeaMessages(prev => [...(prev || []), replyToSend].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()));
    }
    setNewDreamerReply('');
    toast({ title: "Reply Sent!", description: "Your reply has been sent." });
  };

  const handleSubmitToInvestors = () => {
    if (idea) {
      const newIdeaState = { ...idea, status: 'submitted' as const, updatedAt: new Date() };
      setIdea(newIdeaState);
      const ideaIndex = mockUserIdeas.findIndex(i => i.id === ideaId);
      if (ideaIndex !== -1) mockUserIdeas[ideaIndex] = newIdeaState;
      toast({ title: "Idea Submitted!", description: `${idea.title} has been sent to the investor portal.` });
    }
  };

  const handleAskCoachSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!coachUserInput.trim() || !idea) return;
    setCoachChatHistory(prev => [...prev, { role: 'user', content: coachUserInput.trim() }]);
    const formData = new FormData(event.currentTarget);
    formData.set('userMessage', coachUserInput.trim());
    formData.set('ideaId', idea.id);
    formData.set('ideaTitle', idea.title);
    formData.set('ideaOriginalText', idea.originalText);
    if (idea.refinedText) formData.set('ideaRefinedText', idea.refinedText);
    const historyForAction = coachChatHistory.filter(msg => msg.role === 'model' || (msg.role === 'user' && msg.content !== coachUserInput.trim()));
    formData.set('chatHistory', JSON.stringify(historyForAction));
    coachFormAction(formData);
    setCoachUserInput('');
  };

  if (loading) return <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"><Loader2 className="h-12 w-12 animate-spin text-primary" /><p className="ml-2">Loading dream details...</p></div>;
  if (!idea) return <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>Could not find the specified dream.</AlertDescription><Button variant="link" asChild className="mt-2"><Link href="/dreamer/my-dreams"><ArrowLeft className="mr-2 h-4 w-4" /> Back to My Dreams</Link></Button></Alert>;

  const isIdeaMutable = idea.status === 'private' || idea.status === 'submitted';


  return (
    <div className="space-y-8">
      <Button variant="outline" asChild>
        <Link href="/dreamer/my-dreams"><ArrowLeft className="mr-2 h-4 w-4" /> Back to My Dreams</Link>
      </Button>

      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
            <CardTitle className="text-3xl text-primary flex items-center">
              <Lightbulb className="mr-3 h-8 w-8" /> {idea.title}
            </CardTitle>
            <Badge variant={idea.status === 'funded' || idea.status === 'acquired' ? 'default' : (idea.status === 'reviewing_offers' ? 'secondary' : 'outline')}
                   className={`text-sm px-3 py-1 whitespace-nowrap ${idea.status === 'funded' ? 'bg-green-600 text-white' : idea.status === 'acquired' ? 'bg-purple-600 text-white' : idea.status === 'reviewing_offers' ? 'bg-blue-500 text-white' : ''}`}>
              Status: {idea.status.charAt(0).toUpperCase() + idea.status.slice(1).replace('_', ' ')}
            </Badge>
          </div>
          <CardDescription>
            Created: {new Date(idea.createdAt).toLocaleDateString()} | Last Updated: {new Date(idea.updatedAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-1 text-foreground">Original Concept:</h3>
            <p className="text-muted-foreground text-sm">{idea.originalText}</p>
          </div>
          {idea.refinedText && (
            <div>
              <h3 className="text-lg font-semibold mb-1 text-foreground flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-accent" /> Refined Version:
              </h3>
              <p className="text-muted-foreground text-sm">{idea.refinedText}</p>
            </div>
          )}
          {idea.suggestions && idea.suggestions.length > 0 && (
            <div>
              <h4 className="font-semibold text-foreground/80 mt-2 text-sm">AI Suggestions:</h4>
              <ul className="list-disc list-inside text-muted-foreground ml-4 text-sm">
                {idea.suggestions.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}
          <div className="mt-4">
            <Label htmlFor="idea-category" className="text-sm font-medium">Idea Category</Label>
            <Select value={selectedCategory} onValueChange={handleCategoryChange} disabled={!isIdeaMutable}>
              <SelectTrigger id="idea-category" className="w-full md:w-[280px] mt-1">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {ideaCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
              </SelectContent>
            </Select>
            {!isIdeaMutable && selectedCategory && <p className="text-xs text-muted-foreground mt-1">Idea is past submission stage, category is locked.</p>}
          </div>
          {idea.status === 'private' && (
            <div className="flex justify-end mt-4">
              <Button onClick={handleSubmitToInvestors} className="bg-accent hover:bg-accent/90">
                <Send className="mr-2 h-4 w-4" /> Submit to Investors
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
          <TabsTrigger value="planner">Planner</TabsTrigger>
          <TabsTrigger value="investor-hub">Investor Hub</TabsTrigger>
          <TabsTrigger value="ai-coach">AI Coach</TabsTrigger>
        </TabsList>

        <TabsContent value="planner" className="mt-6 space-y-8">
          <GoalChecklist initialGoals={idea.goals} onGoalsChange={handleGoalsChange} />
          <MeetingScheduler initialMeetings={idea.meetings} onMeetingsChange={handleMeetingsChange} />
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="text-xl flex items-center"><BookOpen className="mr-2 h-5 w-5 text-primary" /> Research Notes</CardTitle>
              <Button variant="outline" size="sm" onClick={handleSaveResearchNotes}><Save className="mr-2 h-4 w-4" /> Save Notes</Button>
            </CardHeader>
            <CardContent><Textarea value={editableResearchNotes} onChange={(e) => setEditableResearchNotes(e.target.value)} placeholder="Jot down research, brainstorming..." rows={10} /></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="text-xl flex items-center"><LinkIcon className="mr-2 h-5 w-5 text-primary" /> Research &amp; Links</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setShowAddLinkForm(!showAddLinkForm)}><PlusCircle className="mr-2 h-4 w-4" /> Add Link</Button>
            </CardHeader>
            <CardContent>
              {showAddLinkForm && <form onSubmit={handleAddResearchLink} className="mb-4 p-4 border rounded-md space-y-3 bg-muted/20">
                <div><Label htmlFor="linkTitle">Title</Label><Input id="linkTitle" value={newLinkTitle} onChange={e => setNewLinkTitle(e.target.value)} required /></div>
                <div><Label htmlFor="linkUrl">URL</Label><Input id="linkUrl" type="url" value={newLinkUrl} onChange={e => setNewLinkUrl(e.target.value)} required /></div>
                <div><Label htmlFor="linkDesc">Description</Label><Textarea id="linkDesc" value={newLinkDescription} onChange={e => setNewLinkDescription(e.target.value)} /></div>
                <div className="flex gap-2"><Button type="submit" size="sm">Save</Button><Button type="button" variant="ghost" size="sm" onClick={() => setShowAddLinkForm(false)}>Cancel</Button></div>
              </form>}
              {!idea.researchLinks || idea.researchLinks.length === 0 ? <p className="text-sm text-muted-foreground">No links added.</p> : <ul className="space-y-2">
                {idea.researchLinks.map(link => <li key={link.id} className="p-3 border rounded-md"><a href={link.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">{link.title}</a>{link.description && <p className="text-xs mt-1">{link.description}</p>}</li>)}
              </ul>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="text-xl flex items-center"><Users className="mr-2 h-5 w-5 text-primary" /> Key Contacts</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setShowAddContactForm(!showAddContactForm)}><PlusCircle className="mr-2 h-4 w-4" /> Add Contact</Button>
            </CardHeader>
            <CardContent>
              {showAddContactForm && <form onSubmit={handleAddContact} className="mb-4 p-4 border rounded-md space-y-3 bg-muted/20">
                <div><Label htmlFor="contactName">Name</Label><Input id="contactName" value={newContactName} onChange={e => setNewContactName(e.target.value)} required /></div>
                <div><Label htmlFor="contactEmail">Email</Label><Input id="contactEmail" type="email" value={newContactEmail} onChange={e => setNewContactEmail(e.target.value)} /></div>
                <div><Label htmlFor="contactPhone">Phone</Label><Input id="contactPhone" type="tel" value={newContactPhone} onChange={e => setNewContactPhone(e.target.value)} /></div>
                <div><Label htmlFor="contactNotes">Notes</Label><Textarea id="contactNotes" value={newContactNotes} onChange={e => setNewContactNotes(e.target.value)} /></div>
                <div className="flex gap-2"><Button type="submit" size="sm">Save</Button><Button type="button" variant="ghost" size="sm" onClick={() => setShowAddContactForm(false)}>Cancel</Button></div>
              </form>}
              {!idea.contacts || idea.contacts.length === 0 ? <p className="text-sm text-muted-foreground">No contacts added.</p> : <ul className="space-y-2">
                {idea.contacts.map(contact => <li key={contact.id} className="p-3 border rounded-md"><p className="font-semibold">{contact.name}</p>{contact.email && <p className="text-xs">Email: {contact.email}</p>}{contact.phone && <p className="text-xs">Phone: {contact.phone}</p>}{contact.notes && <p className="text-xs mt-1">Notes: {contact.notes}</p>}</li>)}
              </ul>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investor-hub" className="mt-6 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl flex items-center"><DollarSign className="mr-2 h-6 w-6 text-primary" />Investment Offers</CardTitle>
                    <CardDescription>Review offers received from investors.</CardDescription>
                </CardHeader>
                <CardContent>
                    {(!idea.offers || idea.offers.length === 0) ? (
                        <p className="text-sm text-muted-foreground">No investment offers received yet for this idea.</p>
                    ) : (
                        <div className="space-y-4">
                            {idea.offers.map(offer => (
                                <Card key={offer.id} className={`${offer.status === 'accepted' ? 'border-green-500 bg-green-500/10' : offer.status === 'rejected' ? 'border-red-500 bg-red-500/10' : 'bg-card'}`}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-lg">Offer from: {offer.investorName}</CardTitle>
                                            <Badge variant={offer.status === 'pending' ? 'secondary' : (offer.status === 'accepted' ? 'default' : 'destructive')}
                                                   className={`${offer.status === 'accepted' ? 'bg-green-600 text-white' : ''}`}>
                                                {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                                            </Badge>
                                        </div>
                                        <CardDescription>
                                            Amount: ${offer.amount.toLocaleString()} ({offer.type}) | Submitted: {new Date(offer.createdAt).toLocaleDateString()}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {offer.message && <p className="text-sm text-muted-foreground italic">"{offer.message}"</p>}
                                    </CardContent>
                                    {offer.status === 'pending' && (
                                        <CardFooter className="flex gap-2 justify-end">
                                            <Button size="sm" variant="outline" className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => handleOfferDecision(offer.id, 'rejected')}>Reject Offer</Button>
                                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleOfferDecision(offer.id, 'accepted')}>Accept Offer</Button>
                                        </CardFooter>
                                    )}
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl flex items-center"><MessagesSquare className="mr-2 h-6 w-6 text-primary" />Investor Communications</CardTitle>
                    <CardDescription>View messages and reply to interested investors.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="max-h-96 overflow-y-auto space-y-3 p-3 border rounded-md bg-muted/20">
                    {displayedIdeaMessages.length === 0 ? <p className="text-sm text-center py-4">No messages yet.</p> : displayedIdeaMessages.map(msg => (
                        <div key={msg.id} className={`flex flex-col ${msg.senderId === DREAMER_MOCK_ID ? 'items-end' : 'items-start'}`}>
                        <div className={`p-3 rounded-lg max-w-[75%] ${msg.senderId === DREAMER_MOCK_ID ? 'bg-primary/20 self-end' : 'bg-card'}`}>
                            <p className="text-sm font-semibold flex items-center">{msg.senderName}{msg.senderId !== DREAMER_MOCK_ID && !msg.read && <MailWarning className="ml-2 h-4 w-4 text-accent" />}</p>
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            <p className="text-xs text-muted-foreground mt-1">{new Date(msg.timestamp).toLocaleString()}</p>
                        </div></div>
                    ))}
                    </div>
                    <form onSubmit={handleSendDreamerReply} className="space-y-3">
                    <Textarea value={newDreamerReply} onChange={e => setNewDreamerReply(e.target.value)} placeholder="Type reply..." rows={3} required />
                    <Button type="submit" className="w-full sm:w-auto"><Send className="mr-2 h-4 w-4" /> Send Reply</Button>
                    </form>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="ai-coach" className="mt-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl flex items-center text-primary"><Bot className="mr-2 h-6 w-6" /> AI Dream Coach</CardTitle>
              <CardDescription>Get advice, refine plans, and overcome hurdles.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div ref={coachChatContainerRef} className="h-96 overflow-y-auto space-y-4 p-4 border rounded-md bg-muted/20">
                {coachChatHistory.map((msg, index) => (
                  <div key={index} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-3 rounded-lg max-w-[85%] shadow-sm ${msg.role === 'user' ? 'bg-primary/30 self-end' : 'bg-card'}`}>
                      <p className="text-sm font-semibold capitalize">{msg.role === 'model' ? 'AI Coach' : 'You'}</p>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div></div>
                ))}
                {isCoachPending && <div className="flex items-start"><div className="p-3 rounded-lg max-w-[85%] shadow-sm bg-card flex items-center"><Loader2 className="h-5 w-5 animate-spin mr-2" /><span className="text-sm">AI Coach is typing...</span></div></div>}
                {coachState?.fieldErrors?.userMessage && <p className="text-xs text-destructive mt-1">{coachState.fieldErrors.userMessage.join(", ")}</p>}
              </div>
              <form onSubmit={handleAskCoachSubmit} className="flex items-start gap-2">
                <Textarea name="userMessageInput" value={coachUserInput} onChange={e => setCoachUserInput(e.target.value)} placeholder="Ask your AI coach..." rows={2} disabled={isCoachPending} 
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); const form = e.currentTarget.closest('form'); if (form) handleAskCoachSubmit(e as unknown as React.FormEvent<HTMLFormElement>); }}} />
                <Button type="submit" disabled={isCoachPending || !coachUserInput.trim()} className="h-auto py-3"><Send className="h-5 w-5" /></Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}