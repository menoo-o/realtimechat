import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server"; 
import SignUpForm from "@/components/loginAndRegister/SignUpForm";
import './styles.css'

export default async function RegisterPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data?.user) {
    redirect("/"); // Redirect if already logged in
  }
 
  return <SignUpForm />;
}
