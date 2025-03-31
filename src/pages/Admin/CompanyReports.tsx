
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart, FileDown } from 'lucide-react';
import { toast } from 'sonner';
import { getCompanyById, getCompanyVisitReport } from '@/services/mockData';
import { Company, VisitReport } from '@/types';

const CompanyReports: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [report, setReport] = useState<VisitReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        // Carregar dados da empresa
        const companyData = await getCompanyById(id);
        setCompany(companyData);
        
        // Carregar relatório de visitas
        const reportData = await getCompanyVisitReport(id);
        setReport(reportData);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar relatório');
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleExport = () => {
    toast.success('Relatório exportado com sucesso!');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link to="/admin/clientes">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Empresa não encontrada</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/clientes">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{company.companyName}</h1>
          <p className="text-muted-foreground">
            Relatórios de visitas
          </p>
        </div>
        <Button 
          variant="outline" 
          className="ml-auto flex items-center gap-2"
          onClick={handleExport}
        >
          <FileDown className="h-4 w-4" />
          Exportar Relatório
        </Button>
      </div>

      <Tabs defaultValue="daily">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="daily">Visitas Diárias</TabsTrigger>
          <TabsTrigger value="weekly">Visitas Semanais</TabsTrigger>
          <TabsTrigger value="monthly">Visitas Mensais</TabsTrigger>
        </TabsList>
        
        {report && (
          <>
            <TabsContent value="daily">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-muted-foreground" />
                    Relatório de Visitas Diárias
                  </CardTitle>
                  <CardDescription>
                    Visitas contabilizadas hoje por cada Sala/Local
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sala/Local</TableHead>
                        <TableHead className="text-right">Número de Visitas</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {report.daily.length > 0 ? (
                        report.daily.map((item) => (
                          <TableRow key={item.roomId}>
                            <TableCell className="font-medium">{item.roomName}</TableCell>
                            <TableCell className="text-right">{item.count}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center py-6 text-muted-foreground">
                            Nenhuma visita registrada hoje
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="weekly">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-muted-foreground" />
                    Relatório de Visitas Semanais
                  </CardTitle>
                  <CardDescription>
                    Visitas contabilizadas esta semana por cada Sala/Local
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sala/Local</TableHead>
                        <TableHead className="text-right">Número de Visitas</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {report.weekly.length > 0 ? (
                        report.weekly.map((item) => (
                          <TableRow key={item.roomId}>
                            <TableCell className="font-medium">{item.roomName}</TableCell>
                            <TableCell className="text-right">{item.count}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center py-6 text-muted-foreground">
                            Nenhuma visita registrada esta semana
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="monthly">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-muted-foreground" />
                    Relatório de Visitas Mensais
                  </CardTitle>
                  <CardDescription>
                    Visitas contabilizadas este mês por cada Sala/Local
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sala/Local</TableHead>
                        <TableHead className="text-right">Número de Visitas</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {report.monthly.length > 0 ? (
                        report.monthly.map((item) => (
                          <TableRow key={item.roomId}>
                            <TableCell className="font-medium">{item.roomName}</TableCell>
                            <TableCell className="text-right">{item.count}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center py-6 text-muted-foreground">
                            Nenhuma visita registrada este mês
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default CompanyReports;
