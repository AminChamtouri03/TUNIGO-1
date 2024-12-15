import { useNavigate } from "react-router-dom";
import { Star, MapPin } from "lucide-react";

interface ShoppingPlace {
  id: string;
  title: string;
  description: string;
  image: string;
  rating: number;
  location: string;
  openHours: string;
}

interface ShoppingListProps {
  places?: ShoppingPlace[];
}

const ShoppingList = ({ places = [] }: ShoppingListProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 gap-4">
      {places.map((place) => (
        <div
          key={place.id}
          className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer"
          onClick={() => navigate(`/shopping/${place.id}`)}
        >
          <div className="relative h-[200px]">
            <img
              src={place.image}
              alt={place.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{place.rating}</span>
            </div>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold mb-1">{place.title}</h3>
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <MapPin className="h-3 w-3" />
                  <span>{place.location}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {place.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShoppingList;
