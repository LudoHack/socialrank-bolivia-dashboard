import React from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const COLORS = ['#ef4444', '#eab308', '#22c55e'];
const RADIAN = Math.PI / 180;

// Datos de ejemplo
const impactData = [
  { name: 'Alto Riesgo', value: 12 },
  { name: 'Precaución', value: 8 },
  { name: 'Favorable', value: 15 },
];

const trendData = [
  { fecha: '2023-01', alto: 10, medio: 5, bajo: 8 },
  { fecha: '2023-02', alto: 8, medio: 7, bajo: 10 },
  { fecha: '2023-03', alto: 12, medio: 8, bajo: 15 },
  { fecha: '2023-04', alto: 15, medio: 10, bajo: 12 },
];

const CustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distribución de Impactos */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Distribución de Impactos</h3>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={impactData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={CustomizedLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {impactData.map((entry, index) => (
                      <Cell key={\`cell-\${index}\`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tendencias */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Tendencias por Mes</h3>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="fecha" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="alto" stroke="#ef4444" name="Alto Riesgo" />
                  <Line type="monotone" dataKey="medio" stroke="#eab308" name="Precaución" />
                  <Line type="monotone" dataKey="bajo" stroke="#22c55e" name="Favorable" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Últimas Noticias */}
        <Card className="md:col-span-2">
          <CardHeader>
            <h3 className="text-lg font-semibold">Últimas Noticias</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Lista de ejemplo de noticias */}
              {[1, 2, 3].map((_, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Título de la Noticia {index + 1}</h4>
                    <span className="text-sm text-muted-foreground">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Breve descripción de la noticia que proporciona contexto sobre el contenido...
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                      Alto Impacto
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Fuente: Medio de Comunicación
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
