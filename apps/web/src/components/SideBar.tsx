import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Brain, Home, Twitter, Youtube, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ACCESS_TOKEN_KEY } from '@/lib/constants';
import { logoutUser } from '@/api/logoutUser';
import type { ContentType } from '@/lib/types';

interface SideBarProps {
  shared?: boolean;
  tweet: () => void;
  youtube: () => void;
  all: () => void;
  activeFilter: 'all' | ContentType;
  onNav?: () => void;
}

export function SideBar({
  shared,
  tweet,
  youtube,
  all,
  activeFilter,
  onNav,
}: SideBarProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: logoutUser,
    onSettled: () => {
      queryClient.clear();
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      navigate('/signin');
    },
  });

  const items = [
    {
      label: 'All Notes',
      icon: Home,
      onClick: () => {
        all();
        onNav?.();
      },
      value: 'all' as const,
    },
    {
      label: 'Twitter',
      icon: Twitter,
      onClick: () => {
        tweet();
        onNav?.();
      },
      value: 'TWITTER' as const,
    },
    {
      label: 'YouTube',
      icon: Youtube,
      onClick: () => {
        youtube();
        onNav?.();
      },
      value: 'YOUTUBE' as const,
    },
  ];

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex items-center gap-3 px-1">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Brain className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-semibold text-lg">Brainly</span>
      </div>
      <Separator />
      <nav className="flex flex-col gap-1">
        {items.map((item) => (
          <button
            key={item.value}
            onClick={item.onClick}
            className={cn(
              'relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground',
              activeFilter === item.value
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground',
            )}
          >
            {activeFilter === item.value && (
              <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
            )}
            <item.icon
              className={cn(
                'h-4 w-4 transition-transform duration-200',
                activeFilter === item.value && 'scale-110',
              )}
            />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="mt-auto">
        {!shared && (
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={() => logout()}
            disabled={isLoggingOut}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        )}
      </div>
    </div>
  );
}
