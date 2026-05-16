'use client'

import Link from 'next/link'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(
    searchParams.get('error') === 'confirmation_failed'
      ? 'Email confirmation failed. Please try again.'
      : ''
  )
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push(next)
    router.refresh()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-line rounded-[3px] p-7 space-y-4"
    >
      {error && (
        <div className="text-[11px] text-[#c0392b] bg-[#fceaea] border border-[#f5c6c6] rounded-[3px] px-3 py-2.5">
          {error}
        </div>
      )}

      <div>
        <label className="block text-[9px] tracking-[2.5px] uppercase text-mid mb-1.5">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full bg-oat border border-line rounded-[3px] px-3 py-2 text-[12px] text-ink placeholder:text-mid/50 focus:outline-none focus:border-green focus:bg-white transition-colors"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="block text-[9px] tracking-[2.5px] uppercase text-mid mb-1.5">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full bg-oat border border-line rounded-[3px] px-3 py-2 text-[12px] text-ink placeholder:text-mid/50 focus:outline-none focus:border-green focus:bg-white transition-colors"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2.5 text-[9.5px] font-bold tracking-[1.5px] uppercase rounded-[2px] transition-colors font-body
          ${loading
            ? 'bg-oat-dark text-line cursor-not-allowed'
            : 'bg-green text-oat hover:bg-green-dark'
          }`}
      >
        {loading ? 'Signing in…' : 'Sign In'}
      </button>

      <p className="text-center text-[11px] text-mid pt-1">
        No account yet?{' '}
        <Link href="/auth/signup" className="text-green hover:underline">
          Create one
        </Link>
      </p>
    </form>
  )
}

export default function SignInPage() {
  return (
    <div className="min-h-[calc(100vh-62px)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-[380px]">
        <p className="text-[9.5px] tracking-[3px] uppercase text-matcha mb-2">
          Player Access
        </p>
        <h1 className="font-display text-[32px] font-semibold text-ink mb-8">
          Sign In
        </h1>
        <Suspense>
          <SignInForm />
        </Suspense>
      </div>
    </div>
  )
}
