import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wallet } from "lucide-react";

interface FinancialCardProps {
  nextInstallment: string;
  outstandingBalance: string;
}

const FinancialCard = ({ nextInstallment, outstandingBalance }: FinancialCardProps) => {
  return (
    <Card className="shadow-card hover:shadow-elevated transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-lg">Minhas Finanças</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Próxima Parcela</p>
          <p className="text-2xl font-bold text-primary">{nextInstallment}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Saldo Devedor</p>
          <p className="text-lg font-semibold text-foreground">{outstandingBalance}</p>
        </div>
        <Button variant="outline" className="w-full group" asChild>
          <a href="/financas">
            Ver meu extrato completo
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default FinancialCard;
