import React, { useState, useEffect } from 'react';
import { News, NewsFilters } from '@/types/news';
import { NewsGrid } from '@/components/news/news-grid';
import { NewsFilters as NewsFiltersComponent } from '@/components/news/news-filters';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Simulación de datos - Reemplazar con llamadas a la API real
const mockNews: News[] = [
  {
    id: '1',
    title: 'Nuevo récord en el mercado de valores',
    description: 'El mercado alcanza nuevos máximos históricos...',
    url: 'https://example.com/news/1',
    source: {
      id: '1',
      name: 'Financial Times',
      url: 'https://ft.com',
      type: 'website',
    },
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    impactLevel: 'high',
    tags: [
      { id: '1', name: 'Mercado de Valores', color: '#FF0000' },
      { id: '2', name: 'Economía', color: '#00FF00' },
    ],
    status: 'published',
  },
  // Agregar más noticias de ejemplo aquí
];

const mockSources = [
  { id: '1', name: 'Financial Times' },
  { id: '2', name: 'Bloomberg' },
  { id: '3', name: 'Reuters' },
  { id: '4', name: 'CNBC' },
];

const mockTags = [
  { id: '1', name: 'Mercado de Valores', color: '#FF0000' },
  { id: '2', name: 'Economía', color: '#00FF00' },
  { id: '3', name: 'Tecnología', color: '#0000FF' },
  { id: '4', name: 'Finanzas', color: '#FFFF00' },
];

export default function NewsPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<NewsFilters>({});
  const [filteredNews, setFilteredNews] = useState<News[]>(mockNews);
  const { toast } = useToast();

  useEffect(() => {
    // Aplicar filtros
    let result = [...mockNews];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (news) =>
          news.title.toLowerCase().includes(searchLower) ||
          news.description.toLowerCase().includes(searchLower)
      );
    }

    if (filters.impactLevel?.length) {
      result = result.filter((news) =>
        filters.impactLevel?.includes(news.impactLevel)
      );
    }

    if (filters.sources?.length) {
      result = result.filter((news) =>
        filters.sources?.includes(news.source.id)
      );
    }

    if (filters.tags?.length) {
      result = result.filter((news) =>
        news.tags.some((tag) => filters.tags?.includes(tag.id))
      );
    }

    if (filters.dateRange) {
      const start = new Date(filters.dateRange.start);
      const end = new Date(filters.dateRange.end);
      result = result.filter((news) => {
        const publishedAt = new Date(news.publishedAt);
        return publishedAt >= start && publishedAt <= end;
      });
    }

    if (filters.status?.length) {
      result = result.filter((news) => filters.status?.includes(news.status));
    }

    if (filters.sentiment?.length) {
      result = result.filter(
        (news) => news.sentiment && filters.sentiment?.includes(news.sentiment)
      );
    }

    setFilteredNews(result);
  }, [filters]);

  const handleCreateNews = () => {
    // Implementar la creación de noticias
    console.log('Crear nueva noticia');
  };

  const handleViewNews = (news: News) => {
    // Implementar la vista detallada de noticias
    console.log('Ver noticia', news);
  };

  const handleEditNews = (news: News) => {
    // Implementar la edición de noticias
    console.log('Editar noticia', news);
  };

  const handleDeleteNews = (news: News) => {
    // Implementar la eliminación de noticias
    console.log('Eliminar noticia', news);
    toast({
      title: 'Noticia eliminada',
      description: `La noticia "${news.title}" ha sido eliminada.`,
    });
  };

  const handleShareNews = async (news: News) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: news.title,
          text: news.description,
          url: news.url,
        });
      } else {
        // Fallback para navegadores que no soportan Web Share API
        await navigator.clipboard.writeText(news.url);
        toast({
          title: 'Enlace copiado',
          description: 'El enlace ha sido copiado al portapapeles.',
        });
      }
    } catch (error) {
      console.error('Error al compartir:', error);
      toast({
        title: 'Error al compartir',
        description: 'No se pudo compartir la noticia.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Noticias</h1>
        <Button onClick={handleCreateNews}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Noticia
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <NewsFiltersComponent
            filters={filters}
            onFiltersChange={setFilters}
            availableSources={mockSources}
            availableTags={mockTags}
          />
        </div>

        <div className="md:col-span-3">
          <NewsGrid
            news={filteredNews}
            view={view}
            onViewChange={setView}
            onView={handleViewNews}
            onEdit={handleEditNews}
            onDelete={handleDeleteNews}
            onShare={handleShareNews}
          />
        </div>
      </div>
    </div>
  );
}
