import React, { useState } from 'react';
import GridLayout from 'react-grid-layout';
import { Box, Paper } from '@mui/material';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

interface DashboardItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  component: React.ReactNode;
}

interface DashboardGridProps {
  items: DashboardItem[];
  cols?: number;
  rowHeight?: number;
  width?: number;
}

const DashboardGrid: React.FC<DashboardGridProps> = ({
  items,
  cols = 12,
  rowHeight = 100,
  width = 1200
}) => {
  const [layout, setLayout] = useState(
    items.map(({ i, x, y, w, h }) => ({ i, x, y, w, h }))
  );

  const onLayoutChange = (newLayout: GridLayout.Layout[]) => {
    setLayout(newLayout);
  };

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden' }}>
      <GridLayout
        className="layout"
        layout={layout}
        cols={cols}
        rowHeight={rowHeight}
        width={width}
        onLayoutChange={onLayoutChange}
        draggableHandle=".drag-handle"
      >
        {items.map((item) => (
          <Paper
            key={item.i}
            elevation={3}
            sx={{
              width: '100%',
              height: '100%',
              overflow: 'hidden'
            }}
          >
            {item.component}
          </Paper>
        ))}
      </GridLayout>
    </Box>
  );
};

export default DashboardGrid;
