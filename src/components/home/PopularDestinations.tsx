import { useEffect, useState } from "react";
import DestinationCard from "./DestinationCard";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useNavigate } from "react-router-dom";
import { getWikipediaInfo } from "@/lib/wikipedia";
import { destinationsList } from "@/data/destinations";

interface WikiInfo {
  extract: string;
  thumbnail: string;
  url: string;
}

interface Destination {
  id: string;
  title: string;
  rating: number;
  wikipedia?: {
    lang?: string;
    title: string;
  };
}

interface PopularDestinationsProps {
  destinations?: Destination[];
}

const PopularDestinations = ({
  destinations: propDestinations = destinationsList,
}: PopularDestinationsProps) => {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [wikiInfo, setWikiInfo] = useState<Record<string, WikiInfo>>({});

  useEffect(() => {
    const fetchWikiInfo = async () => {
      const wikiData: Record<string, WikiInfo> = {};

      for (const destination of propDestinations) {
        if (destination?.wikipedia) {
          const info = await getWikipediaInfo(destination.wikipedia);
          if (info) {
            wikiData[destination.id] = info;
          }
        }
      }

      setWikiInfo(wikiData);
    };

    fetchWikiInfo();
  }, [propDestinations]);

  return (
    <div className="w-full bg-white py-4">
      <h2 className="text-base font-semibold text-gray-900 mb-4 px-4">
        Popular Destinations
      </h2>

      <div className="flex overflow-x-auto gap-4 px-4 pb-4 snap-x snap-mandatory hide-scrollbar">
        {propDestinations.map((destination) => (
          <div key={destination.id} className="flex-none w-[250px] snap-start">
            <DestinationCard
              image={
                wikiInfo[destination.id]?.thumbnail ||
                destination.image ||
                `https://dummyimage.com/600x600/cccccc/ffffff&text=${destination.title}`
              }
              title={destination.title}
              rating={destination.rating}
              isFavorite={isFavorite(destination.id)}
              onClick={() => navigate(`/destination/${destination.id}`)}
              onFavoriteClick={() => toggleFavorite(destination.id)}
            />
          </div>
        ))}
      </div>

      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default PopularDestinations;
