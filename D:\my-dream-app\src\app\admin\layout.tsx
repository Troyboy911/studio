"use client";

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldCheck, LogOut } from 'lucide-react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, now check for admin claim.
        try {
          const idTokenResult = await user.getIdTokenResult(true); // Force refresh
          if (idTokenResult.claims.admin === true) {
            setIsAdmin(true);
          } else {
            // User is valid but not an admin.
            setIsAdmin(false);
            if (pathname !== '/admin/auth') {
              router.replace('/admin/auth'); // Or a generic "access-denied" page
            }
          }
        } catch (error) {
          console.error("Error fetching user claims:", error);
          setIsAdmin(false);
          if (pathname !== '/admin/auth') {
            router.replace('/admin/auth');
          }
        }
      } else {
        // User is signed out.
        setIsAdmin(false);
        if (pathname !== '/admin/auth') {
          router.replace('/admin/auth');
        }
      }
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAdmin(false);
      router.replace('/admin/auth');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Verifying Admin Access...</p>
      </div>
    );
  }

  // If on auth page, render it directly. We handle auth state inside the form.
  if (pathname === '/admin/auth') {
    return <>{children}</>;
  }

  // Fallback for redirect while state is resolving or if user is not admin
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Redirecting...</p>
      </div>
    );
  }

  // Main admin layout for authenticated and authorized admins
  return (
    <div className="space-y-8">
      <header className="border-b pb-4 flex justify-between items-center">
        <div className="flex items-center">
          <ShieldCheck className="mr-3 h-8 w-8 text-accent" />
          <div>
              <h1 className="text-4xl font-bold text-accent">Admin Dashboard</h1>
              <p className="text-muted-foreground">Oversee application data and activity.</p>
          </div>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </header>
      {children}
    </div>
  );
}
