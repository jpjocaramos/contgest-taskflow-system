
import React from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Building2, User, Calendar, CheckCircle } from 'lucide-react';
import { Task, priorityColors } from '@/types/task';
import { formatDate, isOverdue } from '@/utils/taskUtils';

interface TaskDetailsProps {
  task: Task;
  onClose: () => void;
}

const TaskDetails = ({ task, onClose }: TaskDetailsProps) => {
  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>{task.title}</DialogTitle>
        <DialogDescription>
          {task.description}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Empresa</p>
            <p className="flex items-center mt-1">
              <Building2 size={16} className="mr-1 text-gray-500" />
              {task.company}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Responsável</p>
            <p className="flex items-center mt-1">
              <User size={16} className="mr-1 text-gray-500" />
              {task.responsible || 'Não atribuído'}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Tipo</p>
            <p className="mt-1">{task.type || 'Não definido'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Prioridade</p>
            <p className="mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                priorityColors[task.priority]
              }`}>
                {task.priority === 'high' 
                  ? 'Alta' 
                  : task.priority === 'medium' 
                  ? 'Média' 
                  : 'Baixa'}
              </span>
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Prazo</p>
            <p className={`flex items-center mt-1 ${isOverdue(task.dueDate) ? 'text-red-500' : ''}`}>
              <Calendar size={16} className="mr-1 text-gray-500" />
              {formatDate(task.dueDate)}
              {isOverdue(task.dueDate) && !task.completedDate && (
                <span className="ml-2 text-xs text-red-500">(Atrasado)</span>
              )}
            </p>
          </div>
          {task.completedDate && (
            <div>
              <p className="text-sm font-medium text-gray-500">Concluída em</p>
              <p className="flex items-center mt-1 text-green-600">
                <CheckCircle size={16} className="mr-1" />
                {formatDate(task.completedDate)}
              </p>
            </div>
          )}
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Fechar
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default TaskDetails;
