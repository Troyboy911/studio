import AdminDashboardClient from '@/components/admin/AdminDashboardClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - IDream',
  description: 'Oversee all ideas and users on the IDream platform.',
};


export default function AdminPage() {
  return (
    <AdminDashboardClient />
  );
}
