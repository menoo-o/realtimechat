'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

// Consistent state shape
export interface LoginState {
  error: string | null;
  success?: boolean; // Optional, for clarity
}

// Reusable redirect function
export async function getUserRoleAndRedirect() {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    redirect('/account/login');
  }
  const { data: role, error: roleError } = await supabase
    .from('roles')
    .select('authority')
    .eq('user_id', user.id)
    .single();
  if (roleError || !role) {
    console.error('Role check failed:', roleError?.message);
    redirect('/dashboard/user');
  }
  if (role.authority === 'admin') {
    redirect('/dashboard/admin');
  } else {
    redirect('/dashboard/user');
  }
}

export async function login(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required.', success: false };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message, success: false };
  }

  // Return success state (redirect handled separately)
  return { error: null, success: true };
}