import { useEffect, useState, useCallback } from "react";
import DestinationCard from "./DestinationCard";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useLocation } from "@/contexts/LocationContext";
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
  coordinates: {
    lat: number;
    lng: number;
  };
  distance?: number;
  wikipedia?: {
    lang?: string;
    title: string;
  };
}

interface PopularDestinationsProps {
  destinations?: Destination[];
}

const calculateDistance = (
  coords1: { lat: number; lng: number },
  coords2: { lat: number; lng: number },
) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((coords2.lat - coords1.lat) * Math.PI) / 180;
  const dLon = ((coords2.lng - coords1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coords1.lat * Math.PI) / 180) *
      Math.cos((coords2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const PopularDestinations = ({
  destinations: propDestinations = destinationsList,
}: PopularDestinationsProps) => {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { coordinates } = useLocation();
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
  const [sortedDestinations, setSortedDestinations] =
    useState(propDestinations);

  const sortDestinations = useCallback(() => {
    if (coordinates) {
      const destinationsWithDistance = propDestinations.map((dest) => ({
        ...dest,
        distance: calculateDistance(coordinates, dest.coordinates),
      }));

      const sorted = [...destinationsWithDistance].sort(
        (a, b) => (a.distance || 0) - (b.distance || 0),
      );
      setSortedDestinations(sorted);
    } else {
      setSortedDestinations(propDestinations);
    }
  }, [coordinates, propDestinations]);

  useEffect(() => {
    sortDestinations();
  }, [sortDestinations]);

  useEffect(() => {
    const loadThumbnails = async () => {
      const thumbnailData: Record<string, string> = {};
      for (const destination of sortedDestinations) {
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
  }, [sortedDestinations]);

  const formatDistance = (distance?: number) => {
    if (!distance) return "";
    if (distance < 1) return `${Math.round(distance * 1000)}m away`;
    return `${distance.toFixed(1)}km away`;
  };

  return (
    <div className="w-full bg-white py-4">
      <div className="flex overflow-x-auto gap-4 px-4 pb-4 snap-x snap-mandatory hide-scrollbar">
        {sortedDestinations.map((destination) => (
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
