"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Sign out failed:", error.message);
    return;
  }

  redirect("/account/login");
}


export async function getUserAuthority() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('userinfo')
    .select('authority')
    .eq('user_id', user.id)
    .single();

  if (error || !data) {
    return null;
  }

  return data.authority as 'admin' | 'client';
}