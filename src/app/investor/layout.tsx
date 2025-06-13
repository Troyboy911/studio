import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Investor Portal - IDream',
  description: 'Discover promising ideas and invest in the future.',
};

export default function InvestorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-8">
      <header className="border-b pb-4">
        <h1 className="text-4xl font-bold text-accent">Investor Portal</h1>
        <p className="text-muted-foreground">Find the next big idea and make your mark.</p>
      </header>
      {children}
    </div>
  );
}
