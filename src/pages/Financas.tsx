import { useEffect } from "react";
import BottomNavigation from "@/components/BottomNavigation";
import SummaryCard from "@/components/SummaryCard";
import InstallmentItem, { InstallmentStatus } from "@/components/InstallmentItem";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Installment {
  id: number;
  name: string;
  dueDate: string;
  amount: string;
  status: InstallmentStatus;
}

const mockInstallments: Installment[] = [
  { id: 1, name: "Parcela 1 de 24", dueDate: "15/01/2025", amount: "R$ 300,00", status: "paid" },
  { id: 2, name: "Parcela 2 de 24", dueDate: "15/02/2025", amount: "R$ 300,00", status: "paid" },
  { id: 3, name: "Parcela 3 de 24", dueDate: "15/03/2025", amount: "R$ 300,00", status: "paid" },
  { id: 4, name: "Parcela 4 de 24", dueDate: "15/04/2025", amount: "R$ 300,00", status: "paid" },
  { id: 5, name: "Parcela 5 de 24", dueDate: "15/05/2025", amount: "R$ 300,00", status: "paid" },
  { id: 6, name: "Parcela 6 de 24", dueDate: "15/10/2025", amount: "R$ 300,00", status: "overdue" },
  { id: 7, name: "Parcela 7 de 24", dueDate: "15/11/2025", amount: "R$ 300,00", status: "pending" },
  { id: 8, name: "Parcela 8 de 24", dueDate: "15/12/2025", amount: "R$ 300,00", status: "pending" },
  { id: 9, name: "Parcela 9 de 24", dueDate: "15/01/2026", amount: "R$ 300,00", status: "pending" },
  { id: 10, name: "Parcela 10 de 24", dueDate: "15/02/2026", amount: "R$ 300,00", status: "pending" },
];

const Financas = () => {
  const totalPaid = "R$ 1.500,00";
  const outstandingBalance = "R$ 3.300,00";

  useEffect(() => {
    document.title = "Minhas Finanças - Forma Ágil";
  }, []);

  const handlePayClick = (installmentName: string) => {
    toast.success(`Redirecionando para pagamento da ${installmentName}`);
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
          <SummaryCard title="Total Pago" value={totalPaid} icon={CheckCircle2} variant="paid" />
          <SummaryCard title="Devendo" value={outstandingBalance} icon={AlertCircle} variant="pending" />
        </div>

        {/* Installments Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Minhas Parcelas</h2>

          <div className="space-y-3">
            {mockInstallments.map((installment) => (
              <InstallmentItem
                key={installment.id}
                name={installment.name}
                dueDate={installment.dueDate}
                amount={installment.amount}
                status={installment.status}
                onPayClick={() => handlePayClick(installment.name)}
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
