'use client'

import { Amplify } from 'aws-amplify'
import { fetchAuthSession, getCurrentUser, signOut } from 'aws-amplify/auth'
import amplifyConfig from './config'

let configured = false

export function configureAmplify() {
  if (!configured) {
    Amplify.configure(amplifyConfig, { ssr: true })
    configured = true
  }
}

export async function getAuthUser() {
  try {
    const user = await getCurrentUser()
    return user
  } catch {
    return null
  }
}

export async function getAuthSession() {
  try {
    const session = await fetchAuthSession()
    return session
  } catch {
    return null
  }
}

export async function logout() {
  await signOut()
}
