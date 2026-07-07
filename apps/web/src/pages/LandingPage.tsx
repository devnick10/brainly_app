import {
  Brain,
  ArrowRight,
  Youtube,
  Twitter,
  FileText,
  Tags,
  Sparkles,
  Search,
  Zap,
  Shield,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { features, steps } from '../lib/constants';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { LandingHeader } from '../components/LandingHeader';
import { LandingFooter } from '../components/LandingFooter';

function GlowOrb({ className }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute -z-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl ${className ?? ''}`}
      aria-hidden
    />
  );
}

function DashboardMockup() {
  return (
    <div className="relative mx-auto w-full max-w-lg">
      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-2xl shadow-primary/10">
        <div className="flex items-center gap-1.5 border-b border-border/50 px-4 py-3">
          <div className="h-3 w-3 rounded-full bg-red-500/80" />
          <div className="h-3 w-3 rounded-full bg-amber-500/80" />
          <div className="h-3 w-3 rounded-full bg-green-500/80" />
          <div className="ml-4 flex-1 rounded-md bg-muted px-3 py-1.5 text-xs text-muted-foreground">
            brainly.app/dashboard
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground/60">
              Search your brain...
            </span>
            <div className="ml-auto flex gap-1">
              <kbd className="rounded border border-border/50 bg-background px-1.5 py-0.5 text-xs text-muted-foreground">
                ⌘
              </kbd>
              <kbd className="rounded border border-border/50 bg-background px-1.5 py-0.5 text-xs text-muted-foreground">
                K
              </kbd>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                icon: Youtube,
                color: 'text-red-500',
                bg: 'bg-red-500/10',
                title: 'How LLMs Work Under the Hood',
                subtitle: 'youtube.com/watch?v=...',
              },
              {
                icon: Twitter,
                color: 'text-sky-500',
                bg: 'bg-sky-500/10',
                title: 'AI Reasoning Breakthrough',
                subtitle: 'x.com/author/status/...',
              },
              {
                icon: FileText,
                color: 'text-amber-500',
                bg: 'bg-amber-500/10',
                title: 'Semantic Search with Vector Embeddings',
                subtitle: 'arxiv.org/paper/...',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex items-start gap-3 rounded-lg border border-border/30 bg-background p-3 transition-all hover:border-border/60"
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.bg} ${item.color}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">
                      {item.title}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {item.subtitle}
                    </div>
                  </div>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Brain className="h-3.5 w-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="absolute -bottom-4 -left-4 -right-4 -z-10 h-full rounded-2xl border border-primary/10 bg-primary/5" />
    </div>
  );
}

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[number];
  index: number;
}) {
  const Icon = feature.icon;
  return (
    <Card
      className="group relative overflow-hidden border-border/50 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="absolute inset-0 -z-10 translate-y-full bg-gradient-to-b from-primary/5 to-transparent transition-transform duration-500 group-hover:translate-y-0" />
      <CardContent className="p-6">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:ring-primary/40">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="mb-2 font-semibold">{feature.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {feature.description}
        </p>
      </CardContent>
    </Card>
  );
}

function StepCard({
  step: s,
  index,
}: {
  step: (typeof steps)[number];
  index: number;
}) {
  const isLast = index === steps.length - 1;

  return (
    <div className="relative flex flex-col items-center text-center">
      <div className="relative mb-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground shadow-lg shadow-primary/25">
          {s.step}
        </div>
        {!isLast && (
          <div className="absolute left-1/2 top-14 hidden h-8 w-0.5 bg-gradient-to-b from-primary/40 to-primary/5 lg:block" />
        )}
      </div>
      <h3 className="mb-2 font-semibold">{s.title}</h3>
      <p className="max-w-xs text-sm text-muted-foreground leading-relaxed">
        {s.description}
      </p>
    </div>
  );
}

export default function BrainlyLanding() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
          <GlowOrb className="-left-48 -top-48" />
          <GlowOrb className="-bottom-48 -right-48" />
          <div className="absolute inset-0 -z-20 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

          <div className="container mx-auto px-4">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <Badge
                  variant="secondary"
                  className="mb-6 gap-1.5 px-4 py-1.5 text-sm"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  AI-Powered Content Vault
                </Badge>

                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  Save, Search & Share
                  <span className="mt-2 block bg-gradient-to-r from-primary via-primary/80 to-purple-500 bg-clip-text text-transparent">
                    With AI-Powered Precision
                  </span>
                </h1>

                <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg leading-relaxed">
                  Brainly is an AI content bookmarking platform that saves,
                  organizes, and retrieves content from YouTube, X, articles,
                  and more — using semantic search powered by vector embeddings.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button
                    size="lg"
                    className="gap-2 text-base shadow-lg shadow-primary/25"
                    asChild
                  >
                    <Link to="/signup">
                      Start Building Your Brain
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 text-base"
                    asChild
                  >
                    <Link to="/signin">
                      <Search className="h-5 w-5" />
                      Explore Demo
                    </Link>
                  </Button>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-6 text-sm">
                  {[
                    { icon: CheckCircle2, text: 'No credit card' },
                    { icon: CheckCircle2, text: 'Free to start' },
                    { icon: CheckCircle2, text: 'Export anytime' },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <span
                        key={item.text}
                        className="flex items-center gap-1.5 text-muted-foreground"
                      >
                        <Icon className="h-4 w-4 text-primary" />
                        {item.text}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="relative">
                <DashboardMockup />
              </div>
            </div>

            <div className="mt-16 flex items-center justify-center gap-6 text-sm flex-wrap">
              <span className="text-xs font-medium tracking-wide text-muted-foreground/60 uppercase">
                Supported sources
              </span>
              <span className="flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1.5 text-red-500">
                <Youtube className="h-4 w-4" />
                YouTube
              </span>
              <span className="flex items-center gap-2 rounded-full bg-sky-500/10 px-3 py-1.5 text-sky-500">
                <Twitter className="h-4 w-4" />X (Twitter)
              </span>
              <span className="flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1.5 text-amber-500">
                <FileText className="h-4 w-4" />
                Articles
              </span>
              <span className="flex items-center gap-2 rounded-full bg-violet-500/10 px-3 py-1.5 text-violet-500">
                <Tags className="h-4 w-4" />
                Tags
              </span>
            </div>
          </div>
        </section>

        <section className="border-t border-border/50 bg-muted/30 py-20 sm:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <Badge variant="outline" className="mb-4">
                Features
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Powerful Features
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Everything you need to build and explore your personal knowledge
                base.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <FeatureCard key={feature.title} feature={feature} index={i} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border/50 py-20 sm:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <Badge variant="outline" className="mb-4">
                How It Works
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                From Link to Insight
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                From saving a link to finding it by meaning — in four simple
                steps.
              </p>
            </div>

            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s, i) => (
                <StepCard key={s.step} step={s} index={i} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border/50 bg-primary/5 py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 sm:grid-cols-3">
              {[
                { icon: Star, value: 'AI-Powered', label: 'Semantic Search' },
                {
                  icon: Zap,
                  value: 'Real-time',
                  label: 'Background Processing',
                },
                { icon: Shield, value: 'Secure', label: 'JWT Authentication' },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.value}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="text-lg font-semibold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-t border-border/50 bg-primary py-20 text-primary-foreground sm:py-28">
          <GlowOrb className="-left-48 -top-48 opacity-30" />
          <GlowOrb className="-bottom-48 -right-48 opacity-30" />
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Ready to Build Your Brain?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80 leading-relaxed">
              Start saving content intelligently with AI-powered organization
              and retrieval. Join today &mdash; it&apos;s free.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 text-base shadow-lg"
                asChild
              >
                <Link to="/signup">
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 text-base border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                asChild
              >
                <Link to="/signin">
                  <Search className="h-5 w-5" />
                  Explore Demo
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
