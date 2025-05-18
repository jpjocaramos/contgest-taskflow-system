
import React from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Task } from '@/types/task';

interface NewTaskFormProps {
  newTask: Omit<Task, 'id' | 'completedDate'>;
  onTaskChange: (field: string, value: string) => void;
  onAddTask: () => void;
  onCancel: () => void;
}

const NewTaskForm = ({ newTask, onTaskChange, onAddTask, onCancel }: NewTaskFormProps) => {
  return (
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
            onChange={(e) => onTaskChange('title', e.target.value)} 
            placeholder="Título da tarefa"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="company">Empresa*</Label>
            <Select 
              value={newTask.company} 
              onValueChange={(value) => onTaskChange('company', value)}
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
              onValueChange={(value) => onTaskChange('responsible', value)}
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
              onValueChange={(value) => onTaskChange('type', value)}
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
              onChange={(e) => onTaskChange('dueDate', e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="priority">Prioridade</Label>
          <Select 
            value={newTask.priority} 
            onValueChange={(value) => onTaskChange('priority', value as 'high' | 'medium' | 'low')}
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
            onChange={(e) => onTaskChange('description', e.target.value)} 
            placeholder="Descrição da tarefa"
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="button" onClick={onAddTask}>
          Adicionar Tarefa
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default NewTaskForm;
