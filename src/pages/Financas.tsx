import { useEffect, useState } from "react";
import BottomNavigation from "@/components/BottomNavigation";
import SummaryCard from "@/components/SummaryCard";
import InstallmentItem, { InstallmentStatus } from "@/components/InstallmentItem";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const Financas = () => {
  // Mock data for screenshots
  const [installments] = useState([
    { id: "1", installment_number: 1, amount: 300, due_date: "2024-01-15", status: "paid" },
    { id: "2", installment_number: 2, amount: 300, due_date: "2024-02-15", status: "paid" },
    { id: "3", installment_number: 3, amount: 300, due_date: "2024-03-15", status: "paid" },
    { id: "4", installment_number: 4, amount: 300, due_date: "2024-04-15", status: "open" },
    { id: "5", installment_number: 5, amount: 300, due_date: "2024-05-15", status: "open" },
    { id: "6", installment_number: 6, amount: 300, due_date: "2024-06-15", status: "overdue" },
  ]);

  const totalPaid = 900;
  const outstandingBalance = 900;

  useEffect(() => {
    document.title = "Minhas Finanças - Formae";
  }, []);

  const handlePayClick = () => {
    toast.success("Pagamento realizado com sucesso!");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
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

          <div className="space-y-3">
            {installments.map((installment) => (
              <InstallmentItem
                key={installment.id}
                name={`Parcela ${installment.installment_number}`}
                dueDate={formatDate(installment.due_date)}
                amount={`R$ ${Number(installment.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                status={installment.status as InstallmentStatus}
                onPayClick={handlePayClick}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Financas;
