
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Save, Upload } from 'lucide-react';
import { toast } from 'sonner';

const UserConfig = () => {
  const [companyName, setCompanyName] = useState('');
  const [companyCNPJ, setCompanyCNPJ] = useState('');
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [letterhead, setLetterhead] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Format CNPJ as user types (XX.XXX.XXX/XXXX-XX)
  const formatCNPJ = (value: string) => {
    const cnpj = value.replace(/\D/g, '');
    
    if (cnpj.length <= 2) {
      return cnpj;
    }
    if (cnpj.length <= 5) {
      return `${cnpj.slice(0, 2)}.${cnpj.slice(2)}`;
    }
    if (cnpj.length <= 8) {
      return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5)}`;
    }
    if (cnpj.length <= 12) {
      return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8)}`;
    }
    return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12, 14)}`;
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCNPJ = formatCNPJ(e.target.value);
    setCompanyCNPJ(formattedCNPJ);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCompanyLogo(e.target.files[0]);
    }
  };

  const handleLetterheadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLetterhead(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Configurações salvas com sucesso!');
    }, 1000);
  };

  return (
    <div className="container-app animate-fade-in py-6">
      <div className="flex items-center mb-6">
        <Building2 className="h-6 w-6 mr-2" />
        <h1 className="text-2xl font-bold">Configurações do Usuário</h1>
      </div>

      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Dados da Empresa</CardTitle>
          <CardDescription>
            Configure as informações da sua empresa que serão usadas em relatórios e documentos.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Empresa Registrada</Label>
                <Input
                  id="companyName"
                  placeholder="Nome da empresa"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyCNPJ">CNPJ</Label>
                <Input
                  id="companyCNPJ"
                  placeholder="XX.XXX.XXX/XXXX-XX"
                  value={companyCNPJ}
                  onChange={handleCNPJChange}
                  maxLength={18}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyLogo">Logo da Empresa</Label>
              <div className="flex items-center gap-4">
                {companyLogo && (
                  <div className="h-16 w-16 rounded border overflow-hidden bg-gray-50 flex items-center justify-center">
                    <img
                      src={URL.createObjectURL(companyLogo)}
                      alt="Company Logo Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    id="companyLogo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById('companyLogo')?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {companyLogo ? 'Alterar Logo' : 'Carregar Logo'}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-1">
                    Recomendado: PNG ou SVG com fundo transparente
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="letterhead">Papel Timbrado</Label>
              <div className="flex items-center gap-4">
                {letterhead && (
                  <div className="flex items-center bg-gray-50 rounded border px-3 py-2">
                    <Building2 className="h-4 w-4 mr-2" />
                    <span className="text-sm truncate">{letterhead.name}</span>
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    id="letterhead"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleLetterheadChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById('letterhead')?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {letterhead ? 'Alterar Arquivo' : 'Carregar Arquivo'}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-1">
                    Formatos aceitos: PDF, DOC, DOCX
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSaving} className="ml-auto">
              {isSaving ? 'Salvando...' : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Configurações
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default UserConfig;
