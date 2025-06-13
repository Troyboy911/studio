"use client";

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LogIn } from 'lucide-react';

export default function InvestorAuthForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Mock authentication: any email/password will work for this prototype
    if (email && password) {
      localStorage.setItem('investorAuthenticated', 'true');
      router.push('/investor'); // Redirect to investor dashboard
    } else {
      setError('Please enter both email and password.');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl flex items-center text-accent">
          <LogIn className="mr-3 h-8 w-8" />
          Investor Access
        </CardTitle>
        <CardDescription>
          Sign in to access exclusive investment opportunities and connect with innovative dreamers.
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
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
            Sign In <LogIn className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </form>
      <CardContent className="text-center text-sm text-muted-foreground pt-4">
        <p>This is a prototype. Any email/password will work.</p>
        <p className="mt-2">Don't have an account? <a href="#" className="underline text-primary hover:text-primary/80" onClick={(e) => {e.preventDefault(); alert("Sign up is not implemented in this prototype.");}}>Sign up (mock)</a></p>
      </CardContent>
    </Card>
  );
}
