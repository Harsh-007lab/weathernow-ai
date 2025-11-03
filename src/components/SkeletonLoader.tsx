import { Skeleton } from "@/components/ui/skeleton";

export const WeatherCardSkeleton = () => (
  <div className="w-full max-w-2xl mx-auto animate-fade-in">
    <div className="glass-strong rounded-3xl p-4 sm:p-6 md:p-8 mb-6">
      <div className="text-center space-y-4">
        <Skeleton className="h-8 w-48 mx-auto bg-white/20" />
        <Skeleton className="h-6 w-32 mx-auto bg-white/20" />
        <Skeleton className="h-24 w-24 mx-auto rounded-full bg-white/20" />
        <Skeleton className="h-20 w-40 mx-auto bg-white/20" />
        <div className="flex justify-center gap-8">
          <Skeleton className="h-16 w-20 bg-white/20" />
          <Skeleton className="h-16 w-20 bg-white/20" />
        </div>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      <Skeleton className="h-32 rounded-2xl bg-white/20" />
      <Skeleton className="h-32 rounded-2xl bg-white/20" />
      <Skeleton className="h-32 col-span-2 rounded-2xl bg-white/20" />
    </div>
  </div>
);

export const ForecastCardSkeleton = () => (
  <div className="w-full max-w-4xl mx-auto animate-fade-in">
    <div className="glass-strong rounded-3xl p-6">
      <Skeleton className="h-8 w-48 mb-6 bg-white/20" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-xl bg-white/20" />
        ))}
      </div>
    </div>
  </div>
);

export const MetricsSkeleton = () => (
  <div className="w-full max-w-4xl mx-auto animate-fade-in">
    <div className="glass-strong rounded-3xl p-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl bg-white/20" />
        ))}
      </div>
    </div>
  </div>
);

export const InsightsSkeleton = () => (
  <div className="w-full max-w-4xl mx-auto animate-fade-in">
    <div className="glass-strong rounded-3xl p-6">
      <Skeleton className="h-8 w-48 mb-6 bg-white/20" />
      <div className="space-y-4">
        <Skeleton className="h-24 rounded-xl bg-white/20" />
        <Skeleton className="h-24 rounded-xl bg-white/20" />
        <Skeleton className="h-24 rounded-xl bg-white/20" />
      </div>
    </div>
  </div>
);
