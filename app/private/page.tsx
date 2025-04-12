import LogoutButton from "./LogoutButton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function PrivatePage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/account/login");
  }

  return (
    <>
      <p>Hello {data.user.email}</p>
      <br /><br />
      <LogoutButton /> {/* Client Component */}
    </>
  );
}
