import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  FileText,
  Settings,
  Upload,
  Activity,
  Home
} from 'lucide-react';

interface NavItem {
  title: string;
  path: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    title: 'Dashboard',
    path: '/',
    icon: <Home className="w-4 h-4" />
  },
  {
    title: 'Noticias',
    path: '/noticias',
    icon: <FileText className="w-4 h-4" />
  },
  {
    title: 'Tiempo Real',
    path: '/realtime',
    icon: <Activity className="w-4 h-4" />
  },
  {
    title: 'Subir Datos',
    path: '/upload',
    icon: <Upload className="w-4 h-4" />
  }
];

const Sidebar: React.FC = () => {
  return (
    <div className="hidden border-r bg-background md:block w-64">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            {navigation.map((item, index) => (
              <React.Fragment key={item.path}>
                {item.children ? (
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center py-2">
                      {item.icon && <span className="mr-2">{item.icon}</span>}
                      <span>{item.title}</span>
                    </div>
                    <div className="grid gap-1 pl-6">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          className={({ isActive }) =>
                            `flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground ${
                              isActive ? 'bg-accent text-accent-foreground' : ''
                            }`
                          }
                        >
                          {child.icon && <span className="mr-2">{child.icon}</span>}
                          {child.title}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                ) : (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground ${
                        isActive ? 'bg-accent text-accent-foreground' : ''
                      }`
                    }
                  >
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.title}
                  </NavLink>
                )}
                {index < navigation.length - 1 && (
                  <div className="my-2 border-t" />
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
