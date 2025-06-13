import IdeaSubmissionForm from '@/components/dreamer/IdeaSubmissionForm';

export default function NewIdeaPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-foreground">Submit Your New Idea</h1>
        <p className="text-muted-foreground">Let our AI help you refine your thoughts and plan your next steps.</p>
      </header>
      <IdeaSubmissionForm />
    </div>
  );
}
