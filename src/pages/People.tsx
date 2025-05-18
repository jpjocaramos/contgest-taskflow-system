
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Eye
} from 'lucide-react';

// Mock data
const people = [
  {
    id: '1',
    name: 'João Silva',
    cpf: '123.456.789-00',
    document: 'RG: 12.345.678-9',
    type: 'Sócio',
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    cpf: '987.654.321-00',
    document: 'CNH: 98765432100',
    type: 'Sócio',
  },
  {
    id: '3',
    name: 'Carlos Pereira',
    cpf: '456.789.123-00',
    document: 'RG: 45.678.912-3',
    type: 'Contador',
  },
  {
    id: '4',
    name: 'Ana Santos',
    cpf: '789.123.456-00',
    document: 'RG: 78.912.345-6',
    type: 'Funcionário',
  },
  {
    id: '5',
    name: 'Roberto Costa',
    cpf: '321.654.987-00',
    document: 'CNH: 32165498700',
    type: 'Sócio',
  },
];

const People = () => {
  const { hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredPeople = people.filter(person => {
    const searchLower = searchTerm.toLowerCase();
    return (
      person.name.toLowerCase().includes(searchLower) ||
      person.cpf.includes(searchTerm) ||
      person.document.toLowerCase().includes(searchLower)
    );
  });
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold flex items-center">
          <Users className="mr-2" />
          Pessoas
        </h1>
        
        {hasPermission('people', 'edit') && (
          <Link to="/dashboard/people/new">
            <Button className="w-full md:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Nova Pessoa
            </Button>
          </Link>
        )}
      </div>
      
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        <Input
          placeholder="Buscar por nome, CPF ou documento..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {/* People Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead className="hidden md:table-cell">Documento</TableHead>
              <TableHead className="hidden md:table-cell">Tipo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPeople.length > 0 ? (
              filteredPeople.map((person) => (
                <TableRow key={person.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{person.name}</TableCell>
                  <TableCell>{person.cpf}</TableCell>
                  <TableCell className="hidden md:table-cell">{person.document}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      person.type === 'Sócio' 
                        ? 'bg-blue-100 text-blue-800' 
                        : person.type === 'Contador'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {person.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-right flex justify-end space-x-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/dashboard/people/${person.id}`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Ver</span>
                      </Link>
                    </Button>
                    
                    {hasPermission('people', 'edit') && (
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/dashboard/people/${person.id}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Link>
                      </Button>
                    )}
                    
                    {hasPermission('people', 'delete') && (
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  Nenhuma pessoa encontrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default People;
