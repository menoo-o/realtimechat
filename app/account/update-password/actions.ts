"use server";
import { createClient } from "@/utils/supabase/server";

export async function updatePassword(code: string | null, newPassword: string) {
  const supabase = await createClient();

  if (!code) return { error: "Invalid or missing code." };

  // Supabase needs the code to update the password
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) return { error: "Failed to validate reset token." };

  // Now we can update the password
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  return { error: updateError?.message || null };
}
