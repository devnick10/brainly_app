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
interface ContentCardProps extends Content {}

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

  return (
    <UICard className="w-80 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {props.type === 'TWITTER' && (
              <Twitter className="h-4 w-4 text-sky-500" />
            )}

            {props.type === 'YOUTUBE' && (
              <Youtube className="h-4 w-4 text-red-500" />
            )}

            {props.type === 'ARTICLE' && (
              <FileText className="h-4 w-4 text-blue-500" />
            )}

            {props.type === 'DOCUMENT' && (
              <File className="h-4 w-4 text-green-500" />
            )}

            <CardTitle className="text-sm font-medium truncate max-w-48">
              {props.title}
            </CardTitle>
          </div>

          <div className="flex items-center gap-1">
            <a href={props.link} target="_blank" rel="noreferrer">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => mutate(props.id)}
              disabled={isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {props.type === 'YOUTUBE' && (
          <div>
            <a
              href={props.link}
              target="_blank"
              rel="noreferrer"
              className="block"
            >
              <div className="relative">
                <img
                  src={getYoutubeThumbnail(props.link) ?? ''}
                  alt={props.title}
                  className="w-full aspect-video object-cover rounded-md"
                  loading="lazy"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-md">
                  <Play className="h-12 w-12 text-white fill-white" />
                </div>
              </div>
            </a>
          </div>
        )}

        {props.type === 'TWITTER' && (
          <div className="bg-muted rounded-md p-4 text-sm text-muted-foreground">
            {props.imageUrl && (
              <div className="relative">
                <img
                  src={props.imageUrl}
                  alt={props.title}
                  className="w-full aspect-video object-cover rounded-md"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        )}

        {props.type === 'ARTICLE' && (
          <div className="bg-muted rounded-md p-4 text-sm text-muted-foreground">
            {props.imageUrl && (
              <div className="relative">
                <img
                  src={props.imageUrl}
                  alt={props.title}
                  className="w-full aspect-video object-cover rounded-md"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        )}

        {props.type === 'DOCUMENT' && (
          <div className="bg-muted rounded-md p-4 text-sm text-muted-foreground">
            <p>Document content cannot be previewed.</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <a
          href={props.link}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-muted-foreground hover:text-primary truncate w-full"
        >
          {props.link}
        </a>
        <Badge className="rounded-sm"> {props.type}</Badge>
      </CardFooter>
    </UICard>
  );
};
