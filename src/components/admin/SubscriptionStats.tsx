
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const SubscriptionStats: React.FC = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R$ 12.580,00</div>
          <div className="mt-4 h-1 w-full bg-secondary">
            <div className="h-1 bg-primary" style={{ width: "75%" }}></div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            75% da meta mensal de R$ 16.000,00
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Status de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm">Pagos</span>
            <span className="text-sm font-medium">32</span>
          </div>
          <Progress value={80} className="h-2 w-full" />
          
          <div className="mt-4 mb-2 flex items-center justify-between">
            <span className="text-sm">Pendentes</span>
            <span className="text-sm font-medium">7</span>
          </div>
          <Progress value={15} className="h-2 w-full bg-amber-100" color="amber" />
          
          <div className="mt-4 mb-2 flex items-center justify-between">
            <span className="text-sm">Atrasados</span>
            <span className="text-sm font-medium">3</span>
          </div>
          <Progress value={5} className="h-2 w-full bg-red-100" color="red" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Distribuição de Planos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
              <span className="text-sm flex-1">Básico</span>
              <span className="text-sm font-medium">12</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm flex-1">Profissional</span>
              <span className="text-sm font-medium">24</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
              <span className="text-sm flex-1">Enterprise</span>
              <span className="text-sm font-medium">6</span>
            </div>
          </div>
          
          <div className="mt-4 flex h-4 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full bg-primary" style={{ width: "28%" }}></div>
            <div className="h-full bg-blue-500" style={{ width: "57%" }}></div>
            <div className="h-full bg-purple-500" style={{ width: "15%" }}></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionStats;
