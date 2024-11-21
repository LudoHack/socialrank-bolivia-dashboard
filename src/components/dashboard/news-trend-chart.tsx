import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format, subDays } from "date-fns";
import { es } from "date-fns/locale";

interface DataPoint {
  date: string;
  total: number;
  highImpact: number;
  mediumImpact: number;
  lowImpact: number;
}

interface NewsTrendChartProps {
  data?: DataPoint[];
}

// Datos de ejemplo - Reemplazar con datos reales
const generateMockData = (): DataPoint[] => {
  return Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    return {
      date: format(date, "yyyy-MM-dd"),
      total: Math.floor(Math.random() * 50) + 20,
      highImpact: Math.floor(Math.random() * 10) + 5,
      mediumImpact: Math.floor(Math.random() * 20) + 10,
      lowImpact: Math.floor(Math.random() * 15) + 5,
    };
  });
};

export function NewsTrendChart({ data = generateMockData() }: NewsTrendChartProps) {
  const formatDate = (date: string) => {
    return format(new Date(date), "d MMM", { locale: es });
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          interval="preserveStartEnd"
        />
        <YAxis />
        <Tooltip
          labelFormatter={(label) =>
            format(new Date(label), "d 'de' MMMM, yyyy", {
              locale: es,
            })
          }
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="total"
          name="Total"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey="highImpact"
          name="Alto Impacto"
          stroke="#ff4d4f"
        />
        <Line
          type="monotone"
          dataKey="mediumImpact"
          name="Medio Impacto"
          stroke="#ffa940"
        />
        <Line
          type="monotone"
          dataKey="lowImpact"
          name="Bajo Impacto"
          stroke="#73d13d"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
