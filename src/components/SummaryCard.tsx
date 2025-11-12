import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  variant?: "paid" | "pending";
}

const SummaryCard = ({ title, value, icon: Icon, variant = "paid" }: SummaryCardProps) => {
  const bgColor = variant === "paid" ? "bg-accent/20" : "bg-primary/10";
  const iconColor = variant === "paid" ? "text-accent-foreground" : "text-primary";
  
  return (
    <Card className="shadow-card">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg ${bgColor} shrink-0`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-1.5">{title}</p>
            <p className="text-xl font-bold text-foreground">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
