import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";

interface EventCardProps {
  eventName: string;
  eventDate: string;
  eventImage: string;
}

const EventCard = ({ eventName, eventDate, eventImage }: EventCardProps) => {
  return (
    <Card className="shadow-card hover:shadow-elevated transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-accent/20">
            <Calendar className="h-5 w-5 text-accent-foreground" />
          </div>
          <CardTitle className="text-lg">Próximo Evento</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative overflow-hidden rounded-lg aspect-video">
          <img
            src={eventImage}
            alt={eventName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">{eventName}</h3>
          <p className="text-sm text-muted-foreground">{eventDate}</p>
        </div>
        <Button variant="outline" className="w-full group" asChild>
          <a href="/eventos">
            Ver todos os eventos
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default EventCard;
