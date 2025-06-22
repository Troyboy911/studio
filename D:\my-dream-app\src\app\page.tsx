

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { TrendingUp, Sparkles, UserCheck, PlayCircle, Star, Award, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { mockUserIdeas } from '@/lib/mockIdeas';
import type { DreamIdea } from '@/types';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  const successStories = mockUserIdeas.filter(
    idea => idea.status === 'funded' || idea.status === 'acquired'
  ).slice(0, 3); // Take up to 3 success stories for the homepage

  return (
    <div className="flex flex-col items-center text-center space-y-16 md:space-y-24">
      {/* Hero Section */}
      <section
        className="w-full py-20 md:py-32 relative overflow-hidden rounded-xl shadow-2xl min-h-[60vh] flex flex-col justify-center items-center"
      >
        <Image
          src="https://images.unsplash.com/photo-1538370965046-79c0d6907d47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxnYWxheHl8ZW58MHx8fHwxNzQ5NzgzNTg4fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Galaxy background"
          fill
          priority
          className="absolute inset-0 z-0 object-cover"
          data-ai-hint="starry sky shooting star"
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-background bg-foreground/10 backdrop-blur-sm p-8 rounded-lg">
          <h1 className="text-5xl md:text-7xl font-bold text-background mb-6">
            Dream big.
          </h1>
          <p className="text-xl md:text-2xl text-background/90 mb-10 max-w-3xl mx-auto">
            Turn your dreams into reality with help of AI guidance and resources.
          </p>
          <div className="space-x-4">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-10 py-6 text-lg" asChild>
              <Link href="/dreamer">
                Get started
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-16 md:py-24 w-full">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground flex items-center justify-center">
            <Award className="mr-3 h-10 w-10 text-primary" />
            Success Stories
          </h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            See how IDream has helped turn visionary ideas into tangible realities and thriving ventures.
          </p>
        </div>
        {successStories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {successStories.map(idea => (
              <Card key={idea.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card text-card-foreground flex flex-col">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">{idea.title}</CardTitle>
                  <Badge variant="default" className="w-fit mt-2 bg-green-600 hover:bg-green-700 text-white">
                    {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
                  </Badge>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground line-clamp-4">
                    {idea.refinedText || idea.originalText}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="link" asChild className="text-primary p-0 hover:text-primary/80">
                    <Link href={`/dreamer/my-dreams/${idea.id}`}>Read Full Story <ArrowRight className="ml-2 h-4 w-4"/></Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <Award className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-lg">Inspiring success stories are on their way!</p>
            <p className="text-sm">Check back soon to see how dreams are taking flight.</p>
          </div>
        )}
        {mockUserIdeas.filter(idea => idea.status === 'funded' || idea.status === 'acquired').length > 3 && (
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" disabled>
                View All Success Stories (Coming Soon)
            </Button>
          </div>
        )}
      </section>

      {/* Placeholder "Save the world" Section */}
      <section className="w-full max-w-4xl mx-auto">
         <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-left">
                <h2 className="text-4xl font-bold mb-4 text-foreground">Save the world</h2>
                <p className="text-lg text-muted-foreground mb-6">
                    At IDream, we believe in ideas that can make a difference. Whether it's a groundbreaking technology or a community project, your vision has the power to create positive change. Let us help you bring it to life.
                </p>
            </div>
            <div>
                <Image
                    src="https://images.unsplash.com/photo-1633672140625-0f71855a521b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMnx8Y2hhbmdlJTIwdGhlJTIwd29ybGR8ZW58MHx8fHwxNzQ5ODA1NTQ4fDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Image related to impactful ideas or superheroes"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-xl"
                    data-ai-hint="superhero flying"
                />
            </div>
         </div>
      </section>


      {/* Features Section - Retained from previous version, can be adjusted or removed */}
      <section className="py-16 md:py-24 w-full">
        <h2 className="text-4xl font-bold mb-12 text-foreground flex items-center justify-center">Why Choose I<Star className="h-7 w-7 mx-1 fill-current text-yellow-400" />Dream?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card text-card-foreground">
            <CardHeader className="items-center">
              <Sparkles className="w-12 h-12 text-primary mb-4" />
              <CardTitle className="text-2xl">Refine Your Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Our AI-powered tools help you sharpen your ideas, research markets, and create solid plans.</CardDescription>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card text-card-foreground">
            <CardHeader className="items-center">
              <TrendingUp className="w-12 h-12 text-primary mb-4" />
              <CardTitle className="text-2xl">Connect & Grow</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Submit your polished concepts to a network of eager investors ready to fund innovation.</CardDescription>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card text-card-foreground">
            <CardHeader className="items-center">
              <UserCheck className="w-12 h-12 text-primary mb-4" />
              <CardTitle className="text-2xl">Secure & Supported</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>With legal frameworks and project tools, we support your journey from dream to reality.</CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

    </div>
  );
}
