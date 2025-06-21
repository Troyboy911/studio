'use client';

import SubmittedIdeaClient from '@/components/investor/SubmittedIdeaClient';

interface InvestorIdeaPageProps {
  params: {
    ideaId: string;
  };
}

export default function InvestorIdeaPage({ params }: InvestorIdeaPageProps) {
  return <SubmittedIdeaClient ideaId={params.ideaId} />;
}
