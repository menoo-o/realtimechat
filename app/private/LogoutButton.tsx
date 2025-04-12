"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "./action";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSignOut() {
    startTransition(async () => {
      await signOut(); // Call the signOut function
      router.push("/account/login"); // Redirect after signing out
    });
  }

  return (
    <button onClick={handleSignOut} disabled={isPending}>
      {isPending ? "Signing out..." : "Sign Out"}
    </button>
  );
}
