import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";


// Helper function to split full_name
export default function splitName(fullName?: string): { firstName: string; lastName: string } {
    if (!fullName || typeof fullName !== 'string') {
      return { firstName: 'Unknown', lastName: 'Unknown' };
    }
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) {
      return { firstName: parts[0], lastName: 'Unknown' };
    }
    return {
      firstName: parts[0],
      lastName: parts.slice(1).join(' ') || 'Unknown',
    };
  }



// signout 
export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Sign out failed:", error.message);
    return;
  }

  redirect("/account/login");
}
