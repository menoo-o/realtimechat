import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Initialize Supabase client
  const supabase = await createClient();

  // Get user
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return NextResponse.redirect(new URL('/account/login', request.url));
  }

  // Get role
  const { data: role, error: roleError } = await supabase
    .from('roles')
    .select('authority')
    .eq('user_id', user.id)
    .single();

  if (roleError || !role) {
    console.error('Role check failed:', roleError?.message);
    // Fallback to user dashboard
    return NextResponse.redirect(new URL('/dashboard/user', request.url));
  }

 

  // Client: Allow /dashboard/user, redirect from /dashboard/admin
  if (role.authority === 'client') {
    if (pathname.startsWith('/dashboard/admin')) {
      return NextResponse.redirect(new URL('/dashboard/user', request.url));
    }
    return NextResponse.next(); // Allow /dashboard/user
  }

  if (role.authority === 'admin') {
    if (pathname.startsWith('/dashboard/user')) {
      return NextResponse.redirect(new URL('/dashboard/admin', request.url));
    } 
    return NextResponse.next(); // Allow /dashboard/user
  }

  // Unknown role: Fallback to user dashboard
  console.warn(`Unknown role for user ${user.id}: ${role.authority}`);
  return NextResponse.redirect(new URL('/dashboard/user', request.url));
}

export const config = {
  matcher: ['/dashboard/user/:path*', '/dashboard/admin/:path*'],
};

// 