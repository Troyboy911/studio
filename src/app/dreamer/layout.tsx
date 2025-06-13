
"use client";

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, Lock, Star, CreditCard } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useToast } from "@/hooks/use-toast";

// Metadata should be handled by individual page.tsx files if layout is client component

function SubscribePrompt({ onSubscribeClick }: { onSubscribeClick: () => void }) {
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
        <Button onClick={onSubscribeClick} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          <Star className="mr-2 h-5 w-5" /> Mock Subscribe Now
        </Button>
        <p className="text-xs text-center text-muted-foreground">(This will open a mock payment dialog)</p>
      </CardContent>
    </Card>
  );
}

function MockPaymentDialog({ isOpen, onClose, onConfirm }: { isOpen: boolean, onClose: () => void, onConfirm: () => void }) {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(openState) => !openState && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <CreditCard className="mr-3 h-6 w-6 text-primary" /> Confirm Your Subscription
          </DialogTitle>
          <DialogDescription className="pt-2">
            You're about to subscribe to IDream Premium. This is a mock payment step.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <p className="text-center font-semibold text-lg">IDream Premium Plan</p>
              <p className="text-center text-3xl font-bold text-primary mt-2">$9.99<span className="text-sm font-normal text-muted-foreground">/month</span></p>
              <p className="text-center text-xs text-muted-foreground mt-1">(Mock Price - No Real Charge)</p>
            </CardContent>
          </Card>
        </div>
        <DialogFooter className="gap-2 sm:justify-between">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={onConfirm} className="bg-primary hover:bg-primary/90">
            Confirm & Pay (Mock)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export default function DreamerLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const { toast } = useToast();

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

  const handleConfirmMockPayment = () => {
    localStorage.setItem('dreamerSubscribed', 'true');
    setIsSubscribed(true);
    setShowPaymentDialog(false);
    toast({
      title: "Subscription Activated!",
      description: "Welcome to IDream Premium! All features are now unlocked.",
    });
    // Reload or navigate to ensure subscription state is reflected everywhere
    window.location.reload(); 
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
  const isGatedSection = pathname.startsWith('/dreamer/my-dreams') || pathname.startsWith('/dreamer/new-idea'); // Added new-idea to gated
  
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
        <SubscribePrompt onSubscribeClick={() => setShowPaymentDialog(true)} />
        <MockPaymentDialog 
          isOpen={showPaymentDialog} 
          onClose={() => setShowPaymentDialog(false)} 
          onConfirm={handleConfirmMockPayment} 
        />
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
            <Button 
              onClick={() => setShowPaymentDialog(true)}
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
      <MockPaymentDialog 
        isOpen={showPaymentDialog} 
        onClose={() => setShowPaymentDialog(false)} 
        onConfirm={handleConfirmMockPayment} 
      />
    </div>
  );
}
