import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

let client: DynamoDBDocumentClient | null = null

export function getDynamoClient(): DynamoDBDocumentClient {
  if (!client) {
    const dynamoClient = new DynamoDBClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        sessionToken: process.env.AWS_SESSION_TOKEN,
      },
    })
    client = DynamoDBDocumentClient.from(dynamoClient, {
      marshallOptions: {
        removeUndefinedValues: true,
      },
    })
  }
  return client
}

export const TABLES = {
  USERS: process.env.DYNAMO_USERS_TABLE || 'sitebuilder-users',
  SITES: process.env.DYNAMO_SITES_TABLE || 'sitebuilder-sites',
  IMAGES: process.env.DYNAMO_IMAGES_TABLE || 'sitebuilder-images',
  CONTACTS: process.env.DYNAMO_CONTACTS_TABLE || 'sitebuilder-contacts',
  DOMAINS: process.env.DYNAMO_DOMAINS_TABLE || 'sitebuilder-domains',
  ANALYTICS: process.env.DYNAMO_ANALYTICS_TABLE || 'sitebuilder-analytics',
} as const
