
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Lightbulb, Briefcase, FileText, CloudSun, Settings } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-primary/10 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-3xl font-headline text-primary hover:text-accent transition-colors">
          <div className="flex items-center gap-2">
            <CloudSun className="w-8 h-8 text-accent" />
            <span>IDream</span>
          </div>
        </Link>
        <nav className="flex items-center space-x-1 sm:space-x-2">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center space-x-1 text-foreground hover:text-accent">
              <Home size={18} />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/dreamer" className="flex items-center space-x-1 text-foreground hover:text-accent">
              <Lightbulb size={18} />
              <span className="hidden sm:inline">Dreamers</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/investor" className="flex items-center space-x-1 text-foreground hover:text-accent">
              <Briefcase size={18} />
              <span className="hidden sm:inline">Investors</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/legal" className="flex items-center space-x-1 text-foreground hover:text-accent">
              <FileText size={18} />
              <span className="hidden sm:inline">Legal</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/settings" className="flex items-center space-x-1 text-foreground hover:text-accent">
              <Settings size={18} />
              <span className="hidden sm:inline">Settings</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
