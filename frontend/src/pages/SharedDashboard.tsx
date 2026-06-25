import { useQuery } from "@tanstack/react-query"
import { useEffect, useState, useMemo } from "react"
import { useParams, Link } from "react-router-dom"
import { Brain, ArrowLeft, Search } from "lucide-react"
import { ContentCard } from "../components/Card"
import { SideBar } from "../components/SideBar"
import { sharedBrain } from "../api/sharedBrain"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import type { Content } from "../utils/types"

export function SharedDashboard() {
  const [contentData, setContentData] = useState<Content[]>([])
  const [activeFilter, setActiveFilter] = useState<"all" | "youtube" | "twitter">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const params = useParams()

  const { data, isLoading, error } = useQuery({
    queryKey: [`${params.hash}`],
    queryFn: sharedBrain,
  })

  useEffect(() => {
    if (data) {
      setContentData(data?.content || [])
    }
  }, [data])

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
          shared
          tweet={() => setActiveFilter("twitter")}
          youtube={() => setActiveFilter("youtube")}
          all={() => setActiveFilter("all")}
          activeFilter={activeFilter}
        />
      </aside>
      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="border-b bg-card px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <h1 className="text-xl font-semibold">Shared Brain</h1>
                </div>
                <p className="text-sm text-muted-foreground">
                  {filteredData.length} item{filteredData.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-9"
              />
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading && (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          )}
          {error && (
            <div className="flex h-full items-center justify-center">
              <p className="text-destructive">Error loading shared content</p>
            </div>
          )}
          {!isLoading && !error && filteredData.length === 0 && (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">
                {searchQuery ? "No results found" : "No shared content"}
              </p>
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
