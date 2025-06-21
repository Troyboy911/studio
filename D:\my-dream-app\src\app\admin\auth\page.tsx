'use client';

import AdminAuthForm from '@/components/admin/AdminAuthForm';

export default function AdminAuthPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-400px)] py-12 bg-muted/30">
        <div className="container mx-auto px-4">
            <AdminAuthForm />
        </div>
    </div>
  );
}
