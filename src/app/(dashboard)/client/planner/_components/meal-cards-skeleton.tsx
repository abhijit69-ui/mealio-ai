import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MealCardSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden">
      {/* Mirrors CardHeader: icon + label | dots menu */}
      <CardHeader className="flex flex-row items-center justify-between p-3 pb-0 sm:p-4 sm:pb-0">
        <div className="flex items-center gap-2">
          <Skeleton className="size-5 rounded-full" />
          <Skeleton className="h-4 w-20 rounded-md" />
        </div>
        <Skeleton className="size-8 rounded-md" />
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
        {/* Mirrors the food image placeholder */}
        <Skeleton className="h-36 w-full rounded-lg sm:h-40" />

        {/* Mirrors food name + description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4 rounded-md" />
          <Skeleton className="h-3 w-full rounded-md" />
        </div>

        {/* Mirrors nutrition row — 4 inline pills */}
        <div className="mt-auto grid grid-cols-2 gap-x-2 gap-y-1 sm:flex sm:flex-wrap sm:gap-3">
          <Skeleton className="h-4 w-16 rounded-md" />
          <Skeleton className="h-4 w-12 rounded-md" />
          <Skeleton className="h-4 w-12 rounded-md" />
          <Skeleton className="h-4 w-12 rounded-md" />
        </div>

        {/* Mirrors View Details button */}
        <Skeleton className="h-8 w-full rounded-md" />
      </CardContent>
    </Card>
  );
}
