
import React from 'react';
import { Task, TaskColumnId } from '@/types/task';
import TaskCard from './TaskCard';

interface KanbanColumnProps {
  columnId: TaskColumnId;
  columnName: string;
  tasks: Task[];
  onMoveTask: (taskId: string, fromColumn: TaskColumnId, toColumn: TaskColumnId) => void;
  onViewDetails: (task: Task) => void;
}

const KanbanColumn = ({ columnId, columnName, tasks, onMoveTask, onViewDetails }: KanbanColumnProps) => {
  return (
    <div className="kanban-column">
      <h3 className="font-medium text-lg mb-4 flex items-center justify-between">
        {columnName}
        <span className="bg-gray-200 text-gray-700 text-xs font-medium rounded-full px-2 py-1">
          {tasks.length}
        </span>
      </h3>
      
      <div className="space-y-3">
        {tasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            columnId={columnId} 
            onMoveTask={onMoveTask} 
            onViewDetails={onViewDetails} 
          />
        ))}
        
        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhuma tarefa nesta coluna
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
