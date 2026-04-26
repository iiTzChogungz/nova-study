import Link from 'next/link'
import { signup } from '../actions'
import { Rocket } from 'lucide-react'

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{' '}
        Back
      </Link>

      <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <div className="flex flex-col items-center mb-8 gap-2">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-500/30">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
          <p className="text-muted-foreground text-sm">Start your learning journey today</p>
        </div>

        <label className="text-sm font-medium" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-xl px-4 py-3 bg-inherit border focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all mb-4"
          name="email"
          placeholder="you@example.com"
          required
        />
        
        <label className="text-sm font-medium" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-xl px-4 py-3 bg-inherit border focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        
        <button
          formAction={signup}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl px-4 py-3 text-foreground mb-4 transition-all hover:shadow-md hover:shadow-blue-500/20 active:scale-[0.98]"
        >
          Sign Up
        </button>

        {searchParams?.message && (
          <p className="mt-4 p-4 bg-red-100 text-red-600 text-center rounded-xl text-sm font-medium">
            {searchParams.message}
          </p>
        )}

        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}
