
"use client";

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Metadata for this layout is removed as it's a client component.
// Individual page.tsx files within /investor should define their own metadata.

export default function InvestorLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This check runs only on the client-side
    const authStatus = localStorage.getItem('investorAuthenticated') === 'true';
    const approvalStatus = localStorage.getItem('investorApproved') === 'true';
    setIsAuthenticated(authStatus);
    setIsApproved(approvalStatus);
    setIsLoading(false); // Finished loading auth status

    if (!authStatus && pathname !== '/investor/auth') {
      router.replace('/investor/auth');
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('investorAuthenticated');
    localStorage.removeItem('investorApproved'); // Clear approval status on logout
    setIsAuthenticated(false);
    setIsApproved(false);
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
  if (pathname === '/investor/auth') {
    return <>{children}</>;
  }

  // If not authenticated (and not on auth page), show redirecting message.
  // This should be caught by useEffect redirect, but acts as a fallback.
  if (!isAuthenticated) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-4 text-lg">Redirecting to login...</p>
        </div>
    );
  }

  // If authenticated but NOT approved, show pending approval message
  if (!isApproved) {
    return (
      <div className="space-y-8">
        <header className="border-b pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-accent">Investor Portal</h1>
            <p className="text-muted-foreground">Account Pending Approval</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </header>
        <div className="container mx-auto px-4 py-8">
          <Alert>
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Approval Pending</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>Your account has been successfully created and is awaiting approval from our team. 
              This step is crucial to maintain the integrity of our network and the confidentiality of our dreamers' intellectual property.</p>
              <p>As part of the approval process, we may require verification of investor accreditation or financial standing. 
              You will be notified via email once your account has been reviewed and approved.</p>
              <p>Thank you for your patience.</p>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // If authenticated AND approved, render the main investor portal layout
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
