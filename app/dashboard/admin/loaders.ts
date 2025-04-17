'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function getAdminDashboardData() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    redirect('/account/login');
  }

  const { data: clients, error: clientsError } = await supabase
    .from('userinfo')
    .select('id, first_name, last_name, email, email_confirmed_at')
    .order('last_name', { ascending: true });

  if (clientsError) {
    console.error('Failed to fetch clients:', clientsError.message);
    return [];
  }

  return clients;
}