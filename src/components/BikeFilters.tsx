import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Search, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";

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
  const [minInput, setMinInput] = useState(priceRange[0].toString());
  const [maxInput, setMaxInput] = useState(priceRange[1].toString());

  useEffect(() => {
    setMinInput(priceRange[0].toString());
    setMaxInput(priceRange[1].toString());
  }, [priceRange]);

  const handleMinInputChange = (value: string) => {
    setMinInput(value);
    const numValue = parseInt(value.replace(/\D/g, "")) || 0;
    if (numValue <= priceRange[1]) {
      onPriceRangeChange([numValue, priceRange[1]]);
    }
  };

  const handleMaxInputChange = (value: string) => {
    setMaxInput(value);
    const numValue = parseInt(value.replace(/\D/g, "")) || maxPrice;
    if (numValue >= priceRange[0] && numValue <= maxPrice) {
      onPriceRangeChange([priceRange[0], numValue]);
    }
  };

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

          {/* Price Input - Mobile First */}
          <div className="flex items-center justify-between gap-3 px-2">
            <div className="flex-1">
              <Label htmlFor="min-price" className="text-xs text-muted-foreground mb-1 block">
                Mínimo
              </Label>
              <Input
                id="min-price"
                type="text"
                value={formatPrice(parseInt(minInput) || 0)}
                onChange={(e) => handleMinInputChange(e.target.value)}
                className="h-10 text-center text-base font-bold border-primary/30 bg-primary/10 text-primary"
              />
            </div>
            <div className="text-muted-foreground text-sm mt-5">-</div>
            <div className="flex-1">
              <Label htmlFor="max-price" className="text-xs text-muted-foreground mb-1 block">
                Máximo
              </Label>
              <Input
                id="max-price"
                type="text"
                value={formatPrice(parseInt(maxInput) || 0)}
                onChange={(e) => handleMaxInputChange(e.target.value)}
                className="h-10 text-center text-base font-bold border-secondary/30 bg-secondary/10 text-secondary"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
