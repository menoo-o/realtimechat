'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export interface UserInfo {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  email_confirmed_at: string | null;
}

export async function getUserInfo(): Promise<UserInfo | null> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    redirect('/account/login');
  }

  const { data, error: infoError } = await supabase
    .from('userinfo')
    .select('id, first_name, last_name, email, email_confirmed_at')
    .eq('id', user.id)
    .single();

  if (infoError) {
    console.error('Failed to fetch userinfo:', infoError.message);
    return null;
  }

  return data;
}