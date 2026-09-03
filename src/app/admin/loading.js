import { Skeleton } from "@/components/ui/skeleton";

// Admin loading skeleton — fills the content area while a section streams in
export default function AdminLoading() {
  return (
    <div dir="rtl" className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-9 w-40 rounded-2xl" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-28 rounded-2xl" />
          <Skeleton className="h-9 w-28 rounded-2xl" />
        </div>
      </div>

      <div className="rounded-2xl border border-border/50 overflow-hidden">
        <div className="flex items-center gap-4 p-4 border-b border-border/50">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        {[1, 2, 3, 4, 5].map((row) => (
          <div key={row} className="flex items-center gap-4 p-4 border-b border-border/50 last:border-b-0">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="flex flex-col gap-1.5 flex-1">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-2xl" />
          </div>
        ))}
      </div>
    </div>
  );
}