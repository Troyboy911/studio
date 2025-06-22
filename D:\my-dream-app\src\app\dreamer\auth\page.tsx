'use client';

import DreamerAuthForm from '@/components/dreamer/DreamerAuthForm';

// Note: For client components, metadata should ideally be handled by a parent layout.
// Commenting out for client component best practices.
/*
export const metadata: Metadata = {
  title: 'Dreamer Sign In - IDream',
  description: 'Access your IDream account or sign up.',
};
*/

export default function DreamerAuthPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-400px)] py-12 bg-muted/30">
        <div className="container mx-auto px-4">
            <DreamerAuthForm />
        </div>
    </div>
  );
}
