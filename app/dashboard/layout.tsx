import { Suspense } from 'react';
import LogoutButton from '@/components/LogoutButton/LogoutBtn';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl">Dashboard</h1>
        <LogoutButton />
      </header>
      <main className="p-4">
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
      </main>
    </div>
  );
}