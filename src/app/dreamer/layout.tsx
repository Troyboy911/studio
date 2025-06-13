import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dreamer Portal - IDream',
  description: 'Manage your ideas, refine them, and prepare for investment.',
};

export default function DreamerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-8">
      <header className="border-b pb-4">
        <h1 className="text-4xl font-bold text-primary">Dreamer Portal</h1>
        <p className="text-muted-foreground">Shape your dreams and bring them to life.</p>
      </header>
      {children}
    </div>
  );
}
