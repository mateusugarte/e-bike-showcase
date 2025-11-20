import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Search } from "lucide-react";

interface BikeFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  maxPrice: number;
  priceRange: number[];
  onPriceRangeChange: (value: number[]) => void;
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
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-6 p-6 rounded-lg border border-border bg-card">
      <div className="space-y-2">
        <Label htmlFor="search" className="text-sm font-medium">
          Buscar por nome
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            type="text"
            placeholder="Digite o modelo da bike..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Faixa de preço</Label>
          <span className="text-sm font-semibold text-primary">
            até {formatPrice(priceRange[0])}
          </span>
        </div>
        <Slider
          value={priceRange}
          onValueChange={onPriceRangeChange}
          max={maxPrice}
          step={100}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>R$ 0</span>
          <span>{formatPrice(maxPrice)}</span>
        </div>
      </div>
    </div>
  );
};
