import { Card } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";
import { Battery } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { parsePrice } from "@/lib/utils";

interface BikeCardProps {
  bike: Tables<"Catálogo_bikes">;
}

export const BikeCard = ({ bike }: BikeCardProps) => {
  const navigate = useNavigate();
  const primaryImage = bike.foto_1 || bike.foto_2 || bike.foto_3;

  const formatPrice = (price: string | null) => {
    const numPrice = parsePrice(price);
    if (!numPrice) return "Consulte";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numPrice);
  };

  return (
    <Card
      onClick={() => navigate(`/bike/${bike.id}`)}
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-elegant hover:-translate-y-1 active:scale-95 border-border/50"
    >
      {/* Image Container - Mobile Optimized */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={bike.modelo}
            className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground">Sem imagem</p>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        {/* Hover Action */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant">
            Ver Detalhes
          </span>
        </div>
      </div>

      {/* Content - Mobile First */}
      <div className="p-4 sm:p-5">
        {/* Model Name */}
        <h3 className="text-lg sm:text-xl font-bold text-card-foreground mb-3 line-clamp-2 min-h-[3.5rem] sm:min-h-[3rem]">
          {bike.modelo}
        </h3>

        {/* Info Grid */}
        <div className="space-y-2.5 mb-4">
          {/* Battery */}
          {bike.autonomia && (
            <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-primary/5 border border-primary/10">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Battery className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Autonomia</p>
                <p className="text-sm font-semibold text-card-foreground truncate">
                  {bike.autonomia}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Price - Prominent */}
        <div className="pt-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground mb-1">Valor</p>
          <p className="text-2xl sm:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            {formatPrice(bike.valor)}
          </p>
        </div>
      </div>
    </Card>
  );
};
