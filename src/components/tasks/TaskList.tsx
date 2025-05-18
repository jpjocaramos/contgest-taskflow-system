
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { Task, TasksState, TaskColumnId, priorityColors } from '@/types/task';
import { formatDate, isOverdue } from '@/utils/taskUtils';

interface TaskListProps {
  tasks: TasksState;
  onViewDetails: (task: Task) => void;
  onMoveTask: (taskId: string, fromColumn: TaskColumnId, toColumn: TaskColumnId) => void;
}

const TaskList = ({ tasks, onViewDetails, onMoveTask }: TaskListProps) => {
  const allTasks = Object.entries(tasks).flatMap(([columnId, columnTasks]) => 
    columnTasks.map(task => ({ columnId, task }))
  );

  return (
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
          {allTasks.map(({ columnId, task }) => (
            <tr key={task.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => onViewDetails(task)}>
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
                  priorityColors[task.priority]
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
                      onMoveTask(task.id, columnId as TaskColumnId, 'completed');
                    }}
                  >
                    Concluir
                  </Button>
                )}
              </td>
            </tr>
          ))}
          
          {allTasks.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-8 text-gray-500">
                Nenhuma tarefa encontrada
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
