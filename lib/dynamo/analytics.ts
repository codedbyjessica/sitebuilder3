import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { getDynamoClient, TABLES } from './client'

export type EventType = 'page_view' | 'contact_submit' | 'button_click'

export interface AnalyticsEvent {
  id: string
  siteId: string
  event: EventType
  meta?: string
  createdAt: string
}

export async function trackEvent(
  siteId: string,
  event: EventType,
  meta?: string
): Promise<void> {
  const client = getDynamoClient()
  const item: AnalyticsEvent = {
    id: crypto.randomUUID(),
    siteId,
    event,
    meta,
    createdAt: new Date().toISOString(),
  }
  await client.send(new PutCommand({ TableName: TABLES.ANALYTICS, Item: item }))
}

export async function getAnalyticsBySite(
  siteId: string
): Promise<AnalyticsEvent[]> {
  const client = getDynamoClient()
  const result = await client.send(
    new QueryCommand({
      TableName: TABLES.ANALYTICS,
      IndexName: 'siteId-index',
      KeyConditionExpression: 'siteId = :sid',
      ExpressionAttributeValues: { ':sid': siteId },
      ScanIndexForward: false,
      Limit: 500,
    })
  )
  return (result.Items as AnalyticsEvent[]) || []
}
