"use server";


import { LoginState } from "@/lib/types/types";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(prevState: LoginState, formData: FormData):  Promise<LoginState> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/private"); // Redirect on success
}
