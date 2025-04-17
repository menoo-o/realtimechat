'use client';

import { useActionState, useEffect } from 'react';
import { login, getUserRoleAndRedirect } from './actions';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';


export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, {
    error: null,
    success: false,
  });
  const router = useRouter();

  // Google SignIn 
  const handleGoogleSignIn = async () => {
    const supabase =await createClient();
    const redirectTo = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/auth/callback'
      : 'https://template-setup.vercel.app/auth/callback';
    
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { 
        redirectTo,
        scopes:'email profile', //// Matches /auth/userinfo.email, /auth/userinfo.profile
      
      },
    });
  }

  // Redirect on successful login
  useEffect(() => {
    if (state.success) {
      // Call redirect function (server action, but we handle it client-side)
      getUserRoleAndRedirect().catch((err) => {
        console.error('Redirect failed:', err);
        router.push('/dashboard/user'); // Fallback
      });
    }
  }, [state.success, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
    <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

      <form action={formAction} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email:
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password:
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition"
        >
          {isPending ? "Logging in..." : "Log in"}
        </button>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full mt-3 border border-gray-300 rounded-md px-4 py-2 transition-all duration-300 relative overflow-hidden group bg-white text-black"
        >
           <span className="relative z-10">Sign in with Google</span>

        </button>


        {state.error && (
          <p className="text-sm text-red-600 text-center">{state.error}</p>
        )}
      </form>

      <div className="mt-6 text-sm text-center space-y-2">
        <Link
          href="/account/signup"
          className="text-orange-500 hover:underline"
        >
          Don&apos;t have an account? Sign up here!
        </Link>
        <br />
        <Link
          href="/account/reset-password"
          className="text-orange-500 hover:underline"
        >
          Forgot password?
        </Link>
      </div>
    </div>
  </div>
);
}