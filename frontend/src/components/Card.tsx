import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ExternalLink, Trash2, Youtube, Twitter } from "lucide-react"
import { toast } from "sonner"
import { deleteContent } from "../api/deleteContent"
import { Button } from "./ui/button"
import {
  Card as UICard,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"

interface CardProps {
  type: "twitter" | "youtube"
  title: string
  link: string
  id: string
}

export function ContentCard({ type, title, link, id }: CardProps) {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: deleteContent,
    onSuccess: () => {
      toast.success("Content deleted")
      queryClient.invalidateQueries({ queryKey: ['content'] })
    },
    onError: () => {
      toast.error("Failed to delete content")
    }
  })

  return (
    <UICard className="w-80 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {type === "twitter" ? (
              <Twitter className="h-4 w-4 text-sky-500" />
            ) : (
              <Youtube className="h-4 w-4 text-red-500" />
            )}
            <CardTitle className="text-sm font-medium truncate max-w-48">
              {title}
            </CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <a href={link} target="_blank" rel="noreferrer">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => mutate(id)}
              disabled={isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        {type === "youtube" && (
          <iframe
            className="w-full aspect-video rounded-md"
            src={link.replace("watch", "embed").replace("?v=", "/")}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        )}
        {type === "twitter" && (
          <div className="bg-muted rounded-md p-4 text-sm text-muted-foreground">
            <blockquote className="twitter-tweet">
              <a href={link.replace("x.com", "twitter.com")}>View on Twitter</a>
            </blockquote>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-muted-foreground hover:text-primary truncate w-full"
        >
          {link}
        </a>
      </CardFooter>
    </UICard>
  )
}
