import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full text-center space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">Welcome to the Home Page</h2>
        <p className="text-gray-600">Implementing Auth & OAuth with Supabase</p>

        <div className="space-y-3">
          <Link
            href="/account/login"
            className="inline-block w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition"
          >
            Go to the Login Page
          </Link>

          <Link
            href="/"
            className="inline-block w-full text-orange-500 border border-orange-500 py-2 px-4 rounded-md hover:bg-orange-50 transition"
          >
            Already Logged In? Lets do some shopping          </Link>
        </div>
      </div>
    </main>
  );
}
