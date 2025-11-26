import { useEffect, useState } from "react";
import BottomNavigation from "@/components/BottomNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

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

interface UserVote {
  poll_id: string;
  option_id: string;
}

const Comunicacao = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [pollOptions, setPollOptions] = useState<Record<string, PollOption[]>>({});
  const [userVotes, setUserVotes] = useState<UserVote[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Comunicação - Forma Ágil";
    fetchPolls();
    fetchUserVotes();
  }, []);

  const fetchPolls = async () => {
    const { data: pollsData } = await supabase
      .from("polls")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (pollsData) {
      setPolls(pollsData as Poll[]);

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

  const fetchUserVotes = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { data: votes } = await supabase
      .from("poll_votes")
      .select("poll_id, option_id")
      .eq("user_id", userData.user.id);

    if (votes) {
      setUserVotes(votes as UserVote[]);
    }
  };

  const hasVoted = (pollId: string) => {
    return userVotes.some(vote => vote.poll_id === pollId);
  };

  const getUserVoteOption = (pollId: string) => {
    return userVotes.find(vote => vote.poll_id === pollId)?.option_id;
  };

  const handleVote = async (pollId: string, optionId: string) => {
    if (hasVoted(pollId)) {
      toast.error("Você já votou nesta enquete");
      return;
    }

    setLoading(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const { error } = await supabase.from("poll_votes").insert({
        poll_id: pollId,
        option_id: optionId,
        user_id: userData.user?.id,
      });

      if (error) throw error;

      toast.success("Voto registrado com sucesso!");
      await fetchPolls();
      await fetchUserVotes();
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Erro ao registrar voto");
    } finally {
      setLoading(false);
    }
  };

  const getTotalVotes = (pollId: string) => {
    const options = pollOptions[pollId] || [];
    return options.reduce((sum, opt) => sum + opt.vote_count, 0);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-gradient-primary text-primary-foreground px-6 py-8 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
        <div className="max-w-md mx-auto relative z-10">
          <h1 className="text-3xl font-bold">Comunicação</h1>
          <p className="text-sm opacity-90 mt-1">Enquetes e avisos da turma</p>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {polls.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma enquete ativa no momento</p>
            </CardContent>
          </Card>
        ) : (
          polls.map((poll) => {
            const options = pollOptions[poll.id] || [];
            const totalVotes = getTotalVotes(poll.id);
            const voted = hasVoted(poll.id);
            const userVoteId = getUserVoteOption(poll.id);

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
                    {voted && (
                      <Badge className="bg-accent/20 text-accent-foreground">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Votado
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {options.map((option) => {
                      const percentage =
                        totalVotes > 0
                          ? Math.round((option.vote_count / totalVotes) * 100)
                          : 0;
                      const isUserChoice = userVoteId === option.id;

                      return (
                        <div key={option.id} className="space-y-2">
                          {voted ? (
                            <>
                              <div className="flex items-center justify-between text-sm">
                                <span className={`font-medium ${isUserChoice ? "text-accent-foreground" : ""}`}>
                                  {option.option_text} {isUserChoice && "✓"}
                                </span>
                                <span className="text-muted-foreground">
                                  {option.vote_count} votos ({percentage}%)
                                </span>
                              </div>
                              <Progress value={percentage} className="h-2" />
                            </>
                          ) : (
                            <Button
                              variant="outline"
                              className="w-full justify-start"
                              onClick={() => handleVote(poll.id, option.id)}
                              disabled={loading}
                            >
                              {option.option_text}
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {voted && (
                    <div className="text-sm text-muted-foreground pt-2 border-t">
                      Total de votos: {totalVotes}
                    </div>
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

export default Comunicacao;
