
"use client";

import type { DreamIdea } from '@/types';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, TrendingUp, Zap } from 'lucide-react';

interface IdeaCardProps {
  idea: DreamIdea;
  isPremierActive?: boolean;
}

export default function IdeaCard({ idea, isPremierActive = false }: IdeaCardProps) {
  return (
    <Card className={`shadow-lg hover:shadow-xl transition-shadow w-full ${isPremierActive ? 'border-2 border-yellow-500 bg-yellow-50/50' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-2xl text-primary flex items-center">
            {isPremierActive && <Zap className="mr-2 h-5 w-5 text-yellow-600" />}
            {idea.title}
          </CardTitle>
          {!isPremierActive && <TrendingUp className="h-6 w-6 text-accent" />}
          {isPremierActive && <Badge className="bg-yellow-500 text-yellow-foreground">Premier</Badge>}
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
