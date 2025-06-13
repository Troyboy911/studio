
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TrendingUp, Sparkles, UserCheck, PlayCircle, Star } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center text-center space-y-16 md:space-y-24">
      {/* Hero Section */}
      <section
        className="w-full py-20 md:py-32 relative overflow-hidden rounded-xl shadow-2xl min-h-[60vh] flex flex-col justify-center items-center"
      >
        <Image
          src="https://images.unsplash.com/photo-1429305336325-b84ace7eba3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxzdGFyc3xlbnwwfHx8fDE3NDk4MDUyODh8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Starry night sky with a shooting star"
          layout="fill"
          objectFit="cover"
          className="opacity-70 z-0"
          data-ai-hint="starry sky shooting star"
          priority
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

      {/* Placeholder Video Section */}
      <section className="w-full max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-foreground">Discover IDream</h2>
        <div className="aspect-video bg-muted/20 rounded-lg flex items-center justify-center border border-border shadow-lg">
          {/* In a real app, you would embed a video player here */}
          <div className="text-center p-8">
            <PlayCircle className="w-24 h-24 text-primary mx-auto mb-4" />
            <p className="text-xl text-muted-foreground">Our explainer video is coming soon!</p>
            <p className="text-sm text-muted-foreground">(Video Player Placeholder)</p>
          </div>
        </div>
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
                    src="https://placehold.co/600x400.png"
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
        <h2 className="text-4xl font-bold mb-12 text-foreground">Why Choose IDream?</h2>
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
