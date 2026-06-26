import { useEffect, useState, useMemo } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Menu, Plus, Share2, Search } from "lucide-react"
import { toast } from "sonner"
import { getContent } from "../api/getContent"
import { createLink } from "../api/createLink"
import { ContentCard } from "../components/ContentCard"
import { CreateContentModel } from "../components/CreateContentModel"
import { SideBar } from "../components/SideBar"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../components/ui/sheet"
import type { Content, ContentType } from "../lib/types"

export function Dashboard() {
  const [modelOpen, setModelOpen] = useState(false)
  const [contentData, setContentData] = useState<Content[]>([])
  const [activeFilter, setActiveFilter] = useState<"all" | ContentType>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const { data, isLoading, error } = useQuery({
    queryKey: ["content"],
    queryFn: getContent,
  })
  console.log(contentData)
  useEffect(() => {
    if (data) {
      setContentData(data?.content || [])
    }
  }, [data])

  const { mutate: shareMutate, isPending: isSharing } = useMutation({
    mutationFn: createLink,
    onSuccess: ({ hash }) => {
      const url = `${window.location.origin}/brain/${hash}`
      navigator.clipboard.writeText(url)
      toast.success("Share link copied to clipboard")
    },
    onError: () => {
      toast.error("Failed to create share link")
    },
  })

  const filteredData = useMemo(() => {
    let items = contentData
    if (activeFilter !== "all") {
      items = items.filter((item) => item.type === activeFilter)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.link.toLowerCase().includes(q)
      )
    }
    return items
  }, [contentData, activeFilter, searchQuery])

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="hidden w-64 border-r bg-card lg:block">
        <SideBar
          tweet={() => setActiveFilter("TWITTER")}
          youtube={() => setActiveFilter("YOUTUBE")}
          all={() => setActiveFilter("all")}
          activeFilter={activeFilter}
        />
      </aside>
      <main className="flex flex-1 flex-col overflow-hidden">
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
                    tweet={() => setActiveFilter("TWITTER")}
                    youtube={() => setActiveFilter("YOUTUBE")}
                    all={() => setActiveFilter("all")}
                    activeFilter={activeFilter}
                  />
                </SheetContent>
              </Sheet>
              <div>
                <h1 className="text-xs  text-wrap font-semibold sm:text-xl">
                  {activeFilter === "all"
                    ? "All Notes"
                    : activeFilter === "YOUTUBE"
                      ? "YouTube Videos"
                      : "Twitter Posts"}
                </h1>
                {/* <p className="text-sm text-muted-foreground">
                  {filteredData.length} item{filteredData.length !== 1 ? "s" : ""}
                </p> */}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
              <Button
                size="sm"
                onClick={() => setModelOpen(true)}>
                <Plus className="mr-2 size-1 sm:size-6" />
                Add Content
              </Button>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          <CreateContentModel
            open={modelOpen}
            onClose={() => setModelOpen(false)}
          />
          {isLoading && (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          )}
          {error && (
            <div className="flex h-full items-center justify-center">
              <p className="text-destructive">Error loading content</p>
            </div>
          )}
          {!isLoading && !error && filteredData.length === 0 && (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground">
                  {searchQuery
                    ? "No results found"
                    : "No content yet"}
                </p>
                {!searchQuery && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setModelOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add your first content
                  </Button>
                )}
              </div>
            </div>
          )}
          {!isLoading && !error && filteredData.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {filteredData.map((content) => (
                <ContentCard
                  key={content.id}
                  {...content}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
