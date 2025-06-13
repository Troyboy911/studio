import SubmittedIdeaClient from '@/components/investor/SubmittedIdeaClient';

interface InvestorIdeaPageProps {
  params: {
    ideaId: string;
  };
}

export default function InvestorIdeaPage({ params }: InvestorIdeaPageProps) {
  return <SubmittedIdeaClient ideaId={params.ideaId} />;
}

export async function generateMetadata({ params }: InvestorIdeaPageProps) {
  // In a real app, fetch idea title based on params.ideaId
  return {
    title: `Investment Opportunity - ${params.ideaId} | IDream`,
  };
}
