import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Bus,
  Car,
  Train,
  RefreshCw,
  X,
  Map as MapIcon,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { useLocation } from "../../contexts/LocationContext";

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

const nearbyPlaces = [
  {
    id: "medina",
    name: "Medina of Tunis",
    description: "UNESCO World Heritage site with traditional souks",
    position: [36.7992, 10.1706],
    transport: [
      { type: "Metro", icon: Train, time: "10 min", safety: "Very Safe" },
      { type: "Bus", icon: Bus, time: "15 min", safety: "Safe" },
      { type: "Taxi", icon: Car, time: "8 min", safety: "Safe" },
    ],
  },
];

const Map = () => {
  const navigate = useNavigate();
  const {
    coordinates,
    locationName,
    loading: locationLoading,
    error: locationError,
    updateLocation,
  } = useLocation();
  const [selectedPlace, setSelectedPlace] = useState<
    (typeof nearbyPlaces)[0] | null
  >(null);
  const [showTransport, setShowTransport] = useState(false);
  const [sortedPlaces, setSortedPlaces] = useState(nearbyPlaces);

  useEffect(() => {
    if (coordinates) {
      // Sort places by distance from current location
      const placesWithDistance = nearbyPlaces.map((place) => ({
        ...place,
        distance: calculateDistance(coordinates, {
          lat: place.position[0],
          lng: place.position[1],
        }),
      }));

      const sorted = placesWithDistance.sort((a, b) => a.distance - b.distance);
      setSortedPlaces(sorted);
    }
  }, [coordinates]);

  const handleNavigate = () => {
    if (selectedPlace) {
      window.open(
        `https://www.google.com/maps/search/${encodeURIComponent(selectedPlace.name + " Tunis")}`,
        "_blank",
      );
    }
  };

  const openInGoogleMaps = () => {
    if (coordinates) {
      window.open(
        `https://www.google.com/maps/@${coordinates.lat},${coordinates.lng},15z`,
        "_blank",
      );
    }
  };

  useEffect(() => {
    if (selectedPlace) {
      setShowTransport(true);
    }
  }, [selectedPlace]);

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm w-full max-w-[390px] mx-auto">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-[#00A9FF]" />
            <span className="text-sm">{locationName}</span>
            {locationError && (
              <span className="text-xs text-red-500">{locationError}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={openInGoogleMaps}
            >
              <MapIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={updateLocation}
              disabled={locationLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${locationLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="fixed top-[56px] left-0 right-0 z-10 w-full max-w-[390px] mx-auto h-[250px]">
        <iframe
          src={`https://www.openstreetmap.org/export/embed.html?bbox=10.1315,36.7892,10.2315,36.8292&layer=mapnik&marker=${coordinates?.lat || 36.8065},${coordinates?.lng || 10.1815}`}
          width="100%"
          height="250"
          style={{ border: 0 }}
          loading="lazy"
          className="w-full h-full"
        />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto mt-[306px] mb-[100px]">
        <div className="px-4 py-4 space-y-4">
          {sortedPlaces.map((place) => (
            <div
              key={place.id}
              className={`bg-gray-50 rounded-lg p-4 cursor-pointer ${selectedPlace?.id === place.id ? "ring-2 ring-[#00A9FF]" : ""}`}
              onClick={() => setSelectedPlace(place)}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold">{place.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="h-3 w-3" />
                    <span>
                      {place.distance
                        ? `${place.distance.toFixed(1)} km`
                        : "Calculating..."}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{place.description}</p>
              <div className="flex gap-2">
                {place.transport.map((t, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1 bg-white rounded-full px-2 py-1 text-xs text-gray-600"
                  >
                    <t.icon className="h-3 w-3 text-[#00A9FF]" />
                    <span>{t.time}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transport Info - Fixed at bottom */}
      {selectedPlace && showTransport && (
        <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-gray-100 p-4 z-[1000] max-w-[390px] mx-auto shadow-lg">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gray-100 hover:bg-gray-200"
              onClick={() => setShowTransport(false)}
            >
              <X className="h-3 w-3" />
            </Button>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{selectedPlace.name}</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#00A9FF]"
                onClick={handleNavigate}
              >
                <MapIcon className="h-4 w-4 mr-2" />
                Open in Maps
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {selectedPlace.transport.map((t, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center bg-gray-50 rounded-lg p-2 text-center"
                >
                  <t.icon className="h-4 w-4 text-[#00A9FF] mb-1" />
                  <span className="text-xs font-medium">{t.type}</span>
                  <span className="text-xs text-gray-500">{t.time}</span>
                  <span className="text-xs text-green-500">{t.safety}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
