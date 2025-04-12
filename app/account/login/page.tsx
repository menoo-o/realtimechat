import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server"; 
import LoginForm from "./LoginForm";


export default async function LoginPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data?.user) {
    redirect("/private"); // Redirect logged-in users
  }

  return <LoginForm />; // Render Client Component
}
