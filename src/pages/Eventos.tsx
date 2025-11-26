import { useState, useEffect } from "react";
import BottomNavigation from "@/components/BottomNavigation";
import EventListItem from "@/components/EventListItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { format, isPast, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import placeholderImage from "@/assets/event-placeholder.jpg";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string | null;
  image_url: string | null;
}

const Eventos = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Eventos da Turma - Forma Ágil";
    fetchEvents();
  }, []);

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
