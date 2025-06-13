import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Eye } from 'lucide-react';

export default function DreamerDashboardPage() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Welcome, Dreamer!</CardTitle>
          <CardDescription>This is your space to cultivate, refine, and launch your brilliant ideas.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <Link href="/dreamer/new-idea" passHref>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-primary/10 hover:bg-primary/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium text-primary">Start a New Dream</CardTitle>
                <PlusCircle className="h-6 w-6 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Got a fresh idea? Let's start shaping it with our AI-powered tools.
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/dreamer/my-dreams" passHref>
             <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-secondary/10 hover:bg-secondary/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium text-secondary-foreground">My Dreams</CardTitle>
                <Eye className="h-6 w-6 text-secondary-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Access your saved ideas, continue working on them, or prepare them for investors.
                </p>
              </CardContent>
            </Card>
          </Link>
        </CardContent>
      </Card>
      
      <section id="start">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Getting Started</h2>
        <p className="text-muted-foreground">
          Use the "Start a New Dream" option to begin. Our AI assistant will guide you through refining your concept,
          identifying potential, and planning your next steps. Once you're ready, you can organize your goals,
          schedule important milestones, and even submit your polished idea to our investor network.
        </p>
      </section>
    </div>
  );
}
