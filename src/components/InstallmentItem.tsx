import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign } from "lucide-react";

export type InstallmentStatus = "paid" | "overdue" | "pending";

interface InstallmentItemProps {
  name: string;
  dueDate: string;
  amount: string;
  status: InstallmentStatus;
  onPayClick?: () => void;
}

const statusConfig = {
  paid: {
    label: "Paga",
    className: "bg-green-100 text-green-800 hover:bg-green-100",
  },
  overdue: {
    label: "Atrasada",
    className: "bg-red-100 text-red-800 hover:bg-red-100",
  },
  pending: {
    label: "Em Aberto",
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  },
};

const InstallmentItem = ({ name, dueDate, amount, status, onPayClick }: InstallmentItemProps) => {
  const config = statusConfig[status];
  
  return (
    <Card className="shadow-card hover:shadow-elevated transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base">{name}</h3>
              <Badge className={config.className}>{config.label}</Badge>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Vencimento: {dueDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="font-semibold text-lg text-primary">{amount}</span>
              </div>
            </div>
          </div>
          
          {status !== "paid" && (
            <Button
              size="sm"
              className="mt-1"
              onClick={onPayClick}
            >
              Pagar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InstallmentItem;
