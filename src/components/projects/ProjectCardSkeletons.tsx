import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface ProjectCardSkeletonsProps {
  count?: number
}

/**
 * Render a grid of skeleton cards for the Projects list while loading
 */
export const ProjectCardSkeletons: React.FC<ProjectCardSkeletonsProps> = ({
  count = 6,
}) => {
  const items = Array.from({ length: count })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((_, i) => (
        <Card key={`skeleton-${i}`} className="flex flex-col overflow-hidden shadow-card">
          <CardHeader className="pb-3 border-b border-border">
            <div className="flex items-start justify-between gap-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </CardHeader>

          <CardContent className="flex-grow flex flex-col gap-4 pt-4">
            {/* Descripción */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            {/* Manager */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>

            {/* Fechas */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-40" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mt-auto pt-2 border-t border-border">
              <div className="p-2 rounded border border-border bg-muted/20 text-center">
                <Skeleton className="h-3.5 w-3.5 mx-auto mb-1" />
                <Skeleton className="h-6 w-8 mx-auto mb-1" />
                <Skeleton className="h-3 w-16 mx-auto" />
              </div>
              <div className="p-2 rounded border border-border bg-muted/20 text-center">
                <Skeleton className="h-3.5 w-3.5 mx-auto mb-1" />
                <Skeleton className="h-6 w-8 mx-auto mb-1" />
                <Skeleton className="h-3 w-16 mx-auto" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default ProjectCardSkeletons
