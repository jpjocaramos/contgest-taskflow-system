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
      } md:translate-x-0 ${expanded ? "w-64" : "w-20"} flex flex-col relative`}>
        {/* Logo */}
        <div className="flex items-center justify-center p-6 border-b bg-gradient-to-r from-gray-50 to-white relative">
          <Link to="/dashboard" className="flex items-center justify-center w-full">
            {expanded ? (
              <img 
                src="/logo-contagest.png" 
                alt="ContaGest Logo" 
                className="transition-all duration-300 h-24"
              />
            ) : (
              <img 
                src="/logo-mini.png" 
                alt="Logo Minimizado" 
                className="transition-all duration-300 h-20"
              />
            )}
          </Link>
          <button 
            onClick={() => setExpanded(!expanded)} 
            className={`p-2 rounded-full hover:bg-gray-100 hidden md:flex items-center justify-center transition-all duration-300 absolute ${
              expanded 
                ? "right-4 top-1/2 -translate-y-1/2" 
                : "-right-6 top-1/2 -translate-y-1/2 bg-white shadow-md z-10"
            }`}
          >
            <ChevronRight 
              size={20} 
              className={`transform transition-transform duration-300 ${
                expanded ? "" : "rotate-0"
              }`} 
            />
          </button>
        </div>
        
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

        {/* Company Registration Info - Moved to bottom */}
        {expanded && (
          <div className="border-t p-4 mt-auto">
            <h4 className="text-xs font-medium text-muted-foreground">Registrado para:</h4>
            <p className="text-sm font-medium mt-1">{companyInfo.name}</p>
            <p className="text-xs text-muted-foreground mb-4">{companyInfo.cnpj}</p>
            
            <Separator className="my-4" />
            
            {/* User Profile */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user?.name ? user.name.charAt(0) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <Link 
                    to="/dashboard/profile" 
                    className="text-sm font-semibold hover:text-primary transition-colors"
                  >
                    {user?.name || "João da Silva"}
                  </Link>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-muted-foreground">Contador</span>
                    <span className="text-xs text-green-600">• Online</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full flex items-center justify-center gap-2 transition-all duration-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 active:bg-red-100 active:text-red-700"
              onClick={handleLogout}
            >
              <LogOut size={14} className="transition-colors duration-300" />
              <span>Sair</span>
            </Button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
