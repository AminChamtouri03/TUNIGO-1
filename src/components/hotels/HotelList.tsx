import { MapPin, Star, Wifi, Utensils, Car } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Hotel {
  id: string;
  title: string;
  location: string;
  description: string;
  image: string;
  rating: number;
  prices: {
    standard: number;
    deluxe: number;
    suite: number;
  };
  amenities: string[];
}

interface HotelListProps {
  hotels?: Hotel[];
}

const amenityIcons: Record<string, any> = {
  WiFi: Wifi,
  Restaurant: Utensils,
  Parking: Car,
};

const HotelList = ({ hotels = [] }: HotelListProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 gap-4">
      {hotels.map((hotel) => (
        <div
          key={hotel.id}
          className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer"
          onClick={() => navigate(`/hotel/${hotel.id}`)}
        >
          <div className="relative h-[200px]">
            <img
              src={hotel.image}
              alt={hotel.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{hotel.rating}</span>
            </div>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold mb-1">{hotel.title}</h3>
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <MapPin className="h-3 w-3" />
                  <span>{hotel.location}</span>
                </div>
              </div>
              <span className="text-[#00A9FF] font-medium">
                {hotel.prices.standard} DT
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {hotel.description}
            </p>
            <div className="flex gap-2">
              {hotel.amenities.slice(0, 3).map((amenity) => {
                const Icon = amenityIcons[amenity] || null;
                return (
                  <div
                    key={amenity}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex items-center gap-1"
                  >
                    {Icon && <Icon className="h-3 w-3" />}
                    <span>{amenity}</span>
                  </div>
                );
              })}
              {hotel.amenities.length > 3 && (
                <div className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  +{hotel.amenities.length - 3} more
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HotelList;
