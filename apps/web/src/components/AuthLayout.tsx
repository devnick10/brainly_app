import { Brain } from "lucide-react"
import { Link } from "react-router-dom"
import type { AuthLayoutProps } from "../lib/types"
import { Card, CardContent } from "./ui/card"

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Brainly</span>
          </Link>
          <h1 className="text-2xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
        <Card>
          <CardContent className="p-6">{children}</CardContent>
        </Card>
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
