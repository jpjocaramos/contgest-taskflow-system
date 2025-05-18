import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  CheckSquare,
  Clock,
  AlertCircle,
  UserCheck,
  Building2
} from 'lucide-react';
import { TasksState } from '@/types/task';
import { isOverdue } from '@/utils/taskUtils';

interface TaskStatisticsProps {
  tasks: TasksState;
}

const TaskStatistics: React.FC<TaskStatisticsProps> = ({ tasks }) => {
  // Calculate statistics
  const totalTasks = Object.values(tasks).flat().length;
  const completedTasks = tasks.completed.length;
  const inProgressTasks = tasks.inProgress.length;
  const overdueTasksCount = Object.entries(tasks)
    .filter(([columnId]) => columnId !== 'completed')
    .flatMap(([_, columnTasks]) => columnTasks)
    .filter(task => isOverdue(task.dueDate))
    .length;
  
  const completionRate = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;

  // Get top responsible person
  const responsibleCounts: Record<string, number> = Object.values(tasks)
    .flat()
    .reduce((acc: Record<string, number>, task) => {
      if (task.responsible) {
        acc[task.responsible] = (acc[task.responsible] || 0) + 1;
      }
      return acc;
    }, {});
  
  const topResponsibleEntries = Object.entries(responsibleCounts)
    .sort(([, a], [, b]) => b - a);
  
  const topResponsible = topResponsibleEntries.length > 0 
    ? topResponsibleEntries[0][0] 
    : 'Não atribuído';
  
  // Get top company
  const companyCounts: Record<string, number> = Object.values(tasks)
    .flat()
    .reduce((acc: Record<string, number>, task) => {
      if (task.company) {
        acc[task.company] = (acc[task.company] || 0) + 1;
      }
      return acc;
    }, {});
  
  const topCompanyEntries = Object.entries(companyCounts)
    .sort(([, a], [, b]) => b - a);
  
  const topCompany = topCompanyEntries.length > 0 
    ? topCompanyEntries[0][0] 
    : 'Não disponível';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Progresso de Tarefas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckSquare className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{completionRate}%</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {completedTasks} de {totalTasks} concluídas
            </div>
          </div>
          <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-2 bg-green-500 rounded-full"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Status das Tarefas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <span className="text-xl font-bold">{inProgressTasks}</span>
              </div>
              <div className="text-xs text-muted-foreground">Em Progresso</div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="text-xl font-bold">{overdueTasksCount}</span>
              </div>
              <div className="text-xs text-muted-foreground">Em Atraso</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Distribuição
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5 text-purple-500" />
                <span className="text-sm font-medium truncate">{topResponsible}</span>
              </div>
              <div className="text-xs text-muted-foreground">Principal Responsável</div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-amber-500" />
                <span className="text-sm font-medium truncate">{topCompany}</span>
              </div>
              <div className="text-xs text-muted-foreground">Principal Empresa</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskStatistics;
