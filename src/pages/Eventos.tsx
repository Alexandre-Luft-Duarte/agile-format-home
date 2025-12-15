import { useState, useEffect } from "react";
import BottomNavigation from "@/components/BottomNavigation";
import EventListItem from "@/components/EventListItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import event100days from "@/assets/event-100-days.jpg";
import eventBbq from "@/assets/event-bbq.jpg";
import eventGala from "@/assets/event-gala.jpg";
import eventIntegration from "@/assets/event-integration.jpg";
import eventReception from "@/assets/event-reception.jpg";
import eventTrip from "@/assets/event-trip.jpg";

const Eventos = () => {
  const { userRole } = useAuth();
  const [activeTab, setActiveTab] = useState("upcoming");
  const isAdmin = userRole === "admin";

  // Mock data for screenshots
  const [events] = useState([
    { id: "1", title: "Festa de 100 Dias", date: "2025-03-15", location: "Espaço Villa Garden", image_url: event100days },
    { id: "2", title: "Churrasco de Integração", date: "2025-04-20", location: "Sítio do João", image_url: eventBbq },
    { id: "3", title: "Baile de Gala", date: "2025-12-10", location: "Buffet Estrela", image_url: eventGala },
    { id: "4", title: "Viagem da Turma", date: "2025-07-05", location: "Praia de Búzios", image_url: eventTrip },
    { id: "5", title: "Recepção dos Calouros", date: "2024-02-10", location: "Auditório Principal", image_url: eventReception },
    { id: "6", title: "Integração 2024", date: "2024-03-20", location: "Campus", image_url: eventIntegration },
  ]);

  useEffect(() => {
    document.title = "Eventos da Turma - Formae";
  }, []);

  const formatEventDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const today = new Date();
  const upcomingEvents = events.filter((event) => new Date(event.date) > today);
  const pastEvents = events.filter((event) => new Date(event.date) <= today);

  const handleEdit = () => {
    toast({ title: "Editar evento" });
  };

  const handleDelete = () => {
    toast({ title: "Excluir evento" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 pb-20">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground px-6 py-8 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
        <div className="max-w-md mx-auto relative z-10">
          <h1 className="text-3xl font-bold">Eventos da Turma</h1>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="upcoming" className="flex-1">
              Próximos
            </TabsTrigger>
            <TabsTrigger value="past" className="flex-1">
              Passados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingEvents.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum evento próximo encontrado.
              </p>
            ) : (
              upcomingEvents.map((event) => (
                <EventListItem
                  key={event.id}
                  name={event.title}
                  date={formatEventDate(event.date)}
                  location={event.location || "Local a definir"}
                  image={event.image_url}
                  isAdmin={isAdmin}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastEvents.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum evento passado encontrado.
              </p>
            ) : (
              pastEvents.map((event) => (
                <EventListItem
                  key={event.id}
                  name={event.title}
                  date={formatEventDate(event.date)}
                  location={event.location || "Local a definir"}
                  image={event.image_url}
                  isAdmin={isAdmin}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Eventos;
