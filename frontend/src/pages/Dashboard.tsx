import { useEffect, useState, useMemo } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Plus, Share2, Search } from "lucide-react"
import { toast } from "sonner"
import { getContent } from "../api/getContent"
import { createLink } from "../api/createLink"
import { ContentCard } from "../components/Card"
import { CreateContentModel } from "../components/CreateContentModel"
import { SideBar } from "../components/SideBar"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import type { Content } from "../utils/types"

export function Dashboard() {
  const [modelOpen, setModelOpen] = useState(false)
  const [contentData, setContentData] = useState<Content[]>([])
  const [activeFilter, setActiveFilter] = useState<"all" | "youtube" | "twitter">("all")
  const [searchQuery, setSearchQuery] = useState("")

  const { data, isLoading, error } = useQuery({
    queryKey: ["content"],
    queryFn: getContent,
  })

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
      <aside className="hidden w-64 border-r bg-card sm:block">
        <SideBar
          tweet={() => setActiveFilter("twitter")}
          youtube={() => setActiveFilter("youtube")}
          all={() => setActiveFilter("all")}
          activeFilter={activeFilter}
        />
      </aside>
      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="border-b bg-card px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold">
                {activeFilter === "all"
                  ? "All Notes"
                  : activeFilter === "youtube"
                    ? "YouTube Videos"
                    : "Twitter Posts"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {filteredData.length} item{filteredData.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-9"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => shareMutate({ share: true })}
                disabled={isSharing}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button onClick={() => setModelOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
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
              {filteredData.map(({ type, title, link, id }) => (
                <ContentCard
                  key={id}
                  id={id}
                  type={type as "youtube" | "twitter"}
                  title={title}
                  link={link}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
