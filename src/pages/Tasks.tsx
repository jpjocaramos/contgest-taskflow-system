
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  CheckSquare,
  Plus,
  Calendar,
  User,
  Building2,
  Clock,
  AlertCircle,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

// Define the Task interface
interface Task {
  id: string;
  title: string;
  company: string;
  responsible: string;
  type: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
  completedDate?: string; // Make completedDate optional with '?'
}

// Define the tasks state interface
interface TasksState {
  todo: Task[];
  inProgress: Task[];
  waitingClient: Task[];
  completed: Task[];
}

// Mock task data
const initialTasks: TasksState = {
  todo: [
    {
      id: '1',
      title: 'Declaração mensal',
      company: 'Tech Solutions Ltda',
      responsible: 'João Silva',
      type: 'Apuração',
      dueDate: '2025-05-25',
      priority: 'high',
      description: 'Preencher declaração mensal do Simples Nacional',
    },
    {
      id: '2',
      title: 'Folha de pagamento',
      company: 'Marketing Pro',
      responsible: 'Maria Oliveira',
      type: 'Folha',
      dueDate: '2025-05-22',
      priority: 'medium',
      description: 'Processar folha de pagamento dos funcionários',
    },
  ],
  inProgress: [
    {
      id: '3',
      title: 'Conciliação bancária',
      company: 'Design Lab',
      responsible: 'João Silva',
      type: 'Contabilidade',
      dueDate: '2025-05-20',
      priority: 'medium',
      description: 'Conciliar extratos bancários com registros contábeis',
    },
  ],
  waitingClient: [
    {
      id: '4',
      title: 'Documentação societária',
      company: 'Connect Soft',
      responsible: 'Maria Oliveira',
      type: 'Societário',
      dueDate: '2025-05-30',
      priority: 'low',
      description: 'Aguardando documentação para alteração contratual',
    },
  ],
  completed: [
    {
      id: '5',
      title: 'Balanço patrimonial',
      company: 'Carvalho Investimentos',
      responsible: 'João Silva',
      type: 'Contabilidade',
      dueDate: '2025-05-15',
      priority: 'high',
      description: 'Elaboração do balanço patrimonial anual',
      completedDate: '2025-05-14',
    },
  ],
};

// Task columns configuration
const columns = [
  { id: 'todo', name: 'A Fazer' },
  { id: 'inProgress', name: 'Em Progresso' },
  { id: 'waitingClient', name: 'Aguardando Cliente' },
  { id: 'completed', name: 'Concluído' },
];

// Task priority colors
const priorityColors = {
  high: 'bg-red-100 text-red-700 border-red-300',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  low: 'bg-blue-100 text-blue-700 border-blue-300',
};

