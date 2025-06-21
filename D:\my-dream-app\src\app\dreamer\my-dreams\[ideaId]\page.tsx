'use client';

import DreamDetailClient from '@/components/dreamer/DreamDetailClient';

interface DreamDetailPageProps {
  params: {
    ideaId: string;
  };
}

export default function DreamDetailPage({ params }: DreamDetailPageProps) {
  return <DreamDetailClient ideaId={params.ideaId} />;
}
