
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const SubscriptionPlans: React.FC = () => {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Básico</CardTitle>
          <CardDescription>Para pequenas empresas</CardDescription>
          <div className="mt-4 text-3xl font-bold">
            R$ 99<span className="text-base font-normal text-muted-foreground">/mês</span>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Até 5 usuários</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Gestão de visitantes</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Relatórios básicos</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Suporte por e-mail</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Escolher Plano</Button>
        </CardFooter>
      </Card>

      <Card className="border-primary border-2 relative">
        <div className="absolute -top-4 left-0 right-0 flex justify-center">
          <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">Mais Popular</span>
        </div>
        <CardHeader>
          <CardTitle>Profissional</CardTitle>
          <CardDescription>Para médias empresas</CardDescription>
          <div className="mt-4 text-3xl font-bold">
            R$ 199<span className="text-base font-normal text-muted-foreground">/mês</span>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Até 20 usuários</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Gestão de visitantes avançada</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Relatórios personalizados</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Suporte prioritário</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Integração com sistemas externos</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Escolher Plano</Button>
        </CardFooter>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Enterprise</CardTitle>
          <CardDescription>Para grandes organizações</CardDescription>
          <div className="mt-4 text-3xl font-bold">
            R$ 499<span className="text-base font-normal text-muted-foreground">/mês</span>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Usuários ilimitados</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Gestão completa de acessos</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Análise avançada de dados</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Suporte 24/7</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>API completa</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Customização total</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Escolher Plano</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SubscriptionPlans;
