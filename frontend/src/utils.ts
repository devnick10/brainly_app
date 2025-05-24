import { Share2, Shield, Copy, Eye, Plus, Globe } from "lucide-react"

const features = [
    {
        icon: Shield,
        title: "Secure Authentication",
        description: "Safe sign up and sign in with JWT-based authentication to protect your content.",
    },
    {
        icon: Plus,
        title: "Easy Content Saving",
        description: "Simply paste YouTube or Twitter links with custom titles and organize by type.",
    },
    {
        icon: Share2,
        title: "Smart Sharing",
        description: "Share your entire 'Brain' collection or individual pieces of content with unique links.",
    },
    {
        icon: Globe,
        title: "Public Access",
        description: "Generate shareable public pages that anyone can view without logging in.",
    },
    {
        icon: Copy,
        title: "One-Click Copy",
        description: "Instantly copy shareable links to your clipboard for easy distribution.",
    },
    {
        icon: Eye,
        title: "Dashboard View",
        description: "Clean, organized dashboard to view and manage all your saved content.",
    },
]

const techStack = [
    { name: "React", color: "bg-blue-100 text-blue-800" },
    { name: "Vite", color: "bg-purple-100 text-purple-800" },
    { name: "Tailwind CSS", color: "bg-cyan-100 text-cyan-800" },
    { name: "TanStack Query", color: "bg-orange-100 text-orange-800" },
    { name: "Express.js", color: "bg-green-100 text-green-800" },
    { name: "MongoDB", color: "bg-emerald-100 text-emerald-800" },
]

const steps = [
    {
        step: "01",
        title: "Sign Up",
        description: "Create your account or log in to get started with your personal content vault.",
    },
    {
        step: "02",
        title: "Add Content",
        description: "Paste YouTube or Twitter links, add custom titles, and organize by content type.",
    },
    {
        step: "03",
        title: "Organize",
        description: "View all your saved content in a clean dashboard for quick access anytime.",
    },
    {
        step: "04",
        title: "Share",
        description: "Generate unique public links to share your entire collection or individual items.",
    },
]

export {
    features,
    techStack,
    steps
}