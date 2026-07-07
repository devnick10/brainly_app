import { useQuery } from '@tanstack/react-query';
import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Menu, Brain, ArrowLeft } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { ContentCard } from '../components/ContentCard';
import { SideBar } from '../components/SideBar';
import { sharedBrain } from '../api/sharedBrain';
import { Button } from '../components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import type { Content } from '../lib/types';

export default function SharedDashboard() {
  const [contentData, setContentData] = useState<Content[]>([]);
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'YOUTUBE' | 'TWITTER'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');
  const params = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: [`${params.hash}`],
    queryFn: sharedBrain,
  });

  useEffect(() => {
    if (data) {
      setContentData(data?.content || []);
    }
  }, [data]);

  const filteredData = useMemo(() => {
    let items = contentData;
    if (activeFilter !== 'all') {
      items = items.filter((item) => item.type === activeFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.link.toLowerCase().includes(q),
      );
    }
    return items;
  }, [contentData, activeFilter, searchQuery]);

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="hidden w-64 border-r bg-card lg:block">
        <SideBar
          shared
          tweet={() => setActiveFilter('TWITTER')}
          youtube={() => setActiveFilter('YOUTUBE')}
          all={() => setActiveFilter('all')}
          activeFilter={activeFilter}
        />
      </aside>
      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="border-b bg-card px-4 py-3 sm:px-6">
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
                    shared
                    tweet={() => setActiveFilter('TWITTER')}
                    youtube={() => setActiveFilter('YOUTUBE')}
                    all={() => setActiveFilter('all')}
                    activeFilter={activeFilter}
                  />
                </SheetContent>
              </Sheet>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <h1 className="text-sm font-semibold sm:text-lg">
                    Shared Brain
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          {isLoading && (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          )}
          {error && (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <p className="text-destructive font-medium">
                  Failed to load shared content
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  The link may be invalid or expired
                </p>
              </div>
            </div>
          )}
          {!isLoading && !error && filteredData.length === 0 && (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">
                {searchQuery ? 'No results found' : 'No shared content'}
              </p>
            </div>
          )}
          {!isLoading && !error && filteredData.length > 0 && (
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredData.map((content) => (
                  <ContentCard key={content.id} {...content} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
