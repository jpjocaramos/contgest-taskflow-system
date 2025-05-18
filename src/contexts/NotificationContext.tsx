
import React, { createContext, useState, useContext, useEffect } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  date: Date;
  link?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'date'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Mock initial notifications
const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Tarefa vencida',
    message: 'A tarefa "Declaração mensal" está atrasada',
    type: 'warning',
    read: false,
    date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    link: '/dashboard/tasks'
  },
  {
    id: '2',
    title: 'Novo cadastro',
    message: 'Empresa "Tech Solutions Ltda" foi cadastrada',
    type: 'info',
    read: false,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    link: '/dashboard/companies'
  },
  {
    id: '3',
    title: 'Regime tributário',
    message: 'Lembrete: Verificação trimestral dos regimes tributários',
    type: 'info',
    read: true,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  }
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  
  // Load notifications from localStorage on initial render
  useEffect(() => {
    const storedNotifications = localStorage.getItem('contgest_notifications');
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications).map((n: any) => ({
        ...n,
        date: new Date(n.date)
      })));
    }
  }, []);
  
  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('contgest_notifications', JSON.stringify(notifications));
  }, [notifications]);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'date'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      date: new Date()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };
  
  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        unreadCount, 
        markAsRead, 
        markAllAsRead, 
        addNotification 
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
