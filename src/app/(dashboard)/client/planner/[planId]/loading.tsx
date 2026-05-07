import MealCardSkeleton from "../_components/meal-cards-skeleton";

const MEAL_TYPES = ["BREAKFAST", "LUNCH", "DINNER"] as const;

export default function PlanDetailLoading() {
  return (
    <div className="space-y-4 p-3 sm:p-4 md:space-y-6 md:p-6">
      {/* Mirrors PlannerView header */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Back button placeholder */}
        <div className="bg-muted size-9 shrink-0 animate-pulse rounded-md" />
        <div className="space-y-1.5">
          <div className="bg-muted h-6 w-40 animate-pulse rounded-md sm:h-7" />
          <div className="bg-muted h-4 w-32 animate-pulse rounded-md" />
        </div>
      </div>

      {/* Mirrors day selector strip */}
      <div className="-mx-3 sm:-mx-4 md:-mx-6">
        <div className="flex gap-2 overflow-x-auto px-3 pb-2 sm:px-4 md:px-6">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="bg-muted flex shrink-0 animate-pulse flex-col items-center gap-1 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3"
            >
              <div className="bg-muted-foreground/20 h-3.5 w-7 rounded-sm" />
              <div className="bg-muted-foreground/20 h-3 w-10 rounded-sm" />
            </div>
          ))}
        </div>
      </div>

      {/* Mirrors day label */}
      <div className="bg-muted h-5 w-44 animate-pulse rounded-md sm:h-6" />

      {/* Mirrors the 3-column meal card grid */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
        {MEAL_TYPES.map((type) => (
          <MealCardSkeleton key={type} />
        ))}
      </div>
    </div>
  );
}
