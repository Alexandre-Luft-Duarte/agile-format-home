import { useEffect, useState } from "react";
import BottomNavigation from "@/components/BottomNavigation";
import SummaryCard from "@/components/SummaryCard";
import InstallmentItem, { InstallmentStatus } from "@/components/InstallmentItem";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Installment {
  id: string;
  installment_number: number;
  amount: number;
  due_date: string;
  status: string;
  paid_date?: string;
}

const Financas = () => {
  const { user } = useAuth();
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [totalPaid, setTotalPaid] = useState(0);
  const [outstandingBalance, setOutstandingBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "Minhas Finanças - Forma Ágil";
    if (user) {
      fetchInstallments();
    }
  }, [user]);

  const fetchInstallments = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("student_installments")
      .select("*")
      .eq("student_id", user.id)
      .order("due_date");

    if (data) {
      setInstallments(data);
      
      const paid = data
        .filter(i => i.status === "paid")
        .reduce((sum, i) => sum + Number(i.amount), 0);
      
      const outstanding = data
        .filter(i => i.status !== "paid")
        .reduce((sum, i) => sum + Number(i.amount), 0);

      setTotalPaid(paid);
      setOutstandingBalance(outstanding);
    }
  };

  const handlePayClick = async (installment: Installment) => {
    if (!user) return;
    
    setIsLoading(true);

    try {
      // Update installment status
      const { error: updateError } = await supabase
        .from("student_installments")
        .update({
          status: "paid",
          paid_date: new Date().toISOString().split('T')[0],
          payment_method: "online"
        })
        .eq("id", installment.id);

      if (updateError) throw updateError;

      // Create financial transaction
      const { error: transactionError } = await supabase
        .from("financial_transactions")
        .insert({
          type: "income",
          description: `Parcela ${installment.installment_number} - Pagamento`,
          amount: installment.amount,
          date: new Date().toISOString().split('T')[0],
          category: "Mensalidade",
          created_by: user.id
        });

      if (transactionError) throw transactionError;

      toast.success("Pagamento realizado com sucesso!");
      fetchInstallments();
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Erro ao processar pagamento");
    } finally {
      setIsLoading(false);
    }
  };

  const getInstallmentStatus = (status: string): InstallmentStatus => {
    return status as InstallmentStatus;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground px-6 py-8 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
        <div className="max-w-md mx-auto relative z-10">
          <h1 className="text-3xl font-bold">Minhas Finanças</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <SummaryCard 
            title="Total Pago" 
            value={`R$ ${totalPaid.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} 
            icon={CheckCircle2} 
            variant="paid" 
          />
          <SummaryCard 
            title="Devendo" 
            value={`R$ ${outstandingBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} 
            icon={AlertCircle} 
            variant="pending" 
          />
        </div>

        {/* Installments Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Minhas Parcelas</h2>

          {installments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma cobrança cadastrada ainda
            </p>
          ) : (
            <div className="space-y-3">
              {installments.map((installment) => (
                <InstallmentItem
                  key={installment.id}
                  name={`Parcela ${installment.installment_number}`}
                  dueDate={format(new Date(installment.due_date), "dd/MM/yyyy", { locale: ptBR })}
                  amount={`R$ ${Number(installment.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                  status={getInstallmentStatus(installment.status)}
                  onPayClick={() => handlePayClick(installment)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Financas;
