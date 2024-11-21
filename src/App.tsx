import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import MainLayout from './components/layout/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import NoticiaSemaforo from './pages/noticias/NoticiaSemaforo';
import NoticiaMonitoreo from './pages/noticias/NoticiaMonitoreo';
import ListadoNoticias from './pages/noticias/ListadoNoticias';
import ReporteSemaforo from './pages/reportes/ReporteSemaforo';
import ReporteMonitoreo from './pages/reportes/ReporteMonitoreo';
import Estadisticas from './pages/reportes/Estadisticas';
import Analisis from './pages/Analisis';
import Configuracion from './pages/Configuracion';
import RealtimeDashboard from './pages/RealtimeDashboard';
import Auth from './pages/Auth';
import DataUpload from './pages/DataUpload';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
    },
  },
});

// Componente para proteger rutas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Rutas protegidas dentro del layout principal */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              
              {/* Rutas de Noticias */}
              <Route path="noticias">
                <Route path="semaforo/nuevo" element={<NoticiaSemaforo />} />
                <Route path="monitoreo/nuevo" element={<NoticiaMonitoreo />} />
                <Route path="" element={<ListadoNoticias />} />
              </Route>
              
              {/* Rutas de Reportes */}
              <Route path="reportes">
                <Route path="semaforo" element={<ReporteSemaforo />} />
                <Route path="monitoreo" element={<ReporteMonitoreo />} />
                <Route path="estadisticas" element={<Estadisticas />} />
              </Route>
              
              {/* Otras rutas */}
              <Route path="analisis" element={<Analisis />} />
              <Route path="configuracion" element={<Configuracion />} />
              <Route path="upload" element={<DataUpload />} />
              <Route path="realtime" element={<RealtimeDashboard />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
