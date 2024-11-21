import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  FileText,
  Home,
  LineChart,
  Settings,
} from 'lucide-react';

const menuItems = [
  {
    title: 'Dashboard',
    icon: Home,
    path: '/',
  },
  {
    title: 'Noticias',
    icon: FileText,
    children: [
      {
        title: 'Nueva Noticia Semáforo',
        path: '/noticias/semaforo/nuevo',
      },
      {
        title: 'Nueva Noticia Monitoreo',
        path: '/noticias/monitoreo/nuevo',
      },
      {
        title: 'Listado de Noticias',
        path: '/noticias',
      },
    ],
  },
  {
    title: 'Reportes',
    icon: BarChart3,
    children: [
      {
        title: 'Reporte Semáforo',
        path: '/reportes/semaforo',
      },
      {
        title: 'Reporte Monitoreo',
        path: '/reportes/monitoreo',
      },
      {
        title: 'Estadísticas',
        path: '/reportes/estadisticas',
      },
    ],
  },
  {
    title: 'Análisis',
    icon: LineChart,
    path: '/analisis',
  },
  {
    title: 'Configuración',
    icon: Settings,
    path: '/configuracion',
  },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-background border-r min-h-screen">
      <nav className="p-4 space-y-2">
        {menuItems.map((item, index) => (
          <div key={index} className="space-y-1">
            {item.children ? (
              <>
                <div className="flex items-center px-3 py-2 text-sm font-medium">
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.title}
                </div>
                <div className="pl-8 space-y-1">
                  {item.children.map((child, childIndex) => (
                    <NavLink
                      key={childIndex}
                      to={child.path}
                      className={({ isActive }) =>
                        \`flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground \${
                          isActive ? 'bg-accent text-accent-foreground' : ''
                        }\`
                      }
                    >
                      {child.title}
                    </NavLink>
                  ))}
                </div>
              </>
            ) : (
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  \`flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground \${
                    isActive ? 'bg-accent text-accent-foreground' : ''
                  }\`
                }
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.title}
              </NavLink>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
