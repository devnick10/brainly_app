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
            <div className="h-16 w-16 rounded-md bg-muted" />
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
          <div className="w-75 animate-pulse rounded-lg border border-border bg-card p-4">
            <div className="mb-3 h-40 w-full rounded-md bg-muted" />
            <div className="space-y-2">
              <div className="h-5 w-3/4 rounded bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-2/3 rounded bg-muted" />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex gap-2">
                <div className="h-6 w-16 rounded-full bg-muted" />
                <div className="h-6 w-16 rounded-full bg-muted" />
              </div>
              <div className="h-8 w-8 rounded-full bg-muted" />
            </div>
          </div>
        );
    }
  };

  return (
    <div className={cn('flex flex-wrap gap-4', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </div>
  );
}
