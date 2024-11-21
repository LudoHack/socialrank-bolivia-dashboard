import React from 'react';
import { useRouter } from 'next/router';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { NewsComments } from '@/components/news/news-comments';
import { NewsHistory } from '@/components/news/news-history';
import { LinkPreview } from '@/components/ui/link-preview';
import { useToast } from '@/components/ui/use-toast';
import {
  ArrowLeft,
  Calendar,
  Download,
  Edit,
  ExternalLink,
  Eye,
  MessageSquare,
  Share2,
  Tag,
  Trash2,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { News } from '@/types/news';

// Datos de ejemplo - Reemplazar con llamadas a la API real
const mockNews: News = {
  id: '1',
  title: 'Nuevo récord en el mercado de valores',
  description: 'El mercado alcanza nuevos máximos históricos...',
  content: 'Contenido detallado de la noticia...',
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
};

const mockComments = [
  {
    id: '1',
    content: 'Excelente análisis',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: {
      id: '1',
      name: 'Juan Pérez',
    },
    replies: [
      {
        id: '2',
        content: 'Totalmente de acuerdo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: {
          id: '2',
          name: 'María García',
        },
      },
    ],
  },
];

const mockHistory = [
  {
    id: '1',
    type: 'created',
    timestamp: new Date().toISOString(),
    user: {
      id: '1',
      name: 'Juan Pérez',
    },
  },
  {
    id: '2',
    type: 'tags_changed',
    timestamp: new Date().toISOString(),
    user: {
      id: '1',
      name: 'Juan Pérez',
    },
    details: {
      from: ['Finanzas'],
      to: ['Mercado de Valores', 'Economía'],
    },
  },
] as const;

export default function NewsDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState('overview');

  const handleEdit = () => {
    router.push(`/news/edit?id=${id}`);
  };

  const handleDelete = async () => {
    // Implementar eliminación
    console.log('Eliminar noticia:', id);
    toast({
      title: 'Noticia eliminada',
      description: 'La noticia ha sido eliminada correctamente.',
    });
    router.push('/news');
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: mockNews.title,
          text: mockNews.description,
          url: mockNews.url,
        });
      } else {
        await navigator.clipboard.writeText(mockNews.url);
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

  const handleAddComment = async (content: string, parentId?: string) => {
    // Implementar agregar comentario
    console.log('Agregar comentario:', { content, parentId });
    toast({
      title: 'Comentario agregado',
      description: 'Tu comentario ha sido publicado.',
    });
  };

  const handleEditComment = async (id: string, content: string) => {
    // Implementar editar comentario
    console.log('Editar comentario:', { id, content });
    toast({
      title: 'Comentario actualizado',
      description: 'El comentario ha sido actualizado.',
    });
  };

  const handleDeleteComment = async (id: string) => {
    // Implementar eliminar comentario
    console.log('Eliminar comentario:', id);
    toast({
      title: 'Comentario eliminado',
      description: 'El comentario ha sido eliminado.',
    });
  };

  const handleDownloadPDF = async () => {
    // Implementar descarga de PDF
    console.log('Descargar PDF');
    toast({
      title: 'Descargando PDF',
      description: 'El reporte se está generando...',
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/news')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">{mockNews.title}</h1>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Compartir
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
            <Download className="mr-2 h-4 w-4" />
            Descargar PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">
            <Eye className="mr-2 h-4 w-4" />
            Vista General
          </TabsTrigger>
          <TabsTrigger value="comments">
            <MessageSquare className="mr-2 h-4 w-4" />
            Comentarios
          </TabsTrigger>
          <TabsTrigger value="history">
            <Calendar className="mr-2 h-4 w-4" />
            Historial
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Publicado el{' '}
                      {format(new Date(mockNews.publishedAt), 'PPP', {
                        locale: es,
                      })}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Fuente:</span>
                      <a
                        href={mockNews.source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center"
                      >
                        {mockNews.source.name}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  </div>

                  <Badge
                    className={
                      mockNews.impactLevel === 'high'
                        ? 'bg-red-500'
                        : mockNews.impactLevel === 'medium'
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }
                  >
                    {mockNews.impactLevel.toUpperCase()}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2">
                  {mockNews.tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      className="flex items-center gap-1"
                      style={{ borderColor: tag.color, color: tag.color }}
                    >
                      <Tag className="h-3 w-3" />
                      {tag.name}
                    </Badge>
                  ))}
                </div>

                <p className="text-lg">{mockNews.description}</p>

                {mockNews.content && (
                  <div className="prose max-w-none">
                    {mockNews.content}
                  </div>
                )}

                <Card className="mt-4">
                  <CardContent className="pt-6">
                    <LinkPreview url={mockNews.url} />
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments">
          <NewsComments
            comments={mockComments}
            onAddComment={handleAddComment}
            onEditComment={handleEditComment}
            onDeleteComment={handleDeleteComment}
          />
        </TabsContent>

        <TabsContent value="history">
          <NewsHistory history={mockHistory} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
