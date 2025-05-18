
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { Dialog } from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { CheckSquare, Plus } from 'lucide-react';
import { Task, TasksState, TaskColumnId, columns } from '@/types/task';
import { initialTasks } from '@/data/initialTasks';
import KanbanColumn from '@/components/tasks/KanbanColumn';
import TaskDetails from '@/components/tasks/TaskDetails';
import NewTaskForm from '@/components/tasks/NewTaskForm';
import TaskList from '@/components/tasks/TaskList';
import TaskFilters from '@/components/tasks/TaskFilters';
import TaskStatistics from '@/components/tasks/TaskStatistics';
import ExportOptions from '@/components/tasks/ExportOptions';

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
  
  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    responsible: '',
    company: '',
    taskType: '',
    status: '',
    dateFrom: undefined as Date | undefined,
    dateTo: undefined as Date | undefined,
  });
  
  // Extract unique companies, responsibles, and task types for filter options
  const companies = useMemo(() => {
    return Array.from(
      new Set(
        Object.values(tasks)
          .flat()
          .map((task) => task.company)
      )
    );
  }, [tasks]);
  
  const responsibles = useMemo(() => {
    return Array.from(
      new Set(
        Object.values(tasks)
          .flat()
          .filter((task) => task.responsible)
          .map((task) => task.responsible)
      )
    );
  }, [tasks]);
  
  const taskTypes = useMemo(() => {
    return Array.from(
      new Set(
        Object.values(tasks)
          .flat()
          .filter((task) => task.type)
          .map((task) => task.type)
      )
    );
  }, [tasks]);
  
  // Filter tasks based on selected filters
  const filteredTasks = useMemo(() => {
    const result = { ...tasks };
    
    // Apply filters to each column
    Object.keys(result).forEach((columnId) => {
      result[columnId as TaskColumnId] = result[columnId as TaskColumnId].filter((task) => {
        // Filter by search term
        if (filters.search && 
            !task.title.toLowerCase().includes(filters.search.toLowerCase()) &&
            !task.description.toLowerCase().includes(filters.search.toLowerCase())) {
          return false;
        }
        
        // Filter by responsible
        if (filters.responsible && task.responsible !== filters.responsible) {
          return false;
        }
        
        // Filter by company
        if (filters.company && task.company !== filters.company) {
          return false;
        }
        
        // Filter by task type
        if (filters.taskType && task.type !== filters.taskType) {
          return false;
        }
        
        // Filter by status (column)
        if (filters.status && columnId !== filters.status) {
          return false;
        }
        
        // Filter by date range
        if (filters.dateFrom) {
          const taskDate = new Date(task.dueDate);
          if (taskDate < filters.dateFrom) {
            return false;
          }
        }
        
        if (filters.dateTo) {
          const taskDate = new Date(task.dueDate);
          if (taskDate > filters.dateTo) {
            return false;
          }
        }
        
        return true;
      });
    });
    
    return result;
  }, [tasks, filters]);
  
  // Handle filter changes
  const handleFilterChange = (field: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      responsible: '',
      company: '',
      taskType: '',
      status: '',
      dateFrom: undefined,
      dateTo: undefined,
    });
  };
  
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
  const moveTask = (taskId: string, fromColumn: TaskColumnId, toColumn: TaskColumnId) => {
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
  
  // Handle export
  const handleExport = (format: 'pdf' | 'docx' | 'txt') => {
    console.log(`Exporting tasks in ${format} format`);
    // In a real application, this would call a backend API to generate the export
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center mb-1">
            <CheckSquare className="mr-2" />
            TaskGest
          </h1>
          <p className="text-sm text-muted-foreground">
            Sistema de gestão de tarefas e processos
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-3">
          <ExportOptions onExport={handleExport} />
          
          <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
            <Button onClick={() => setIsNewTaskDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Tarefa
            </Button>
            
            {isNewTaskDialogOpen && (
              <NewTaskForm 
                newTask={newTask}
                onTaskChange={handleNewTaskChange}
                onAddTask={handleAddTask}
                onCancel={() => setIsNewTaskDialogOpen(false)}
              />
            )}
          </Dialog>
        </div>
      </div>
      
      {/* Statistics Panels */}
      <TaskStatistics tasks={tasks} />
      
      {/* Filters */}
      <TaskFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        companies={companies}
        responsibles={responsibles}
        taskTypes={taskTypes}
      />
      
      {/* Task Views */}
      <Tabs defaultValue={viewType} onValueChange={setViewType} className="w-auto">
        <TabsList className="grid grid-cols-2 w-[200px]">
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="list">Lista</TabsTrigger>
        </TabsList>

        {/* Kanban View */}
        <TabsContent value="kanban" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {columns.map(column => (
              <KanbanColumn
                key={column.id}
                columnId={column.id}
                columnName={column.name}
                tasks={filteredTasks[column.id]}
                onMoveTask={moveTask}
                onViewDetails={viewTaskDetails}
              />
            ))}
          </div>
        </TabsContent>
        
        {/* List View */}
        <TabsContent value="list" className="mt-6">
          <TaskList 
            tasks={filteredTasks} 
            onViewDetails={viewTaskDetails} 
            onMoveTask={moveTask} 
          />
        </TabsContent>
      </Tabs>
      
      {/* Task Details Dialog */}
      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        {selectedTask && (
          <TaskDetails task={selectedTask} onClose={() => setSelectedTask(null)} />
        )}
      </Dialog>
    </div>
  );
};

export default Tasks;
