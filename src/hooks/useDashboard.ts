import { useState, useEffect, useCallback } from 'react';
import { DashboardService } from '@/services/dashboard';
import { DashboardData, DashboardFilters } from '@/types/dashboard';
import { useToast } from '@/components/ui/use-toast';

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const dashboardService = DashboardService.getInstance();

  const fetchData = useCallback(async (filters: DashboardFilters) => {
    setLoading(true);
    setError(null);
    try {
      const dashboardData = await dashboardService.getDashboardData(filters);
      setData(dashboardData);
    } catch (err) {
      setError(err as Error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos del dashboard",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const exportData = useCallback(async (filters: DashboardFilters, format: 'csv' | 'xlsx') => {
    try {
      const blob = await dashboardService.exportDashboardData(filters, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-export.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Éxito",
        description: "Los datos se han exportado correctamente",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudieron exportar los datos",
        variant: "destructive",
      });
    }
  }, [toast]);

  const saveFilter = useCallback(async (name: string, filters: DashboardFilters) => {
    try {
      await dashboardService.saveFilter(name, filters);
      toast({
        title: "Éxito",
        description: "Filtro guardado correctamente",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo guardar el filtro",
        variant: "destructive",
      });
    }
  }, [toast]);

  return {
    data,
    loading,
    error,
    fetchData,
    exportData,
    saveFilter,
  };
}
