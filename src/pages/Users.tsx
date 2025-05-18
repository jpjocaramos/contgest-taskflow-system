
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Edit, Trash2, Plus, Users as UsersIcon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Mock data for users
const mockUsers = [
  {
    id: '1',
    name: 'João da Silva',
    email: 'joao@contagest.com',
    role: 'Administrador',
    permissions: [
      { page: 'dashboard', value: true },
      { page: 'companies', value: true },
      { page: 'people', value: true },
      { page: 'tasks', value: true },
      { page: 'reports', value: true },
      { page: 'users', value: true },
      { page: 'settings', value: true },
    ],
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    email: 'maria@contagest.com',
    role: 'Contador',
    permissions: [
      { page: 'dashboard', value: true },
      { page: 'companies', value: true },
      { page: 'people', value: true },
      { page: 'tasks', value: true },
      { page: 'reports', value: true },
      { page: 'users', value: false },
      { page: 'settings', value: false },
    ],
  },
  {
    id: '3',
    name: 'Carlos Santos',
    email: 'carlos@contagest.com',
    role: 'Assistente',
    permissions: [
      { page: 'dashboard', value: true },
      { page: 'companies', value: true },
      { page: 'people', value: false },
      { page: 'tasks', value: true },
      { page: 'reports', value: false },
      { page: 'users', value: false },
      { page: 'settings', value: false },
    ],
  },
];

const Users = () => {
  const { hasPermission } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // Redirect if user doesn't have permission
  if (!hasPermission('users', 'view')) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-muted-foreground">Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = () => {
    if (userToDelete) {
      setUsers(users.filter((user) => user.id !== userToDelete));
      toast.success('Usuário excluído com sucesso!');
      setUserToDelete(null);
    }
  };

  return (
    <div className="container-app animate-fade-in py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <UsersIcon className="h-6 w-6 mr-2" />
          <h1 className="text-2xl font-bold">Usuários</h1>
        </div>
        <Button onClick={() => navigate('/dashboard/users/new')}>
          <Plus className="mr-2 h-4 w-4" /> Novo Usuário
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <Input
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={handleSearch}
            className="max-w-sm"
          />
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Função</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => navigate(`/dashboard/users/${user.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Ver</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => navigate(`/dashboard/users/${user.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setUserToDelete(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    Nenhum usuário encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Users;