const Tasks = () => {
  const [tasks, setTasks] = useState<TasksState>(initialTasks);
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<Omit<Task, 'id' | 'completedDate'>>({
    title: '',
    company: '',
    responsible: '',
    type: '',
    dueDate: '',
    priority: 'medium',
    description: '',
  });
  const [viewType, setViewType] = useState('kanban');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // Handle new task dialog form
  const handleNewTaskChange = (field: string, value: string) => {
    setNewTask(prev => ({ ...prev, [field]: value }) as typeof newTask);
  };
  
  // Add a new task
  const handleAddTask = () => {
    if (!newTask.title || !newTask.company || !newTask.dueDate) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }
    
    const newTaskObj: Task = {
      id: Date.now().toString(),
      ...newTask,
    };
    
    setTasks(prev => ({
      ...prev,
      todo: [...prev.todo, newTaskObj],
    }));
    
    setNewTask({
      title: '',
      company: '',
      responsible: '',
      type: '',
      dueDate: '',
      priority: 'medium',
      description: '',
    });
    
    setIsNewTaskDialogOpen(false);
    toast.success('Tarefa adicionada com sucesso!');
  };
  
  // Move a task to a different column
  const moveTask = (taskId: string, fromColumn: keyof TasksState, toColumn: keyof TasksState) => {
    const taskIndex = tasks[fromColumn].findIndex(task => task.id === taskId);
    if (taskIndex === -1) return;
    
    const taskToMove = tasks[fromColumn][taskIndex];
    const updatedTask = { ...taskToMove };
    
    // Add completedDate if moving to completed column
    if (toColumn === 'completed') {
      updatedTask.completedDate = new Date().toISOString().slice(0, 10);
    } else {
      // Remove completedDate if moving from completed column
      delete updatedTask.completedDate;
    }
    
    setTasks(prev => ({
      ...prev,
      [fromColumn]: prev[fromColumn].filter(task => task.id !== taskId),
      [toColumn]: [...prev[toColumn], updatedTask],
    }));
    
    toast.success('Tarefa movida com sucesso!');
  };
  
  // View task details
  const viewTaskDetails = (task: Task) => {
    setSelectedTask(task);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  // Check if a task is overdue
  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && dueDate !== '';
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold flex items-center">
          <CheckSquare className="mr-2" />
          TaskGest
        </h1>
        
        <div className="flex items-center gap-4">
          <Tabs value={viewType} onValueChange={setViewType} className="w-auto">
            <TabsList className="grid grid-cols-2 w-[200px]">
              <TabsTrigger value="kanban">Kanban</TabsTrigger>
              <TabsTrigger value="list">Lista</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Tarefa
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Nova Tarefa</DialogTitle>
                <DialogDescription>
                  Preencha os dados para criar uma nova tarefa.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Título*</Label>
                  <Input 
                    id="title" 
                    value={newTask.title} 
                    onChange={(e) => handleNewTaskChange('title', e.target.value)} 
                    placeholder="Título da tarefa"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="company">Empresa*</Label>
                    <Select 
                      value={newTask.company} 
                      onValueChange={(value) => handleNewTaskChange('company', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tech Solutions Ltda">Tech Solutions Ltda</SelectItem>
                        <SelectItem value="Marketing Pro">Marketing Pro</SelectItem>
                        <SelectItem value="Design Lab">Design Lab</SelectItem>
                        <SelectItem value="Connect Soft">Connect Soft</SelectItem>
                        <SelectItem value="Carvalho Investimentos">Carvalho Investimentos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="responsible">Responsável</Label>
                    <Select 
                      value={newTask.responsible} 
                      onValueChange={(value) => handleNewTaskChange('responsible', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="João Silva">João Silva</SelectItem>
                        <SelectItem value="Maria Oliveira">Maria Oliveira</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select 
                      value={newTask.type} 
                      onValueChange={(value) => handleNewTaskChange('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Apuração">Apuração</SelectItem>
                        <SelectItem value="Folha">Folha</SelectItem>
                        <SelectItem value="Contabilidade">Contabilidade</SelectItem>
                        <SelectItem value="Fiscal">Fiscal</SelectItem>
                        <SelectItem value="Societário">Societário</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="dueDate">Prazo*</Label>
                    <Input 
                      id="dueDate" 
                      type="date" 
                      value={newTask.dueDate} 
                      onChange={(e) => handleNewTaskChange('dueDate', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="priority">Prioridade</Label>
                  <Select 
                    value={newTask.priority} 
                    onValueChange={(value) => handleNewTaskChange('priority', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="low">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input 
                    id="description" 
                    value={newTask.description} 
                    onChange={(e) => handleNewTaskChange('description', e.target.value)} 
                    placeholder="Descrição da tarefa"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsNewTaskDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="button" onClick={handleAddTask}>
                  Adicionar Tarefa
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Task Details Dialog */}
      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        {selectedTask && (
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{selectedTask.title}</DialogTitle>
              <DialogDescription>
                {selectedTask.description}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Empresa</p>
                  <p className="flex items-center mt-1">
                    <Building2 size={16} className="mr-1 text-gray-500" />
                    {selectedTask.company}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Responsável</p>
                  <p className="flex items-center mt-1">
                    <User size={16} className="mr-1 text-gray-500" />
                    {selectedTask.responsible || 'Não atribuído'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Tipo</p>
                  <p className="mt-1">{selectedTask.type || 'Não definido'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Prioridade</p>
                  <p className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      priorityColors[selectedTask.priority as keyof typeof priorityColors]
                    }`}>
                      {selectedTask.priority === 'high' 
                        ? 'Alta' 
                        : selectedTask.priority === 'medium' 
                        ? 'Média' 
                        : 'Baixa'}
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Prazo</p>
                  <p className={`flex items-center mt-1 ${isOverdue(selectedTask.dueDate) ? 'text-red-500' : ''}`}>
                    <Calendar size={16} className="mr-1 text-gray-500" />
                    {formatDate(selectedTask.dueDate)}
                    {isOverdue(selectedTask.dueDate) && !selectedTask.completedDate && (
                      <span className="ml-2 text-xs text-red-500">(Atrasado)</span>
                    )}
                  </p>
                </div>
                {selectedTask.completedDate && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Concluída em</p>
                    <p className="flex items-center mt-1 text-green-600">
                      <CheckCircle size={16} className="mr-1" />
                      {formatDate(selectedTask.completedDate)}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setSelectedTask(null)}>
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
      
      {/* Kanban View */}
      <TabsContent value="kanban" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map(column => (
            <div key={column.id} className="kanban-column">
              <h3 className="font-medium text-lg mb-4 flex items-center justify-between">
                {column.name}
                <span className="bg-gray-200 text-gray-700 text-xs font-medium rounded-full px-2 py-1">
                  {tasks[column.id as keyof typeof tasks].length}
                </span>
              </h3>
              
              <div className="space-y-3">
                {tasks[column.id as keyof typeof tasks].map(task => (
                  <div 
                    key={task.id}
                    className="kanban-card"
                    onClick={() => viewTaskDetails(task)}
                  >
                    <div className="flex justify-between mb-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        priorityColors[task.priority as keyof typeof priorityColors]
                      }`}>
                        {task.priority === 'high' 
                          ? 'Alta' 
                          : task.priority === 'medium' 
                          ? 'Média' 
                          : 'Baixa'}
                      </span>
                      {task.type && (
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">
                          {task.type}
                        </span>
                      )}
                    </div>
                    
                    <h4 className="font-medium mb-1">{task.title}</h4>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {task.description || 'Sem descrição'}
                    </p>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Building2 size={14} className="mr-1" />
                      {task.company}
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      {task.responsible && (
                        <span className="flex items-center">
                          <User size={14} className="mr-1" />
                          {task.responsible}
                        </span>
                      )}
                      
                      <span className={`flex items-center ${isOverdue(task.dueDate) && column.id !== 'completed' ? 'text-red-500' : ''}`}>
                        {isOverdue(task.dueDate) && column.id !== 'completed' ? (
                          <AlertCircle size={14} className="mr-1" />
                        ) : (
                          <Calendar size={14} className="mr-1" />
                        )}
                        {formatDate(task.dueDate)}
                      </span>
                    </div>
                    
                    {column.id !== 'completed' && (
                      <div className="mt-3 pt-3 border-t flex justify-end gap-2">
                        {column.id !== 'inProgress' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={(e) => {
                              e.stopPropagation();
                              moveTask(task.id, column.id, 'inProgress');
                            }}
                          >
                            Iniciar
                          </Button>
                        )}
                        
                        {column.id !== 'waitingClient' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={(e) => {
                              e.stopPropagation();
                              moveTask(task.id, column.id, 'waitingClient');
                            }}
                          >
                            Aguardando
                          </Button>
                        )}
                        
                        <Button 
                          size="sm"
                          variant="outline"
                          className="text-green-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveTask(task.id, column.id, 'completed');
                          }}
                        >
                          Concluir
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                
                {tasks[column.id as keyof typeof tasks].length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhuma tarefa nesta coluna
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </TabsContent>
      
      {/* List View */}
      <TabsContent value="list" className="mt-6">
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-4 text-left">Título</th>
                <th className="py-3 px-4 text-left">Empresa</th>
                <th className="py-3 px-4 text-left">Responsável</th>
                <th className="py-3 px-4 text-left">Prazo</th>
                <th className="py-3 px-4 text-left">Prioridade</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(tasks).flatMap(([columnId, columnTasks]) => 
                columnTasks.map(task => (
                  <tr key={task.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => viewTaskDetails(task)}>
                    <td className="py-3 px-4 font-medium">{task.title}</td>
                    <td className="py-3 px-4">{task.company}</td>
                    <td className="py-3 px-4">{task.responsible || 'Não atribuído'}</td>
                    <td className="py-3 px-4">
                      <span className={`flex items-center ${isOverdue(task.dueDate) && columnId !== 'completed' ? 'text-red-500' : ''}`}>
                        {formatDate(task.dueDate)}
                        {isOverdue(task.dueDate) && columnId !== 'completed' && (
                          <AlertTriangle size={14} className="ml-1" />
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        priorityColors[task.priority as keyof typeof priorityColors]
                      }`}>
                        {task.priority === 'high' 
                          ? 'Alta' 
                          : task.priority === 'medium' 
                          ? 'Média' 
                          : 'Baixa'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        columnId === 'todo'
                          ? 'bg-gray-100 text-gray-800'
                          : columnId === 'inProgress'
                          ? 'bg-blue-100 text-blue-800'
                          : columnId === 'waitingClient'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {columnId === 'todo'
                          ? 'A Fazer'
                          : columnId === 'inProgress'
                          ? 'Em Progresso'
                          : columnId === 'waitingClient'
                          ? 'Aguardando Cliente'
                          : 'Concluído'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {columnId !== 'completed' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-green-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveTask(task.id, columnId, 'completed');
                          }}
                        >
                          Concluir
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
              
              {Object.values(tasks).flat().length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    Nenhuma tarefa encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </TabsContent>
    </div>
  );
};

export default Tasks;
