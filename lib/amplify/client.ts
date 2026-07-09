'use client'

import { Amplify } from 'aws-amplify'
import { fetchAuthSession, getCurrentUser, signOut } from 'aws-amplify/auth'
import amplifyConfig, { hasAuth } from './config'

let configured = false

export function configureAmplify() {
  if (!configured && hasAuth) {
    Amplify.configure(amplifyConfig, { ssr: true })
    configured = true
  }
}

export async function getAuthUser() {
  if (!hasAuth) return null
  try {
    const user = await getCurrentUser()
    return user
  } catch {
    return null
  }
}

export async function getAuthSession() {
  if (!hasAuth) return null
  try {
    const session = await fetchAuthSession()
    return session
  } catch {
    return null
  }
}

export async function logout() {
  if (!hasAuth) return
  try {
    await signOut()
  } catch {
    // ignore
  }
}
