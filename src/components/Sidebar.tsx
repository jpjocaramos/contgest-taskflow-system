
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  X,
  LogOut
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Sidebar = () => {
  const { hasPermission, logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
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
      icon: <Users size={20} />, 
      permission: 'view',
      module: 'users'
    },
    { 
      path: '/dashboard/user-config', 
      label: 'Configurações', 
      icon: <Settings size={20} />, 
      permission: 'view',
      module: 'settings'
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get company info from local storage or mock data
  const companyInfo = {
    name: localStorage.getItem('companyName') || 'Tech Solutions Ltda',
    cnpj: localStorage.getItem('companyCNPJ') || '12.345.678/0001-90',
  };

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
        <div className="flex items-center justify-center p-4 border-b">
          <Link to="/dashboard" className="flex items-center">
            <img 
              src="/lovable-uploads/8f4c0a83-a44c-4bb1-b78a-6d917ea2a1ac.png" 
              alt="ContaGest Logo" 
              className="h-10" // Increased logo size
            />
          </Link>
          <button 
            onClick={() => setExpanded(!expanded)} 
            className="p-1 rounded-full hover:bg-gray-100 hidden md:block absolute right-4"
          >
            <ChevronRight size={20} className={`transform transition-transform ${expanded ? "" : "rotate-180"}`} />
          </button>
        </div>
        
        {/* User Profile */}
        {expanded && (
          <div className="border-b p-4">
            <div className="flex items-center space-x-3 mb-3">
              <Avatar>
                <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {user?.name ? user.name.charAt(0) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <Link 
                  to="/dashboard/profile" 
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  {user?.name || "João da Silva"}
                </Link>
                <span className="text-xs text-muted-foreground">Contador</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              className="w-full flex items-center justify-center gap-2"
              onClick={handleLogout}
            >
              <LogOut size={14} />
              <span>Sair</span>
            </Button>

            {/* Company Registration Info */}
            <div className="mt-3 pt-3 border-t">
              <h4 className="text-xs font-medium text-muted-foreground">Registrado para:</h4>
              <p className="text-sm font-medium mt-1">{companyInfo.name}</p>
              <p className="text-xs text-muted-foreground">{companyInfo.cnpj}</p>
            </div>
          </div>
        )}
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {expanded && (
            <div className="px-4 mb-1">
              <span className="text-xs font-medium text-gray-500">Menu Principal</span>
            </div>
          )}
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
