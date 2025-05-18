
import React from 'react';
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Filter, X } from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskFiltersProps {
  filters: {
    search: string;
    responsible: string;
    company: string;
    taskType: string;
    status: string;
    dateFrom: Date | undefined;
    dateTo: Date | undefined;
  };
  onFilterChange: (field: string, value: any) => void;
  onClearFilters: () => void;
  companies: string[];
  responsibles: string[];
  taskTypes: string[];
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ 
  filters, 
  onFilterChange,
  onClearFilters,
  companies,
  responsibles,
  taskTypes
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <div className="flex flex-wrap gap-3 items-end">
        <div className="w-full md:w-auto flex-1">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Pesquisar</label>
          <Input
            type="text"
            placeholder="Buscar tarefas..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full"
          />
        </div>

        <div className="w-full md:w-auto">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Responsável</label>
          <Select
            value={filters.responsible}
            onValueChange={(value) => onFilterChange('responsible', value)}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {responsibles.map((responsible) => (
                <SelectItem key={responsible} value={responsible}>{responsible}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-auto">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Empresa</label>
          <Select
            value={filters.company}
            onValueChange={(value) => onFilterChange('company', value)}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {companies.map((company) => (
                <SelectItem key={company} value={company}>{company}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-auto">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Tipo de Tarefa</label>
          <Select
            value={filters.taskType}
            onValueChange={(value) => onFilterChange('taskType', value)}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {taskTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-auto">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Status</label>
          <Select
            value={filters.status}
            onValueChange={(value) => onFilterChange('status', value)}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="todo">A Fazer</SelectItem>
              <SelectItem value="inProgress">Em Progresso</SelectItem>
              <SelectItem value="waitingClient">Aguardando Cliente</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-auto">
          <label className="text-sm font-medium text-gray-700 mb-1 block">De</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full md:w-[150px] justify-start text-left font-normal",
                  !filters.dateFrom && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateFrom ? format(filters.dateFrom, 'dd/MM/yyyy') : 'Escolha uma data'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.dateFrom}
                onSelect={(date) => onFilterChange('dateFrom', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="w-full md:w-auto">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Até</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full md:w-[150px] justify-start text-left font-normal",
                  !filters.dateTo && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateTo ? format(filters.dateTo, 'dd/MM/yyyy') : 'Escolha uma data'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.dateTo}
                onSelect={(date) => onFilterChange('dateTo', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="w-full md:w-auto flex gap-2">
          <Button variant="outline" size="icon" onClick={onClearFilters}>
            <X className="h-4 w-4" />
          </Button>
          <Button>
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;
