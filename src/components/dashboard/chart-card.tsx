import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  timeRange?: string;
  onTimeRangeChange?: (value: string) => void;
}

export function ChartCard({
  title,
  children,
  timeRange,
  onTimeRangeChange,
}: ChartCardProps) {
  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        {timeRange && onTimeRangeChange && (
          <Select
            value={timeRange}
            onValueChange={onTimeRangeChange}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Seleccionar período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 días</SelectItem>
              <SelectItem value="30d">Últimos 30 días</SelectItem>
              <SelectItem value="90d">Últimos 90 días</SelectItem>
              <SelectItem value="1y">Último año</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
