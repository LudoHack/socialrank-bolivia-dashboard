import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';

const formSchema = z.object({
  titulo: z.string().min(1, 'El título es requerido'),
  fecha: z.string().min(1, 'La fecha es requerida'),
  categoria: z.string().min(1, 'La categoría es requerida'),
  impactoRojo: z.string().optional(),
  impactoAmarillo: z.string().optional(),
  impactoVerde: z.string().optional(),
  fuente: z.string().min(1, 'La fuente es requerida'),
  url: z.string().url('URL inválida').optional(),
  confidencial: z.boolean().default(false),
});

const NoticiaSemaforo = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      confidencial: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
      // Aquí iría la lógica para enviar los datos al backend
    } catch (error) {
      console.error('Error al guardar la noticia:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Nueva Noticia Semáforo</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información de la Noticia</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Título */}
                <FormField
                  control={form.control}
                  name="titulo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingrese el título de la noticia" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Fecha */}
                <FormField
                  control={form.control}
                  name="fecha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Categoría */}
                <FormField
                  control={form.control}
                  name="categoria"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione una categoría" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="economia">Economía</SelectItem>
                          <SelectItem value="politica">Política</SelectItem>
                          <SelectItem value="social">Social</SelectItem>
                          <SelectItem value="tecnologia">Tecnología</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Fuente */}
                <FormField
                  control={form.control}
                  name="fuente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fuente</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del medio o fuente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* URL */}
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
                    </FormItem>
                  )}
                />

                {/* Confidencial */}
                <FormField
                  control={form.control}
                  name="confidencial"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Confidencial</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Impactos */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Evaluación de Impacto</h3>
                <div className="grid grid-cols-1 gap-4">
                  {/* Impacto Rojo */}
                  <FormField
                    control={form.control}
                    name="impactoRojo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-red-600">Impacto Rojo (Alto Riesgo/Negativo)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describa el impacto negativo..."
                            className="h-20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Impacto Amarillo */}
                  <FormField
                    control={form.control}
                    name="impactoAmarillo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-yellow-600">Impacto Amarillo (Precaución/Neutral)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describa el impacto neutral..."
                            className="h-20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Impacto Verde */}
                  <FormField
                    control={form.control}
                    name="impactoVerde"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-green-600">Impacto Verde (Positivo/Favorable)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describa el impacto positivo..."
                            className="h-20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" type="button">
                  Cancelar
                </Button>
                <Button type="submit">
                  Guardar Noticia
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoticiaSemaforo;
