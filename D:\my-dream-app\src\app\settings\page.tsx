
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Bell, UserCircle, LogOut, Palette, Globe, CreditCard } from 'lucide-react'; // Added CreditCard
import { Separator } from '@/components/ui/separator';
import { useToast } from "@/hooks/use-toast"; // Import useToast

// Since this is a client component, metadata is better handled by a parent layout or not at all if dynamic.

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [loggedInStatus, setLoggedInStatus] = useState<string>("Not currently logged in.");

  // Effect to handle initial theme load and ensure client-side execution
  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('idream-theme') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (storedTheme) {
      setTheme(storedTheme);
    } else if (systemPrefersDark) {
      setTheme('dark');
    } else {
      setTheme('light');
    }

    // Check login status
    const dreamerAuth = localStorage.getItem('dreamerAuthenticated') === 'true';
    const investorAuth = localStorage.getItem('investorAuthenticated') === 'true';

    if (dreamerAuth && investorAuth) {
      setLoggedInStatus("Logged in (Dreamer & Investor roles active)");
    } else if (dreamerAuth) {
      setLoggedInStatus("Logged in as Dreamer");
    } else if (investorAuth) {
      setLoggedInStatus("Logged in as Investor");
    } else {
      setLoggedInStatus("Not currently logged in.");
    }

  }, []);

  // Effect to apply theme changes to the DOM
  useEffect(() => {
    if (mounted) {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('idream-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('idream-theme', 'light');
      }
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    localStorage.removeItem('dreamerAuthenticated');
    localStorage.removeItem('dreamerSubscribed');
    localStorage.removeItem('investorAuthenticated');
    localStorage.removeItem('investorApproved');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    setLoggedInStatus("Not currently logged in."); // Update UI immediately
    router.push('/'); // Redirect to homepage
  };

  const handleManageSubscription = () => {
    // Navigate to a page where subscription can be managed
    // For this prototype, we'll direct to the dreamer dashboard which handles subscription UI
    router.push('/dreamer'); 
  };

  if (!mounted) {
    // Avoid rendering mismatch during hydration
    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
            <Palette className="h-12 w-12 animate-pulse text-primary" />
        </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <header className="text-center">
        <Palette className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold text-foreground">Settings</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Customize your IDream experience.
        </p>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Palette className="mr-3 h-6 w-6 text-accent" /> Appearance
          </CardTitle>
          <CardDescription>
            Adjust how IDream looks and feels.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between space-x-2 p-4 rounded-md border">
            <div className="flex items-center space-x-2">
              {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              <Label htmlFor="theme-toggle" className="text-base">
                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </Label>
            </div>
            <Switch
              id="theme-toggle"
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
              aria-label="Toggle theme"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <UserCircle className="mr-3 h-6 w-6 text-accent" /> Account
          </CardTitle>
          <CardDescription>
            Manage your account details and logout.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 rounded-md border">
            <p className="text-sm text-muted-foreground">{loggedInStatus}</p>
          </div>
          <Button variant="outline" className="w-full flex items-center" onClick={handleManageSubscription}>
            <CreditCard className="mr-2 h-4 w-4" /> Manage Subscription (Dreamer)
          </Button>
          <Button variant="destructive" className="w-full flex items-center" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Bell className="mr-3 h-6 w-6 text-accent" /> Notifications
          </CardTitle>
          <CardDescription>
            Manage how you receive updates from IDream. (Placeholder)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-md border bg-muted/30">
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <Switch id="email-notifications" disabled />
          </div>
          <div className="flex items-center justify-between p-3 rounded-md border bg-muted/30">
            <Label htmlFor="app-notifications">In-App Notifications</Label>
            <Switch id="app-notifications" checked disabled />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Globe className="mr-3 h-6 w-6 text-accent" /> Language & Region
          </CardTitle>
          <CardDescription>
            Choose your preferred language. (Placeholder)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex items-center justify-between p-3 rounded-md border bg-muted/30">
            <Label htmlFor="language-select">Language</Label>
            <select id="language-select" className="p-2 border rounded-md bg-background text-foreground" disabled>
                <option value="en">English (US)</option>
                <option value="es">Español</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-6" />
      <p className="text-center text-sm text-muted-foreground">
        More settings and customizations will be available soon.
      </p>
    </div>
  );
}
