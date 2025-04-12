"use client";


import { RegisterState } from "@/lib/types/types";
import { useActionState } from "react";
import { register } from "@/app/account/signup/actions";
import Link from "next/link";



export default function SignUpForm() {
  const initialState: RegisterState = { error: null };
  const [state, formAction, isPending] = useActionState(register, initialState);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg border border-red-800">
        <h2 className="text-3xl font-bold text-center text-red-800 mb-6">Sign Up</h2>

        <form action={formAction} className="space-y-5">
          <div>
            <label htmlFor="firstname" className="block text-sm font-medium mb-1 text-black">
              First Name
            </label>
            <input
              id="firstname"
              name="firstname"
              type="text"
              required
              className="w-full px-4 py-2 border border-red-300 rounded-md shadow-sm focus:ring-red-700 focus:border-red-700 text-[#0096FF]"
            />
          </div>

          <div>
            <label htmlFor="lastname" className="block text-sm font-medium mb-1 text-black">
              Last Name
            </label>
            <input
              id="lastname"
              name="lastname"
              type="text"
              required
              className="w-full px-4 py-2 border border-red-300 rounded-md shadow-sm focus:ring-red-700 focus:border-red-700 text-[#0096FF]"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1 text-black">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-2 border border-red-300 rounded-md shadow-sm focus:ring-red-700 focus:border-red-700 text-[#0096FF]"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1 text-black">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-2 border border-red-300 rounded-md shadow-sm focus:ring-red-700 focus:border-red-700 text-[#0096FF]"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-red-700 hover:bg-red-800 text-white font-medium py-2 px-4 rounded-md transition"
          >
            {isPending ? "Signing up..." : "Sign up"}
          </button>

          {state?.error && (
            <p className="text-red-600 text-sm text-center mt-2">{state.error}</p>
          )}
        </form>

        <div className="text-center mt-6">
          <Link
            href="/account/login"
            className="text-sm text-red-700 hover:underline"
          >
            Already have an account? Log in here!
          </Link>
        </div>
      </div>
    </div>
  );
}
