import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Battery, Gauge, FileText, CreditCard, ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";

type Bike = Tables<"Catálogo_bikes">;

const BikePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: bike, isLoading } = useQuery({
    queryKey: ["bike", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Catálogo_bikes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Bike;
    },
    enabled: !!id,
  });

  const formatPrice = (price: string | null) => {
    if (!price) return "Consulte";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(parseFloat(price.replace(/[^\d,]/g, "").replace(",", ".")));
  };

  const images = [bike?.foto_1, bike?.foto_2, bike?.foto_3].filter(Boolean) as string[];
  const displayImage = selectedImage || images[0];

  const isVideo = (url: string) => {
    return url?.includes("youtube") || url?.includes("youtu.be") || url?.match(/\.(mp4|webm|ogg)$/i);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-accent flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!bike) {
    return (
      <div className="min-h-screen bg-gradient-accent flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted-foreground mb-4">Bike não encontrada</p>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Catálogo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-accent">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Catálogo
          </Button>
        </div>

        {/* Product Layout - Similar to Mercado Livre */}
        <div className="bg-card rounded-xl shadow-elegant overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-6 p-4 sm:p-6 lg:p-8">
            {/* Left Column - Images */}
            <div className="space-y-4">
              {/* Main Image/Video */}
              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted border border-border">
                {bike.vídeo && isVideo(bike.vídeo) ? (
                  <iframe
                    src={getVideoEmbedUrl(bike.vídeo)}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : displayImage ? (
                  <img
                    src={displayImage}
                    alt={bike.modelo}
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">Sem imagem</p>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="grid grid-cols-3 gap-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(img)}
                      className={`aspect-square rounded-lg overflow-hidden bg-muted border-2 transition-all hover:border-primary ${
                        selectedImage === img || (!selectedImage && index === 0)
                          ? "border-primary"
                          : "border-border"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${bike.modelo} - ${index + 1}`}
                        className="w-full h-full object-contain p-2"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Info */}
            <div className="space-y-6">
              {/* Title and Price */}
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-card-foreground">
                  {bike.modelo}
                </h1>
                <div className="pt-2">
                  <p className="text-5xl sm:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    {formatPrice(bike.valor)}
                  </p>
                </div>
              </div>

              {/* Specifications Grid */}
              <div className="grid gap-4">
                {/* Battery */}
                {bike.autonomia && (
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Battery className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Autonomia</p>
                      <p className="text-lg font-semibold text-card-foreground">
                        {bike.autonomia}
                      </p>
                    </div>
                  </div>
                )}

                {/* Battery Type */}
                {bike.Bateria && (
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-muted border border-border">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/20">
                      <Battery className="h-6 w-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Bateria</p>
                      <p className="text-lg font-semibold text-card-foreground">
                        {bike.Bateria}
                      </p>
                    </div>
                  </div>
                )}

                {/* Weight Support */}
                {bike.aguenta && (
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-muted border border-border">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary/20">
                      <Gauge className="h-6 w-6 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Capacidade de Carga</p>
                      <p className="text-lg font-semibold text-card-foreground">
                        {bike.aguenta}
                      </p>
                    </div>
                  </div>
                )}

                {/* CNH */}
                {bike.precisa_CNH && (
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-muted border border-border">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-background">
                      <FileText className="h-6 w-6 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Requer CNH</p>
                      <p className="text-lg font-semibold text-card-foreground">
                        {bike.precisa_CNH}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Observations */}
              {bike.obs && (
                <div className="space-y-3 p-4 rounded-lg bg-muted border border-border">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-semibold text-lg text-card-foreground">
                      Descrição
                    </h3>
                  </div>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {bike.obs}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BikePage;
