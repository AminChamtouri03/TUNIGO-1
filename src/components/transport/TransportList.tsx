import { useNavigate } from "react-router-dom";
import { Star, MapPin, Clock } from "lucide-react";

interface TransportOption {
  id: string;
  title: string;
  description: string;
  image: string;
  rating: number;
  types: string[];
  priceRange: string;
  availability: string;
}

interface TransportListProps {
  options?: TransportOption[];
}

const TransportList = ({ options = [] }: TransportListProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 gap-4">
      {options.map((option) => (
        <div
          key={option.id}
          className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer"
          onClick={() => navigate(`/transport/${option.id}`)}
        >
          <div className="relative h-[200px]">
            <img
              src={option.image}
              alt={option.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{option.rating}</span>
            </div>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold mb-1">{option.title}</h3>
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <Clock className="h-3 w-3" />
                  <span>{option.availability}</span>
                </div>
              </div>
              <span className="text-[#00A9FF] font-medium">
                {option.priceRange}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {option.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {option.types.map((type) => (
                <span
                  key={type}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransportList;
