"use server";


import { RegisterState } from "@/lib/types/types";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

// Signup action function
export async function register( prevState: RegisterState,  formData: FormData): Promise<RegisterState> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get('firstname') as string;
  const lastname = formData.get('lastname') as string;

  if (!email || !password || !firstName || !lastname) {
    return { error: "Incomplete Fields" };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastname,
      },
      emailRedirectTo: process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/auth/confirm'
        : 'https://template-setup.vercel.app/auth/confirm',
    },
  });

if (error) {
 return { error: error.message }; // Return error back to UI
}

redirect("/account/login"); // Redirect on success
}
