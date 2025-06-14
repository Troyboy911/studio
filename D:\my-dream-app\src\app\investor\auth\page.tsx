
import InvestorAuthForm from '@/components/investor/InvestorAuthForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Investor Sign In - IDream',
  description: 'Access the IDream Investor Portal.',
};

export default function InvestorAuthPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-muted/30">
        <div className="container mx-auto px-4">
            <InvestorAuthForm />
        </div>
    </div>
  );
}
