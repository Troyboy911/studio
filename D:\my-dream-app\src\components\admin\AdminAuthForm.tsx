"use client";

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldCheck, LogIn } from 'lucide-react';

const ADMIN_EMAIL = 'admin@idream.app';
const ADMIN_PASSWORD = 'supersecret';

export default function AdminAuthForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem('adminAuthenticated', 'true');
      router.push('/admin'); 
    } else {
      setError('Invalid admin credentials.');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-accent">
      <CardHeader>
        <CardTitle className="text-3xl flex items-center text-accent">
          <ShieldCheck className="mr-3 h-8 w-8" />
          Admin Portal
        </CardTitle>
        <CardDescription>
          Please enter your administrator credentials to continue.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@idream.app"
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
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            Sign In <LogIn className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
