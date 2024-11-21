import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Paper, Typography, Box } from '@mui/material';

interface DataPoint {
  timestamp: string;
  value: number;
  [key: string]: any;
}

interface RealTimeChartProps {
  title: string;
  streamId: string;
  dataKey: string;
  color?: string;
  height?: number;
  maxDataPoints?: number;
}

const RealTimeChart: React.FC<RealTimeChartProps> = ({
  title,
  streamId,
  dataKey,
  color = '#8884d8',
  height = 400,
  maxDataPoints = 100
}) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Connect to WebSocket
    const websocket = new WebSocket(`ws://localhost:8000/api/realtime/ws/${streamId}`);

    websocket.onopen = () => {
      console.log('Connected to WebSocket');
    };

    websocket.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      
      setData(currentData => {
        // Add new data point
        const updatedData = [...currentData, {
          timestamp: newData.timestamp,
          value: newData.metrics[dataKey].current
        }];
        
        // Keep only the last maxDataPoints
        return updatedData.slice(-maxDataPoints);
      });
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    websocket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    setWs(websocket);

    // Cleanup on unmount
    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, [streamId, dataKey, maxDataPoints]);

  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    return date.toLocaleTimeString();
  };

  return (
    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ width: '100%', height }}>
        <ResponsiveContainer>
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
              dataKey="timestamp"
              tickFormatter={formatXAxis}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(label) => new Date(label).toLocaleString()}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default RealTimeChart;
