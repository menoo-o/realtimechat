
import MessageSender from '@/components/admin/MessageSender';
import AdminMessageDisplay from '@/components/admin/MessageDisplay';

export default function AdminDashboard() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
      <MessageSender />
      <AdminMessageDisplay />
    </div>
  );
}