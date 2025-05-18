
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-blue-50 to-indigo-50">
      <header className="bg-white shadow-sm">
        <div className="container-app py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">
            Cont<span className="text-secondary">Gest</span>
          </div>
          <Button onClick={() => navigate('/login')}>
            Acessar Sistema
          </Button>
        </div>
      </header>
      
      <main className="flex-1 container-app flex flex-col items-center justify-center py-12">
        <div className="text-center max-w-3xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Sistema Completo de Contabilidade
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            ContGest é uma plataforma SaaS de contabilidade moderna com foco em usabilidade
            e integração completa entre cadastros de empresas, pessoas e gerenciamento de tarefas contábeis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/login')}>
              Começar Agora
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/contact')}>
              Fale Conosco
            </Button>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-12 w-12 bg-primary/10 rounded-md flex items-center justify-center mb-4">
              <Building2 className="text-primary" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Cadastro Completo</h3>
            <p className="text-gray-600">
              Gestão integrada de empresas e pessoas com validações automáticas de dados fiscais.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-12 w-12 bg-primary/10 rounded-md flex items-center justify-center mb-4">
              <CheckSquare className="text-primary" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">TaskGest</h3>
            <p className="text-gray-600">
              Sistema Kanban para gerenciamento de tarefas contábeis com automações e templates.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-12 w-12 bg-primary/10 rounded-md flex items-center justify-center mb-4">
              <FileText className="text-primary" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Relatórios</h3>
            <p className="text-gray-600">
              Geração de relatórios customizados exportáveis em múltiplos formatos.
            </p>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-8">
        <div className="container-app">
          <div className="text-center">
            <p>© 2025 ContGest - Sistema de Contabilidade</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

function Building2(props: any) {
  return <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <path d="M6 22V2a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v20" />
    <path d="M6 12H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2" />
    <path d="M18 22h2a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-2" />
    <path d="M10 7h4" />
    <path d="M10 11h4" />
    <path d="M10 15h4" />
  </svg>;
}

function CheckSquare(props: any) {
  return <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <path d="m9 11 3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>;
}

function FileText(props: any) {
  return <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" x2="8" y1="13" y2="13" />
    <line x1="16" x2="8" y1="17" y2="17" />
    <line x1="10" x2="8" y1="9" y2="9" />
  </svg>;
}
