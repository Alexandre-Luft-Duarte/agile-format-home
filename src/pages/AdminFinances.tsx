import { useEffect, useState } from "react";
import BottomNavigation from "@/components/BottomNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, TrendingDown, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ManualEntryDialog from "@/components/ManualEntryDialog";
import StudentControl from "@/components/StudentControl";

interface Transaction {
  id: string;
  type: "income" | "expense";
  description: string;
  amount: number;
  date: string;
  category: string | null;
}

const AdminFinances = () => {
  const [activeTab, setActiveTab] = useState("statement");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showManualEntry, setShowManualEntry] = useState(false);

  useEffect(() => {
    document.title = "Gestão Financeira - Formae";
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from("financial_transactions")
      .select("*")
      .order("date", { ascending: false });

    if (!error && data) {
      setTransactions(data as Transaction[]);
    }
  };

  const handleDelete = async (transactionId: string) => {
    const { error } = await supabase
      .from("financial_transactions")
      .delete()
      .eq("id", transactionId);

    if (error) {
      toast.error("Erro ao excluir lançamento");
    } else {
      toast.success("Lançamento excluído com sucesso");
      fetchTransactions();
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground px-6 py-8 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
        <div className="max-w-md mx-auto relative z-10">
          <h1 className="text-3xl font-bold">Gestão Financeira</h1>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="statement" className="flex-1">
              Extrato Geral
            </TabsTrigger>
            <TabsTrigger value="students" className="flex-1">
              Controle de Alunos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="statement" className="space-y-4">
            {transactions.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  Nenhuma transação registrada ainda
                </CardContent>
              </Card>
            ) : (
              transactions.map((transaction) => (
                <Card key={transaction.id} className="shadow-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className={`p-3 rounded-lg ${
                            transaction.type === "income"
                              ? "bg-accent/20"
                              : "bg-destructive/10"
                          }`}
                        >
                          {transaction.type === "income" ? (
                            <TrendingUp className="h-5 w-5 text-accent-foreground" />
                          ) : (
                            <TrendingDown className="h-5 w-5 text-destructive" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(transaction.date), "dd 'de' MMMM", {
                              locale: ptBR,
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p
                            className={`font-bold ${
                              transaction.type === "income"
                                ? "text-accent-foreground"
                                : "text-destructive"
                            }`}
                          >
                            {transaction.type === "income" ? "+" : "-"} R${" "}
                            {Number(transaction.amount).toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {transaction.type === "income" ? "Entrada" : "Saída"}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(transaction.id)}
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="students">
            <StudentControl />
          </TabsContent>
        </Tabs>

        {/* Floating Action Button */}
        <Button
          size="icon"
          className="fixed bottom-24 right-6 h-14 w-14 rounded-full shadow-elevated z-40"
          onClick={() => setShowManualEntry(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>

        <ManualEntryDialog
          open={showManualEntry}
          onOpenChange={setShowManualEntry}
          onSuccess={fetchTransactions}
        />
      </div>

      <BottomNavigation />
    </div>
  );
};

export default AdminFinances;
