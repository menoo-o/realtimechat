

// export default async function AdminDashboard() {
//   const clients = await getAdminDashboardData();

//   if (!clients.length) {
//     throw new Error('No users found or error loading data.');
//   }

//   return (
//     <div>
//       <h2 className="text-xl mb-4">All Users</h2>
//       <table className="w-full border">
//         <thead>
//           <tr>
//             <th className="border p-2">First Name</th>
//             <th className="border p-2">Last Name</th>
//             <th className="border p-2">Email</th>
//             <th className="border p-2">Verified</th>
//           </tr>
//         </thead>
//         <tbody>
//           {clients.map((client) => (
//             <tr key={client.id}>
//               <td className="border p-2">{client.first_name}</td>
//               <td className="border p-2">{client.last_name}</td>
//               <td className="border p-2">{client.email}</td>
//               <td className="border p-2">
//                 {client.email_confirmed_at ? 'Yes' : 'No'}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// dashboard/admin/page.tsx
import { getAdminDashboardData } from './loaders';
import AdminChatForm from '@/components/AdminChatForm';

export default async function AdminDashboardPage() {
  const { user } = await getAdminDashboardData();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Chat Broadcast</h1>
      <AdminChatForm userId={user.id} />
    </div>
  );
}
