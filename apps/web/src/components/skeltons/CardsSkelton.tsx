import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  variant?: 'card' | 'list' | 'grid';
  count?: number;
  className?: string;
}

export function CardsSkeletonLoader({
  variant = 'card',
  count = 6,
  className,
}: SkeletonLoaderProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case 'list':
        return (
          <div className="flex items-center gap-4 border-b border-border py-4">
            <div className="h-12 w-12 shrink-0 rounded-md bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-muted" />
              <div className="h-3 w-1/2 rounded bg-muted" />
            </div>
            <div className="h-8 w-20 rounded bg-muted" />
          </div>
        );

      case 'grid':
        return (
          <div className="aspect-square w-full rounded-lg border border-border bg-card p-4">
            <div className="mb-3 h-3/4 w-full rounded-md bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-3/4 rounded bg-muted" />
              <div className="h-3 w-1/2 rounded bg-muted" />
            </div>
          </div>
        );

      case 'card':
      default:
        return (
          <div className="animate-pulse rounded-xl border border-border bg-card">
            <div className="p-4 pb-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="h-4 w-4 shrink-0 rounded bg-muted" />
                  <div className="h-4 w-3/4 rounded bg-muted" />
                </div>
                <div className="flex gap-1 shrink-0">
                  <div className="h-7 w-7 rounded bg-muted" />
                  <div className="h-7 w-7 rounded bg-muted" />
                </div>
              </div>
            </div>
            <div className="px-4 pb-2">
              <div className="aspect-video w-full rounded-md bg-muted" />
            </div>
            <div className="px-4 pb-2">
              <div className="flex gap-1">
                <div className="h-4 w-12 rounded-full bg-muted" />
                <div className="h-4 w-16 rounded-full bg-muted" />
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-border px-4 py-3">
              <div className="h-3 w-2/3 rounded bg-muted" />
              <div className="h-4 w-[52px] rounded-full bg-muted" />
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className,
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </div>
  );
}
