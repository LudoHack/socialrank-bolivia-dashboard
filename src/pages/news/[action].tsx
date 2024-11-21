import React from 'react';
import { useRouter } from 'next/router';
import { NewsForm } from '@/components/news/news-form';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// Datos de ejemplo - Reemplazar con llamadas a la API real
const mockSources = [
  { id: '1', name: 'Financial Times', url: 'https://ft.com', type: 'website' },
  { id: '2', name: 'Bloomberg', url: 'https://bloomberg.com', type: 'website' },
  { id: '3', name: 'Reuters', url: 'https://reuters.com', type: 'website' },
];

const mockTags = [
  { id: '1', name: 'Mercado de Valores', color: '#FF0000' },
  { id: '2', name: 'Economía', color: '#00FF00' },
  { id: '3', name: 'Tecnología', color: '#0000FF' },
  { id: '4', name: 'Finanzas', color: '#FFFF00' },
];

export default function NewsActionPage() {
  const router = useRouter();
  const { action, id } = router.query;
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const isEdit = action === 'edit';
  const pageTitle = isEdit ? 'Editar Noticia' : 'Nueva Noticia';

  // En caso de edición, cargar los datos de la noticia
  React.useEffect(() => {
    if (isEdit && id) {
      // Implementar carga de datos
      console.log('Cargar noticia:', id);
    }
  }, [isEdit, id]);

  const handleSubmit = async (values: any) => {
    try {
      setIsLoading(true);
      // Implementar guardado de datos
      console.log('Guardar noticia:', values);
      
      toast({
        title: 'Éxito',
        description: isEdit
          ? 'La noticia ha sido actualizada.'
          : 'La noticia ha sido creada.',
      });
      
      router.push('/news');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar la noticia.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/news')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">{pageTitle}</h1>
      </div>

      <div className="max-w-3xl">
        <NewsForm
          sources={mockSources}
          tags={mockTags}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
