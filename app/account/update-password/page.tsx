"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { updatePassword } from "./actions";
import { Suspense } from 'react'


function PasswordReset() {

  const searchParams = useSearchParams();
  const token = searchParams.get("code"); // Use "code", not "token"

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    const { error } = await updatePassword(token, password);
    if (error) {
      setMessage("Error: " + error);
    } else {
      setMessage("Password updated! You can now login.");
      
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
    <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Set New Password</h2>

      <form
        onSubmit={(e) => {
          handleSubmit(e);
          router.push("/private");
        }}
        className="space-y-5"
      >
        <div>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition"
        >
          Update Password
        </button>
      </form>

      {message && (
        <p className="text-center text-sm text-gray-700 mt-4">{message}</p>
      )}
    </div>
  </div>
);
}

export default function UpdatePasswordPage(){
  return(
    <>
      <Suspense>
        <PasswordReset />
      </Suspense>
    </>
  )
}