"use client";

import type { DreamIdea } from '@/types';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp } from 'lucide-react';

interface IdeaCardProps {
  idea: DreamIdea;
}

export default function IdeaCard({ idea }: IdeaCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl text-primary">{idea.title}</CardTitle>
          <TrendingUp className="h-6 w-6 text-accent" />
        </div>
        <CardDescription>
          Submitted on: {new Date(idea.updatedAt).toLocaleDateString()} {/* Assuming submission updates this date */}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {idea.refinedText || idea.originalText}
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" asChild className="w-full">
          <Link href={`/investor/ideas/${idea.id}`}>
            View Full Proposal <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
