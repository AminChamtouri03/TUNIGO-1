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
    id: "tourbet-el-bey",
    title: "Tourbet El Bey",
    distance: 1.2,
    coordinates: {
      lat: 36.7992,
      lng: 10.1706,
    },
    transport: {
      type: "Walk",
      duration: "12 mins",
      cost: "Free",
    },
  },
];

const Map = () => {
  const navigate = useNavigate();
  const [selectedPlace, setSelectedPlace] = useState<NearbyPlace | null>(null);

  const handleOpenInGoogleMaps = (place: NearbyPlace) => {
    const query = encodeURIComponent(`${place.title}, Tunis, Tunisia`);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}&center=${place.coordinates.lat},${place.coordinates.lng}`;
    window.open(url, "_blank");
  };

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
      <div className="w-full h-[60vh] bg-gray-100 flex items-center justify-center">
        <div className="text-gray-400 flex flex-col items-center gap-2">
          <MapPin className="h-8 w-8" />
          <span>Map View</span>
        </div>
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
              className={`p-3 transition-colors ${selectedPlace?.id === place.id ? "bg-gray-50 ring-1 ring-[#00A9FF]" : "hover:bg-gray-50"}`}
            >
              <div
                className="cursor-pointer"
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
              </div>
              {selectedPlace?.id === place.id && (
                <div className="mt-2 pt-2 border-t space-y-2">
                  <div className="text-sm text-gray-600">
                    <p>Best transport option:</p>
                    <p className="text-[#00A9FF]">
                      {place.transport.type} • {place.transport.duration} •{" "}
                      {place.transport.cost}
                    </p>
                  </div>
                  <Button
                    className="w-full bg-[#00A9FF] hover:bg-[#00A9FF]/90 text-white"
                    onClick={() => handleOpenInGoogleMaps(place)}
                  >
                    <Navigation className="mr-2 h-4 w-4" />
                    Open in Google Maps
                  </Button>
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
