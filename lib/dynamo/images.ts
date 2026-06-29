import { PutCommand, QueryCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb'
import { getDynamoClient, TABLES } from './client'
import type { ImageRecord } from '@/lib/types'

export async function saveImage(image: ImageRecord): Promise<void> {
  const client = getDynamoClient()
  await client.send(new PutCommand({ TableName: TABLES.IMAGES, Item: image }))
}

export async function getImagesBySite(siteId: string): Promise<ImageRecord[]> {
  const client = getDynamoClient()
  const result = await client.send(
    new QueryCommand({
      TableName: TABLES.IMAGES,
      IndexName: 'siteId-index',
      KeyConditionExpression: 'siteId = :sid',
      ExpressionAttributeValues: { ':sid': siteId },
    })
  )
  return (result.Items as ImageRecord[]) || []
}

export async function deleteImage(id: string): Promise<void> {
  const client = getDynamoClient()
  await client.send(new DeleteCommand({ TableName: TABLES.IMAGES, Key: { id } }))
}
