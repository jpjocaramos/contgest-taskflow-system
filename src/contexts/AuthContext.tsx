
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  avatar?: string;
  permissions: {
    [key: string]: {
      view: boolean;
      edit: boolean;
      delete: boolean;
    }
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (module: string, action: 'view' | 'edit' | 'delete') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data - in a real app, this would come from an API
const MOCK_USERS = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@contgest.com',
    password: 'admin123',
    role: 'admin' as const,
    avatar: '',
    permissions: {
      companies: { view: true, edit: true, delete: true },
      people: { view: true, edit: true, delete: true },
      tasks: { view: true, edit: true, delete: true },
      users: { view: true, edit: true, delete: true },
    }
  },
  {
    id: '2',
    name: 'Employee User',
    email: 'employee@contgest.com',
    password: 'employee123',
    role: 'employee' as const,
    avatar: '',
    permissions: {
      companies: { view: true, edit: true, delete: false },
      people: { view: true, edit: true, delete: false },
      tasks: { view: true, edit: true, delete: false },
      users: { view: false, edit: false, delete: false },
    }
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  
  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('contgest_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    // In a real app, this would make an API call
    const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('contgest_user', JSON.stringify(userWithoutPassword));
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } else {
      toast.error('Email ou senha inválidos');
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('contgest_user');
    navigate('/login');
    toast.success('Logout realizado com sucesso');
  };

  const hasPermission = (module: string, action: 'view' | 'edit' | 'delete'): boolean => {
    if (!user) return false;
    return user.permissions[module]?.[action] || false;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, hasPermission }}>
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
