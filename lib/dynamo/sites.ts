import {
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb'
import { getDynamoClient, TABLES } from './client'
import type { BusinessData } from '@/lib/types'

export async function getSiteBySlug(slug: string): Promise<BusinessData | null> {
  const client = getDynamoClient()
  const result = await client.send(
    new ScanCommand({
      TableName: TABLES.SITES,
      FilterExpression: 'slug = :slug AND published = :pub',
      ExpressionAttributeValues: { ':slug': slug, ':pub': true },
      // TODO(db): Remove Limit:1 — DynamoDB applies Limit BEFORE FilterExpression, so this
      // returns null if the matching item isn't the first row scanned. Either drop the limit
      // or, better, add a GSI on `slug` and use QueryCommand instead of ScanCommand.
      Limit: 1,
    })
  )
  return (result.Items?.[0] as BusinessData) || null
}

export async function getSiteById(id: string): Promise<BusinessData | null> {
  const client = getDynamoClient()
  const result = await client.send(
    new GetCommand({ TableName: TABLES.SITES, Key: { id } })
  )
  return (result.Item as BusinessData) || null
}

export async function getSitesByUser(userId: string): Promise<BusinessData[]> {
  const client = getDynamoClient()
  const result = await client.send(
    new QueryCommand({
      TableName: TABLES.SITES,
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :uid',
      ExpressionAttributeValues: { ':uid': userId },
    })
  )
  return (result.Items as BusinessData[]) || []
}

export async function createSite(site: BusinessData): Promise<void> {
  const client = getDynamoClient()
  await client.send(new PutCommand({ TableName: TABLES.SITES, Item: site }))
}

export async function updateSite(
  id: string,
  updates: Partial<BusinessData>
): Promise<void> {
  const client = getDynamoClient()
  const keys = Object.keys(updates).filter((k) => k !== 'id')
  const expressions = keys.map((k, i) => `#k${i} = :v${i}`)
  const names: Record<string, string> = {}
  const values: Record<string, unknown> = {}
  keys.forEach((k, i) => {
    names[`#k${i}`] = k
    values[`:v${i}`] = updates[k as keyof BusinessData]
  })
  values[':updated'] = new Date().toISOString()

  await client.send(
    new UpdateCommand({
      TableName: TABLES.SITES,
      Key: { id },
      UpdateExpression: `SET ${expressions.join(', ')}, updatedAt = :updated`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
    })
  )
}

export async function deleteSite(id: string): Promise<void> {
  const client = getDynamoClient()
  await client.send(new DeleteCommand({ TableName: TABLES.SITES, Key: { id } }))
}

export async function checkSlugAvailable(slug: string): Promise<boolean> {
  const client = getDynamoClient()
  const result = await client.send(
    new ScanCommand({
      TableName: TABLES.SITES,
      FilterExpression: 'slug = :slug',
      ExpressionAttributeValues: { ':slug': slug },
      Select: 'COUNT',
    })
  )
  return (result.Count || 0) === 0
}
