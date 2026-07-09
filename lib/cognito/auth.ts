'use client'

import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js'

const poolData = {
  UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || '',
  ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '',
}

const userPool = new CognitoUserPool(poolData)

export async function cognitoSignIn(email: string, password: string) {
  return new Promise<{ userId: string; idToken: string }>((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: userPool })
    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    })

    user.authenticateUser(authDetails, {
      onSuccess: (result) => {
        resolve({
          userId: user.getUsername(),
          idToken: result.getIdToken().getJwtToken(),
        })
      },
      onFailure: (err) => reject(err),
    })
  })
}

export async function cognitoSignUp(email: string, password: string) {
  return new Promise<void>((resolve, reject) => {
    userPool.signUp(email, password, [], [], (err, result) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

export async function cognitoConfirmSignUp(email: string, code: string) {
  return new Promise<void>((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: userPool })
    user.confirmRegistration(code, true, (err, result) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

export async function cognitoResendCode(email: string) {
  return new Promise<void>((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: userPool })
    user.resendConfirmationCode((err, result) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

export async function cognitoGetCurrentUser() {
  const user = userPool.getCurrentUser()
  if (!user) return null

  return new Promise<{ userId: string; username: string }>((resolve, reject) => {
    user.getSession((err: any, session: any) => {
      if (err) reject(err)
      else {
        resolve({
          userId: user.getUsername(),
          username: user.getUsername(),
        })
      }
    })
  })
}

export async function cognitoSignOut() {
  const user = userPool.getCurrentUser()
  if (user) {
    user.signOut()
  }
}
