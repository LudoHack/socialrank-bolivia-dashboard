import React from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Clock,
  Download,
  Eye,
  Save,
  Tag,
  TrendingUp,
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ChartCard } from "@/components/dashboard/chart-card";
import { ActivityList } from "@/components/dashboard/activity-list";
import { DashboardFilters } from "@/components/dashboard/dashboard-filters";
import { NewsTrendChart } from "@/components/dashboard/news-trend-chart";
import { ImpactDistributionChart } from "@/components/dashboard/impact-distribution-chart";
import { TagCloudChart } from "@/components/dashboard/tag-cloud-chart";
import { useDashboard } from "@/hooks/useDashboard";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { DashboardFilters as Filters } from "@/types/dashboard";

const mockActivities = [
  {
    id: "1",
    user: {
      name: "Juan Pérez",
      avatar: "https://github.com/shadcn.png",
    },
    action: "agregó una nueva noticia:",
    target: "Récord histórico en el mercado de valores",
    timestamp: new Date().toISOString(),
  },
  {
    id: "2",
    user: {
      name: "María García",
    },
    action: "comentó en",
    target: "Análisis del sector tecnológico",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  // Agregar más actividades de ejemplo
];

export default function DashboardPage() {
  const [timeRange, setTimeRange] = React.useState("30d");
  const [filters, setFilters] = React.useState<Filters>({
    dateRange: { from: undefined, to: undefined },
    impactLevel: [],
    sources: [],
    tags: [],
  });
  const [filterName, setFilterName] = React.useState("");
  const [saveDialogOpen, setSaveDialogOpen] = React.useState(false);

  const { data, loading, error, fetchData, exportData, saveFilter } = useDashboard();

  React.useEffect(() => {
    fetchData(filters);
  }, [fetchData, filters]);

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const handleExport = (format: "csv" | "xlsx") => {
    exportData(filters, format);
  };

  const handleSaveFilter = async () => {
    if (filterName.trim()) {
      await saveFilter(filterName, filters);
      setFilterName("");
      setSaveDialogOpen(false);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="rounded-lg border border-destructive p-4">
          <h2 className="text-lg font-semibold text-destructive">Error</h2>
          <p className="mt-2">No se pudieron cargar los datos del dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport("csv")}>
                Exportar como CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("xlsx")}>
                Exportar como Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Save className="mr-2 h-4 w-4" />
                Guardar Filtros
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Guardar Filtros</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Input
                    id="name"
                    placeholder="Nombre del filtro"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                  />
                </div>
                <Button onClick={handleSaveFilter}>Guardar</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <DashboardFilters onFiltersChange={handleFiltersChange} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {data && (
          <>
            <StatsCard
              title="Total de Noticias"
              value={data.metrics.current.totalNews}
              icon={BarChart3}
              trend={data.metrics.trends.totalNews}
              description="Total de noticias en el sistema"
            />
            <StatsCard
              title="Alto Impacto"
              value={data.metrics.current.highImpactNews}
              icon={AlertTriangle}
              trend={data.metrics.trends.highImpactNews}
              description="Noticias de alto impacto"
            />
            <StatsCard
              title="Usuarios Activos"
              value={data.metrics.current.activeUsers}
              icon={Activity}
              trend={data.metrics.trends.activeUsers}
              description="Usuarios activos este mes"
            />
            <StatsCard
              title="Vistas Promedio"
              value={data.metrics.current.averageViews}
              icon={Eye}
              trend={data.metrics.trends.averageViews}
              description="Vistas por noticia"
            />
          </>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <ChartCard
          title="Tendencia de Noticias"
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          className="lg:col-span-3"
          loading={loading}
        >
          <div className="h-[350px]">
            {data && <NewsTrendChart data={data.trends} />}
          </div>
        </ChartCard>

        <ChartCard 
          title="Distribución por Impacto" 
          className="lg:col-span-2"
          loading={loading}
        >
          <div className="h-[350px]">
            {data && <ImpactDistributionChart data={data.distribution} />}
          </div>
        </ChartCard>

        <ChartCard 
          title="Etiquetas Más Comunes" 
          className="lg:col-span-2"
          loading={loading}
        >
          <div className="h-[350px]">
            {data && <TagCloudChart data={data.tags} />}
          </div>
        </ChartCard>

        <ActivityList activities={mockActivities} />
      </div>
    </div>
  );
}
