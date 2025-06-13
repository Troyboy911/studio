import DreamDetailClient from '@/components/dreamer/DreamDetailClient';

interface DreamDetailPageProps {
  params: {
    ideaId: string;
  };
}

export default function DreamDetailPage({ params }: DreamDetailPageProps) {
  return <DreamDetailClient ideaId={params.ideaId} />;
}

// Optional: Generate static paths if you have a fixed set of ideas at build time (not typical for dynamic data)
// export async function generateStaticParams() {
//   // const ideas = await fetchIdeas(); // Fetch your ideas
//   // return ideas.map(idea => ({ ideaId: idea.id }));
//   return []; // For now, let it be server-rendered on demand
// }

export async function generateMetadata({ params }: DreamDetailPageProps) {
  // In a real app, fetch idea title based on params.ideaId
  return {
    title: `Dream Details - ${params.ideaId} | IDream`,
  };
}
