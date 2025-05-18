
import { useState } from 'react';
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
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold flex items-center">
          <CheckSquare className="mr-2" />
          TaskGest
        </h1>
        
        <div className="flex items-center gap-4">
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
                    tasks={tasks[column.id]}
                    onMoveTask={moveTask}
                    onViewDetails={viewTaskDetails}
                  />
                ))}
              </div>
            </TabsContent>
            
            {/* List View */}
            <TabsContent value="list" className="mt-6">
              <TaskList 
                tasks={tasks} 
                onViewDetails={viewTaskDetails} 
                onMoveTask={moveTask} 
              />
            </TabsContent>
          </Tabs>
          
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
