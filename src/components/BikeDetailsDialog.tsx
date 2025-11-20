import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tables } from "@/integrations/supabase/types";
import { Battery, Gauge, FileText, CreditCard } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Bike = Tables<"Catálogo_bikes">;

interface BikeDetailsDialogProps {
  bike: Bike | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BikeDetailsDialog = ({
  bike,
  open,
  onOpenChange,
}: BikeDetailsDialogProps) => {
  if (!bike) return null;

  const media = [bike.foto_1, bike.foto_2, bike.foto_3, bike.vídeo].filter(
    Boolean
  ) as string[];

  const formatPrice = (price: string | null) => {
    if (!price) return "Consulte";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(parseFloat(price.replace(/[^\d,]/g, "").replace(",", ".")));
  };

  const isVideo = (url: string) => {
    return url.includes("youtube") || url.includes("youtu.be") || url.match(/\.(mp4|webm|ogg)$/i);
  };

  const getVideoEmbedUrl = (url: string) => {
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-card-foreground">
            {bike.modelo}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {media.length > 0 && (
            <Carousel className="w-full">
              <CarouselContent>
                {media.map((item, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                      {isVideo(item) ? (
                        <iframe
                          src={getVideoEmbedUrl(item)}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <img
                          src={item}
                          alt={`${bike.modelo} - ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {media.length > 1 && (
                <>
                  <CarouselPrevious className="left-4" />
                  <CarouselNext className="right-4" />
                </>
              )}
            </Carousel>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor</p>
                <p className="text-xl font-bold text-primary">
                  {formatPrice(bike.valor)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
                <Battery className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Autonomia</p>
                <p className="text-xl font-bold text-card-foreground">
                  {bike.autonomia || "N/A"}
                </p>
              </div>
            </div>

            {bike.aguenta && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background">
                  <Gauge className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Suporta</p>
                  <p className="text-xl font-bold text-card-foreground">
                    {bike.aguenta}
                  </p>
                </div>
              </div>
            )}

            {bike.precisa_CNH && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background">
                  <CreditCard className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CNH</p>
                  <p className="text-xl font-bold text-card-foreground">
                    {bike.precisa_CNH}
                  </p>
                </div>
              </div>
            )}
          </div>

          {bike.obs && (
            <div className="space-y-2 p-4 rounded-lg bg-muted">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <h4 className="font-semibold text-card-foreground">
                  Observações
                </h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {bike.obs}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
