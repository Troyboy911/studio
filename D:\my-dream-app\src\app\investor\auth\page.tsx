'use client';

import InvestorAuthForm from '@/components/investor/InvestorAuthForm';

// Note: For client components, metadata should ideally be handled by a parent layout.
// If you need dynamic metadata here, you might need to reconsider component structure
// or use a different approach as 'export const metadata' is for Server Components.
// For static titles like this, it might still work but can be misleading.
// Let's comment it out for now to align with client component best practices.
/*
export const metadata: Metadata = {
  title: 'Investor Sign In - IDream',
  description: 'Access the IDream Investor Portal.',
};
*/

export default function InvestorAuthPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-muted/30">
        <div className="container mx-auto px-4">
            <InvestorAuthForm />
        </div>
    </div>
  );
}
