
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Sample person data (in a real app, this would come from an API)
const personData = {
  id: '1',
  nome: 'João Silva',
  cpf: '123.456.789-00',
  tipoDocumento: 'rg',
  numeroDocumento: '12.345.678-9',
  orgaoEmissor: 'SSP',
  dataEmissao: '2015-10-20',
  dataNascimento: '1985-05-15',
  nacionalidade: 'Brasileira',
  naturalidade: 'São Paulo',
  ufNaturalidade: 'SP',
  estadoCivil: 'casado',
  regimeBens: 'comunhaoParcial',
  grauInstrucao: 'superior',
  profissao: 'Engenheiro',
  endereco: {
    cep: '01234-567',
    logradouro: 'Rua das Flores',
    numero: '123',
    complemento: 'Apto 45',
    bairro: 'Jardim Europa',
    cidade: 'São Paulo',
    uf: 'SP',
  },
};

// Form schema definition
const formSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  cpf: z.string().min(14, "CPF é obrigatório").max(14),
  tipoDocumento: z.string().min(1, "Tipo de documento é obrigatório"),
  numeroDocumento: z.string().min(1, "Número do documento é obrigatório"),
  orgaoEmissor: z.string().optional(),
  dataEmissao: z.string().optional(),
  dataNascimento: z.string().optional(),
  nacionalidade: z.string().optional(),
  naturalidade: z.string().optional(),
  ufNaturalidade: z.string().optional(),
  estadoCivil: z.string().optional(),
  regimeBens: z.string().optional(),
  grauInstrucao: z.string().optional(),
  profissao: z.string().optional(),
  // Additional fields would be validated here
});

// CPF mask function
const applyCpfMask = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

const PersonForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      cpf: '',
      tipoDocumento: '',
      numeroDocumento: '',
    },
  });
  
  // Load person data if editing
  useEffect(() => {
    if (isEditing) {
      // In a real app, fetch data from API
      form.reset({
        nome: personData.nome,
        cpf: personData.cpf,
        tipoDocumento: personData.tipoDocumento,
        numeroDocumento: personData.numeroDocumento,
        orgaoEmissor: personData.orgaoEmissor,
        dataEmissao: personData.dataEmissao,
        dataNascimento: personData.dataNascimento,
        nacionalidade: personData.nacionalidade,
        naturalidade: personData.naturalidade,
        ufNaturalidade: personData.ufNaturalidade,
        estadoCivil: personData.estadoCivil,
        regimeBens: personData.regimeBens,
        grauInstrucao: personData.grauInstrucao,
        profissao: personData.profissao,
      });
    }
  }, [isEditing, form]);
  
  // Handle CPF input with mask
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = applyCpfMask(e.target.value);
    form.setValue('cpf', value);
  };
  
  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      console.log('Form values:', values);
      
      // In a real app, this would be an API call
      setTimeout(() => {
        setIsLoading(false);
        toast.success(isEditing ? 'Pessoa atualizada com sucesso!' : 'Pessoa cadastrada com sucesso!');
        navigate('/dashboard/people');
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      toast.error('Erro ao salvar pessoa');
      console.error('Error saving person:', error);
    }
  };
  
  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">{isEditing ? 'Editar Pessoa' : 'Nova Pessoa'}</h1>
        <p className="text-muted-foreground">
          {isEditing ? 'Atualize as informações pessoais' : 'Preencha os dados para cadastrar uma nova pessoa'}
        </p>
      </div>
      
      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList>
          <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="address">Endereço</TabsTrigger>
          <TabsTrigger value="company">Empresas Vinculadas</TabsTrigger>
        </TabsList>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Info Tab */}
            <TabsContent value="personal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>Dados básicos de identificação</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo*</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF*</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="XXX.XXX.XXX-XX" 
                            {...field}
                            onChange={handleCpfChange}
                            maxLength={14}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="tipoDocumento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Documento*</FormLabel>
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
                              <SelectItem value="rg">RG</SelectItem>
                              <SelectItem value="cnh">CNH</SelectItem>
                              <SelectItem value="passaporte">Passaporte</SelectItem>
                              <SelectItem value="ctps">CTPS</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="numeroDocumento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número do Documento*</FormLabel>
                          <FormControl>
                            <Input placeholder="Número do documento" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="orgaoEmissor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Órgão Emissor</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: SSP" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dataEmissao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Emissão</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dataNascimento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Nascimento</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="nacionalidade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nacionalidade</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Brasileira" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="naturalidade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Naturalidade</FormLabel>
                          <FormControl>
                            <Input placeholder="Cidade de nascimento" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="ufNaturalidade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>UF Naturalidade</FormLabel>
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
                      name="estadoCivil"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado Civil</FormLabel>
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
                              <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                              <SelectItem value="casado">Casado(a)</SelectItem>
                              <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                              <SelectItem value="separado">Separado(a)</SelectItem>
                              <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                              <SelectItem value="uniaoEstavel">União Estável</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="regimeBens"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Regime de Bens</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={form.watch('estadoCivil') !== 'casado' && form.watch('estadoCivil') !== 'uniaoEstavel'}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="comunhaoUniversal">Comunhão Universal</SelectItem>
                              <SelectItem value="comunhaoParcial">Comunhão Parcial</SelectItem>
                              <SelectItem value="separacaoTotal">Separação Total</SelectItem>
                              <SelectItem value="participacaoFinal">Participação Final</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="grauInstrucao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grau de Instrução</FormLabel>
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
                              <SelectItem value="fundamental">Ensino Fundamental</SelectItem>
                              <SelectItem value="medio">Ensino Médio</SelectItem>
                              <SelectItem value="tecnico">Ensino Técnico</SelectItem>
                              <SelectItem value="superior">Ensino Superior</SelectItem>
                              <SelectItem value="posGraduacao">Pós-graduação</SelectItem>
                              <SelectItem value="mestrado">Mestrado</SelectItem>
                              <SelectItem value="doutorado">Doutorado</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="profissao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profissão</FormLabel>
                        <FormControl>
                          <Input placeholder="Profissão" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Address Tab */}
            <TabsContent value="address" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Endereço</CardTitle>
                  <CardDescription>Informações de endereço e contato</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Address fields would go here */}
                  <p className="text-center text-muted-foreground py-8">
                    Campos de endereço seriam implementados aqui
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Companies Tab */}
            <TabsContent value="company" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Empresas Vinculadas</CardTitle>
                  <CardDescription>Empresas associadas a esta pessoa</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Company association fields would go here */}
                  <p className="text-center text-muted-foreground py-8">
                    Vínculo com empresas seria implementado aqui
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Form buttons */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard/people')}
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

export default PersonForm;
