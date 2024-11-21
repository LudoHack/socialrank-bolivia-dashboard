import React from 'react';
import { News } from '@/types/news';
import { NewsCard } from './news-card';
import { Button } from '../ui/button';
import { Grid, List, LayoutGrid } from 'lucide-react';

interface NewsGridProps {
  news: News[];
  view?: 'grid' | 'list';
  onViewChange?: (view: 'grid' | 'list') => void;
  onView?: (news: News) => void;
  onEdit?: (news: News) => void;
  onDelete?: (news: News) => void;
  onShare?: (news: News) => void;
}

export function NewsGrid({
  news,
  view = 'grid',
  onViewChange,
  onView,
  onEdit,
  onDelete,
  onShare,
}: NewsGridProps) {
  return (
    <div className="space-y-4">
      {onViewChange && (
        <div className="flex justify-end space-x-2">
          <Button
            variant={view === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('grid')}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="sr-only">Vista Cuadrícula</span>
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('list')}
          >
            <List className="h-4 w-4" />
            <span className="sr-only">Vista Lista</span>
          </Button>
        </div>
      )}

      <div
        className={
          view === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'space-y-4'
        }
      >
        {news.map((item) => (
          <NewsCard
            key={item.id}
            news={item}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            onShare={onShare}
          />
        ))}
      </div>

      {news.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No se encontraron noticias</p>
        </div>
      )}
    </div>
  );
}
