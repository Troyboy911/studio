import MyIdeasClient from '@/components/dreamer/MyIdeasClient';

export default function MyDreamsPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-foreground">My Dreams</h1>
        <p className="text-muted-foreground">Here are all the ideas you're currently working on. Refine, plan, and prepare them for success!</p>
      </header>
      <MyIdeasClient />
    </div>
  );
}
