import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, MessageSquare } from "lucide-react";

interface Communication {
  id: number;
  type: "announcement" | "poll";
  title: string;
  date: string;
}

const communications: Communication[] = [
  { id: 1, type: "announcement", title: "Novos valores de parcelas disponíveis", date: "Hoje" },
  { id: 2, type: "poll", title: "Enquete: Escolha do tema da festa", date: "2 dias atrás" },
  { id: 3, type: "announcement", title: "Reunião mensal marcada", date: "1 semana atrás" },
];

const CommunicationsSection = () => {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-accent/20">
            <Bell className="h-5 w-5 text-accent-foreground" />
          </div>
          <CardTitle className="text-lg">Últimos Comunicados</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {communications.map((comm) => (
            <div
              key={comm.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="p-2 rounded-full bg-primary/10 mt-0.5">
                {comm.type === "poll" ? (
                  <MessageSquare className="h-4 w-4 text-primary" />
                ) : (
                  <Bell className="h-4 w-4 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-tight">{comm.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{comm.date}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunicationsSection;
