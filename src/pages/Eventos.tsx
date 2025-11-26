import { useState, useEffect } from "react";
import BottomNavigation from "@/components/BottomNavigation";
import EventListItem from "@/components/EventListItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import event100Days from "@/assets/event-100-days.jpg";
import eventGala from "@/assets/event-gala.jpg";
import eventBBQ from "@/assets/event-bbq.jpg";
import eventTrip from "@/assets/event-trip.jpg";
import eventReception from "@/assets/event-reception.jpg";
import eventIntegration from "@/assets/event-integration.jpg";

const mockUpcomingEvents = [
  {
    id: 1,
    name: "Festa de 100 Dias",
    date: "25 de Março de 2025",
    location: "Espaço Villa da Mata",
    image: event100Days,
  },
  {
    id: 2,
    name: "Baile de Gala",
    date: "15 de Maio de 2025",
    location: "Grand Hotel São Paulo",
    image: eventGala,
  },
  {
    id: 3,
    name: "Churrasco da Turma",
    date: "8 de Junho de 2025",
    location: "Chácara Recanto Verde",
    image: eventBBQ,
  },
  {
    id: 4,
    name: "Viagem de Formatura",
    date: "20 de Julho de 2025",
    location: "Porto Seguro, BA",
    image: eventTrip,
  },
];

const mockPastEvents = [
  {
    id: 5,
    name: "Festa de Recepção",
    date: "10 de Fevereiro de 2025",
    location: "Clube Universitário",
    image: eventReception,
  },
  {
    id: 6,
    name: "Encontro de Integração",
    date: "5 de Janeiro de 2025",
    location: "Parque da Cidade",
    image: eventIntegration,
  },
];

const Eventos = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    document.title = "Eventos da Turma - Forma Ágil";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-foreground mb-6">
          Eventos da Turma
        </h1>

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
            {mockUpcomingEvents.map((event) => (
              <EventListItem
                key={event.id}
                name={event.name}
                date={event.date}
                location={event.location}
                image={event.image}
              />
            ))}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {mockPastEvents.map((event) => (
              <EventListItem
                key={event.id}
                name={event.name}
                date={event.date}
                location={event.location}
                image={event.image}
              />
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Eventos;
