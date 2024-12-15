import { MapPin } from "lucide-react";

interface LocationIndicatorProps {
  location?: string;
}

const LocationIndicator = ({
  location = "Centre Ville, Tunis",
}: LocationIndicatorProps) => {
  return (
    <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg h-8 w-[140px]">
      <MapPin className="h-4 w-4 text-blue-500" />
      <span className="text-sm font-medium truncate">{location}</span>
    </div>
  );
};

export default LocationIndicator;
