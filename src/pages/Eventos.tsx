import { useState, useEffect } from "react";
import BottomNavigation from "@/components/BottomNavigation";
import EventListItem from "@/components/EventListItem";
import EditEventDialog from "@/components/EditEventDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { format, isPast, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import placeholderImage from "@/assets/event-placeholder.jpg";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string | null;
  image_url: string | null;
  description: string | null;
}

const Eventos = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Eventos da Turma - Formae";
    fetchEvents();
  }, []);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) return;

      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      setIsAdmin(!!data);
    };

    checkAdminRole();
  }, [user]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("events-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events",
        },
        () => {
          fetchEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const formatEventDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const upcomingEvents = events.filter((event) => !isPast(parseISO(event.date)));
  const pastEvents = events.filter((event) => isPast(parseISO(event.date)));

  const handleDeleteEvent = async (eventId: string) => {
    const { error } = await supabase.from("events").delete().eq("id", eventId);

    if (error) {
      toast({
        title: "Erro ao excluir evento",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Evento excluído!",
      description: "O evento foi excluído com sucesso.",
    });

    setDeletingEventId(null);
    fetchEvents();
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
            {loading ? (
              <p className="text-center text-muted-foreground py-8">Carregando eventos...</p>
            ) : upcomingEvents.length === 0 ? (
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
                  image={event.image_url || placeholderImage}
                  isAdmin={isAdmin}
                  onEdit={() => setEditingEvent(event)}
                  onDelete={() => setDeletingEventId(event.id)}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {loading ? (
              <p className="text-center text-muted-foreground py-8">Carregando eventos...</p>
            ) : pastEvents.length === 0 ? (
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
                  image={event.image_url || placeholderImage}
                  isAdmin={isAdmin}
                  onEdit={() => setEditingEvent(event)}
                  onDelete={() => setDeletingEventId(event.id)}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation />

      {editingEvent && (
        <EditEventDialog
          open={!!editingEvent}
          onOpenChange={(open) => !open && setEditingEvent(null)}
          event={editingEvent}
          onEventUpdated={fetchEvents}
        />
      )}

      <AlertDialog
        open={!!deletingEventId}
        onOpenChange={(open) => !open && setDeletingEventId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este evento? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingEventId && handleDeleteEvent(deletingEventId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Eventos;
