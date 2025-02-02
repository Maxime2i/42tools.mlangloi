import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface EventDrawerProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  events: any[]; // Remplacez par le type approprié si possible
}

const EventDrawer: React.FC<EventDrawerProps> = ({ isOpen, onClose, events }) => {
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="bg-zinc-900/50 backdrop-blur flex justify-center items-center">
        <div className="max-w-md w-full">
          <DrawerHeader>
            <DrawerTitle className="text-white text-center">Détails des événements pédagogiques</DrawerTitle>
          </DrawerHeader>
          <Carousel opts={{
            align: "start",
            loop: true,
          }}>
            <CarouselContent>
              {events.map((event: any) => (
                <CarouselItem key={event.event.id}>
                  <Card className="border-white/10 bg-zinc-800/50 mb-4">
                    <CardContent className="p-4">
                      <h6 className="text-white text-center mb-4">{event.event.name}</h6>
                      <p className="text-white">{event.event.description.substring(0, 200) + "..."}</p>
                      <div className="flex justify-end gap-2 mt-2">
                        {event.event.kind && <Badge>{event.event.kind}</Badge>}
                        {event.event.location && <Badge>{event.event.location}</Badge>}
                        {event.event.begin_at && <Badge>{event.event.begin_at.split('T')[0]}</Badge>}
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default EventDrawer;