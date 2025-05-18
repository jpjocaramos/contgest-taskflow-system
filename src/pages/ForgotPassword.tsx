
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Por favor, informe seu email');
      return;
    }
    
    setIsLoading(true);
    
    // In a real app, this would call an API
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast.success('Instruções de recuperação enviadas com sucesso!');
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-50 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <span className="text-3xl font-bold text-primary">Cont<span className="text-secondary">Gest</span></span>
        </div>
        
        <h1 className="text-2xl font-semibold text-center mb-6">Recuperar Senha</h1>
        
        {isSubmitted ? (
          <div className="text-center space-y-4">
            <div className="rounded-full bg-green-100 p-3 mx-auto w-fit">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-6 w-6 text-green-600"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h2 className="text-xl font-medium text-gray-900">Email enviado!</h2>
            <p className="text-gray-600">
              Enviamos instruções para recuperar sua senha para {email}. 
              Por favor, verifique sua caixa de entrada.
            </p>
            <div className="pt-4">
              <Link to="/login">
                <Button variant="link">Voltar para login</Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-6 text-center">
              Informe seu email e enviaremos instruções para redefinir sua senha.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Enviando...' : 'Enviar instruções'}
              </Button>
              
              <div className="text-center">
                <Link 
                  to="/login" 
                  className="text-sm text-primary hover:underline"
                >
                  Voltar para login
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
