import { createClient } from '@/utils/supabase/server';
import { getUserRoleAndRedirect } from './actions';
import LoginForm from './LoginForm';

export default async function LoginPage() {
  const supabase = await createClient();

  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    // Redirect based on role
    await getUserRoleAndRedirect();
  }

  return <LoginForm />;
}