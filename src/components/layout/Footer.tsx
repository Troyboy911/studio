
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-background/80 py-8 mt-12 border-t border-border">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <div className="flex justify-center space-x-6 mb-4">
          <Link href="/legal" className="text-sm hover:text-primary transition-colors">
            Legal
          </Link>
          <Link href="/settings" className="text-sm hover:text-primary transition-colors">
            Settings
          </Link>
          {/* Placeholder links from prototype image */}
          <span className="text-sm hover:text-primary transition-colors cursor-pointer">About Us</span>
          <span className="text-sm hover:text-primary transition-colors cursor-pointer">Sponsorship</span>
        </div>
        <p>&copy; {new Date().getFullYear()} Dreamer. All rights reserved.</p>
        <p className="text-xs mt-1">Turning dreams into reality, one idea at a time.</p>
      </div>
    </footer>
  );
}
