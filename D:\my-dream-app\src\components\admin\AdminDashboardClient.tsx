"use client";

import type { DreamIdea } from '@/types';
import { useState, useEffect } from 'react';
import { mockUserIdeas } from '@/lib/mockIdeas';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

export default function AdminDashboardClient() {
  const [allIdeas, setAllIdeas] = useState<DreamIdea[]>([]);
  const [ideaCounts, setIdeaCounts] = useState<{ [key: string]: number }>({});
  
  useEffect(() => {
    // In a real app, this would be a fetch from the database.
    // Here we're just loading the mock data.
    const ideas = [...mockUserIdeas];
    setAllIdeas(ideas);

    const counts = ideas.reduce((acc, idea) => {
      acc[idea.status] = (acc[idea.status] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    setIdeaCounts(counts);

  }, []);

  const getStatusBadgeVariant = (status: DreamIdea['status']) => {
    switch (status) {
      case 'funded':
        return 'default';
      case 'acquired':
        return 'default';
      case 'reviewing_offers':
        return 'secondary';
      case 'submitted':
        return 'secondary';
      case 'private':
      default:
        return 'outline';
    }
  };

   const getStatusBadgeClass = (status: DreamIdea['status']) => {
    switch (status) {
      case 'funded':
        return 'bg-green-600 text-white';
      case 'acquired':
        return 'bg-purple-600 text-white';
      case 'reviewing_offers':
        return 'bg-blue-500 text-white';
      case 'submitted':
        return 'bg-accent text-accent-foreground';
      default:
        return '';
    }
  };


  return (
    <div className="space-y-6">
        <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Idea Overview</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {Object.entries(ideaCounts).map(([status, count]) => (
                    <Card key={status}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium capitalize">{status.replace('_', ' ')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{count}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>

      <Card>
        <CardHeader>
          <CardTitle>All Ideas</CardTitle>
          <CardDescription>A complete list of all ideas currently on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allIdeas.length > 0 ? allIdeas.map((idea) => (
                <TableRow key={idea.id}>
                  <TableCell className="font-medium">{idea.title}</TableCell>
                  <TableCell>{idea.category || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(idea.status)} className={getStatusBadgeClass(idea.status)}>
                      {idea.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(idea.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dreamer/my-dreams/${idea.id}`}>
                            View <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No ideas found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
