import { useEffect, useState } from "react";
import BottomNavigation from "@/components/BottomNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, X } from "lucide-react";

interface Poll {
  id: string;
  title: string;
  description: string | null;
  status: "active" | "closed";
  created_at: string;
}

interface PollOption {
  id: string;
  poll_id: string;
  option_text: string;
  vote_count: number;
}

const AdminCommunication = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [pollOptions, setPollOptions] = useState<Record<string, PollOption[]>>({});

  useEffect(() => {
    document.title = "Gestão de Comunicação - Forma Ágil";
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    const { data: pollsData } = await supabase
      .from("polls")
      .select("*")
      .order("created_at", { ascending: false });

    if (pollsData) {
      setPolls(pollsData as Poll[]);

      // Fetch options for each poll
      const optionsMap: Record<string, PollOption[]> = {};
      for (const poll of pollsData) {
        const { data: options } = await supabase
          .from("poll_options")
          .select("*")
          .eq("poll_id", poll.id);

        if (options) {
          optionsMap[poll.id] = options as PollOption[];
        }
      }
      setPollOptions(optionsMap);
    }
  };

  const handleClosePoll = async (pollId: string) => {
    const { error } = await supabase
      .from("polls")
      .update({ status: "closed", closed_at: new Date().toISOString() })
      .eq("id", pollId);

    if (!error) {
      fetchPolls();
    }
  };

  const getTotalVotes = (pollId: string) => {
    const options = pollOptions[pollId] || [];
    return options.reduce((sum, opt) => sum + opt.vote_count, 0);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground px-6 py-8 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
        <div className="max-w-md mx-auto relative z-10">
          <h1 className="text-3xl font-bold">Gestão de Comunicação</h1>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {polls.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma enquete criada ainda</p>
            </CardContent>
          </Card>
        ) : (
          polls.map((poll) => {
            const options = pollOptions[poll.id] || [];
            const totalVotes = getTotalVotes(poll.id);

            return (
              <Card key={poll.id} className="shadow-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{poll.title}</CardTitle>
                      {poll.description && (
                        <p className="text-sm text-muted-foreground">
                          {poll.description}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant={poll.status === "active" ? "default" : "secondary"}
                      className={
                        poll.status === "active"
                          ? "bg-accent/20 text-accent-foreground"
                          : ""
                      }
                    >
                      {poll.status === "active" ? "Ativa" : "Encerrada"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {options.map((option) => {
                      const percentage =
                        totalVotes > 0
                          ? Math.round((option.vote_count / totalVotes) * 100)
                          : 0;

                      return (
                        <div key={option.id} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{option.option_text}</span>
                            <span className="text-muted-foreground">
                              {option.vote_count} votos ({percentage}%)
                            </span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-sm text-muted-foreground pt-2 border-t">
                    Total de votos: {totalVotes}
                  </div>

                  {poll.status === "active" && (
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => handleClosePoll(poll.id)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Encerrar Votação
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default AdminCommunication;
