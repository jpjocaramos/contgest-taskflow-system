
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'email' | 'popup' | 'panel';
  read: boolean;
  createdAt: Date;
  date: Date; // Added date property
  link?: string; // Added optional link property
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt' | 'date'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Add a notification
  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'createdAt' | 'date'>) => {
    const now = new Date();
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      createdAt: now,
      date: now, // Set date to be same as createdAt
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show toast for popup notifications
    if (notification.type === 'popup') {
      toast(notification.title, {
        description: notification.message,
        duration: 5000,
      });
    }
  };

  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  // Mock notifications for testing
  useEffect(() => {
    const now = new Date();
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Nova tarefa atribuída',
        message: 'Você foi designado para a tarefa "Declaração IR 2023"',
        type: 'panel',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        date: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        link: '/dashboard/tasks', // Added link property
      },
      {
        id: '2',
        title: 'Prazo chegando',
        message: 'A tarefa "Folha de Pagamento" vence em 2 dias',
        type: 'email',
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      },
    ];

    setNotifications(mockNotifications);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
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
