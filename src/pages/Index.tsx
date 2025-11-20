import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BikeCard } from "@/components/BikeCard";
import { BikeDetailsDialog } from "@/components/BikeDetailsDialog";
import { BikeFilters } from "@/components/BikeFilters";
import { Tables } from "@/integrations/supabase/types";
import { Battery } from "lucide-react";

type Bike = Tables<"Catálogo_bikes">;

const Index = () => {
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0]);

  // Buscar bikes do Supabase
  const { data: bikes = [], isLoading } = useQuery({
    queryKey: ["bikes"],
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

  // Calcular preço máximo
  const maxPrice = useMemo(() => {
    if (bikes.length === 0) return 20000;
    return Math.max(
      ...bikes.map((bike) => {
        const price = bike.valor?.replace(/[^\d,]/g, "").replace(",", ".");
        return parseFloat(price || "0");
      })
    );
  }, [bikes]);

  // Filtrar bikes
  const filteredBikes = useMemo(() => {
    return bikes.filter((bike) => {
      const matchesSearch = bike.modelo
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const bikePrice = parseFloat(
        bike.valor?.replace(/[^\d,]/g, "").replace(",", ".") || "0"
      );
      const matchesPrice =
        priceRange[0] === 0 || bikePrice <= priceRange[0];

      return matchesSearch && matchesPrice;
    });
  }, [bikes, searchTerm, priceRange]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-primary to-accent text-primary-foreground py-16 px-4">
        <div className="container mx-auto max-w-7xl text-center">
          <div className="flex justify-center mb-6">
            <Battery className="h-16 w-16" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Catálogo de E-Bikes
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Encontre a bike elétrica perfeita para você. Modelos modernos,
            autonomia excepcional e o melhor custo-benefício.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl px-4 py-12">
        {/* Filtros */}
        <div className="mb-8">
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
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Carregando bikes...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredBikes.length === 0 && (
          <div className="text-center py-12">
            <Battery className="h-16 w-16 mx-auto text-muted-foreground/20 mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Nenhuma bike encontrada
            </h3>
            <p className="text-muted-foreground">
              Tente ajustar os filtros para ver mais resultados.
            </p>
          </div>
        )}

        {/* Grid de Bikes */}
        {!isLoading && filteredBikes.length > 0 && (
          <>
            <div className="mb-6 text-sm text-muted-foreground">
              Mostrando {filteredBikes.length} de {bikes.length} bikes
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBikes.map((bike) => (
                <BikeCard
                  key={bike.id}
                  bike={bike}
                  onClick={() => setSelectedBike(bike)}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Dialog de Detalhes */}
      {selectedBike && (
        <BikeDetailsDialog
          bike={selectedBike}
          open={!!selectedBike}
          onOpenChange={(open) => !open && setSelectedBike(null)}
        />
      )}
    </div>
  );
};

export default Index;
