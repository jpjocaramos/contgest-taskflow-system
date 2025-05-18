
import { TasksState } from '../types/task';

// Mock task data
export const initialTasks: TasksState = {
  todo: [
    {
      id: '1',
      title: 'Declaração mensal',
      company: 'Tech Solutions Ltda',
      responsible: 'João Silva',
      type: 'Apuração',
      dueDate: '2025-05-25',
      priority: 'high',
      description: 'Preencher declaração mensal do Simples Nacional',
    },
    {
      id: '2',
      title: 'Folha de pagamento',
      company: 'Marketing Pro',
      responsible: 'Maria Oliveira',
      type: 'Folha',
      dueDate: '2025-05-22',
      priority: 'medium',
      description: 'Processar folha de pagamento dos funcionários',
    },
  ],
  inProgress: [
    {
      id: '3',
      title: 'Conciliação bancária',
      company: 'Design Lab',
      responsible: 'João Silva',
      type: 'Contabilidade',
      dueDate: '2025-05-20',
      priority: 'medium',
      description: 'Conciliar extratos bancários com registros contábeis',
    },
  ],
  waitingClient: [
    {
      id: '4',
      title: 'Documentação societária',
      company: 'Connect Soft',
      responsible: 'Maria Oliveira',
      type: 'Societário',
      dueDate: '2025-05-30',
      priority: 'low',
      description: 'Aguardando documentação para alteração contratual',
    },
  ],
  completed: [
    {
      id: '5',
      title: 'Balanço patrimonial',
      company: 'Carvalho Investimentos',
      responsible: 'João Silva',
      type: 'Contabilidade',
      dueDate: '2025-05-15',
      priority: 'high',
      description: 'Elaboração do balanço patrimonial anual',
      completedDate: '2025-05-14',
    },
  ],
};
