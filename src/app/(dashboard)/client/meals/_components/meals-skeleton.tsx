import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Body only — used when header stays visible during date change
export function MealsSkeletonBody() {
  return (
    <div className="space-y-6">
      {/* Nutrition summary skeleton */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card>
          <CardContent className="space-y-3 p-4">
            <div className="flex items-center gap-2">
              <Skeleton className="size-5 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-8 w-32" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 p-4">
            <div className="flex items-center gap-2">
              <Skeleton className="size-5 rounded-full" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="mt-2 flex gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-5 w-10" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 p-4">
            <div className="flex items-center gap-2">
              <Skeleton className="size-5 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="mt-2 space-y-2">
              {[1, 2].map((i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-6" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 p-4">
            <div className="flex items-center gap-2">
              <Skeleton className="size-5 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="mt-2 flex gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-3 w-10" />
                  <Skeleton className="h-5 w-8" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Day label skeleton */}
      <Skeleton className="h-7 w-40" />

      {/* Meal cards skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
              <div className="flex items-center gap-2">
                <Skeleton className="size-5 rounded-full" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="size-8 rounded-lg" />
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-3 p-4 pt-0">
              {Array.from({ length: i }).map((_, j) => (
                <div key={j} className="bg-muted space-y-2 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="ml-2 h-3 w-14" />
                  </div>
                  <Skeleton className="h-3 w-24" />
                  <div className="flex gap-3">
                    <Skeleton className="h-3 w-10" />
                    <Skeleton className="h-3 w-10" />
                    <Skeleton className="h-3 w-10" />
                  </div>
                </div>
              ))}
              <div className="mt-auto border-t pt-3">
                <div className="flex flex-wrap gap-3">
                  {[1, 2, 3, 4].map((k) => (
                    <Skeleton key={k} className="h-4 w-16" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Full page version — used in page.tsx Suspense if needed later
export default function MealsSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>
      <MealsSkeletonBody />
    </div>
  );
}
