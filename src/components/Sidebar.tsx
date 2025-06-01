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
  LogOut,
  Bell
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  // Mock notification count
  const notificationCount = 5; // Substitua por um estado real ou prop

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
      } md:translate-x-0 flex flex-col relative py-4`} style={{ width: expanded ? '235px' : '75px' }}>
        {/* Logo */}
        <div className="flex items-center justify-center p-6 bg-gradient-to-r from-gray-50 to-white relative">
          <Link to="/dashboard" className="flex items-center w-full pl-6">
            {expanded ? (
              <img 
                src="/lovable-uploads/59880246-d998-4891-97b3-6b1619e864d3.png" 
                alt="ContaGest Logo" 
                className="transition-all duration-300"
                style={{ height: '50px', marginLeft: '-18px' }}
              />
            ) : (
              <img 
                src="/lovable-uploads/ac828e75-90a0-4415-82d0-09898abdc274.png" 
                alt="Logo Minimizado" 
                className="transition-all duration-300 h-10"
              />
            )}
          </Link>
        </div>
        
        {/* Botão de expandir/recolher - Novo posicionamento e estilo */}
        <button 
          onClick={() => setExpanded(!expanded)} 
          className={`p-1.5 rounded-full bg-white shadow-md hidden md:flex items-center justify-center transition-all duration-300 absolute z-20 right-[-10px] top-[calc(var(-logo-block-height) + 90px)] -translate-y-1/2`}
          style={{ '--logo-block-height': expanded ? '90px' : '80px', '--profile-block-height': '48px', '--button-height': '32px' } as React.CSSProperties}
        >
          <ChevronRight 
            size={12} 
            className={`transform transition-transform duration-300 ${
              expanded ? "rotate-180" : ""
            }`} 
          />
        </button>
        
        {/* Novo Separator entre Logo e Perfil */}
        {expanded && <Separator className="h-[2px] bg-gray-300 mt-[5px] mb-[5px]" />}
        
        {/* User Profile - Remodelado */}
        {expanded && (
          <div className="flex items-center justify-between mx-2 mb-2 mt-0">
            {/* Contêiner para Avatar, Nome, Cargo e Botão de Logout com Fundo e Hover */}
            <div className="flex items-center flex-grow rounded-lg p-4 -m-1 bg-gray-100 hover:bg-gray-100 transition-colors cursor-pointer">
              <Avatar className="h-10 w-10 border-2 border-white shadow-sm relative mr-2">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user?.name ? user.name.charAt(0) : "U"}
                </AvatarFallback>
                {/* Removido o ícone de Logout posicionado absolutamente */}
              </Avatar>

              {/* Nome e Cargo */}
              <div className="flex flex-col flex-grow min-w-0">
                <Link 
                  to="/dashboard/profile" 
                  className="text-sm font-semibold hover:text-primary transition-colors truncate"
                >
                  {user?.name || "João Pedro"}
                </Link>
                <span className="text-xs text-muted-foreground truncate">Administrador</span>
              </div>
                {/* Botão de Logout */}
                <button 
                  onClick={handleLogout}
                  className="p-1 rounded-full hover:bg-gray-200 transition-colors flex-shrink-0 ml-auto"
                >
                    <LogOut size={16} className="text-red-500" />
                </button>
            </div>

            {/* Ícone de notificações */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative p-1.5 rounded-md transition-colors focus:outline-none flex-shrink-0">
                  <Bell size={20} />
                  {notificationCount > 0 && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64">
                <DropdownMenuLabel>Notificações ({notificationCount})</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* Conteúdo das notificações (substituir por dados reais) */}
                <DropdownMenuItem>Você tem novas mensagens.</DropdownMenuItem>
                <DropdownMenuItem>Nova tarefa atribuída.</DropdownMenuItem>
                {/* Adicione mais itens de notificação aqui */}
                <DropdownMenuSeparator />
                <DropdownMenuItem>Ver todas as notificações</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        
        {/* Separator abaixo do perfil do usuário */}
        {expanded && <Separator className="my-2" />}

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
          <div className="bg-[#f8fafc] rounded-lg p-4 mt-auto mx-2">
            <h4 className="text-xs font-medium text-muted-foreground">Registrado para:</h4>
            <p className="text-sm font-medium mt-1">{companyInfo.name}</p>
            <p className="text-xs text-muted-foreground mb-[10px]">{companyInfo.cnpj}</p>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
