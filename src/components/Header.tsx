
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { 
  Bell, 
  User, 
  LogOut, 
  ChevronDown
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Header = () => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  
  return (
    <header className="bg-white shadow-sm py-4 px-4 md:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800 hidden md:block">
          ContGest
        </h1>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Popover open={showNotifications} onOpenChange={setShowNotifications}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="flex items-center justify-between p-3 border-b">
                <h3 className="font-medium">Notificações</h3>
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => markAllAsRead()}
                  >
                    Marcar todas como lidas
                  </Button>
                )}
              </div>
              <div className="max-h-60 overflow-y-auto">
                {notifications.length > 0 ? (
                  <div className="py-1">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`px-4 py-2 hover:bg-muted cursor-pointer ${notification.read ? 'opacity-70' : 'border-l-4 border-primary'}`}
                        onClick={() => {
                          markAsRead(notification.id);
                          if (notification.link) {
                            window.location.href = notification.link;
                          }
                          setShowNotifications(false);
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <p className="font-medium text-sm">{notification.title}</p>
                          <span className="text-xs text-gray-500">
                            {format(notification.date, 'P', { locale: ptBR })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    Nenhuma notificação
                  </div>
                )}
              </div>
              <div className="p-2 border-t text-center">
                <Link 
                  to="/dashboard/notifications" 
                  className="text-sm text-primary hover:underline"
                  onClick={() => setShowNotifications(false)}
                >
                  Ver todas notificações
                </Link>
              </div>
            </PopoverContent>
          </Popover>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="rounded-full bg-gray-200 h-8 w-8 flex items-center justify-center">
                  <User size={18} className="text-gray-600" />
                </div>
                <span className="hidden md:inline text-sm font-medium">{user?.name}</span>
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/dashboard/profile" className="cursor-pointer w-full">
                  <User size={16} className="mr-2" />
                  Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-500 focus:text-red-500">
                <LogOut size={16} className="mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
