import { DashbaordHeader } from '@/components/DashbaordHeader';
import { CardsSkeletonLoader } from '@/components/skeltons/CardsSkelton';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
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
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
          setModelOpen={setModelOpen}
        />
        <div className="flex-1 overflow-y-auto p-6">
          <CreateContentModel
            open={modelOpen}
            onClose={() => setModelOpen(false)}
          />
          {showLoading && <CardsSkeletonLoader />}
          {error && (
            <div className="flex h-full items-center justify-center">
              <p className="text-destructive">Error loading content</p>
            </div>
          )}
          {showEmpty && (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                {isSearching && (
                  <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                )}
                <p className="text-muted-foreground">
                  {isSearching
                    ? `No results for "${debouncedSearch}"`
                    : 'No content yet'}
                </p>
                {!isSearching && (
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
          {!showLoading && !error && filteredData.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {filteredData.map((content) => (
                <ContentCard key={content.id} {...content} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
