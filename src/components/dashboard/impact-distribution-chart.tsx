import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface DataPoint {
  name: string;
  value: number;
  color: string;
}

interface ImpactDistributionChartProps {
  data?: DataPoint[];
}

// Datos de ejemplo - Reemplazar con datos reales
const defaultData: DataPoint[] = [
  { name: "Alto Impacto", value: 89, color: "#ff4d4f" },
  { name: "Medio Impacto", value: 245, color: "#ffa940" },
  { name: "Bajo Impacto", value: 167, color: "#73d13d" },
];

export function ImpactDistributionChart({
  data = defaultData,
}: ImpactDistributionChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            value,
            index,
          }) => {
            const RADIAN = Math.PI / 180;
            const radius = 25 + innerRadius + (outerRadius - innerRadius);
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);

            return (
              <text
                x={x}
                y={y}
                fill={data[index].color}
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
              >
                {`${value} (${((value / data.reduce((a, b) => a + b.value, 0)) * 100).toFixed(0)}%)`}
              </text>
            );
          }}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value: string) => (
            <span style={{ color: data.find((d) => d.name === value)?.color }}>
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
