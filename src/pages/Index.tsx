import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BikeCard } from "@/components/BikeCard";
import { BikeDetailsDialog } from "@/components/BikeDetailsDialog";
import { BikeFilters } from "@/components/BikeFilters";
import { Tables } from "@/integrations/supabase/types";
import { Loader2 } from "lucide-react";
import logo from "@/assets/logo.png";
import { parsePrice } from "@/lib/utils";

type Bike = Tables<"Catálogo_bikes">;

const Index = () => {
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);

  const { data: bikes, isLoading } = useQuery({
    queryKey: ["available-bikes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Catálogo_bikes")
        .select("*")
        .eq("status", "Disponível")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Bike[];
    },
  });

  const maxPrice = useMemo(() => {
    if (!bikes || bikes.length === 0) return 50000;
    const prices = bikes
      .map((bike) => parsePrice(bike.valor))
      .filter((price) => !isNaN(price) && price > 0);

    return prices.length > 0 ? Math.max(...prices) : 50000;
  }, [bikes]);

  const filteredBikes = useMemo(() => {
    if (!bikes) return [];

    return bikes.filter((bike) => {
      const matchesSearch = bike.modelo
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const price = parsePrice(bike.valor);
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];

      return matchesSearch && matchesPrice;
    });
  }, [bikes, searchTerm, priceRange]);

  return (
    <div className="min-h-screen bg-gradient-accent">
      <main className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
        {/* Logo Hero Section - Mobile First */}
        <section className="text-center mb-8 sm:mb-10 md:mb-12">
          <div className="flex justify-center mb-4">
            <img 
              src={logo} 
              alt="Logo" 
              className="h-20 sm:h-24 md:h-32 lg:h-40 w-auto object-contain"
            />
          </div>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
            Encontre a bike elétrica perfeita para você
          </p>
        </section>

        {/* Filters */}
        <div className="mb-6 sm:mb-8">
          <BikeFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            maxPrice={maxPrice}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16 sm:py-20">
            <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-primary" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredBikes.length === 0 && (
          <div className="text-center py-16 sm:py-20">
            <p className="text-lg sm:text-xl text-muted-foreground">
              Nenhuma bike encontrada
            </p>
          </div>
        )}

        {/* Bikes Grid - Mobile First */}
        {!isLoading && filteredBikes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {filteredBikes.map((bike) => (
              <BikeCard
                key={bike.id}
                bike={bike}
              />
            ))}
          </div>
        )}
      </main>

      {/* Details Dialog */}
      <BikeDetailsDialog
        bike={selectedBike}
        open={!!selectedBike}
        onOpenChange={(open) => !open && setSelectedBike(null)}
      />
    </div>
  );
};

export default Index;
