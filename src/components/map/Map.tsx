import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Navigation, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface NearbyPlace {
  id: string;
  title: string;
  distance: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  transport: {
    type: string;
    duration: string;
    cost: string;
  };
}

const nearbyPlaces: NearbyPlace[] = [
  {
    id: "medina-tunis",
    title: "Medina of Tunis",
    distance: 0.5,
    coordinates: {
      lat: 36.7992,
      lng: 10.1706,
    },
    transport: {
      type: "Walk",
      duration: "7 mins",
      cost: "Free",
    },
  },
  {
    id: "ezzitouna-mosque",
    title: "Ezzitouna Mosque",
    distance: 0.8,
    coordinates: {
      lat: 36.7982,
      lng: 10.1696,
    },
    transport: {
      type: "Walk",
      duration: "10 mins",
      cost: "Free",
    },
  },
  {
    id: "cathedral-st-vincent",
    title: "Cathedral of St. Vincent",
    distance: 1.2,
    coordinates: {
      lat: 36.8002,
      lng: 10.1716,
    },
    transport: {
      type: "Bus",
      duration: "5 mins",
      cost: "1 TND",
    },
  },
];

const Map = () => {
  const navigate = useNavigate();
  const [selectedPlace, setSelectedPlace] = useState<NearbyPlace | null>(null);

  // Center coordinates (Centre Ville, Tunis)
  const center = { lat: 36.7992, lng: 10.1706 };

  // Create marker parameters for OpenStreetMap
  const markers = nearbyPlaces
    .map(
      (place) => `&marker=${place.coordinates.lat}%2C${place.coordinates.lng}`,
    )
    .join("");

  return (
    <div className="h-screen bg-white relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-md">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium">Nearby Places</span>
          <div className="w-8" />
        </div>
      </div>

      {/* Map */}
      <div className="w-full h-[60vh] bg-gray-100">
        <iframe
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${center.lng - 0.005}%2C${center.lat - 0.005}%2C${center.lng + 0.005}%2C${center.lat + 0.005}&layer=mapnik&marker=${center.lat}%2C${center.lng}${markers}`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Location Legend */}
      <div className="absolute top-20 left-4 right-4 bg-white rounded-lg shadow-lg p-3 z-20">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00A9FF]" />
            <span className="text-sm">Your Location</span>
          </div>
          <div className="w-px h-4 bg-gray-200 mx-2" />
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3 text-red-500" />
            <span className="text-sm">Destinations</span>
          </div>
        </div>
      </div>

      {/* Nearby Places List */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-lg p-4 pb-20">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-[#00A9FF]" />
          <span className="text-sm text-gray-600">
            Your Location: Centre Ville, Tunis
          </span>
        </div>
        <h2 className="font-semibold mb-3">Nearest Places</h2>
        <div className="space-y-3">
          {nearbyPlaces.map((place) => (
            <Card
              key={place.id}
              className={`p-3 cursor-pointer transition-colors ${selectedPlace?.id === place.id ? "bg-gray-50 ring-1 ring-[#00A9FF]" : "hover:bg-gray-50"}`}
              onClick={() => setSelectedPlace(place)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{place.title}</h3>
                  <p className="text-sm text-gray-600">
                    {place.distance} km away
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-[#00A9FF] text-sm">
                    <Navigation className="h-3 w-3" />
                    <p>{place.transport.type}</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    {place.transport.duration}
                  </p>
                </div>
              </div>
              {selectedPlace?.id === place.id && (
                <div className="mt-2 pt-2 border-t text-sm text-gray-600">
                  <p>Best transport option:</p>
                  <p className="text-[#00A9FF]">
                    {place.transport.type} • {place.transport.duration} •{" "}
                    {place.transport.cost}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Map;
