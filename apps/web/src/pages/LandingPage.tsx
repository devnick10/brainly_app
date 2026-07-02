import {
  Brain,
  ArrowRight,
  Youtube,
  Twitter,
  FileText,
  Tags,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { features, steps } from '../lib/constants';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

export default function BrainlyLanding() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Brainly</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 text-center">
          <div className="mx-auto mb-6 flex items-center justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-4 py-1.5 text-sm text-muted-foreground">
              <Brain className="h-3.5 w-3.5" />
              AI-Powered Content Vault
            </span>
          </div>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            Save, Search & Share
            <span className="block text-primary">
              With AI-Powered Precision
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Brainly is an AI content bookmarking platform that saves, organizes,
            and retrieves content from YouTube, X, articles, and more — using
            semantic search powered by vector embeddings.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link to="/signup">
                Start Building Your Brain
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          <div className="mt-12 flex items-center justify-center gap-6 text-muted-foreground flex-wrap">
            <span className="flex items-center gap-2">
              <Youtube className="h-5 w-5 text-red-500" />
              YouTube
            </span>
            <span className="flex items-center gap-2">
              <Twitter className="h-5 w-5 text-sky-500" />X (Twitter)
            </span>
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-amber-500" />
              Articles
            </span>
            <span className="flex items-center gap-2">
              <Tags className="h-5 w-5 text-violet-500" />
              Tags
            </span>
          </div>
        </section>

        <section className="border-t bg-muted/30 py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Powerful Features
              </h2>
              <p className="mt-4 text-muted-foreground">
                Everything you need to build and explore your personal knowledge
                base.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title}>
                    <CardContent className="p-6">
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mb-2 font-semibold">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-t py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 text-muted-foreground">
                From saving a link to finding it by meaning — in four simple
                steps.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step) => (
                <div key={step.step} className="text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    {step.step}
                  </div>
                  <h3 className="mb-2 font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t bg-primary py-20 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Build Your Brain?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
              Start saving content intelligently with AI-powered organization
              and retrieval.
            </p>
            <div className="mt-8">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">Brainly</span>
              </div>
              <p className="max-w-md text-sm text-muted-foreground">
                AI-powered content bookmarking platform using semantic search
                with vector embeddings. Built on Cloudflare's edge platform.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Features</li>
                <li>Pricing</li>
                <li>Demo</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Documentation</li>
                <li>Contact</li>
                <li>Help Center</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Brainly App.
          </div>
        </div>
      </footer>
    </div>
  );
}
