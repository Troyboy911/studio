
"use client";

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LogIn, UserPlus } from 'lucide-react';

export default function DreamerAuthForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Mock authentication: any email/password will work for this prototype
    if (email && password) {
      localStorage.setItem('dreamerAuthenticated', 'true');
      // For now, new sign-ups/sign-ins do NOT automatically grant subscription
      // localStorage.setItem('dreamerSubscribed', 'false'); // Explicitly set or leave unset
      router.push('/dreamer'); // Redirect to dreamer dashboard
    } else {
      setError('Please enter both email and password.');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl flex items-center text-primary">
          <UserPlus className="mr-3 h-8 w-8" />
          Dreamer Access
        </CardTitle>
        <CardDescription>
          Sign in or create an account to manage your ideas, access planning tools, and connect with investors (subscription required for some features).
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Login Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            Sign In / Sign Up <LogIn className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </form>
      <CardContent className="text-center text-sm text-muted-foreground pt-4">
        <p>This is a prototype. Any email/password will work for sign-in/sign-up.</p>
        <p className="mt-1">Access to Dream Planner and Investor Hub requires a subscription after sign-in.</p>
      </CardContent>
    </Card>
  );
}
