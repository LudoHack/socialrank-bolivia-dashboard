import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface DashboardFiltersProps {
  onFiltersChange: (filters: DashboardFilters) => void;
}

export interface DashboardFilters {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  impactLevel: string[];
  sources: string[];
  tags: string[];
}

const impactLevels = [
  { value: "high", label: "Alto" },
  { value: "medium", label: "Medio" },
  { value: "low", label: "Bajo" },
];

// Datos de ejemplo - Reemplazar con datos reales
const sources = [
  { value: "financial-times", label: "Financial Times" },
  { value: "bloomberg", label: "Bloomberg" },
  { value: "reuters", label: "Reuters" },
  { value: "wsj", label: "Wall Street Journal" },
];

const tags = [
  { value: "mercado-valores", label: "Mercado de Valores" },
  { value: "economia", label: "Economía" },
  { value: "tecnologia", label: "Tecnología" },
  { value: "finanzas", label: "Finanzas" },
];

export function DashboardFilters({ onFiltersChange }: DashboardFiltersProps) {
  const [filters, setFilters] = React.useState<DashboardFilters>({
    dateRange: {
      from: undefined,
      to: undefined,
    },
    impactLevel: [],
    sources: [],
    tags: [],
  });

  const updateFilters = (newFilters: Partial<DashboardFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const removeFilter = (type: keyof DashboardFilters, value?: string) => {
    if (type === "dateRange") {
      updateFilters({
        dateRange: { from: undefined, to: undefined },
      });
    } else if (value) {
      updateFilters({
        [type]: filters[type].filter((v: string) => v !== value),
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {/* Selector de rango de fechas */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !filters.dateRange.from && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateRange.from ? (
                filters.dateRange.to ? (
                  <>
                    {format(filters.dateRange.from, "P", { locale: es })} -{" "}
                    {format(filters.dateRange.to, "P", { locale: es })}
                  </>
                ) : (
                  format(filters.dateRange.from, "P", { locale: es })
                )
              ) : (
                "Seleccionar fechas"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={filters.dateRange.from}
              selected={{
                from: filters.dateRange.from,
                to: filters.dateRange.to,
              }}
              onSelect={(range) =>
                updateFilters({
                  dateRange: {
                    from: range?.from,
                    to: range?.to,
                  },
                })
              }
              locale={es}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        {/* Selector de nivel de impacto */}
        <Select
          value={filters.impactLevel[0]}
          onValueChange={(value) =>
            updateFilters({ impactLevel: [value] })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Nivel de impacto" />
          </SelectTrigger>
          <SelectContent>
            {impactLevels.map((level) => (
              <SelectItem key={level.value} value={level.value}>
                {level.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Selector de fuentes */}
        <Select
          value={filters.sources[0]}
          onValueChange={(value) =>
            updateFilters({
              sources: [...filters.sources, value],
            })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Fuentes" />
          </SelectTrigger>
          <SelectContent>
            {sources.map((source) => (
              <SelectItem
                key={source.value}
                value={source.value}
                disabled={filters.sources.includes(source.value)}
              >
                {source.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Selector de etiquetas */}
        <Select
          value={filters.tags[0]}
          onValueChange={(value) =>
            updateFilters({
              tags: [...filters.tags, value],
            })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Etiquetas" />
          </SelectTrigger>
          <SelectContent>
            {tags.map((tag) => (
              <SelectItem
                key={tag.value}
                value={tag.value}
                disabled={filters.tags.includes(tag.value)}
              >
                {tag.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Botón para limpiar todos los filtros */}
        {(filters.dateRange.from ||
          filters.impactLevel.length > 0 ||
          filters.sources.length > 0 ||
          filters.tags.length > 0) && (
          <Button
            variant="ghost"
            className="h-8 px-2 lg:px-3"
            onClick={() =>
              setFilters({
                dateRange: { from: undefined, to: undefined },
                impactLevel: [],
                sources: [],
                tags: [],
              })
            }
          >
            Limpiar filtros
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Mostrar filtros activos */}
      <div className="flex flex-wrap gap-2">
        {filters.dateRange.from && (
          <Badge variant="secondary" className="h-7">
            {format(filters.dateRange.from, "P", { locale: es })} -{" "}
            {filters.dateRange.to
              ? format(filters.dateRange.to, "P", { locale: es })
              : ""}
            <Button
              variant="ghost"
              className="h-4 w-4 p-0 ml-2"
              onClick={() => removeFilter("dateRange")}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        )}
        {filters.impactLevel.map((level) => (
          <Badge key={level} variant="secondary" className="h-7">
            {
              impactLevels.find((l) => l.value === level)?.label ||
              level
            }
            <Button
              variant="ghost"
              className="h-4 w-4 p-0 ml-2"
              onClick={() => removeFilter("impactLevel", level)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
        {filters.sources.map((source) => (
          <Badge key={source} variant="secondary" className="h-7">
            {
              sources.find((s) => s.value === source)?.label ||
              source
            }
            <Button
              variant="ghost"
              className="h-4 w-4 p-0 ml-2"
              onClick={() => removeFilter("sources", source)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
        {filters.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="h-7">
            {tags.find((t) => t.value === tag)?.label || tag}
            <Button
              variant="ghost"
              className="h-4 w-4 p-0 ml-2"
              onClick={() => removeFilter("tags", tag)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
