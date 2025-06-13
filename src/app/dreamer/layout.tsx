
"use client";

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, Lock, Star } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Metadata should be handled by individual page.tsx files if layout is client component
// export const metadata: Metadata = {
//   title: 'Dreamer Portal - IDream',
//   description: 'Manage your ideas, refine them, and prepare for investment.',
// };

function SubscribePrompt() {
  const handleMockSubscribe = () => {
    localStorage.setItem('dreamerSubscribed', 'true');
    // Force a reload or navigate to trigger layout re-check
    window.location.reload(); 
  };

  return (
    <Card className="max-w-lg mx-auto mt-10 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center text-primary">
          <Lock className="mr-3 h-7 w-7" /> Unlock Full Access
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <AlertDescription>
          <p>This feature requires an active IDream subscription.</p>
          <p>Subscribe now to unlock the Dream Planner, submit your ideas to investors, and access exclusive tools to bring your dreams to life!</p>
        </AlertDescription>
        <Button onClick={handleMockSubscribe} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          <Star className="mr-2 h-5 w-5" /> Mock Subscribe Now
        </Button>
        <p className="text-xs text-center text-muted-foreground">(In a real app, this would lead to a payment page)</p>
      </CardContent>
    </Card>
  );
}


export default function DreamerLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authStatus = localStorage.getItem('dreamerAuthenticated') === 'true';
    const subStatus = localStorage.getItem('dreamerSubscribed') === 'true';
    setIsAuthenticated(authStatus);
    setIsSubscribed(subStatus);
    setIsLoading(false);

    if (!authStatus && pathname !== '/dreamer/auth') {
      router.replace('/dreamer/auth');
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('dreamerAuthenticated');
    localStorage.removeItem('dreamerSubscribed');
    setIsAuthenticated(false);
    setIsSubscribed(false);
    router.replace('/dreamer/auth');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading Dreamer Portal...</p>
      </div>
    );
  }

  // If the current page is the authentication page, render its content directly
  if (pathname === '/dreamer/auth') {
    return <>{children}</>;
  }

  // If not authenticated (and not on auth page), show redirecting message or loader.
  if (!isAuthenticated) {
     return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-4 text-lg">Redirecting to login...</p>
        </div>
    );
  }

  // Gated sections for authenticated but non-subscribed users
  const isGatedSection = pathname.startsWith('/dreamer/my-dreams');
  
  if (isAuthenticated && !isSubscribed && isGatedSection) {
    return (
      <div className="space-y-8">
        <header className="border-b pb-4 flex flex-col sm:flex-row justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-primary">Dreamer Portal</h1>
            <p className="text-muted-foreground">Shape your dreams and bring them to life.</p>
          </div>
          <div className="flex gap-2 mt-2 sm:mt-0">
             <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
        </header>
        <SubscribePrompt />
      </div>
    );
  }


  // Authenticated (and subscribed if accessing gated content)
  return (
    <div className="space-y-8">
      <header className="border-b pb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-primary">Dreamer Portal</h1>
          <p className="text-muted-foreground">Shape your dreams and bring them to life.</p>
        </div>
        <div className="flex items-center gap-2">
          {!isSubscribed && (
            <Button onClick={() => {
              localStorage.setItem('dreamerSubscribed', 'true');
              setIsSubscribed(true);
              window.location.reload(); // Reload to reflect subscription
            }} 
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            size="sm"
            >
              <Star className="mr-2 h-4 w-4" /> Mock Subscribe
            </Button>
          )}
          <Button variant="outline" onClick={handleLogout} size="sm">Logout</Button>
        </div>
      </header>
      {children}
    </div>
  );
}
