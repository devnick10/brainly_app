import { createLink } from '@/api/createLink';
import type { ContentType } from '@/lib/types';
import { useMutation } from '@tanstack/react-query';
import { Menu, Plus, Share2 } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import { SideBar } from './SideBar';
import { Button } from './ui/button';

interface DashbaordHeaderProps {
  setActiveFilter: (t: ContentType | 'all') => void;
  activeFilter: ContentType | 'all';
  setModelOpen: (v: boolean) => void;
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
    <header className="border-b bg-card px-4 py-3 sm:px-6">
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
          <h1 className="text-sm font-semibold sm:text-lg">
            {props.activeFilter === 'all'
              ? 'All Notes'
              : props.activeFilter === 'YOUTUBE'
                ? 'YouTube Videos'
                : 'Twitter Posts'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="hidden sm:flex"
            onClick={() => shareMutate({ share: true })}
            disabled={isSharing}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button onClick={() => props.setModelOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Content
          </Button>
        </div>
      </div>
    </header>
  );
};
