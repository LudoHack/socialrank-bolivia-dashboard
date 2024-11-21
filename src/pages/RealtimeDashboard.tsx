import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import DashboardGrid from '../components/DashboardGrid';
import RealTimeChart from '../components/RealTimeChart';
import axios from 'axios';

interface StreamConfig {
  streamId: string;
  title: string;
  dataKey: string;
  color: string;
}

const defaultStreams: StreamConfig[] = [
  {
    streamId: 'cpu-usage',
    title: 'CPU Usage',
    dataKey: 'usage',
    color: '#8884d8'
  },
  {
    streamId: 'memory-usage',
    title: 'Memory Usage',
    dataKey: 'usage',
    color: '#82ca9d'
  },
  {
    streamId: 'network-traffic',
    title: 'Network Traffic',
    dataKey: 'bytes',
    color: '#ffc658'
  }
];

const RealtimeDashboard: React.FC = () => {
  const [streams, setStreams] = useState<StreamConfig[]>(defaultStreams);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeStreams = async () => {
      try {
        // Register all streams
        for (const stream of streams) {
          await axios.post('http://localhost:8000/api/realtime/register-stream', {
            stream_id: stream.streamId,
            processor_type: 'statistical',
            window_size: 100,
            batch_size: 10,
            processing_config: {
              columns: [stream.dataKey]
            }
          });
        }
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing streams:', error);
      }
    };

    if (!isInitialized) {
      initializeStreams();
    }

    // Cleanup on unmount
    return () => {
      const cleanupStreams = async () => {
        for (const stream of streams) {
          try {
            await axios.delete(
              `http://localhost:8000/api/realtime/deregister-stream/${stream.streamId}`
            );
          } catch (error) {
            console.error(`Error cleaning up stream ${stream.streamId}:`, error);
          }
        }
      };
      cleanupStreams();
    };
  }, [streams, isInitialized]);

  const dashboardItems = streams.map((stream, index) => ({
    i: stream.streamId,
    x: (index % 2) * 6,
    y: Math.floor(index / 2) * 4,
    w: 6,
    h: 4,
    component: (
      <RealTimeChart
        title={stream.title}
        streamId={stream.streamId}
        dataKey={stream.dataKey}
        color={stream.color}
      />
    )
  }));

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Real-time Dashboard
        </Typography>
        <DashboardGrid
          items={dashboardItems}
          cols={12}
          rowHeight={100}
          width={1200}
        />
      </Box>
    </Container>
  );
};

export default RealtimeDashboard;
