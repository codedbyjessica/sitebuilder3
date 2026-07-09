'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  signIn,
  signUp,
  confirmSignUp,
  resendSignUpCode,
} from 'aws-amplify/auth'
import { configureAmplify, getAuthUser } from '@/lib/amplify/client'
import { loadDraft, deleteDraft } from '@/lib/siteStore'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Link from 'next/link'

type Mode = 'login' | 'signup' | 'confirm'

async function publishDraftAfterLogin(publishId: string, userId: string) {
  const draft = loadDraft(publishId)
  if (!draft) return
  const existing = await fetch(`/api/sites/${publishId}`, { headers: { 'x-user-id': userId } })
  if (existing.ok) {
    await fetch(`/api/sites/${publishId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
      body: JSON.stringify({ published: true }),
    })
  } else {
    await fetch('/api/sites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
      body: JSON.stringify({ ...draft, userId, published: true }),
    })
  }
  deleteDraft(publishId)
}

function LoginForm() {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const publishId = searchParams.get('publish')

  useEffect(() => {
    configureAmplify()
    getAuthUser().then((user) => {
      if (user) router.replace('/app')
    })
  }, [router])

  async function afterAuth(userId: string) {
    if (publishId) {
      await publishDraftAfterLogin(publishId, userId)
      router.push(`/app/edit/${publishId}`)
    } else {
      router.push('/app')
    }
  }

  async function handleLogin() {
    setLoading(true)
    setError('')
    try {
      await signIn({ username: email, password })
      const user = await getAuthUser()
      await afterAuth(user?.userId ?? '')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Login failed')
      setLoading(false)
    }
  }

  async function handleSignup() {
    setLoading(true)
    setError('')
    try {
      await signUp({ username: email, password, options: { userAttributes: { email } } })
      setMode('confirm')
      setLoading(false)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Sign up failed')
      setLoading(false)
    }
  }

  async function handleConfirm() {
    setLoading(true)
    setError('')
    try {
      await confirmSignUp({ username: email, confirmationCode: code })
      await signIn({ username: email, password })
      const user = await getAuthUser()
      await afterAuth(user?.userId ?? '')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Confirmation failed')
      setLoading(false)
    }
  }

  async function handleResend() {
    try {
      await resendSignUpCode({ username: email })
    } catch {
      // silent
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-maple rounded-lg flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">S</span>
            </div>
            <span className="font-display font-semibold text-ink text-lg">Sitelit</span>
          </Link>
          <h1 className="font-display text-2xl font-semibold text-ink">
            {mode === 'confirm' ? 'Check your email' : publishId ? 'Sign in to publish' : mode === 'login' ? 'Sign in' : 'Create account'}
          </h1>
          {mode === 'confirm' && (
            <p className="text-sm text-ink/50 mt-2">
              We sent a code to <strong>{email}</strong>
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-ink/10 shadow-sm p-6 space-y-4">
          {mode !== 'confirm' && (
            <>
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                hint={mode === 'signup' ? 'At least 8 characters' : undefined}
              />
            </>
          )}

          {mode === 'confirm' && (
            <Input
              label="Verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
            />
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button
            className="w-full"
            onClick={
              mode === 'login'
                ? handleLogin
                : mode === 'signup'
                ? handleSignup
                : handleConfirm
            }
            loading={loading}
          >
            {mode === 'login' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Verify email'}
          </Button>

          {mode === 'confirm' && (
            <button
              type="button"
              onClick={handleResend}
              className="w-full text-sm text-ink/50 hover:text-ink/70"
            >
              Resend code
            </button>
          )}
        </div>

        <p className="text-center text-sm text-ink/50 mt-6">
          {mode === 'login' ? (
            <>
              No account?{' '}
              <button
                className="text-maple font-medium hover:underline"
                onClick={() => { setMode('signup'); setError('') }}
              >
                Create account
              </button>
            </>
          ) : mode === 'signup' ? (
            <>
              Already have an account?{' '}
              <button
                className="text-maple font-medium hover:underline"
                onClick={() => { setMode('login'); setError('') }}
              >
                Sign in
              </button>
            </>
          ) : (
            <button
              className="text-maple font-medium hover:underline"
              onClick={() => { setMode('signup'); setError('') }}
            >
              Back to sign up
            </button>
          )}
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
