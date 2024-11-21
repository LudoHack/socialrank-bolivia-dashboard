import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { NewsFilters, ImpactLevel } from '@/types/news';
import { DateRangePicker } from '../ui/date-range-picker';
import { Badge } from '../ui/badge';
import { X } from 'lucide-react';

interface NewsFiltersProps {
  filters: NewsFilters;
  onFiltersChange: (filters: NewsFilters) => void;
  availableSources: { id: string; name: string }[];
  availableTags: { id: string; name: string }[];
}

export function NewsFilters({
  filters,
  onFiltersChange,
  availableSources,
  availableTags,
}: NewsFiltersProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      search: e.target.value,
    });
  };

  const handleImpactLevelChange = (level: ImpactLevel) => {
    const currentLevels = filters.impactLevel || [];
    const newLevels = currentLevels.includes(level)
      ? currentLevels.filter((l) => l !== level)
      : [...currentLevels, level];

    onFiltersChange({
      ...filters,
      impactLevel: newLevels,
    });
  };

  const handleSourceChange = (sourceId: string) => {
    const currentSources = filters.sources || [];
    const newSources = currentSources.includes(sourceId)
      ? currentSources.filter((s) => s !== sourceId)
      : [...currentSources, sourceId];

    onFiltersChange({
      ...filters,
      sources: newSources,
    });
  };

  const handleTagChange = (tagId: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter((t) => t !== tagId)
      : [...currentTags, tagId];

    onFiltersChange({
      ...filters,
      tags: newTags,
    });
  };

  const handleDateRangeChange = (range: { start: Date; end: Date }) => {
    onFiltersChange({
      ...filters,
      dateRange: range,
    });
  };

  const handleStatusChange = (status: string) => {
    const currentStatus = filters.status || [];
    const newStatus = currentStatus.includes(status as any)
      ? currentStatus.filter((s) => s !== status)
      : [...currentStatus, status as any];

    onFiltersChange({
      ...filters,
      status: newStatus,
    });
  };

  const handleSentimentChange = (sentiment: string) => {
    const currentSentiment = filters.sentiment || [];
    const newSentiment = currentSentiment.includes(sentiment as any)
      ? currentSentiment.filter((s) => s !== sentiment)
      : [...currentSentiment, sentiment as any];

    onFiltersChange({
      ...filters,
      sentiment: newSentiment,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value.length > 0
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Filtros</CardTitle>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 px-2 lg:px-3"
          >
            Limpiar
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search">Búsqueda</Label>
          <Input
            id="search"
            placeholder="Buscar noticias..."
            value={filters.search || ''}
            onChange={handleSearchChange}
          />
        </div>

        <div className="space-y-2">
          <Label>Nivel de Impacto</Label>
          <div className="flex flex-wrap gap-2">
            {(['high', 'medium', 'low'] as ImpactLevel[]).map((level) => (
              <Badge
                key={level}
                variant={
                  filters.impactLevel?.includes(level) ? 'default' : 'outline'
                }
                className="cursor-pointer"
                onClick={() => handleImpactLevelChange(level)}
              >
                {level.toUpperCase()}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Fuentes</Label>
          <div className="grid grid-cols-2 gap-2">
            {availableSources.map((source) => (
              <div key={source.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`source-${source.id}`}
                  checked={filters.sources?.includes(source.id)}
                  onCheckedChange={() => handleSourceChange(source.id)}
                />
                <label
                  htmlFor={`source-${source.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {source.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Etiquetas</Label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <Badge
                key={tag.id}
                variant={filters.tags?.includes(tag.id) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => handleTagChange(tag.id)}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Rango de Fechas</Label>
          <DateRangePicker
            value={filters.dateRange}
            onChange={handleDateRangeChange}
          />
        </div>

        <div className="space-y-2">
          <Label>Estado</Label>
          <div className="flex flex-wrap gap-2">
            {['draft', 'published', 'archived'].map((status) => (
              <Badge
                key={status}
                variant={filters.status?.includes(status as any) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => handleStatusChange(status)}
              >
                {status.toUpperCase()}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Sentimiento</Label>
          <div className="flex flex-wrap gap-2">
            {['positive', 'negative', 'neutral'].map((sentiment) => (
              <Badge
                key={sentiment}
                variant={
                  filters.sentiment?.includes(sentiment as any)
                    ? 'default'
                    : 'outline'
                }
                className="cursor-pointer"
                onClick={() => handleSentimentChange(sentiment)}
              >
                {sentiment.toUpperCase()}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
