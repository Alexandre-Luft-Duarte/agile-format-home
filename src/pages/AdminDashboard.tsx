import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import BottomNavigation from "@/components/BottomNavigation";
import SummaryCard from "@/components/SummaryCard";
import { Wallet, TrendingUp, AlertCircle, Plus, MessageSquare, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [totalBalance, setTotalBalance] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [overdueRate, setOverdueRate] = useState(0);

  useEffect(() => {
    document.title = "Dashboard Admin - Forma Ágil";
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    // Fetch total balance from transactions
    const { data: transactions } = await supabase
      .from("financial_transactions")
      .select("type, amount");

    if (transactions) {
      const balance = transactions.reduce((acc, t) => {
        return t.type === "income" ? acc + Number(t.amount) : acc - Number(t.amount);
      }, 0);
      setTotalBalance(balance);

      // Calculate monthly income
      const income = transactions
        .filter(t => t.type === "income")
        .reduce((acc, t) => acc + Number(t.amount), 0);
      setMonthlyIncome(income);
    }

    // Calculate overdue rate
    const { data: installments } = await supabase
      .from("student_installments")
      .select("status");

    if (installments) {
      const overdueCount = installments.filter(i => i.status === "overdue").length;
      const rate = (overdueCount / installments.length) * 100;
      setOverdueRate(Math.round(rate));
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground px-6 py-8 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
        <div className="max-w-md mx-auto relative z-10">
          <h1 className="text-3xl font-bold mb-1">Dashboard da Comissão</h1>
          <p className="text-primary-foreground/90 text-sm">
            Gestão Forma Ágil
          </p>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Main Balance Card */}
        <Card className="shadow-elevated bg-gradient-primary text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-primary-foreground/80 text-sm">Caixa da Turma</p>
              <Wallet className="h-5 w-5 text-primary-foreground/80" />
            </div>
            <p className="text-4xl font-bold">
              R$ {totalBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>

        {/* Quick Summary */}
        <div className="grid grid-cols-2 gap-4">
          <SummaryCard
            title="Arrecadado"
            value={`R$ ${monthlyIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
            icon={TrendingUp}
            variant="paid"
          />
          <SummaryCard
            title="Inadimplência"
            value={`${overdueRate}%`}
            icon={AlertCircle}
            variant="pending"
          />
        </div>

        {/* Quick Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                className="flex flex-col h-auto py-4 gap-2"
                onClick={() => navigate("/admin/communication")}
              >
                <MessageSquare className="h-6 w-6" />
                <span className="text-xs">Nova Enquete</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col h-auto py-4 gap-2"
                onClick={() => navigate("/admin/communication")}
              >
                <Plus className="h-6 w-6" />
                <span className="text-xs">Novo Aviso</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col h-auto py-4 gap-2"
              >
                <Calendar className="h-6 w-6" />
                <span className="text-xs">Novo Evento</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default AdminDashboard;
