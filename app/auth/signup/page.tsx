'use client'

import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setDone(true)
  }

  if (done) {
    return (
      <div className="min-h-[calc(100vh-62px)] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-[380px] text-center">
          <div className="w-10 h-10 rounded-full bg-[#e8f5ee] flex items-center justify-center mx-auto mb-5">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 9.5l4 4 8-8" stroke="#1a5c38" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-[9.5px] tracking-[3px] uppercase text-matcha mb-2">
            Almost there
          </p>
          <h1 className="font-display text-[28px] font-semibold text-ink mb-3">
            Check your email
          </h1>
          <p className="text-[12px] text-mid leading-[1.7] mb-6">
            We sent a confirmation link to <span className="text-ink font-medium">{email}</span>.
            Click it to activate your account.
          </p>
          <Link
            href="/auth/signin"
            className="text-[9.5px] font-bold tracking-[1.5px] uppercase text-green hover:text-green-dark transition-colors"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-62px)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-[380px]">
        <p className="text-[9.5px] tracking-[3px] uppercase text-matcha mb-2">
          Player Access
        </p>
        <h1 className="font-display text-[32px] font-semibold text-ink mb-8">
          Create Account
        </h1>

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
              autoComplete="new-password"
              className="w-full bg-oat border border-line rounded-[3px] px-3 py-2 text-[12px] text-ink placeholder:text-mid/50 focus:outline-none focus:border-green focus:bg-white transition-colors"
              placeholder="Min. 6 characters"
            />
          </div>

          <div>
            <label className="block text-[9px] tracking-[2.5px] uppercase text-mid mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
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
            {loading ? 'Creating account…' : 'Create Account'}
          </button>

          <p className="text-center text-[11px] text-mid pt-1">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-green hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
