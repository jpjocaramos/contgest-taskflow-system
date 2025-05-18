
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (module: string, action: 'view' | 'create' | 'update' | 'delete') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for development
const mockUser = {
  id: '1',
  name: 'João da Silva',
  email: 'joao@contgest.com',
  role: 'admin' as const,
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(mockUser); // Start with mock user for development
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Start as authenticated for development

  const login = async (email: string, password: string) => {
    // Mock login functionality
    if (email && password) {
      setUser(mockUser);
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const hasPermission = (module: string, action: 'view' | 'create' | 'update' | 'delete'): boolean => {
    // Mock permission checks
    if (!isAuthenticated || !user) {
      return false;
    }

    if (user.role === 'admin') {
      return true;
    }

    // For employees, restrict some modules/actions
    if (user.role === 'employee') {
      if (module === 'settings' || module === 'users') {
        return action === 'view';
      }
      return true;
    }

    return false;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
