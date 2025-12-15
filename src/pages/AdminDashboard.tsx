import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import BottomNavigation from "@/components/BottomNavigation";
import SummaryCard from "@/components/SummaryCard";
import { Wallet, TrendingUp, AlertCircle, MessageSquare, Calendar, Megaphone } from "lucide-react";
import { CreatePollDialog } from "@/components/CreatePollDialog";
import { CreateAnnouncementDialog } from "@/components/CreateAnnouncementDialog";
import CreateEventDialog from "@/components/CreateEventDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [showCreateAnnouncement, setShowCreateAnnouncement] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  // Mock data for screenshots
  const totalBalance = 15750.00;
  const monthlyIncome = 8400.00;
  const overdueRate = 12;

  useEffect(() => {
    document.title = "Dashboard Admin - Formae";
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground px-6 py-8 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
        <div className="max-w-md mx-auto relative z-10">
          <h1 className="text-3xl font-bold mb-1">Dashboard da Comissão</h1>
          <p className="text-primary-foreground/90 text-sm">
            Gestão Formae
          </p>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Main Balance Card */}
        <Card className="shadow-elevated bg-gradient-primary text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-primary-foreground/80 text-sm">Caixa da Turma</p>
              <Wallet className="h-5 w-5 text-primary-foreground/80" />
            </div>
            <p className="text-4xl font-bold">
              R$ {totalBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>

        {/* Quick Summary */}
        <div className="grid grid-cols-2 gap-4">
          <SummaryCard
            title="Arrecadado"
            value={`R$ ${monthlyIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
            icon={TrendingUp}
            variant="paid"
          />
          <SummaryCard
            title="Inadimplência"
            value={`${overdueRate}%`}
            icon={AlertCircle}
            variant="pending"
          />
        </div>

        {/* Quick Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                className="flex flex-col h-auto py-4 gap-2"
                onClick={() => setShowCreatePoll(true)}
              >
                <MessageSquare className="h-6 w-6" />
                <span className="text-xs">Nova Enquete</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col h-auto py-4 gap-2"
                onClick={() => setShowCreateAnnouncement(true)}
              >
                <Megaphone className="h-6 w-6" />
                <span className="text-xs">Novo Aviso</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col h-auto py-4 gap-2"
                onClick={() => setShowCreateEvent(true)}
              >
                <Calendar className="h-6 w-6" />
                <span className="text-xs">Novo Evento</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <CreatePollDialog 
        open={showCreatePoll} 
        onOpenChange={setShowCreatePoll}
      />
      <CreateAnnouncementDialog
        open={showCreateAnnouncement}
        onOpenChange={setShowCreateAnnouncement}
      />
      <CreateEventDialog
        open={showCreateEvent}
        onOpenChange={setShowCreateEvent}
      />

      <BottomNavigation />
    </div>
  );
};

export default AdminDashboard;
