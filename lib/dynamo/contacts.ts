import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { getDynamoClient, TABLES } from './client'
import type { ContactSubmission } from '@/lib/types'

export async function saveContact(submission: ContactSubmission): Promise<void> {
  const client = getDynamoClient()
  await client.send(
    new PutCommand({ TableName: TABLES.CONTACTS, Item: submission })
  )
}

export async function getContactsBySite(
  siteId: string
): Promise<ContactSubmission[]> {
  const client = getDynamoClient()
  const result = await client.send(
    new QueryCommand({
      TableName: TABLES.CONTACTS,
      IndexName: 'siteId-index',
      KeyConditionExpression: 'siteId = :sid',
      ExpressionAttributeValues: { ':sid': siteId },
      ScanIndexForward: false,
    })
  )
  return (result.Items as ContactSubmission[]) || []
}
