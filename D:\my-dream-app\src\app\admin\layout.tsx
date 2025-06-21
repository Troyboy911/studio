"use client";

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldCheck, LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
    setIsLoading(false);

    if (!authStatus && pathname !== '/admin/auth') {
      router.replace('/admin/auth');
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    setIsAuthenticated(false);
    router.replace('/admin/auth');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading Admin Portal...</p>
      </div>
    );
  }

  // If on auth page, render it directly
  if (pathname === '/admin/auth') {
    return <>{children}</>;
  }

  // Fallback for redirect
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Redirecting to admin login...</p>
      </div>
    );
  }

  // Main admin layout for authenticated users
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
