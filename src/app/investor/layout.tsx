"use client";

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Metadata for this layout is removed as it's a client component.
// Individual page.tsx files within /investor should define their own metadata.

export default function InvestorLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This check runs only on the client-side
    const authStatus = localStorage.getItem('investorAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
    setIsLoading(false); // Finished loading auth status

    if (!authStatus && pathname !== '/investor/auth') {
      router.replace('/investor/auth');
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('investorAuthenticated');
    setIsAuthenticated(false); // Update state immediately
    router.replace('/investor/auth'); // Redirect to login page
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading Investor Portal...</p>
      </div>
    );
  }

  // If the current page is the authentication page, render its content directly
  // without the protected layout structure (header, logout button, etc.)
  if (pathname === '/investor/auth') {
    return <>{children}</>;
  }

  // If not authenticated and not on the auth page,
  // this state should ideally be caught by the redirect in useEffect.
  // Render a redirecting message as a fallback.
  if (!isAuthenticated) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-4 text-lg">Redirecting to login...</p>
        </div>
    );
  }

  // If authenticated, render the main investor portal layout
  return (
    <div className="space-y-8">
      <header className="border-b pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-accent">Investor Portal</h1>
          <p className="text-muted-foreground">Find the next big idea and make your mark.</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </header>
      {children}
    </div>
  );
}
