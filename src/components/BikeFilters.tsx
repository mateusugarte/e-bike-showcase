import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Search, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";

interface BikeFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  maxPrice: number;
  priceRange: [number, number];
  onPriceRangeChange: (value: [number, number]) => void;
}

export const BikeFilters = ({
  searchTerm,
  onSearchChange,
  maxPrice,
  priceRange,
  onPriceRangeChange,
}: BikeFiltersProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="p-4 sm:p-6 shadow-card-custom border-border/50">
      <div className="space-y-5 sm:space-y-6">
        {/* Search Input - Mobile Optimized */}
        <div className="space-y-2.5">
          <Label 
            htmlFor="search" 
            className="text-sm sm:text-base font-semibold text-card-foreground flex items-center gap-2"
          >
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Buscar Modelo
          </Label>
          <div className="relative">
            <Input
              id="search"
              type="text"
              placeholder="Digite o nome da bike..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-12 sm:h-14 text-base sm:text-lg pl-4 pr-4 rounded-xl border-2 border-border focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Price Range Slider - Mobile Optimized */}
        <div className="space-y-3">
          <Label 
            htmlFor="price-range" 
            className="text-sm sm:text-base font-semibold text-card-foreground flex items-center gap-2"
          >
            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Faixa de Preço
          </Label>
          
          {/* Slider - Touch Optimized */}
          <div className="px-2 pt-4 pb-2">
            <Slider
              id="price-range"
              min={0}
              max={maxPrice}
              step={100}
              value={priceRange}
              onValueChange={(value) =>
                onPriceRangeChange(value as [number, number])
              }
              className="touch-manipulation"
            />
          </div>

          {/* Price Display - Mobile First */}
          <div className="flex items-center justify-between gap-3 px-2">
            <div className="flex-1 text-center p-2 bg-primary/10 rounded-lg border border-primary/30">
              <p className="text-xs text-muted-foreground mb-1">Mínimo</p>
              <p className="text-base sm:text-lg font-bold text-primary">
                {formatPrice(priceRange[0])}
              </p>
            </div>
            <div className="text-muted-foreground text-sm">-</div>
            <div className="flex-1 text-center p-2 bg-secondary/10 rounded-lg border border-secondary/30">
              <p className="text-xs text-muted-foreground mb-1">Máximo</p>
              <p className="text-base sm:text-lg font-bold text-secondary">
                {formatPrice(priceRange[1])}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
