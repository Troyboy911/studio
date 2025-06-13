
import Link from 'next/link';
import { Button } from '@/components/ui/button';
// Removed unused icons, kept Lightbulb, Briefcase if we re-introduce more direct portal links
// import { Home, Lightbulb, Briefcase, FileText, CloudSun, Settings } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-3xl font-headline text-foreground hover:text-primary transition-colors">
          Dreamer
        </Link>
        <nav className="flex items-center space-x-2 sm:space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/dreamer/auth" className="text-sm sm:text-base text-foreground hover:text-primary">
              Log in as Dreamer
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/investor/auth" className="text-sm sm:text-base text-foreground hover:text-primary">
              Log in as Investor
            </Link>
          </Button>
           {/* You can add other links here like About Us, Settings if desired later */}
            {/* Example:
            <Button variant="ghost" asChild>
              <Link href="/about" className="text-sm sm:text-base text-foreground hover:text-primary">
                About Us
              </Link>
            </Button>
           */}
        </nav>
      </div>
    </header>
  );
}
