import { createLink } from '@/api/createLink';
import type { ContentType } from '@/lib/types';
import { useMutation } from '@tanstack/react-query';
import { Menu, Plus, Search, Share2 } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { Input } from '../components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import { SideBar } from './SideBar';
import { Button } from './ui/button';

interface DashbaordHeaderProps {
  setActiveFilter: (t: ContentType | 'all') => void;
  activeFilter: ContentType | 'all';
  setModelOpen: (v: boolean) => void;
  setSearchQuery: (s: string) => void;
  searchQuery: string;
}

export const DashbaordHeader: React.FC<DashbaordHeaderProps> = (props) => {
  const { mutate: shareMutate, isPending: isSharing } = useMutation({
    mutationFn: createLink,
    onSuccess: ({ hash }) => {
      const url = `${window.location.origin}/brain/${hash}`;
      navigator.clipboard.writeText(url);
      toast.success('Share link copied to clipboard');
    },
    onError: () => {
      toast.error('Failed to create share link');
    },
  });

  return (
    <header className="border-b bg-card px-4 py-3 sm:px-6 sm:py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SideBar
                tweet={() => props.setActiveFilter('TWITTER')}
                youtube={() => props.setActiveFilter('YOUTUBE')}
                all={() => props.setActiveFilter('all')}
                activeFilter={props.activeFilter}
              />
            </SheetContent>
          </Sheet>
          <div>
            <h1 className="text-xs  text-wrap font-semibold sm:text-xl">
              {props.activeFilter === 'all'
                ? 'All Notes'
                : props.activeFilter === 'YOUTUBE'
                  ? 'YouTube Videos'
                  : 'Twitter Posts'}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={props.searchQuery}
              onChange={(e) => props.setSearchQuery(e.target.value)}
              className="w-48 pl-9 lg:w-64"
            />
          </div>
          <Button
            variant="outline"
            className="hidden sm:flex"
            onClick={() => shareMutate({ share: true })}
            disabled={isSharing}
          >
            <Share2 className="mr-2 size-1 sm:size-6" />
            Share
          </Button>
          <Button size="sm" onClick={() => props.setModelOpen(true)}>
            <Plus className="mr-2 size-1 sm:size-6" />
            Add Content
          </Button>
        </div>
      </div>
    </header>
  );
};
