import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  Brain,
  Home,
  LogOut,
  Menu,
  Plus,
  Search,
  Share2,
  Twitter,
  Youtube,
} from 'lucide-react';
import { CardsSkeletonLoader } from './CardsSkelton';

export function DashboardSkeleton() {
  return (
    <div className="flex h-screen overflow-hidden animate-pulse">
      {/* Sidebar Skeleton - Desktop */}
      <aside className="hidden w-64 border-r bg-card lg:block">
        <div className="flex h-full flex-col gap-4 p-4">
          {/* Logo */}
          <div className="flex items-center gap-2 px-2">
            <Brain className="h-6 w-6 text-muted-foreground" />
            <span className="h-6 w-16 rounded bg-muted" />
          </div>
          <Separator />

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1">
            {[
              { icon: Home, label: 'All Notes' },
              { icon: Twitter, label: 'Twitter' },
              { icon: Youtube, label: 'YouTube' },
            ].map((item, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2',
                  index === 0 ? 'bg-accent' : 'bg-muted/50',
                )}
              >
                <item.icon className="h-4 w-4 text-muted-foreground" />
                <span className="h-4 w-20 rounded bg-muted-foreground/20" />
              </div>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="mt-auto">
            <div className="flex w-full items-center gap-3 rounded-lg border border-border px-3 py-2">
              <LogOut className="h-4 w-4 text-muted-foreground" />
              <span className="h-4 w-16 rounded bg-muted" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Header Skeleton */}
        <header className="border-b bg-card px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <div className="rounded-md border border-border p-2">
                  <Menu className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              {/* Title */}
              <div>
                <div className="h-6 w-24 rounded bg-muted sm:h-7 sm:w-32" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <div className="h-10 w-48 rounded-md border border-border bg-background pl-9 lg:w-64" />
              </div>

              {/* Share Button */}
              <div className="hidden h-10 w-20 rounded-md border border-border bg-background sm:flex sm:items-center sm:justify-center sm:gap-2">
                <Share2 className="h-4 w-4 text-muted-foreground" />
                <span className="h-3 w-12 rounded bg-muted" />
              </div>

              {/* Add Content Button */}
              <div className="flex h-10 w-28 items-center justify-center gap-2 rounded-md bg-primary/60">
                <Plus className="h-4 w-4 text-primary-foreground" />
                <span className="h-3 w-16 rounded bg-primary-foreground/60" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <CardsSkeletonLoader />
        </div>
      </main>
    </div>
  );
}
