import { useEffect, useState } from "react";
import BottomNavigation from "@/components/BottomNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, X, Trash2 } from "lucide-react";
import { CreatePollDialog } from "@/components/CreatePollDialog";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  const [showCreatePoll, setShowCreatePoll] = useState(false);

  useEffect(() => {
    document.title = "Gestão de Comunicação - Formae";
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
      toast.success("Enquete encerrada com sucesso!");
      fetchPolls();
    } else {
      toast.error("Erro ao encerrar enquete");
    }
  };

  const handleDeletePoll = async (pollId: string) => {
    // First delete poll votes
    await supabase.from("poll_votes").delete().eq("poll_id", pollId);
    
    // Then delete poll options
    await supabase.from("poll_options").delete().eq("poll_id", pollId);
    
    // Finally delete the poll
    const { error } = await supabase.from("polls").delete().eq("id", pollId);

    if (!error) {
      toast.success("Enquete excluída com sucesso!");
      fetchPolls();
    } else {
      toast.error("Erro ao excluir enquete");
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
        <Button 
          className="w-full" 
          onClick={() => setShowCreatePoll(true)}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Nova Enquete
        </Button>
        
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

                  <div className="flex gap-2">
                    {poll.status === "active" && (
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => handleClosePoll(poll.id)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Encerrar
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="flex-1">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir esta enquete? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeletePoll(poll.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <CreatePollDialog 
        open={showCreatePoll} 
        onOpenChange={(open) => {
          setShowCreatePoll(open);
          if (!open) fetchPolls();
        }}
      />

      <BottomNavigation />
    </div>
  );
};

export default AdminCommunication;
