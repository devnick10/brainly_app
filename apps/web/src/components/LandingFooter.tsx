import { Brain, Github, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

const footerLinks = [
  {
    heading: 'Product',
    items: ['Features', 'Pricing', 'Demo', 'Changelog'],
  },
  {
    heading: 'Resources',
    items: ['Documentation', 'API Reference', 'Blog', 'Status'],
  },
  {
    heading: 'Support',
    items: ['Help Center', 'Contact', 'Privacy', 'Terms'],
  },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-border/50 bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Brain className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-tight">Brainly</span>
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground leading-relaxed">
              AI-powered content bookmarking platform using semantic search with
              vector embeddings. Built on Cloudflare&apos;s edge platform.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full"
                asChild
              >
                <a href="#" aria-label="GitHub">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full"
                asChild
              >
                <a href="#" aria-label="Twitter">
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.heading}>
              <h3 className="mb-4 text-sm font-semibold tracking-wide uppercase text-muted-foreground/70">
                {group.heading}
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {group.items.map((item) => (
                  <li key={item}>
                    <Link
                      to="#"
                      className="transition-colors hover:text-foreground"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-muted-foreground sm:flex-row sm:text-left">
          <p>
            &copy; {new Date().getFullYear()} Brainly App. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            Built with <Brain className="h-3.5 w-3.5 text-primary" /> on
            Cloudflare
          </p>
        </div>
      </div>
    </footer>
  );
}
