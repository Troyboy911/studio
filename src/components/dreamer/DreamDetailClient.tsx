
"use client";

import type { DreamIdea, Goal, Meeting, ResearchLink, Contact } from '@/types';
import { useState, useEffect, type FormEvent } from 'react';
import { mockUserIdeas } from '@/lib/mockIdeas'; 
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import GoalChecklist from './GoalChecklist';
import MeetingScheduler from './MeetingScheduler';
import { ArrowLeft, Lightbulb, Sparkles, Send, CheckCircle, Lock, Star, Link as LinkIcon, Users, BookOpen, MessageSquare, Edit, Trash2, PlusCircle, Wand2, Save } from 'lucide-react';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';

interface DreamDetailClientProps {
  ideaId: string;
}

export default function DreamDetailClient({ ideaId }: DreamDetailClientProps) {
  const [idea, setIdea] = useState<DreamIdea | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  // State for adding new research link
  const [showAddLinkForm, setShowAddLinkForm] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkDescription, setNewLinkDescription] = useState('');

  // State for adding new contact
  const [showAddContactForm, setShowAddContactForm] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactNotes, setNewContactNotes] = useState('');
  
  // State for editing research notes
  const [editableResearchNotes, setEditableResearchNotes] = useState('');


  useEffect(() => {
    const subStatus = localStorage.getItem('dreamerSubscribed') === 'true';
    setIsSubscribed(subStatus);

    const foundIdea = mockUserIdeas.find(i => i.id === ideaId);
    if (foundIdea) {
      setIdea(foundIdea);
      setEditableResearchNotes(foundIdea.researchNotes || '');
    }
    setLoading(false);
  }, [ideaId]);
  
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

        </CardContent>
      </Card>
       {!isSubscribed && idea.status === 'private' && (
         <Card className="mt-6 border-dashed border-accent bg-accent/5">
           <CardHeader>
             <CardTitle className="flex items-center text-accent">
               <Star className="mr-2 h-6 w-6"/> Unlock Full Dream Planner &amp; Investor Submissions
             </CardTitle>
           </CardHeader>
           <CardContent>
             <p className="text-accent/90 text-base">
               To access the detailed Dream Planner (Goals, Meetings, Research, Contacts, AI Coach) and submit this idea to our investor network, an active subscription is required.
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

      {/* Detailed Planner Sections - Gated by Subscription */}
      {isSubscribed && (
        <>
          <Separator className="my-8" />
          <h2 className="text-2xl font-semibold text-foreground mb-4">Dream Planner Dashboard</h2>
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
                        {/* Add Edit/Delete buttons per link in future */}
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
                        {/* Add Edit/Delete buttons per contact in future */}
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
                <MessageSquare className="mr-2 h-6 w-6" /> AI Dream Coach
              </CardTitle>
              <CardDescription>Get personalized advice, refine your plan, and overcome hurdles. (Premium Feature)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Q&A Section */}
              <div>
                <h4 className="text-lg font-semibold mb-2 text-primary/90">Ask a Question</h4>
                <Textarea placeholder="Ask your AI coach... (e.g., How can I validate this idea? What are common pitfalls?)" rows={3} disabled />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-muted-foreground">Mock: 5 / 10 queries remaining this month.</p>
                  <Button disabled className="bg-primary hover:bg-primary/90 text-primary-foreground">Ask Coach</Button>
                </div>
              </div>

              <Separator />

              {/* Adjustment Assistance Section */}
              <div>
                <h4 className="text-lg font-semibold mb-2 text-primary/90 flex items-center">
                  <Wand2 className="mr-2 h-5 w-5" /> Refine Your Plan with AI
                </h4>
                <Textarea 
                  placeholder="Describe an aspect of your dream you'd like to adjust or improve with AI's help... (e.g., 'Make my target audience more specific', 'Strengthen my unique selling proposition')" 
                  rows={4} 
                  disabled 
                />
                <div className="flex justify-end mt-2">
                  <Button disabled className="bg-primary hover:bg-primary/90 text-primary-foreground">Get AI Adjustment Ideas</Button>
                </div>
                <div className="mt-3 p-3 bg-muted/30 rounded-md min-h-[50px]">
                    <p className="text-sm text-muted-foreground">AI-suggested adjustments will appear here...</p>
                </div>
              </div>
              
              <Alert className="mt-4">
                <Sparkles className="h-4 w-4" />
                <AlertTitle>Full AI Coach Coming Soon!</AlertTitle>
                <AlertDescription>
                  Advanced Q&A and AI-assisted plan refinement functionalities are under development. These tools will help you polish every aspect of your dream.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

    