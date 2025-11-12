import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";

interface EventListItemProps {
  name: string;
  date: string;
  location: string;
  image: string;
}

const EventListItem = ({ name, date, location, image }: EventListItemProps) => {
  return (
    <Card className="overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300">
      <div className="relative h-32 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4 space-y-2">
        <h3 className="font-semibold text-lg text-foreground">{name}</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventListItem;
