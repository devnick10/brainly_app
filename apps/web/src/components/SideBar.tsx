import { useNavigate } from "react-router-dom"
import { Brain, Home, Twitter, Youtube, LogOut } from "lucide-react"
import { cn } from "../lib/utils"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"
import type { ContentType } from "@/lib/types"

interface SideBarProps {
  shared?: boolean
  tweet: () => void
  youtube: () => void
  all: () => void
  activeFilter: "all" | ContentType
  onNav?: () => void
}

export function SideBar({ shared, tweet, youtube, all, activeFilter, onNav }: SideBarProps) {
  const navigate = useNavigate()

  const items = [
    { label: "All Notes", icon: Home, onClick: () => { all(); onNav?.(); }, value: "all" as const },
    { label: "Twitter", icon: Twitter, onClick: () => { tweet(); onNav?.(); }, value: "TWITTER" as const },
    { label: "YouTube", icon: Youtube, onClick: () => { youtube(); onNav?.(); }, value: "YOUTUBE" as const },
  ]

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex items-center gap-2 px-2">
        <Brain className="h-6 w-6 text-primary" />
        <span className="font-semibold text-lg">Brainly</span>
      </div>
      <Separator />
      <nav className="flex flex-col gap-1">
        {items.map((item) => (
          <button
            key={item.value}
            onClick={item.onClick}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              activeFilter === item.value
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="mt-auto">
        {!shared && (
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={() => {
              localStorage.removeItem("token")
              navigate("/")
            }}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        )}
      </div>
    </div>
  )
}
