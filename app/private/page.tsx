import LogoutButton from "./LogoutButton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getUserAuthority } from './action';
import MessageList from '@/components/MessageList';
import PostForm from '@/components/PostForm';

export default async function PrivatePage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  
  if (error || !data?.user) {
    redirect("/account/login");
  }

  const authority = await getUserAuthority();
  if (!authority) {
    redirect('/account/login');
  }

  const { data: initialMessages } = await supabase
    .from('messages')
    .select('id, content, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <>
      <h2>Dashboard</h2> <br />
      <p>Hello {data.user.email}</p>
      <br /><br />
      <div className="min-h-screen p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Traffic Alerts</h1>
      {authority === 'admin' && <PostForm />}
      <MessageList initialMessages={initialMessages || []} />
    </div> <br /><br />
      <LogoutButton /> {/* Client Component */}
    </>
  );
}
