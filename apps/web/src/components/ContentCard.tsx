import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ExternalLink,
  Trash2,
  Youtube,
  Twitter,
  FileText,
  File,
  Play,
} from 'lucide-react';
import { toast } from 'sonner';
import { deleteContent } from '../api/deleteContent';
import { Button } from './ui/button';
import {
  Card as UICard,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import type { Content } from '@/lib/types';
import { getYoutubeThumbnail } from '@/lib/getYoutubeThumbnail';
import { Badge } from '@/components/ui/badge';

type ContentCardProps = Content;

export const ContentCard: React.FC<ContentCardProps> = (
  props: ContentCardProps,
) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteContent,
    onSuccess: () => {
      toast.success('Content deleted');
      queryClient.invalidateQueries({ queryKey: ['content'] });
    },
    onError: () => {
      toast.error('Failed to delete content');
    },
  });

  const typeIcon = {
    TWITTER: <Twitter className="h-4 w-4 text-sky-500" />,
    YOUTUBE: <Youtube className="h-4 w-4 text-red-500" />,
    ARTICLE: <FileText className="h-4 w-4 text-blue-500" />,
    DOCUMENT: <File className="h-4 w-4 text-green-500" />,
  } as const;

  return (
    <UICard className="group flex flex-col overflow-hidden transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {typeIcon[props.type]}
            <CardTitle className="text-sm font-medium truncate">
              {props.title}
            </CardTitle>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <a href={props.link} target="_blank" rel="noreferrer">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-muted-foreground hover:text-foreground"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-muted-foreground hover:text-destructive"
              onClick={() => mutate(props.id)}
              disabled={isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        {props.type === 'YOUTUBE' && (
          <div>
            <a
              href={props.link}
              target="_blank"
              rel="noreferrer"
              className="block"
            >
              <div className="relative overflow-hidden rounded-md">
                <img
                  src={getYoutubeThumbnail(props.link) ?? ''}
                  alt={props.title}
                  className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-200 group-hover:bg-black/30">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 transition-transform duration-200 group-hover:scale-110">
                    <Play className="h-5 w-5 text-black fill-black ml-0.5" />
                  </div>
                </div>
              </div>
            </a>
          </div>
        )}

        {(props.type === 'TWITTER' || props.type === 'ARTICLE') && (
          <div>
            {props.imageUrl ? (
              <div className="relative overflow-hidden rounded-md">
                <img
                  src={props.imageUrl}
                  alt={props.title}
                  className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-md bg-muted aspect-video">
                <span className="text-xs text-muted-foreground">
                  No preview available
                </span>
              </div>
            )}
          </div>
        )}

        {props.type === 'DOCUMENT' && (
          <div className="flex items-center justify-center rounded-md bg-muted aspect-video">
            <div className="text-center">
              <File className="mx-auto h-8 w-8 text-muted-foreground/50" />
              <p className="mt-1 text-xs text-muted-foreground">
                No preview available
              </p>
            </div>
          </div>
        )}
      </CardContent>

      {props.tags.length > 0 && (
        <div className="px-6 pb-2">
          <div className="flex flex-wrap gap-1">
            {props.tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                {tag.title}
              </span>
            ))}
          </div>
        </div>
      )}

      <CardFooter className="pt-0 mt-auto">
        <div className="flex w-full items-center justify-between gap-2">
          <a
            href={props.link}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-muted-foreground/70 hover:text-primary truncate min-w-0"
          >
            {props.link}
          </a>
          <Badge
            variant="secondary"
            className="shrink-0 rounded-full text-[10px] font-medium uppercase tracking-wider"
          >
            {props.type}
          </Badge>
        </div>
      </CardFooter>
    </UICard>
  );
};
