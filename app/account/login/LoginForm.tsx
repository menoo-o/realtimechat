'use client'

import Link from "next/link"
import { useActionState } from "react"
import { login } from "@/app/account/login/actions" // update the path as needed
import type { LoginState } from "@/lib/types/types"
import { createClient } from '@/utils/supabase/client';


export default function LoginForm() {
  const initialState: LoginState = { error: null };
  const [state, formAction, isPending] = useActionState(login, initialState);

  const handleGoogleSignIn = async () => {
    const supabase = createClient();
    const redirectTo = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/auth/callback'
      : 'https://realtimechat-smoky.vercel.app/auth/callback';

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        scopes: 'email profile',
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg border border-red-800">
        <h2 className="text-3xl font-bold text-center text-red-800 mb-6">Login</h2>

        <form action={formAction} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black">
              Email:
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full px-4 py-2 border border-red-300 rounded-md shadow-sm focus:ring-red-700 focus:border-red-700"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-black">
              Password:
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full px-4 py-2 border border-red-300 rounded-md shadow-sm focus:ring-red-700 focus:border-red-700"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-red-700 hover:bg-red-800 text-white font-medium py-2 px-4 rounded-md transition"
          >
            {isPending ? "Logging in..." : "Log in"}
          </button>

          {/* Google Sign In Button with Gmail stripe hover effect */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full mt-3 border border-gray-300 rounded-md px-4 py-2 relative overflow-hidden bg-white text-black transition-all duration-300 group"
          >
            <span className="relative z-10">Sign in with Google</span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-red-500 via-yellow-400 to-green-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-md"></span>
          </button>

          {state.error && (
            <p className="text-sm text-red-600 text-center">{state.error}</p>
          )}
        </form>

        <div className="mt-6 text-sm text-center space-y-2">
          <Link
            href="/account/signup"
            className="text-red-700 hover:underline"
          >
            Don&apos;t have an account? Sign up here!
          </Link>
          <br />
          <Link
            href="/account/reset-password"
            className="text-red-700 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
}
