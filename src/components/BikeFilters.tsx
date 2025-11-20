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
            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-secondary" />
            Faixa de Preço
          </Label>
          
          {/* Price Display - Mobile First */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 sm:p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border border-border/50">
            <div className="text-center sm:text-left">
              <p className="text-xs text-muted-foreground mb-0.5">Mínimo</p>
              <p className="text-lg sm:text-xl font-bold text-primary">
                {formatPrice(priceRange[0])}
              </p>
            </div>
            <div className="hidden sm:block text-muted-foreground">até</div>
            <div className="text-center sm:text-right">
              <p className="text-xs text-muted-foreground mb-0.5">Máximo</p>
              <p className="text-lg sm:text-xl font-bold text-secondary">
                {formatPrice(priceRange[1])}
              </p>
            </div>
          </div>

          {/* Slider - Touch Optimized */}
          <div className="px-2 pt-2">
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
        </div>
      </div>
    </Card>
  );
};
