import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Pencil, Trash2 } from "lucide-react";

interface EventListItemProps {
  name: string;
  date: string;
  location: string;
  image: string;
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const EventListItem = ({ name, date, location, image, isAdmin, onEdit, onDelete }: EventListItemProps) => {
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
        {isAdmin && (
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="flex-1"
            >
              <Pencil className="h-4 w-4 mr-1" />
              Editar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={onDelete}
              className="flex-1"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Excluir
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventListItem;
