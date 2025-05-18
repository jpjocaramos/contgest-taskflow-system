
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  Building2, 
  Users, 
  CheckSquare, 
  FileText, 
  Settings, 
  User, 
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const { hasPermission } = useAuth();
  const location = useLocation();
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname.startsWith(path);
  
  const menuItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: <Home size={20} />, 
      permission: 'view',
      module: 'dashboard'
    },
    { 
      path: '/dashboard/companies', 
      label: 'Empresas', 
      icon: <Building2 size={20} />, 
      permission: 'view',
      module: 'companies'
    },
    { 
      path: '/dashboard/people', 
      label: 'Pessoas', 
      icon: <Users size={20} />, 
      permission: 'view',
      module: 'people'
    },
    { 
      path: '/dashboard/tasks', 
      label: 'TaskGest', 
      icon: <CheckSquare size={20} />, 
      permission: 'view',
      module: 'tasks'
    },
    { 
      path: '/dashboard/reports', 
      label: 'Relatórios', 
      icon: <FileText size={20} />, 
      permission: 'view',
      module: 'reports'
    },
    { 
      path: '/dashboard/users', 
      label: 'Usuários', 
      icon: <User size={20} />, 
      permission: 'view',
      module: 'users'
    },
    { 
      path: '/dashboard/settings', 
      label: 'Configurações', 
      icon: <Settings size={20} />, 
      permission: 'view',
      module: 'settings'
    },
  ];

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button 
        className="fixed top-4 left-4 z-50 md:hidden bg-white rounded-lg p-2 shadow-md"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {/* Sidebar for mobile */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${
        mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`} 
      onClick={() => setMobileOpen(false)}
      />
      
      <aside className={`bg-white shadow-lg z-40 transition-all duration-300 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 ${expanded ? "w-64" : "w-20"} flex flex-col`}>
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b">
          {expanded && (
            <Link to="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-primary">Cont<span className="text-secondary">Gest</span></span>
            </Link>
          )}
          <button 
            onClick={() => setExpanded(!expanded)} 
            className="p-1 rounded-full hover:bg-gray-100 hidden md:block"
          >
            <ChevronRight size={20} className={`transform transition-transform ${expanded ? "" : "rotate-180"}`} />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => 
              hasPermission(item.module, item.permission as 'view') && (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                  >
                    {item.icon}
                    {expanded && <span className="ml-3">{item.label}</span>}
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
