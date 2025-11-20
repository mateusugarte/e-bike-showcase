import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tables } from "@/integrations/supabase/types";
import { Battery, Gauge } from "lucide-react";

type Bike = Tables<"Catálogo_bikes">;

interface BikeCardProps {
  bike: Bike;
  onClick: () => void;
}

export const BikeCard = ({ bike, onClick }: BikeCardProps) => {
  const primaryImage = bike.foto_1 || bike.foto_2 || bike.foto_3;

  const formatPrice = (price: string | null) => {
    if (!price) return "Consulte";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(parseFloat(price.replace(/[^\d,]/g, "").replace(",", ".")));
  };

  return (
    <Card
      className="group cursor-pointer overflow-hidden border-border hover:shadow-[var(--shadow-hover)] transition-all duration-300"
      onClick={onClick}
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={bike.modelo}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Battery className="h-16 w-16 text-muted-foreground/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-card-foreground line-clamp-1">
            {bike.modelo}
          </h3>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Battery className="h-4 w-4" />
            <span>{bike.autonomia || "N/A"}</span>
          </div>
          {bike.aguenta && (
            <Badge variant="secondary" className="text-xs">
              <Gauge className="h-3 w-3 mr-1" />
              {bike.aguenta}
            </Badge>
          )}
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-2xl font-bold text-primary">
            {formatPrice(bike.valor)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
