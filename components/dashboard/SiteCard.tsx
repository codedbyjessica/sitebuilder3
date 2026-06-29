import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import type { BusinessData } from '@/lib/types'
import { TEMPLATES } from '@/lib/types'

interface SiteCardProps {
  site: BusinessData
  onDelete?: (id: string) => void
}

export default function SiteCard({ site, onDelete }: SiteCardProps) {
  const template = TEMPLATES.find((t) => t.id === site.template)

  return (
    <Card className="hover:shadow-md transition-shadow">
      {/* Color bar */}
      <div
        className="h-1.5 rounded-full mb-4 -mt-2"
        style={{ backgroundColor: template?.accentColor ?? '#6366f1' }}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate">{site.businessName}</h3>
            <Badge variant={site.published ? 'success' : 'default'}>
              {site.published ? 'Live' : 'Draft'}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 truncate">{site.category}</p>
          <p className="text-xs text-gray-400 mt-1">
            {template?.name} template &middot; /{site.slug}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <Link href={`/app/edit/${site.id}`} className="flex-1">
          <Button variant="secondary" size="sm" className="w-full">
            Edit
          </Button>
        </Link>
        {site.published && (
          <Link href={`/site/${site.slug}`} target="_blank" className="flex-1">
            <Button size="sm" className="w-full">
              View site
            </Button>
          </Link>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(site.id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            ✕
          </Button>
        )}
      </div>
    </Card>
  )
}
