
"use client"; 

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Eye, ListChecks, Bell, Activity, InfoIcon, MailWarning, CheckCircle, Hourglass, Award, Briefcase, MessageSquare, ChevronRight, Loader2 } from 'lucide-react';
import type { DreamIdea, InvestmentOffer, Message } from '@/types';
import { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/firebase'; // Import Firestore instance
import { collection, getDocs, Timestamp, query, orderBy } from 'firebase/firestore';
import { useToast } from "@/hooks/use-toast";

interface IdeaStatusCounts {
  private: number;
  submitted: number;
  reviewing_offers: number;
  funded: number;
  acquired: number;
}

function DreamerDashboardPage() {
  const [userIdeas, setUserIdeas] = useState<DreamIdea[]>([]);
  const [fundedIdeas, setFundedIdeas] = useState<DreamIdea[]>([]);
  const [offers, setOffers] = useState<(InvestmentOffer & {ideaTitle?: string})[]>([]);
  const [communications, setCommunications] = useState<(Message & {ideaTitle?: string})[]>([]);
  const [ideaCounts, setIdeaCounts] = useState<IdeaStatusCounts>({
    private: 0,
    submitted: 0,
    reviewing_offers: 0,
    funded: 0,
    acquired: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchIdeas = async () => {
      setIsLoading(true);
      try {
        const ideasCollectionRef = collection(db, 'ideas');
        // Assuming you might want to order by creation date or last update
        const q = query(ideasCollectionRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedIdeas: DreamIdea[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Convert Firestore Timestamps to JS Dates
          const idea: DreamIdea = {
            id: doc.id,
            ...data,
            createdAt: (data.createdAt as Timestamp)?.toDate ? (data.createdAt as Timestamp).toDate() : new Date(data.createdAt),
            updatedAt: (data.updatedAt as Timestamp)?.toDate ? (data.updatedAt as Timestamp).toDate() : new Date(data.updatedAt),
            goals: data.goals?.map((g: any) => ({ ...g })) || [],
            meetings: data.meetings?.map((m: any) => ({ ...m, date: (m.date as Timestamp)?.toDate ? (m.date as Timestamp).toDate() : new Date(m.date) })) || [],
            researchLinks: data.researchLinks?.map((rl: any) => ({ ...rl })) || [],
            contacts: data.contacts?.map((c: any) => ({ ...c })) || [],
            offers: data.offers?.map((o: any) => ({
              ...o,
              createdAt: (o.createdAt as Timestamp)?.toDate ? (o.createdAt as Timestamp).toDate() : new Date(o.createdAt),
              updatedAt: (o.updatedAt as Timestamp)?.toDate ? (o.updatedAt as Timestamp).toDate() : new Date(o.updatedAt),
            })) || [],
            communications: data.communications?.map((comm: any) => ({
              ...comm,
              timestamp: (comm.timestamp as Timestamp)?.toDate ? (comm.timestamp as Timestamp).toDate() : new Date(comm.timestamp),
            })) || [],
            premierUntil: data.premierUntil ? ((data.premierUntil as Timestamp)?.toDate ? (data.premierUntil as Timestamp).toDate() : new Date(data.premierUntil)) : undefined,
          } as DreamIdea;
          fetchedIdeas.push(idea);
        });

        setUserIdeas(fetchedIdeas);
        
        setFundedIdeas(fetchedIdeas.filter(idea => idea.status === 'funded' || idea.status === 'acquired'));
    
        const allOffers: (InvestmentOffer & {ideaTitle?: string})[] = fetchedIdeas.reduce((acc, idea) => {
          if (idea.offers) {
            return acc.concat(idea.offers.map(offer => ({...offer, ideaTitle: idea.title, ideaId: idea.id })));
          }
          return acc;
        }, [] as (InvestmentOffer & {ideaTitle?: string})[]);
        setOffers(allOffers.filter(offer => offer.status === 'pending'));

        const allMessages: (Message & {ideaTitle?: string})[] = fetchedIdeas.reduce((acc, idea) => {
            if (idea.communications) {
                return acc.concat(idea.communications.map(msg => ({...msg, ideaTitle: idea.title, ideaId: idea.id})));
            }
            return acc;
        }, [] as (Message & {ideaTitle?: string})[]);
        setCommunications(allMessages.sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 3));

        const counts = fetchedIdeas.reduce((acc, idea) => {
          acc[idea.status] = (acc[idea.status] || 0) + 1;
          return acc;
        }, { private: 0, submitted: 0, reviewing_offers: 0, funded: 0, acquired: 0 } as IdeaStatusCounts);
        setIdeaCounts(counts);

      } catch (error) {
        console.error("Error fetching ideas from Firestore:", error);
        toast({
          title: "Error Loading Data",
          description: "Could not fetch your ideas from the database. Please try again later.",
          variant: "destructive",
        });
        // Keep showing empty/mock state or specific error UI
        setUserIdeas([]); // Clear ideas on error
        setFundedIdeas([]);
        setOffers([]);
        setCommunications([]);
        setIdeaCounts({ private: 0, submitted: 0, reviewing_offers: 0, funded: 0, acquired: 0 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchIdeas();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Idea Status Summary */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center">
            <ListChecks className="mr-3 h-7 w-7 text-primary" /> Idea Snapshot
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <Card className="bg-muted/30">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Private Ideas</CardTitle>
                    <CardDescription>Currently in development</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold text-foreground">{ideaCounts.private}</div>
                </CardContent>
            </Card>
            <Card className="bg-muted/30">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Submitted</CardTitle>
                    <CardDescription>Awaiting investor review</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold text-accent">{ideaCounts.submitted}</div>
                </CardContent>
            </Card>
             <Card className="bg-muted/30">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Reviewing Offers</CardTitle>
                    <CardDescription>Actively managing offers</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold text-blue-500">{ideaCounts.reviewing_offers}</div>
                </CardContent>
            </Card>
            <Card className="bg-green-500/10">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-green-700">Funded</CardTitle>
                    <CardDescription className="text-green-600">Investment secured!</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold text-green-600">{ideaCounts.funded}</div>
                </CardContent>
            </Card>
            <Card className="bg-purple-500/10">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-purple-700">Acquired</CardTitle>
                    <CardDescription className="text-purple-600">Successfully exited!</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold text-purple-600">{ideaCounts.acquired}</div>
                </CardContent>
            </Card>
        </div>
      </section>

      <Separator />

      {/* Quick Actions */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Quick Actions</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Link href="/dreamer/new-idea" passHref>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-primary/10 hover:bg-primary/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium text-primary">Start a New Dream</CardTitle>
                <PlusCircle className="h-6 w-6 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Got a fresh idea? Let's start shaping it.
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/dreamer/my-dreams" passHref>
             <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-secondary/10 hover:bg-secondary/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium text-secondary-foreground">My Dreams Workbench</CardTitle>
                <Eye className="h-6 w-6 text-secondary-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Access your saved ideas, manage plans, and submit to investors.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      <Separator />
      
      {/* Recent Activity / Notifications Placeholder */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center">
            <Bell className="mr-3 h-7 w-7 text-yellow-500" /> Recent Activity & Notifications
        </h2>
        <Card className="bg-muted/20">
            <CardContent className="pt-6">
                 {userIdeas.length > 0 ? (
                    <div className="space-y-4">
                        {/* Placeholder activity items - replace with real data if available */}
                        <div className="flex items-start p-3 border-b border-border/50">
                            <Activity className="h-5 w-5 text-primary mr-3 mt-1 shrink-0" />
                            <div>
                                <p className="font-medium">Investor Alpha Ventures <span className="text-muted-foreground">viewed your idea:</span> "{userIdeas[0]?.title || 'Your Latest Idea'}"</p>
                                <p className="text-xs text-muted-foreground">2 hours ago (Mock)</p>
                            </div>
                        </div>
                        <div className="flex items-start p-3 border-b border-border/50">
                            <MailWarning className="h-5 w-5 text-accent mr-3 mt-1 shrink-0" />
                            <div>
                                <p className="font-medium">New Message <span className="text-muted-foreground">from Investor Beta Corp regarding:</span> "{userIdeas[1]?.title || 'Another Idea'}"</p>
                                <p className="text-xs text-muted-foreground">1 day ago (Mock)</p>
                            </div>
                        </div>
                        <div className="flex items-start p-3">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1 shrink-0" />
                            <div>
                                <p className="font-medium">Your idea "{userIdeas[2]?.title || 'A Great Idea'}" <span className="text-muted-foreground">was successfully submitted to investors.</span></p>
                                <p className="text-xs text-muted-foreground">3 days ago (Mock)</p>
                            </div>
                        </div>
                    </div>
                 ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No recent activity to display.</p>
                 )}
                <div className="mt-6 text-center">
                    <Button variant="outline" disabled>View All Notifications (Coming Soon)</Button>
                </div>
            </CardContent>
        </Card>
      </section>

      <Separator />


      {/* Funded/Acquired Dreams */}
      {fundedIdeas.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center">
            <Award className="mr-3 h-7 w-7 text-green-500" /> Success Stories
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {fundedIdeas.map(idea => (
              <Card key={idea.id} className="border-green-500 bg-green-50/50">
                <CardHeader>
                  <CardTitle className="text-xl text-green-700">{idea.title}</CardTitle>
                  <Badge variant="default" className="bg-green-600 text-white w-fit">
                    {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-green-600 line-clamp-2">{idea.refinedText || idea.originalText}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="link" asChild className="text-green-700 p-0">
                    <Link href={`/dreamer/my-dreams/${idea.id}`}>View Details <ChevronRight className="h-4 w-4 ml-1"/></Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}
      
      {fundedIdeas.length > 0 && <Separator />}

      {/* Recent Offers */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center">
          <Briefcase className="mr-3 h-7 w-7 text-accent" /> Recent Investment Offers
        </h2>
        {offers.length > 0 ? (
          <div className="space-y-4">
            {offers.map(offer => (
              <Card key={offer.id} className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                   <CardTitle className="text-lg">
                    Offer for: <span className="text-primary">{offer.ideaTitle || 'Your Idea'}</span>
                    </CardTitle>
                  <CardDescription>
                    From: {offer.investorName} | Amount: ${offer.amount.toLocaleString()} ({offer.type})
                  </CardDescription>
                  {offer.investorFocus && (
                    <div className="flex items-center text-xs text-muted-foreground pt-1">
                      <InfoIcon className="h-3 w-3 mr-1" />
                      Investor Focus: {offer.investorFocus}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{offer.message || "No additional message."}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                   <Badge variant={offer.status === 'pending' ? 'secondary' : 'default'}>
                    {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                   </Badge>
                   <Button variant="outline" size="sm" asChild>
                     <Link href={`/dreamer/my-dreams/${offer.ideaId}?tab=offers`}>
                       View Offer <ChevronRight className="h-4 w-4 ml-1"/>
                     </Link>
                   </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center text-muted-foreground py-6">
                <Hourglass className="h-10 w-10 mb-3" />
                <p className="font-medium">No pending offers at the moment.</p>
                <p className="text-sm">Keep refining your submitted ideas!</p>
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      <Separator />

      {/* Investor Communications */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center">
          <MessageSquare className="mr-3 h-7 w-7 text-blue-500" /> Investor Communications
        </h2>
        {communications.length > 0 ? (
            <div className="space-y-4">
            {communications.map(msg => (
                <Card key={msg.id} className={`shadow-sm ${!msg.read && msg.senderId !== 'dreamer-mock-id' ? 'border-blue-500 bg-blue-50/30' : ''}`}>
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-md">
                                {msg.senderName} <span className="text-sm text-muted-foreground">re: {msg.ideaTitle || 'Your Idea'}</span>
                            </CardTitle>
                            {!msg.read && msg.senderId !== 'dreamer-mock-id' && <MailWarning className="h-5 w-5 text-blue-600" />}
                        </div>
                        <CardDescription className="text-xs">
                            {new Date(msg.timestamp).toLocaleString()}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-foreground line-clamp-2">{msg.content}</p>
                    </CardContent>
                    <CardFooter>
                        <Button variant="link" size="sm" asChild className="p-0 text-blue-600">
                             <Link href={`/dreamer/my-dreams/${msg.ideaId}?tab=messages`}>
                                Read Full Message <ChevronRight className="h-4 w-4 ml-1"/>
                             </Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
            </div>
        ) : (
             <Card className="bg-muted/30">
                <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center text-muted-foreground py-6">
                    <MessageSquare className="h-10 w-10 mb-3 opacity-50" />
                    <p className="font-medium">No messages yet.</p>
                    <p className="text-sm">Communications from interested investors will appear here.</p>
                </div>
                </CardContent>
            </Card>
        )}
        <div className="mt-6 text-center">
            <Button variant="outline" disabled>
                Go to Full Messaging Center (Coming Soon)
            </Button>
        </div>
      </section>
    </div>
  );
}

export default DreamerDashboardPage;

    