import { useEffect, useState } from "react";
import { Heart, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "@/contexts/FavoritesContext";
import { getWikipediaInfo } from "@/lib/wikipedia";

interface WikiInfo {
  extract: string;
  thumbnail: string;
  url: string;
}

interface Destination {
  id: string;
  title: string;
  location: string;
  wikipedia?: {
    lang?: string;
    title: string;
  };
  description: string;
  image: string;
}

interface DestinationListProps {
  destinations?: Destination[];
}

const DestinationList = ({ destinations = [] }: DestinationListProps) => {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [wikiInfo, setWikiInfo] = useState<Record<string, WikiInfo>>({});

  useEffect(() => {
    const fetchWikiInfo = async () => {
      const wikiData: Record<string, WikiInfo> = {};

      for (const destination of destinations) {
        if (destination.wikipedia?.title || destination.title) {
          const info = await getWikipediaInfo(
            destination.wikipedia || { title: destination.title },
          );
          if (info) {
            wikiData[destination.id] = info;
          }
        }
      }

      setWikiInfo(wikiData);
    };

    fetchWikiInfo();
  }, [destinations]);

  return (
    <div className="grid grid-cols-1 gap-4">
      {destinations.map((destination) => {
        const wiki = wikiInfo[destination.id];

        return (
          <div
            key={destination.id}
            className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
          >
            <div
              className="relative h-[180px] cursor-pointer"
              onClick={() => navigate(`/destination/${destination.id}`)}
            >
              <img
                src={
                  wiki?.thumbnail ||
                  destination.image ||
                  `https://dummyimage.com/600x400/cccccc/ffffff&text=${destination.title}`
                }
                alt={destination.title}
                className="w-full h-full object-cover"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(destination.id);
                }}
              >
                <Heart
                  className={`h-4 w-4 ${isFavorite(destination.id) ? "fill-[#FF2D55] text-[#FF2D55]" : "text-[#8E8E93]"}`}
                />
              </Button>
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-[17px] font-semibold">
                  {destination.title}
                </h3>
                {wiki?.url && (
                  <a
                    href={wiki.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[#00A9FF] hover:text-[#00A9FF]/80 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
              <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                <MapPin className="h-3 w-3" />
                <span>{destination.location}</span>
              </div>
              <p className="text-[13px] text-gray-600 leading-snug line-clamp-2">
                {wiki?.extract || destination.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DestinationList;
