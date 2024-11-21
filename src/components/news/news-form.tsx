import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { News, NewsSource, NewsTag, ImpactLevel } from '@/types/news';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LinkPreview } from '@/components/ui/link-preview';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const newsFormSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  url: z.string().url('URL inválida'),
  sourceId: z.string().min(1, 'La fuente es requerida'),
  impactLevel: z.enum(['high', 'medium', 'low'] as const),
  tags: z.array(z.string()).min(1, 'Seleccione al menos una etiqueta'),
  content: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived'] as const),
});

type NewsFormValues = z.infer<typeof newsFormSchema>;

interface NewsFormProps {
  news?: News;
  sources: NewsSource[];
  tags: NewsTag[];
  onSubmit: (values: NewsFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function NewsForm({
  news,
  sources,
  tags,
  onSubmit,
  isLoading = false,
}: NewsFormProps) {
  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: {
      title: news?.title || '',
      description: news?.description || '',
      url: news?.url || '',
      sourceId: news?.source.id || '',
      impactLevel: news?.impactLevel || 'medium',
      tags: news?.tags.map((tag) => tag.id) || [],
      content: news?.content || '',
      status: news?.status || 'draft',
    },
  });

  const handleSubmit = async (values: NewsFormValues) => {
    try {
      await onSubmit(values);
      form.reset();
    } catch (error) {
      console.error('Error al guardar la noticia:', error);
    }
  };

  const watchUrl = form.watch('url');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Título de la noticia" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Breve descripción de la noticia"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
              {watchUrl && (
                <Card className="mt-2 p-4">
                  <LinkPreview url={watchUrl} showActions={false} />
                </Card>
              )}
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="sourceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fuente</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar fuente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sources.map((source) => (
                      <SelectItem key={source.id} value={source.id}>
                        {source.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="impactLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nivel de Impacto</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar impacto" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="high">Alto</SelectItem>
                    <SelectItem value="medium">Medio</SelectItem>
                    <SelectItem value="low">Bajo</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Etiquetas</FormLabel>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={
                      field.value.includes(tag.id) ? 'default' : 'outline'
                    }
                    className="cursor-pointer"
                    style={{
                      borderColor: tag.color,
                      backgroundColor: field.value.includes(tag.id)
                        ? tag.color
                        : 'transparent',
                      color: field.value.includes(tag.id) ? 'white' : tag.color,
                    }}
                    onClick={() => {
                      const newValue = field.value.includes(tag.id)
                        ? field.value.filter((id) => id !== tag.id)
                        : [...field.value, tag.id];
                      field.onChange(newValue);
                    }}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contenido Adicional</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Contenido adicional o notas sobre la noticia"
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Puedes agregar contenido adicional o notas sobre la noticia
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="draft">Borrador</SelectItem>
                  <SelectItem value="published">Publicado</SelectItem>
                  <SelectItem value="archived">Archivado</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {news ? 'Actualizar' : 'Crear'} Noticia
          </Button>
        </div>
      </form>
    </Form>
  );
}
