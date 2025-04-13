
// app/auth/confirm/route.ts
import { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/account/login'; // Redirect to /login by default

  if (!code) {
    redirect('/error?reason=missing_code');
  }

  // No need for verifyOtp—Supabase already verified the code before redirecting here
  // Trigger has already populated userinfo

  // Redirect to /login
  redirect(next);
}