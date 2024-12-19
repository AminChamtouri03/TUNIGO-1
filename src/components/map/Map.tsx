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
import { Button } from "@/components/ui/button";

const nearbyPlaces = [
  {
    id: "medina",
    name: "Medina of Tunis",
    description: "UNESCO World Heritage site with traditional souks",
    distance: "1.2 km",
    position: [36.7992, 10.1706],
    transport: [
      { type: "Metro", icon: Train, time: "10 min", safety: "Very Safe" },
      { type: "Bus", icon: Bus, time: "15 min", safety: "Safe" },
      { type: "Taxi", icon: Car, time: "8 min", safety: "Safe" },
    ],
  },
  {
    id: "bardo",
    name: "Bardo Museum",
    description: "World's largest collection of Roman mosaics",
    distance: "2.5 km",
    position: [36.8092, 10.1345],
    transport: [
      { type: "Metro", icon: Train, time: "15 min", safety: "Very Safe" },
      { type: "Bus", icon: Bus, time: "25 min", safety: "Safe" },
      { type: "Taxi", icon: Car, time: "12 min", safety: "Safe" },
    ],
  },
  {
    id: "avenue",
    name: "Avenue Habib Bourguiba",
    description: "Main avenue of Tunis with colonial architecture",
    distance: "0.8 km",
    position: [36.7992, 10.1815],
    transport: [
      { type: "Metro", icon: Train, time: "5 min", safety: "Very Safe" },
      { type: "Bus", icon: Bus, time: "10 min", safety: "Safe" },
      { type: "Taxi", icon: Car, time: "5 min", safety: "Safe" },
    ],
  },
];

const Map = () => {
  const navigate = useNavigate();
  const [selectedPlace, setSelectedPlace] = useState<
    (typeof nearbyPlaces)[0] | null
  >(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationName, setLocationName] = useState("Unknown Location");
  const [isLocating, setIsLocating] = useState(false);
  const [showTransport, setShowTransport] = useState(false);

  const handleNavigate = () => {
    if (selectedPlace) {
      window.open(
        `https://www.google.com/maps/search/${encodeURIComponent(selectedPlace.name + " Tunis")}`,
        "_blank",
      );
    }
  };

  const openInGoogleMaps = () => {
    if (userLocation) {
      window.open(
        `https://www.google.com/maps/@${userLocation.lat},${userLocation.lng},15z`,
        "_blank",
      );
    }
  };

  const getLocationName = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      );
      const data = await response.json();
      return (
        data.address.city ||
        data.address.town ||
        data.address.suburb ||
        "Unknown Location"
      );
    } catch (error) {
      console.error("Error getting location name:", error);
      return "Unknown Location";
    }
  };

  const getCurrentLocation = async () => {
    setIsLocating(true);
    setLocationName("Detecting location...");

    if (navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0,
            });
          },
        );

        const { latitude: lat, longitude: lng } = position.coords;
        setUserLocation({ lat, lng });

        // Get location name
        const name = await getLocationName(lat, lng);
        setLocationName(name);
      } catch (error) {
        console.error("Error getting location:", error);
        setLocationName("Unknown Location");
      } finally {
        setIsLocating(false);
      }
    } else {
      setLocationName("Location not available");
      setIsLocating(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

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
              onClick={getCurrentLocation}
              disabled={isLocating}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLocating ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="fixed top-[56px] left-0 right-0 z-10 w-full max-w-[390px] mx-auto h-[250px]">
        <iframe
          src={`https://www.openstreetmap.org/export/embed.html?bbox=10.1315,36.7892,10.2315,36.8292&layer=mapnik&marker=${userLocation?.lat || 36.8065},${userLocation?.lng || 10.1815}`}
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
          {nearbyPlaces.map((place) => (
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
                    <span>{place.distance}</span>
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
