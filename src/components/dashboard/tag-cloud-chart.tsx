import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TagData {
  name: string;
  count: number;
  x: number;
  y: number;
  z: number;
}

interface TagCloudChartProps {
  data?: TagData[];
}

// Datos de ejemplo - Reemplazar con datos reales
const generateMockData = (): TagData[] => {
  const tags = [
    "Mercado de Valores",
    "Economía",
    "Tecnología",
    "Finanzas",
    "Política",
    "Empresas",
    "Internacional",
    "Innovación",
    "Startups",
    "Inversiones",
  ];

  return tags.map((tag) => ({
    name: tag,
    count: Math.floor(Math.random() * 100) + 20,
    x: Math.random() * 100,
    y: Math.random() * 100,
    z: Math.random() * 100,
  }));
};

export function TagCloudChart({ data = generateMockData() }: TagCloudChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <XAxis type="number" dataKey="x" hide />
        <YAxis type="number" dataKey="y" hide />
        <ZAxis
          type="number"
          dataKey="z"
          range={[16, 32]}
          domain={[0, 100]}
        />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">{data.name}</div>
                    <div className="font-medium text-right">
                      {data.count} noticias
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Scatter
          data={data}
          fill="#8884d8"
          shape={(props: any) => {
            const { cx, cy, payload } = props;
            const fontSize = (payload.z / 100) * 16 + 8; // Tamaño de fuente basado en el valor z
            return (
              <text
                x={cx}
                y={cy}
                dy={fontSize / 3}
                textAnchor="middle"
                fill="#8884d8"
                fontSize={`${fontSize}px`}
                style={{ userSelect: "none" }}
              >
                {payload.name}
              </text>
            );
          }}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
