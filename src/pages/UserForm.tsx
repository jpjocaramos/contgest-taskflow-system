
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { User, ArrowLeft, Save } from 'lucide-react';

// Define schema for form validation
const formSchema = z.object({
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
  email: z.string().email({ message: 'Email inválido' }),
  tempPassword: z.string().optional(),
  birthDate: z.string().optional(),
  role: z.string({ required_error: 'Selecione uma função' }),
  permissions: z.record(z.string(), z.boolean()).optional(),
});

// Mock data for users
const mockUsers = [
  {
    id: '1',
    name: 'João da Silva',
    email: 'joao@contagest.com',
    birthDate: '1985-06-12',
    role: 'Administrador',
    permissions: {
      dashboard: true,
      companies: true,
      people: true,
      tasks: true,
      reports: true,
      users: true,
      settings: true,
    },
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    email: 'maria@contagest.com',
    birthDate: '1990-03-22',
    role: 'Contador',
    permissions: {
      dashboard: true,
      companies: true,
      people: true,
      tasks: true,
      reports: true,
      users: false,
      settings: false,
    },
  },
  {
    id: '3',
    name: 'Carlos Santos',
    email: 'carlos@contagest.com',
    birthDate: '1995-11-05',
    role: 'Assistente',
    permissions: {
      dashboard: true,
      companies: true,
      people: false,
      tasks: true,
      reports: false,
      users: false,
      settings: false,
    },
  },
];

// Available permissions to check
const availablePermissions = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'companies', label: 'Empresas' },
  { id: 'people', label: 'Pessoas' },
  { id: 'tasks', label: 'TaskGest' },
  { id: 'reports', label: 'Relatórios' },
  { id: 'users', label: 'Usuários' },
  { id: 'settings', label: 'Configurações' },
];

// Available roles
const roles = ['Administrador', 'Contador', 'Assistente'];

const UserForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const isEditing = !!id && id !== 'new';

  // Initialize form with React Hook Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      tempPassword: '',
      birthDate: '',
      role: '',
      permissions: {},
    },
  });

  useEffect(() => {
    // If editing, populate form with user data
    if (isEditing) {
      const user = mockUsers.find((u) => u.id === id);
      if (user) {
        form.reset({
          name: user.name,
          email: user.email,
          birthDate: user.birthDate,
          role: user.role,
          permissions: user.permissions,
        });
      } else {
        toast.error('Usuário não encontrado');
        navigate('/dashboard/users');
      }
    }
  }, [id, isEditing, navigate, form]);

  // Redirect if user doesn't have permission
  if (!hasPermission('users', 'update')) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-muted-foreground">Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success(isEditing ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!');
      console.log('Form data:', data);
      navigate('/dashboard/users');
    }, 1000);
  };

  return (
    <div className="container-app animate-fade-in py-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          size="icon" 
          className="mr-4"
          onClick={() => navigate('/dashboard/users')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <User className="h-6 w-6 mr-2" />
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
        </h1>
      </div>

      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>
            {isEditing ? 'Editar informações do usuário' : 'Cadastrar novo usuário'}
          </CardTitle>
          <CardDescription>
            {isEditing
              ? 'Atualize as informações e permissões do usuário.'
              : 'Preencha os dados para criar um novo usuário no sistema.'}
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {!isEditing && (
                  <FormField
                    control={form.control}
                    name="tempPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha Temporária</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Senha temporária"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          O usuário precisará alterar a senha no primeiro acesso.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Nascimento</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Data de nascimento"
                          type="date"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Função</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma função" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel className="text-base">Permissões</FormLabel>
                <FormDescription className="mt-0">
                  Selecione as páginas que este usuário poderá acessar.
                </FormDescription>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                  {availablePermissions.map((permission) => (
                    <FormField
                      key={permission.id}
                      control={form.control}
                      name={`permissions.${permission.id}`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            {permission.label}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="button" variant="outline" onClick={() => navigate('/dashboard/users')}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSaving} className="ml-auto">
                {isSaving ? 'Salvando...' : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEditing ? 'Atualizar Usuário' : 'Criar Usuário'}
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default UserForm;
