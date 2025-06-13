import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lightbulb, Briefcase, ArrowRight, TrendingUp, Sparkles, UserCheck } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
      {/* Hero Section */}
      <section 
        className="w-full py-20 md:py-32 bg-gradient-to-br from-primary via-primary/70 to-background relative overflow-hidden rounded-xl shadow-2xl"
      >
        <Image 
          src="https://placehold.co/1200x800.png" 
          alt="Inspiring sky background" 
          layout="fill" 
          objectFit="cover" 
          className="opacity-20 z-0"
          data-ai-hint="sky clouds"
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6">
            Welcome to <span className="text-accent">IDream</span>
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-10 max-w-3xl mx-auto">
            The platform where innovative ideas meet investment opportunities. Let's build the future, together.
          </p>
          <div className="space-x-4">
            <Button size="lg" variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
              <Link href="/dreamer">
                I'm a Dreamer <Lightbulb className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent/10 hover:text-accent" asChild>
              <Link href="/investor">
                I'm an Investor <Briefcase className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 w-full">
        <h2 className="text-4xl font-bold mb-12 text-foreground">Why Choose IDream?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="items-center">
              <Sparkles className="w-12 h-12 text-accent mb-4" />
              <CardTitle className="text-2xl">Refine Your Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Our AI-powered tools help you sharpen your ideas, research markets, and create solid plans.</CardDescription>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="items-center">
              <TrendingUp className="w-12 h-12 text-accent mb-4" />
              <CardTitle className="text-2xl">Connect & Grow</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Submit your polished concepts to a network of eager investors ready to fund innovation.</CardDescription>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="items-center">
              <UserCheck className="w-12 h-12 text-accent mb-4" />
              <CardTitle className="text-2xl">Secure & Supported</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>With legal frameworks and project tools, we support your journey from dream to reality.</CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 w-full bg-muted/50 rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-foreground">Ready to Start Your Journey?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Whether you're a dreamer with a groundbreaking idea or an investor seeking the next big thing, IDream is your launchpad.
        </p>
        <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
          <Link href="/dreamer#start">
            Get Started Today <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
