import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tables } from "@/integrations/supabase/types";
import { Battery, Gauge, FileText, CreditCard, X } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

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
      <DialogContent className="max-w-full sm:max-w-4xl h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto p-0">
        {/* Mobile Header */}
        <div className="sticky top-0 z-50 bg-card border-b border-border p-4 sm:hidden flex items-center justify-between">
          <DialogTitle className="text-xl font-bold text-card-foreground line-clamp-1 pr-2">
            {bike.modelo}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="shrink-0"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Desktop Header */}
        <DialogHeader className="hidden sm:block p-6 pb-0">
          <DialogTitle className="text-2xl font-bold text-card-foreground">
            {bike.modelo}
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
          {/* Media Carousel */}
          {media.length > 0 && (
            <Carousel className="w-full">
              <CarouselContent>
                {media.map((item, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
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
                  <CarouselPrevious className="left-2 sm:left-4 h-10 w-10 sm:h-12 sm:w-12" />
                  <CarouselNext className="right-2 sm:right-4 h-10 w-10 sm:h-12 sm:w-12" />
                </>
              )}
            </Carousel>
          )}

          {/* Info Cards Grid - Mobile First */}
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
            {/* Price Card */}
            <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20">
              <div className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-full bg-primary/20">
                <CreditCard className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">Valor</p>
                <p className="text-xl sm:text-2xl font-bold text-primary truncate">
                  {formatPrice(bike.valor)}
                </p>
              </div>
            </div>

            {/* Battery Card */}
            <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 border-2 border-secondary/20">
              <div className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-full bg-secondary/20">
                <Battery className="h-7 w-7 sm:h-8 sm:w-8 text-secondary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">Autonomia</p>
                <p className="text-xl sm:text-2xl font-bold text-card-foreground truncate">
                  {bike.autonomia || "N/A"}
                </p>
              </div>
            </div>

            {/* Weight Support Card */}
            {bike.aguenta && (
              <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-muted border border-border">
                <div className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-full bg-accent/20">
                  <Gauge className="h-7 w-7 sm:h-8 sm:w-8 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">Suporta</p>
                  <p className="text-xl sm:text-2xl font-bold text-card-foreground truncate">
                    {bike.aguenta}
                  </p>
                </div>
              </div>
            )}

            {/* CNH Card */}
            {bike.precisa_CNH && (
              <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-muted border border-border">
                <div className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-full bg-background">
                  <FileText className="h-7 w-7 sm:h-8 sm:w-8 text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">CNH</p>
                  <p className="text-xl sm:text-2xl font-bold text-card-foreground truncate">
                    {bike.precisa_CNH}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Observations */}
          {bike.obs && (
            <div className="space-y-2.5 p-4 sm:p-5 rounded-xl bg-muted border border-border">
              <div className="flex items-center gap-2.5">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground shrink-0" />
                <h4 className="font-semibold text-base sm:text-lg text-card-foreground">
                  Observações
                </h4>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {bike.obs}
              </p>
            </div>
          )}
        </div>

        {/* Mobile Bottom Action Bar */}
        <div className="sticky bottom-0 sm:hidden bg-card border-t border-border p-4 shadow-elegant">
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full h-12 text-base font-semibold rounded-xl"
            size="lg"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
