
// Format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

// Check if a task is overdue
export const isOverdue = (dueDate: string): boolean => {
  return new Date(dueDate) < new Date() && dueDate !== '';
};
