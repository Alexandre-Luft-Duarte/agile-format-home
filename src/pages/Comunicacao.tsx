import { useEffect, useState } from "react";
import BottomNavigation from "@/components/BottomNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, CheckCircle2, Bell } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

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

interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface UserVote {
  poll_id: string;
  option_id: string;
}

const Comunicacao = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [pollOptions, setPollOptions] = useState<Record<string, PollOption[]>>({});
  const [userVotes, setUserVotes] = useState<UserVote[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Comunicação - Formae";
    fetchPolls();
    fetchAnnouncements();
    fetchUserVotes();
  }, []);

  const fetchPolls = async () => {
    try {
      const { data, error } = await supabase
        .from("polls")
        .select("id, title, description, status, created_at")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      if (data) {
        setPolls(data as Poll[]);
        
        // Fetch options for each poll
        const optionsPromises = data.map(poll =>
          supabase
            .from("poll_options")
            .select("*")
            .eq("poll_id", poll.id)
            .order("created_at")
        );
        
        const optionsResults = await Promise.all(optionsPromises);
        const optionsMap: Record<string, PollOption[]> = {};
        
        data.forEach((poll, index) => {
          optionsMap[poll.id] = optionsResults[index].data || [];
        });
        
        setPollOptions(optionsMap);
      }
    } catch (error) {
      console.error("Error fetching polls:", error);
      toast.error("Erro ao carregar enquetes");
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      toast.error("Erro ao carregar avisos");
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
        {/* Announcements Section */}
        {announcements.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Avisos</h2>
            {announcements.map((announcement) => (
              <Card key={announcement.id} className="shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-accent/20 mt-0.5">
                      <Bell className="h-4 w-4 text-accent-foreground" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold">{announcement.title}</h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDistanceToNow(new Date(announcement.created_at), {
                            addSuffix: true,
                            locale: ptBR
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{announcement.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Separator */}
        {announcements.length > 0 && polls.length > 0 && <Separator />}

        {/* Polls Section */}
        <div className="space-y-3">
          {polls.length > 0 && <h2 className="text-lg font-semibold">Enquetes</h2>}
          {polls.length === 0 && announcements.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Nenhuma comunicação ativa no momento</p>
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
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Comunicacao;
