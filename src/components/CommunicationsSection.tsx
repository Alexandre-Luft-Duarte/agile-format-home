import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Poll {
  id: string;
  title: string;
  created_at: string;
}

const CommunicationsSection = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecentPolls();
  }, []);

  const fetchRecentPolls = async () => {
    const { data } = await supabase
      .from("polls")
      .select("id, title, created_at")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(3);

    if (data) {
      setPolls(data as Poll[]);
    }
  };

  const getRelativeTime = (date: string) => {
    const now = new Date();
    const pollDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - pollDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Agora";
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "1 dia atrás";
    if (diffInDays < 7) return `${diffInDays} dias atrás`;
    return `${Math.floor(diffInDays / 7)} semana(s) atrás`;
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-accent/20">
              <Bell className="h-5 w-5 text-accent-foreground" />
            </div>
            <CardTitle className="text-lg">Enquetes Ativas</CardTitle>
          </div>
          {polls.length > 0 && (
            <button
              onClick={() => navigate("/comunicacao")}
              className="text-xs text-primary hover:underline"
            >
              Ver todas
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {polls.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground text-sm">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Nenhuma enquete ativa</p>
          </div>
        ) : (
          <div className="space-y-3">
            {polls.map((poll) => (
              <div
                key={poll.id}
                onClick={() => navigate("/comunicacao")}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="p-2 rounded-full bg-primary/10 mt-0.5">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight">{poll.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getRelativeTime(poll.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommunicationsSection;
