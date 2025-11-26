import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ManualEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const ManualEntryDialog = ({ open, onOpenChange, onSuccess }: ManualEntryDialogProps) => {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!description || !amount || !date) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("financial_transactions").insert({
      type,
      description,
      amount: parseFloat(amount),
      date,
    });

    if (error) {
      toast({
        title: "Erro ao registrar",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sucesso!",
        description: "Lançamento registrado com sucesso",
      });
      setDescription("");
      setAmount("");
      setDate(new Date().toISOString().split("T")[0]);
      onOpenChange(false);
      onSuccess();
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Lançamento</DialogTitle>
          <DialogDescription>
            Registre uma nova entrada ou despesa no caixa da turma
          </DialogDescription>
        </DialogHeader>

        <Tabs value={type} onValueChange={(v) => setType(v as "income" | "expense")}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="expense" className="flex-1">
              Despesa
            </TabsTrigger>
            <TabsTrigger value="income" className="flex-1">
              Receita Extra
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-4">
            <TabsContent value="expense" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label htmlFor="description-expense">Descrição</Label>
                <Input
                  id="description-expense"
                  placeholder="Ex: Pagamento Buffet"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
            </TabsContent>

            <TabsContent value="income" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label htmlFor="description-income">Descrição</Label>
                <Input
                  id="description-income"
                  placeholder="Ex: Mensalidades Março"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
            </TabsContent>

            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registrando..." : "Confirmar Lançamento"}
            </Button>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ManualEntryDialog;
