// # Logout button (client component)

'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { signOut } from '@/app/dashboard/actions';

export default function LogoutBtn() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSignOut() {
    startTransition(async () => {
      await signOut();
      router.push('/account/login');
    });
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={isPending}
      className="bg-red-500 text-white p-2 rounded"
    >
      {isPending ? 'Signing out...' : 'Sign Out'}
    </button>
  );
}