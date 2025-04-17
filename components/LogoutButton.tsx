// app/components/LogoutButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from "react";
import { signOut } from "@/utils/helperfns";



export default function LogoutBtn() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSignOut() {
    startTransition(async () => {
      await signOut(); // Call the signOut function
      router.push("/account/login"); // Redirect after signing out
    });
  }

  return (
    <button 
       onClick={handleSignOut} 
       disabled={isPending}
       className="bg-red-500 text-white p-2 rounded"
       >
      {isPending ? "Signing out..." : "Sign Out"}
    </button>
  );
}