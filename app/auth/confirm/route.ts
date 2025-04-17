
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

  

  // Redirect to /login
  redirect(next);
}