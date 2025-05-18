
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  date: Date;
  link?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'read'>) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Mock notifications for development
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Nova tarefa atribuída',
    message: 'Você recebeu uma nova tarefa para a empresa Tech Solutions.',
    read: false,
    date: new Date(2023, 4, 18),
    link: '/dashboard/tasks'
  },
  {
    id: '2',
    title: 'Prazo se aproximando',
    message: 'A tarefa "Entrega de relatório fiscal" vence em 2 dias.',
    read: false,
    date: new Date(2023, 4, 17),
    link: '/dashboard/tasks'
  },
  {
    id: '3',
    title: 'Atualização do sistema',
    message: 'Nova versão do ContGest disponível. Acesse as configurações para atualizar.',
    read: true,
    date: new Date(2023, 4, 15),
    link: '/dashboard/user-config'
  }
];

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter(notification => !notification.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'read'>) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      read: false
    };
    setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification.id !== id)
    );
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      addNotification,
      removeNotification
    }}>
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
