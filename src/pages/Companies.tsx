
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Building2, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Eye
} from 'lucide-react';

// Mock data
const companies = [
  {
    id: '1',
    name: 'Tech Solutions Ltda',
    cnpj: '12.345.678/0001-90',
    regime: 'Simples Nacional',
    status: 'Ativa',
  },
  {
    id: '2',
    name: 'Marketing Pro',
    cnpj: '23.456.789/0001-01',
    regime: 'Lucro Presumido',
    status: 'Ativa',
  },
  {
    id: '3',
    name: 'Design Lab',
    cnpj: '34.567.890/0001-12',
    regime: 'Simples Nacional',
    status: 'Ativa',
  },
  {
    id: '4',
    name: 'Connect Soft',
    cnpj: '45.678.901/0001-23',
    regime: 'Lucro Real',
    status: 'Suspensa',
  },
  {
    id: '5',
    name: 'Carvalho Investimentos',
    cnpj: '56.789.012/0001-34',
    regime: 'Lucro Presumido',
    status: 'Ativa',
  },
];

const Companies = () => {
  const { hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = 
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.cnpj.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || company.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold flex items-center">
          <Building2 className="mr-2" />
          Empresas
        </h1>
        
        {hasPermission('companies', 'edit') && (
          <Link to="/dashboard/companies/new">
            <Button className="w-full md:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Nova Empresa
            </Button>
          </Link>
        )}
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <Input
            placeholder="Buscar por nome ou CNPJ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="ativa">Ativa</SelectItem>
            <SelectItem value="suspensa">Suspensa</SelectItem>
            <SelectItem value="cancelada">Cancelada</SelectItem>
            <SelectItem value="extinta">Extinta</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Companies Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome / Razão Social</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead className="hidden md:table-cell">Regime Tributário</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((company) => (
                <TableRow key={company.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>{company.cnpj}</TableCell>
                  <TableCell className="hidden md:table-cell">{company.regime}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      company.status === 'Ativa' 
                        ? 'bg-green-100 text-green-800' 
                        : company.status === 'Suspensa'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {company.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right flex justify-end space-x-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/dashboard/companies/${company.id}`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Ver</span>
                      </Link>
                    </Button>
                    
                    {hasPermission('companies', 'edit') && (
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/dashboard/companies/${company.id}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Link>
                      </Button>
                    )}
                    
                    {hasPermission('companies', 'delete') && (
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
                  Nenhuma empresa encontrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Companies;
