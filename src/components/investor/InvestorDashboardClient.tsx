"use client";

import type { DreamIdea } from '@/types';
import { useState, useEffect } from 'react';
import { mockUserIdeas } from '@/lib/mockIdeas'; // Using a separate mock file
import IdeaCard from './IdeaCard';
import { Input } from '@/components/ui/input';
import { Search, ListFilter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


export default function InvestorDashboardClient() {
  const [submittedIdeas, setSubmittedIdeas] = useState<DreamIdea[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest'

  useEffect(() => {
    // Simulate fetching submitted ideas.
    const ideasForInvestors = mockUserIdeas.filter(idea => idea.status === 'submitted');
    setSubmittedIdeas(ideasForInvestors);
  }, []);

  const filteredAndSortedIdeas = submittedIdeas
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

  return (
    <div className="space-y-6">
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
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <ListFilter className="h-5 w-5 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredAndSortedIdeas.length === 0 ? (
        <div className="text-center py-10">
          <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold">No Ideas Found</h3>
          <p className="text-muted-foreground">
            {searchTerm ? "Try adjusting your search or sort criteria." : "There are currently no submitted ideas matching your criteria. Check back later!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedIdeas.map(idea => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      )}
    </div>
  );
}
