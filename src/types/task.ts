
// Task related interfaces and types
export interface Task {
  id: string;
  title: string;
  company: string;
  responsible: string;
  type: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
  completedDate?: string;
}

// Define the tasks state interface
export interface TasksState {
  todo: Task[];
  inProgress: Task[];
  waitingClient: Task[];
  completed: Task[];
}

// Task column configuration
export const columns = [
  { id: 'todo' as const, name: 'A Fazer' },
  { id: 'inProgress' as const, name: 'Em Progresso' },
  { id: 'waitingClient' as const, name: 'Aguardando Cliente' },
  { id: 'completed' as const, name: 'Concluído' },
];

// Task priority colors
export const priorityColors = {
  high: 'bg-red-100 text-red-700 border-red-300',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  low: 'bg-blue-100 text-blue-700 border-blue-300',
};

// Task column IDs type
export type TaskColumnId = 'todo' | 'inProgress' | 'waitingClient' | 'completed';
