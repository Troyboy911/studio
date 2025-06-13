
import ProfileClient from '@/components/dreamer/ProfileClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Profile - IDream',
  description: 'Manage your Dreamer profile.',
};

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground">Showcase your skills and tell your story.</p>
      </header>
      <ProfileClient />
    </div>
  );
}
