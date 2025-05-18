
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  
  // Mock data for charts
  const taskData = [
    { name: 'Jan', completed: 45, pending: 15 },
    { name: 'Fev', completed: 50, pending: 18 },
    { name: 'Mar', completed: 35, pending: 20 },
    { name: 'Abr', completed: 60, pending: 10 },
    { name: 'Mai', completed: 48, pending: 12 },
    { name: 'Jun', completed: 52, pending: 14 },
  ];
  
  const regimeData = [
    { name: 'Simples Nacional', value: 60 },
    { name: 'Lucro Presumido', value: 25 },
    { name: 'Lucro Real', value: 15 },
  ];
  
  const COLORS = ['#3B82F6', '#6366F1', '#22C55E'];
  
  // Mock recent tasks
  const recentTasks = [
    { id: 1, title: 'Apuração mensal', company: 'Tech Solutions Ltda', deadline: '2025-05-20', status: 'pending' },
    { id: 2, title: 'Conciliação bancária', company: 'Connect Soft', deadline: '2025-05-19', status: 'completed' },
    { id: 3, title: 'Declaração DCTF', company: 'Design Lab', deadline: '2025-05-25', status: 'pending' },
    { id: 4, title: 'Folha de pagamento', company: 'Marketing Pro', deadline: '2025-05-22', status: 'pending' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Bem-vindo, {user?.name}</p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-1.5">
              <p className="text-sm font-medium text-muted-foreground">Total de Empresas</p>
              <p className="text-3xl font-bold">48</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-1.5">
              <p className="text-sm font-medium text-muted-foreground">Total de Pessoas</p>
              <p className="text-3xl font-bold">124</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-1.5">
              <p className="text-sm font-medium text-muted-foreground">Tarefas Pendentes</p>
              <p className="text-3xl font-bold text-warning">15</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-1.5">
              <p className="text-sm font-medium text-muted-foreground">Tarefas Concluídas</p>
              <p className="text-3xl font-bold text-success">42</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tarefas por Mês</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" name="Concluídas" fill="#22C55E" />
                <Bar dataKey="pending" name="Pendentes" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Regimes Tributários</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={regimeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {regimeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} empresas`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Tasks */}
      <div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Tarefas Recentes</CardTitle>
            <Link to="/dashboard/tasks">
              <Button variant="outline" size="sm">Ver Todas</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-left">Tarefa</th>
                    <th className="py-3 px-4 text-left">Empresa</th>
                    <th className="py-3 px-4 text-left">Prazo</th>
                    <th className="py-3 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTasks.map((task) => (
                    <tr key={task.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-4">{task.title}</td>
                      <td className="py-3 px-4">{task.company}</td>
                      <td className="py-3 px-4">{formatDate(task.deadline)}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          task.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {task.status === 'completed' ? 'Concluída' : 'Pendente'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

export default Dashboard;
