import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Sample company data (in a real app, this would come from an API)
const companyData = {
  id: '1',
  cnpj: '12.345.678/0001-90',
  nire: '12345678901',
  razaoSocial: 'Tech Solutions Ltda',
  nomeFantasia: 'TechSol',
  inscricaoEstadual: '123456789',
  inscricaoEstadualIsento: false,
  ufEstadual: 'SP',
  inscricaoMunicipal: '987654321',
  dataAbertura: '2020-01-15',
  regimeTributario: 'simplesNacional',
  tipoSociedade: 'ltda',
  endereco: {
    cep: '01234-567',
    logradouro: 'Av. Paulista',
    numero: '1000',
    complemento: 'Sala 123',
    bairro: 'Bela Vista',
    cidade: 'São Paulo',
    uf: 'SP',
  },
  cnaePrincipal: {
    codigo: '62.01-5-01',
    descricao: 'Desenvolvimento de programas de computador sob encomenda',
  },
  cnaesSecundarios: [
    {
      codigo: '62.02-3-00',
      descricao: 'Desenvolvimento e licenciamento de programas de computador customizáveis',
    },
  ],
  contato: {
    telefoneFixo: '(11) 3456-7890',
    celular: '(11) 98765-4321',
    email: 'contato@techsolutions.com',
  },
  socios: [
    {
      id: '1',
      nome: 'João Silva',
      cpf: '123.456.789-00',
      participacao: 60,
      responsavelRfb: true,
      responsavelAdministrativo: true,
    },
    {
      id: '2',
      nome: 'Maria Oliveira',
      cpf: '987.654.321-00',
      participacao: 40,
      responsavelRfb: false,
      responsavelAdministrativo: false,
    },
  ],
  capitalSocial: {
    valorTotal: 100000,
    valorCota: 1000,
    valorIntegralizado: 60000,
    valorAIntegralizar: 40000,
    formaIntegralizacao: 'Dinheiro',
    dataPrevista: '2023-12-31',
  },
  tipoAtividade: 'servicosSoftware',
  historicoTributario: [
    {
      inicioVigencia: '2020-01-15',
      fimVigencia: '2021-12-31',
      regime: 'mei',
    },
    {
      inicioVigencia: '2022-01-01',
      fimVigencia: null,
      regime: 'simplesNacional',
    },
  ],
  prestacaoServicos: {
    dataInicio: '2020-02-01',
    honorarioMensal: 1200,
    obrigacoesAnuais: 3600,
  },
  acessos: [
    {
      sistema: 'Portal e-CAC',
      login: 'techsolutions',
      senha: '**********',
      dataAlteracao: '2023-01-15',
    },
    {
      sistema: 'Sistema Prefeitura',
      login: 'tech123',
      senha: '**********',
      dataAlteracao: '2023-03-20',
    },
  ],
  situacao: 'Ativa',
  historicoCadastro: [
    {
      data: '2023-04-10',
      campo: 'Regime Tributário',
      valorAntigo: 'MEI',
      valorNovo: 'Simples Nacional',
      usuario: 'João Silva',
    },
    {
      data: '2023-03-15',
      campo: 'Telefone',
      valorAntigo: '(11) 1234-5678',
      valorNovo: '(11) 3456-7890',
      usuario: 'Maria Oliveira',
    },
  ],
};

// Form schema definition
const formSchema = z.object({
  cnpj: z.string().min(18, "CNPJ é obrigatório").max(18),
  nire: z.string().optional(),
  razaoSocial: z.string().min(1, "Razão Social é obrigatória"),
  nomeFantasia: z.string().optional(),
  inscricaoEstadual: z.string().optional(),
  inscricaoEstadualIsento: z.boolean().optional(),
  ufEstadual: z.string().optional(),
  inscricaoMunicipal: z.string().optional(),
  dataAbertura: z.string().optional(),
  regimeTributario: z.string().min(1, "Regime Tributário é obrigatório"),
  tipoSociedade: z.string().min(1, "Tipo de Sociedade é obrigatório"),
  // Additional fields would be validated here
});

// CNPJ mask function
const applyCnpjMask = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

const CompanyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cnpj: '',
      razaoSocial: '',
      regimeTributario: '',
      tipoSociedade: '',
    },
  });
  
  // Load company data if editing
  useEffect(() => {
    if (isEditing) {
      // In a real app, fetch data from API
      form.reset({
        cnpj: companyData.cnpj,
        nire: companyData.nire,
        razaoSocial: companyData.razaoSocial,
        nomeFantasia: companyData.nomeFantasia,
        inscricaoEstadual: companyData.inscricaoEstadual,
        inscricaoEstadualIsento: companyData.inscricaoEstadualIsento,
        ufEstadual: companyData.ufEstadual,
        inscricaoMunicipal: companyData.inscricaoMunicipal,
        dataAbertura: companyData.dataAbertura,
        regimeTributario: companyData.regimeTributario,
        tipoSociedade: companyData.tipoSociedade,
      });
    }
  }, [isEditing, form]);
  
  // Handle CNPJ input with mask
  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = applyCnpjMask(e.target.value);
    form.setValue('cnpj', value);
  };
  
  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      console.log('Form values:', values);
      
      // In a real app, this would be an API call
      setTimeout(() => {
        setIsLoading(false);
        toast.success(isEditing ? 'Empresa atualizada com sucesso!' : 'Empresa cadastrada com sucesso!');
        navigate('/dashboard/companies');
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      toast.error('Erro ao salvar empresa');
      console.error('Error saving company:', error);
    }
  };
  
  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">{isEditing ? 'Editar Empresa' : 'Nova Empresa'}</h1>
        <p className="text-muted-foreground">
          {isEditing ? 'Atualize as informações da empresa' : 'Preencha os dados para cadastrar uma nova empresa'}
        </p>
      </div>
      
      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
          <TabsTrigger value="address">Endereço</TabsTrigger>
          <TabsTrigger value="contact">Contato</TabsTrigger>
          <TabsTrigger value="partners">Sócios</TabsTrigger>
          <TabsTrigger value="finance">Capital Social</TabsTrigger>
          <TabsTrigger value="tax">Tributação</TabsTrigger>
          <TabsTrigger value="service">Serviços</TabsTrigger>
          <TabsTrigger value="access">Acessos</TabsTrigger>
        </TabsList>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Gerais</CardTitle>
                  <CardDescription>Dados de identificação da empresa</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="cnpj"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CNPJ*</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="XX.XXX.XXX/XXXX-XX" 
                              {...field}
                              onChange={handleCnpjChange}
                              maxLength={18}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="nire"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>NIRE / Cartório</FormLabel>
                          <FormControl>
                            <Input placeholder="Nº de Registro" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="razaoSocial"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Razão Social*</FormLabel>
                          <FormControl>
                            <Input placeholder="Razão Social completa" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="nomeFantasia"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Fantasia</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome Fantasia" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="inscricaoEstadual"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Inscrição Estadual</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Inscrição Estadual" 
                              {...field} 
                              disabled={form.watch('inscricaoEstadualIsento')}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="inscricaoEstadualIsento"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-end space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                if (checked) {
                                  form.setValue('inscricaoEstadual', '');
                                }
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Isento de Inscrição Estadual</FormLabel>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="ufEstadual"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>UF Estadual</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'].map((uf) => (
                                <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="inscricaoMunicipal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Inscrição Municipal</FormLabel>
                          <FormControl>
                            <Input placeholder="Inscrição Municipal" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dataAbertura"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Abertura</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="regimeTributario"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Regime Tributário Atual*</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="simplesNacional">Simples Nacional</SelectItem>
                              <SelectItem value="mei">MEI</SelectItem>
                              <SelectItem value="lucroPresumido">Lucro Presumido</SelectItem>
                              <SelectItem value="lucroReal">Lucro Real</SelectItem>
                              <SelectItem value="imune">Imune</SelectItem>
                              <SelectItem value="isento">Isento</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="tipoSociedade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Sociedade*</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="mei">MEI</SelectItem>
                              <SelectItem value="ei">EI</SelectItem>
                              <SelectItem value="eireli">EIRELI</SelectItem>
                              <SelectItem value="ltda">LTDA</SelectItem>
                              <SelectItem value="sa">S.A.</SelectItem>
                              <SelectItem value="scp">SCP</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Other tabs would be implemented similarly */}
            <TabsContent value="address" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Endereço</CardTitle>
                  <CardDescription>Informações de localização da empresa</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Address fields would go here */}
                  <p className="text-center text-muted-foreground py-8">
                    Campos de endereço seriam implementados aqui
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle>Contato</CardTitle>
                  <CardDescription>Informações de contato da empresa</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Contact fields would go here */}
                  <p className="text-center text-muted-foreground py-8">
                    Campos de contato seriam implementados aqui
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="partners">
              <Card>
                <CardHeader>
                  <CardTitle>Sócios</CardTitle>
                  <CardDescription>Informações sobre os sócios da empresa</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Partners fields would go here */}
                  <p className="text-center text-muted-foreground py-8">
                    Campos de sócios seriam implementados aqui
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="finance">
              <Card>
                <CardHeader>
                  <CardTitle>Capital Social</CardTitle>
                  <CardDescription>Informações sobre o capital da empresa</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Financial fields would go here */}
                  <p className="text-center text-muted-foreground py-8">
                    Campos de capital social seriam implementados aqui
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tax">
              <Card>
                <CardHeader>
                  <CardTitle>Tributação</CardTitle>
                  <CardDescription>Histórico tributário da empresa</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Tax fields would go here */}
                  <p className="text-center text-muted-foreground py-8">
                    Campos de histórico tributário seriam implementados aqui
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="service">
              <Card>
                <CardHeader>
                  <CardTitle>Prestação de Serviços</CardTitle>
                  <CardDescription>Dados de contratação e honorários</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Service fields would go here */}
                  <p className="text-center text-muted-foreground py-8">
                    Campos de prestação de serviços seriam implementados aqui
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="access">
              <Card>
                <CardHeader>
                  <CardTitle>Acessos</CardTitle>
                  <CardDescription>Acessos a sistemas e plataformas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Access fields would go here */}
                  <p className="text-center text-muted-foreground py-8">
                    Campos de acessos seriam implementados aqui
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Form buttons */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard/companies')}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
};

export default CompanyForm;
