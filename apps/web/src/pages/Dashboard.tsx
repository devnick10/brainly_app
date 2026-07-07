import { DashbaordHeader } from '@/components/DashbaordHeader';
import { SearchBar } from '@/components/SearchBar';
import { CardsSkeletonLoader } from '@/components/skeltons/CardsSkelton';
import { useQuery } from '@tanstack/react-query';
import { Inbox, Plus, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getContent } from '../api/getContent';
import { searchContent } from '../api/searchContent';
import { ContentCard } from '../components/ContentCard';
import { CreateContentModel } from '../components/CreateContentModel';
import { SideBar } from '../components/SideBar';
import { Button } from '../components/ui/button';
import type { ContentType } from '../lib/types';

export default function Dashboard() {
  const [modelOpen, setModelOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | ContentType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const isSearching = debouncedSearch.length >= 2;

  const { data, isLoading, error } = useQuery({
    queryKey: isSearching ? ['search', debouncedSearch] : ['content'],
    queryFn: isSearching ? () => searchContent(debouncedSearch) : getContent,
    placeholderData: (prev) => prev,
  });

  const filteredData = useMemo(() => {
    const items = data?.content || [];
    if (activeFilter !== 'all') {
      return items.filter((item) => item.type === activeFilter);
    }
    return items;
  }, [data, activeFilter]);

  const showLoading = isLoading && !data;
  const showEmpty = !showLoading && !error && filteredData.length === 0;

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="hidden w-64 border-r bg-card lg:block">
        <SideBar
          tweet={() => setActiveFilter('TWITTER')}
          youtube={() => setActiveFilter('YOUTUBE')}
          all={() => setActiveFilter('all')}
          activeFilter={activeFilter}
        />
      </aside>
      <main className="flex flex-1 flex-col overflow-hidden">
        <DashbaordHeader
          setActiveFilter={setActiveFilter}
          activeFilter={activeFilter}
          setModelOpen={setModelOpen}
        />
        <div className="flex-1 overflow-y-auto">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <CreateContentModel
            open={modelOpen}
            onClose={() => setModelOpen(false)}
          />
          {showLoading && (
            <div className="p-6">
              <CardsSkeletonLoader />
            </div>
          )}
          {error && (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <p className="text-destructive font-medium">
                  Failed to load content
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Please try again later
                </p>
              </div>
            </div>
          )}
          {showEmpty && (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                {isSearching ? (
                  <>
                    <Search className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      No results for "
                      <span className="font-medium">{debouncedSearch}</span>"
                    </p>
                  </>
                ) : (
                  <>
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <Inbox className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">No content yet</p>
                    <p className="mt-1 text-sm text-muted-foreground/60">
                      Save your first YouTube video, tweet, or article
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setModelOpen(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add your first content
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
          {!showLoading && !error && filteredData.length > 0 && (
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
