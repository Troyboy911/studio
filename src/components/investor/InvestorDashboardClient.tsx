
"use client";

import type { DreamIdea } from '@/types';
import { useState, useEffect } from 'react';
import { mockUserIdeas } from '@/lib/mockIdeas'; // Using a separate mock file
import IdeaCard from './IdeaCard';
import { Input } from '@/components/ui/input';
import { Search, ListFilter, Zap } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';


export default function InvestorDashboardClient() {
  const [allIdeas, setAllIdeas] = useState<DreamIdea[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest'

  useEffect(() => {
    // Simulate fetching submitted ideas.
    const ideasForInvestors = mockUserIdeas.filter(idea => idea.status === 'submitted' || idea.status === 'reviewing_offers');
    setAllIdeas(ideasForInvestors);
  }, []);

  const now = new Date();

  const activePremierIdeas = allIdeas
    .filter(idea => idea.isPremier && idea.premierUntil && new Date(idea.premierUntil) > now)
    .filter(idea => idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   (idea.refinedText || idea.originalText).toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.premierUntil!).getTime() - new Date(a.premierUntil!).getTime()); // Sort by expiry, soonest expiring or newest premier

  const regularIdeas = allIdeas
    .filter(idea => !idea.isPremier || !idea.premierUntil || new Date(idea.premierUntil) <= now)
    .filter(idea => idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   (idea.refinedText || idea.originalText).toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      }
      return 0;
    });

  const hasSearchResults = activePremierIdeas.length > 0 || regularIdeas.length > 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 items-center p-4 border rounded-lg bg-card">
        <div className="relative w-full sm:flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search ideas by title or keyword..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <ListFilter className="h-5 w-5 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest Submitted</SelectItem>
              <SelectItem value="oldest">Oldest Submitted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {!hasSearchResults ? (
        <div className="text-center py-10">
          <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold">No Ideas Found</h3>
          <p className="text-muted-foreground">
            {searchTerm ? "Try adjusting your search or filter criteria." : "There are currently no submitted ideas. Check back later!"}
          </p>
        </div>
      ) : (
        <>
          {activePremierIdeas.length > 0 && (
            <section className="space-y-4 bg-yellow-500/5 dark:bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 md:p-6 mb-8">
              <h2 className="text-2xl font-semibold text-yellow-500 flex items-center">
                <Zap className="mr-2 h-6 w-6 text-yellow-500" /> Premier Ideas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activePremierIdeas.map(idea => (
                  <IdeaCard key={idea.id} idea={idea} isPremierActive={true} />
                ))}
              </div>
            </section>
          )}

          {regularIdeas.length > 0 && (
             <section className="space-y-4">
              {activePremierIdeas.length > 0 && <h2 className="text-2xl font-semibold text-foreground mb-4">Other Ideas</h2>}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularIdeas.map(idea => (
                  <IdeaCard key={idea.id} idea={idea} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
