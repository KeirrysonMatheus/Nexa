import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const SkeletonCard = () => {
  return (
    <Card className="w-full overflow-hidden border-border/70 bg-card/80">
      <CardHeader className="flex flex-row items-center gap-3 p-4 pb-2">
        <Skeleton className="size-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-24" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-4 pt-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="aspect-video w-full rounded-xl" />
      </CardContent>
    </Card>
  )
}

export default SkeletonCard
