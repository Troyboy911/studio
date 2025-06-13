"use client";

import type { DreamIdea } from '@/types';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DollarSign, Send, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface InvestmentOfferFormProps {
  idea: DreamIdea;
}

const MIN_INVESTMENT_AMOUNT = 5000;

export default function InvestmentOfferForm({ idea }: InvestmentOfferFormProps) {
  const [offerType, setOfferType] = useState<'investment' | 'buyout'>('investment');
  const [amount, setAmount] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid offer amount.');
      return;
    }

    if (offerType === 'investment' && numericAmount < MIN_INVESTMENT_AMOUNT) {
      setError(`Minimum investment amount is $${MIN_INVESTMENT_AMOUNT.toLocaleString()}.`);
      return;
    }

    // Simulate submission
    console.log({
      ideaId: idea.id,
      offerType,
      amount: numericAmount,
      message,
    });
    
    // In a real app, this would be an API call to save the offer
    // For now, also update the global mock for other parts of the app, e.g. add to idea.offers
    const ideaIndex = mockUserIdeas.findIndex(i => i.id === idea.id);
    if (ideaIndex !== -1) {
      // mockUserIdeas[ideaIndex].offers = [...(mockUserIdeas[ideaIndex].offers || []), { /* new offer data */ }];
      // For simplicity, just log it. A real app would update state and potentially the mock data.
    }


    setIsSubmitted(true);
    toast({
        title: "Offer Submitted!",
        description: `Your ${offerType} offer of $${numericAmount.toLocaleString()} for "${idea.title}" has been sent.`,
    });
  };

  if (isSubmitted) {
    return (
      <Card className="shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader className="items-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          <CardTitle className="text-2xl text-green-700">Offer Sent Successfully!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-green-600">
            Your {offerType} offer of ${parseFloat(amount).toLocaleString()} for "{idea.title}" has been submitted.
            The dreamer will be notified.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center text-accent">
          <DollarSign className="mr-2 h-7 w-7" /> Make an Offer
        </CardTitle>
        <CardDescription>
          Interested in "{idea.title}"? Submit your investment proposal or buyout offer below.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-md font-semibold">Offer Type</Label>
            <RadioGroup value={offerType} onValueChange={(value) => setOfferType(value as 'investment' | 'buyout')} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="investment" id="investment" />
                <Label htmlFor="investment">Invest in Project</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="buyout" id="buyout" />
                <Label htmlFor="buyout">Buy Outright</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-md font-semibold">
              {offerType === 'investment' ? 'Investment Amount (USD)' : 'Buyout Offer (USD)'}
            </Label>
            <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={offerType === 'investment' ? `Min. ${MIN_INVESTMENT_AMOUNT.toLocaleString()}` : 'e.g., 50000'}
                className="pl-10"
                min={offerType === 'investment' ? MIN_INVESTMENT_AMOUNT : 1}
                step="100"
                required
                />
            </div>
            {offerType === 'investment' && <p className="text-xs text-muted-foreground">Minimum investment: ${MIN_INVESTMENT_AMOUNT.toLocaleString()}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-md font-semibold">Message to Dreamer (Optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Include any terms, conditions, or a personal message..."
              rows={4}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
            Submit Offer <Send className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

// Need to import mockUserIdeas if modifying it, or use a global state/context for a better scaffold
import { mockUserIdeas } from '@/lib/mockIdeas';
