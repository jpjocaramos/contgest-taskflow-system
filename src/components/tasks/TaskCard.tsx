
import React from 'react';
import { Button } from '@/components/ui/button';
import { Building2, User, Calendar, AlertCircle } from 'lucide-react';
import { Task, TaskColumnId, priorityColors } from '@/types/task';
import { formatDate, isOverdue } from '@/utils/taskUtils';

interface TaskCardProps {
  task: Task;
  columnId: TaskColumnId;
  onMoveTask: (taskId: string, fromColumn: TaskColumnId, toColumn: TaskColumnId) => void;
  onViewDetails: (task: Task) => void;
}

const TaskCard = ({ task, columnId, onMoveTask, onViewDetails }: TaskCardProps) => {
  return (
    <div 
      className="kanban-card"
      onClick={() => onViewDetails(task)}
    >
      <div className="flex justify-between mb-2">
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
          priorityColors[task.priority]
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
        
        <span className={`flex items-center ${isOverdue(task.dueDate) && columnId !== 'completed' ? 'text-red-500' : ''}`}>
          {isOverdue(task.dueDate) && columnId !== 'completed' ? (
            <AlertCircle size={14} className="mr-1" />
          ) : (
            <Calendar size={14} className="mr-1" />
          )}
          {formatDate(task.dueDate)}
        </span>
      </div>
      
      {columnId !== 'completed' && (
        <div className="mt-3 pt-3 border-t flex justify-end gap-2">
          {columnId !== 'inProgress' && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={(e) => {
                e.stopPropagation();
                onMoveTask(task.id, columnId, 'inProgress');
              }}
            >
              Iniciar
            </Button>
          )}
          
          {columnId !== 'waitingClient' && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={(e) => {
                e.stopPropagation();
                onMoveTask(task.id, columnId, 'waitingClient');
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
              onMoveTask(task.id, columnId, 'completed');
            }}
          >
            Concluir
          </Button>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
