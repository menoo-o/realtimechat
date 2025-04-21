// app/auth/callback/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

//google auth redirect after successfull code exchange
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // how to redirect based on who's loging in! do we check user role here?
  const next = searchParams.get('next') ?? '/account/login';

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`);
  }

  const supabase = await createClient();

  const {  error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error('Code exchange error:', error);
    return NextResponse.redirect(`${origin}/login?error=auth_failed&message=${encodeURIComponent(error.message)}`);
  }

  // Trigger handles userinfo population—no manual upsert needed
  const forwardedHost = request.headers.get('x-forwarded-host');
  const isLocalEnv = process.env.NODE_ENV === 'development';

  if (isLocalEnv) {
    return NextResponse.redirect(`${origin}${next}`);
  } else if (forwardedHost) {
    return NextResponse.redirect(`https://${forwardedHost}${next}`);
  } else {
    return NextResponse.redirect(`${origin}${next}`);
  }
}