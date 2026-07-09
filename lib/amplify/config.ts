// AWS Amplify configuration
// Auth is optional for local dev (sign up/sign in won't work without Cognito configured)
// Fill in NEXT_PUBLIC_COGNITO_* values from AWS to enable auth

const hasAuthConfig =
  process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID &&
  process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID &&
  process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID

const amplifyConfig: any = {
  ...(hasAuthConfig && {
    Auth: {
      Cognito: {
        userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
        userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
        clientSecret: process.env.NEXT_PUBLIC_COGNITO_CLIENT_SECRET,
        identityPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID,
        signUpVerificationMethod: 'code',
        loginWith: {
          email: true,
        },
      },
    },
  }),
  ...(process.env.NEXT_PUBLIC_S3_BUCKET && {
    Storage: {
      S3: {
        bucket: process.env.NEXT_PUBLIC_S3_BUCKET,
        region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
      },
    },
  }),
}

export default amplifyConfig
export const hasAuth = hasAuthConfig
