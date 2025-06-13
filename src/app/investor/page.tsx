import InvestorDashboardClient from '@/components/investor/InvestorDashboardClient';

export default function InvestorDashboardPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-foreground">Submitted Ideas</h1>
        <p className="text-muted-foreground">Browse through innovative ideas submitted by dreamers. Find your next investment opportunity.</p>
      </header>
      <InvestorDashboardClient />
    </div>
  );
}
