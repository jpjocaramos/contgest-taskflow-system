
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

interface ExportOptionsProps {
  onExport: (format: 'pdf' | 'docx' | 'txt') => void;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ onExport }) => {
  const [exporting, setExporting] = useState(false);

  const handleExport = (format: 'pdf' | 'docx' | 'txt') => {
    setExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      onExport(format);
      setExporting(false);
      toast.success(`Relatório exportado em formato ${format.toUpperCase()} com sucesso!`);
    }, 1000);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={exporting}>
          {exporting ? <Check className="mr-2 h-4 w-4" /> : <FileText className="mr-2 h-4 w-4" />}
          {exporting ? 'Exportando...' : 'Exportar Relatório'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          <FileText className="mr-2 h-4 w-4" />
          <span>PDF</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('docx')}>
          <FileText className="mr-2 h-4 w-4" />
          <span>Word (DOCX)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('txt')}>
          <FileText className="mr-2 h-4 w-4" />
          <span>Texto (TXT)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportOptions;
