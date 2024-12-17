import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DestinationCardProps {
  image?: string;
  title?: string;
  rating?: number;
  distance?: string;
  isFavorite?: boolean;
  onFavoriteClick?: () => void;
  onClick?: () => void;
}

const DestinationCard = ({
  image = "https://dummyimage.com/300x200/1e40af/ffffff&text=Destination",
  title = "Carthage Ruins",
  rating = 4.6,
  distance,
  isFavorite = false,
  onFavoriteClick = () => {},
  onClick = () => {},
}: DestinationCardProps) => {
  return (
    <div
      className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer bg-white"
      onClick={onClick}
    >
      <img src={image} alt={title} className="w-full h-full object-cover" />
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white/90 rounded-full"
        onClick={(e) => {
          e.stopPropagation();
          onFavoriteClick();
        }}
      >
        <Heart
          className={`h-4 w-4 ${isFavorite ? "fill-black text-black" : "text-black"}`}
        />
      </Button>
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex flex-col text-white gap-1">
          <div className="flex justify-between items-center">
            <span className="font-medium">{title}</span>
            <div className="flex items-center gap-1">
              <span className="text-sm">★</span>
              <span className="text-sm">{rating}</span>
            </div>
          </div>
          {distance && (
            <span className="text-sm text-white/80">{distance}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
