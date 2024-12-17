import { useEffect, useState } from "react";
import DestinationCard from "./DestinationCard";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useNavigate } from "react-router-dom";
import { destinationsList } from "@/data/destinations";
import { getWikipediaInfo } from "@/lib/wikipedia";

interface WikiInfo {
  extract: string;
  thumbnail: string;
  url: string;
}

interface Destination {
  id: string;
  title: string;
  rating: number;
  image: string;
  distance?: number;
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
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadThumbnails = async () => {
      const thumbnailData: Record<string, string> = {};
      for (const destination of propDestinations) {
        if (destination.wikipedia?.title || destination.title) {
          const info = await getWikipediaInfo(
            destination.wikipedia || { title: destination.title },
          );
          if (info?.thumbnail) {
            thumbnailData[destination.id] = info.thumbnail;
          } else {
            thumbnailData[destination.id] = destination.image;
          }
        } else {
          thumbnailData[destination.id] = destination.image;
        }
      }
      setThumbnails(thumbnailData);
    };

    loadThumbnails();
  }, [propDestinations]);

  const formatDistance = (distance?: number) => {
    if (!distance) return "";
    if (distance < 1) return `${Math.round(distance * 1000)}m away`;
    return `${distance.toFixed(1)}km away`;
  };

  return (
    <div className="w-full bg-white py-4">
      <div className="flex overflow-x-auto gap-4 px-4 pb-4 snap-x snap-mandatory hide-scrollbar">
        {propDestinations.map((destination) => (
          <div key={destination.id} className="flex-none w-[250px] snap-start">
            <DestinationCard
              image={
                thumbnails[destination.id] ||
                destination.image ||
                `https://dummyimage.com/600x600/cccccc/ffffff&text=${destination.title}`
              }
              title={destination.title}
              rating={destination.rating}
              distance={formatDistance(destination.distance)}
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
