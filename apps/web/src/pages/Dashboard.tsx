import { DashbaordHeader } from '@/components/DashbaordHeader';
import { CardsSkeletonLoader } from '@/components/skeltons/CardsSkelton';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getContent } from '../api/getContent';
import { ContentCard } from '../components/ContentCard';
import { CreateContentModel } from '../components/CreateContentModel';
import { SideBar } from '../components/SideBar';
import { Button } from '../components/ui/button';
import type { Content, ContentType } from '../lib/types';

export default function Dashboard() {
  const [modelOpen, setModelOpen] = useState(false);
  const [contentData, setContentData] = useState<Content[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | ContentType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['content'],
    queryFn: getContent,
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
          {isLoading && <CardsSkeletonLoader />}
          {error && (
            <div className="flex h-full items-center justify-center">
              <p className="text-destructive">Error loading content</p>
            </div>
          )}
          {!isLoading && !error && filteredData.length === 0 && (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground">
                  {searchQuery ? 'No results found' : 'No content yet'}
                </p>
                {!searchQuery && (
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
          {!isLoading && !error && filteredData.length > 0 && (
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
