
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserCircle, LayoutDashboard, LogIn, Settings, Star } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center">
        <Link href="/" className="mr-6 flex items-center text-3xl font-headline text-foreground hover:text-primary transition-colors">
          I<Star className="h-5 w-5 mx-0.5 fill-current text-yellow-400" />Dream
        </Link>
        
        <nav className="flex items-center space-x-1 sm:space-x-2">
          <Button variant="ghost" asChild size="sm">
            <Link href="/dreamer" className="text-sm sm:text-base text-foreground hover:text-primary">
              <LayoutDashboard className="mr-1 sm:mr-2 h-4 w-4" /> Dreamer Portal
            </Link>
          </Button>
          <Button variant="ghost" asChild size="sm">
            <Link href="/dreamer/profile" className="text-sm sm:text-base text-foreground hover:text-primary">
              <UserCircle className="mr-1 sm:mr-2 h-4 w-4" /> Profile
            </Link>
          </Button>
          <Button variant="ghost" asChild size="sm">
            <Link href="/settings" className="text-sm sm:text-base text-foreground hover:text-primary">
              <Settings className="mr-1 sm:mr-2 h-4 w-4" /> Settings
            </Link>
          </Button>
        </nav>

        <nav className="ml-auto flex items-center space-x-1 sm:space-x-2">
          <Button variant="ghost" asChild size="sm">
            <Link href="/dreamer/auth" className="text-xs sm:text-sm text-muted-foreground hover:text-primary">
              <LogIn className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> Dreamer Login
            </Link>
          </Button>
          <Button variant="ghost" asChild size="sm">
            <Link href="/investor/auth" className="text-xs sm:text-sm text-muted-foreground hover:text-primary">
              <LogIn className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> Investor Login
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
