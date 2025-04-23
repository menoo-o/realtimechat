'use client';

import MessageSender from '@/components/admin/MessageSender';
import MessageDisplay from '@/components/user/MessageDisplay';

export default function AdminDashboard() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <MessageSender />
      <MessageDisplay />
    </div>
  );
}