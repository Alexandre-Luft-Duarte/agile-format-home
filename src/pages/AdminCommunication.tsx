import { useEffect, useState } from "react";
import BottomNavigation from "@/components/BottomNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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

const AdminCommunication = () => {
  const [showCreatePoll, setShowCreatePoll] = useState(false);

  // Mock data for screenshots
  const [polls] = useState([
    { id: "1", title: "Tema da Festa de 100 Dias", description: "Vote no tema preferido!", status: "active", created_at: "2024-12-01" },
    { id: "2", title: "Local do Churrasco", description: "Qual local vocês preferem?", status: "active", created_at: "2024-11-28" },
    { id: "3", title: "Data da Formatura", description: "Escolha a melhor data", status: "closed", created_at: "2024-11-15" },
  ]);

  const [pollOptions] = useState<Record<string, Array<{ id: string; option_text: string; vote_count: number }>>>({
    "1": [
      { id: "1a", option_text: "Anos 80", vote_count: 15 },
      { id: "1b", option_text: "Hollywood", vote_count: 22 },
      { id: "1c", option_text: "Tropical", vote_count: 8 },
    ],
    "2": [
      { id: "2a", option_text: "Sítio do João", vote_count: 18 },
      { id: "2b", option_text: "Chácara Verde", vote_count: 12 },
    ],
    "3": [
      { id: "3a", option_text: "15 de Dezembro", vote_count: 25 },
      { id: "3b", option_text: "20 de Dezembro", vote_count: 30 },
    ],
  });

  useEffect(() => {
    document.title = "Gestão de Comunicação - Formae";
  }, []);

  const handleClosePoll = () => {
    toast.success("Enquete encerrada com sucesso!");
  };

  const handleDeletePoll = () => {
    toast.success("Enquete excluída com sucesso!");
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
        
        {polls.map((poll) => {
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
                      onClick={handleClosePoll}
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
                          onClick={handleDeletePoll}
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
        })}
      </div>

      <CreatePollDialog 
        open={showCreatePoll} 
        onOpenChange={setShowCreatePoll}
      />

      <BottomNavigation />
    </div>
  );
};

export default AdminCommunication;
