
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Bell, UserCircle, LogOut, Palette, Globe } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { Metadata } from 'next';

// Since this is a client component, metadata is better handled by a parent layout or not at all if dynamic.
// For a static title, we can leave it commented or create a server component wrapper if needed.
// export const metadata: Metadata = {
//   title: 'Settings - IDream',
//   description: 'Manage your application preferences.',
// };

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

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

  if (!mounted) {
    // Avoid rendering mismatch during hydration, show a loader or null.
    // This could be a simple loading spinner or skeleton.
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
            <UserCircle className="mr-3 h-6 w-6 text-accent" /> Account
          </CardTitle>
          <CardDescription>
            Manage your account details and subscription. (Placeholder)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 rounded-md border">
            <p className="text-sm text-muted-foreground">Logged in as: <span className="font-medium text-foreground">dreamer@example.com</span> (Mock)</p>
          </div>
          <Button variant="outline" className="w-full" disabled>Manage Subscription</Button>
          <Button variant="destructive" className="w-full flex items-center" disabled>
            <LogOut className="mr-2 h-4 w-4" /> Logout (Mock)
          </Button>
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
