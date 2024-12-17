import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Navigation2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { destinationsList } from "@/data/destinations";

interface Coordinates {
  lat: number;
  lng: number;
}

interface Place {
  id: string;
  title: string;
  coordinates: Coordinates;
  distance?: number;
  walkingTime?: string;
}

const calculateDistance = (coords1: Coordinates, coords2: Coordinates) => {
  const R = 6371;
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

const calculateWalkingTime = (distance: number) => {
  const hours = distance / 5;
  const minutes = Math.round(hours * 60);
  return `${minutes} mins`;
};

const mapContainerStyle = {
  width: "100%",
  height: "300px",
};

const NearbyPlaces = () => {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<string>(
    "Detecting location...",
  );
  const [userCoords, setUserCoords] = useState<Coordinates | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<Place[]>([]);
  const [selectedTab, setSelectedTab] = useState<"location" | "destinations">(
    "location",
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY",
  });

  const updateLocation = useCallback(async () => {
    setIsRefreshing(true);
    setUserLocation("Detecting location...");

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
        const coords = { lat, lng };
        setUserCoords(coords);

        // Get location name
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        );
        const data = await response.json();
        const city =
          data.address.city ||
          data.address.town ||
          data.address.suburb ||
          "Unknown Location";
        setUserLocation(city);

        // Calculate nearby places
        const placesWithDistance = destinationsList.map((dest) => ({
          id: dest.id,
          title: dest.title,
          coordinates: dest.coordinates,
          distance: calculateDistance(coords, dest.coordinates),
        }));

        // Sort by distance and add walking time
        const sortedPlaces = placesWithDistance
          .sort((a, b) => (a.distance || 0) - (b.distance || 0))
          .map((place) => ({
            ...place,
            walkingTime: calculateWalkingTime(place.distance || 0),
          }));

        setNearbyPlaces(sortedPlaces);
      } catch (error) {
        console.error("Error getting location:", error);
        setUserLocation("Location access denied");
        // Fallback to Tunis coordinates
        const tunis = { lat: 36.8065, lng: 10.1815 };
        setUserCoords(tunis);
      }
    } else {
      setUserLocation("Geolocation not supported");
      // Fallback to Tunis coordinates
      const tunis = { lat: 36.8065, lng: 10.1815 };
      setUserCoords(tunis);
    }
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    updateLocation();
  }, [updateLocation]);

  const handlePlaceClick = (place: Place) => {
    setSelectedPlace(place);
    navigate(`/destination/${place.id}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
        <div className="flex items-center p-4">
          <Button
            variant="ghost"
            size="icon"
            className="mr-3"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Nearby Places</h1>
        </div>

        {/* Tabs */}
        <div className="flex p-4 gap-4">
          <button
            className={`flex-1 p-3 rounded-full ${selectedTab === "location" ? "bg-blue-50 text-blue-500" : "bg-gray-50"}`}
            onClick={() => setSelectedTab("location")}
          >
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Your Location</span>
            </div>
          </button>
          <button
            className={`flex-1 p-3 rounded-full ${selectedTab === "destinations" ? "bg-blue-50 text-blue-500" : "bg-gray-50"}`}
            onClick={() => setSelectedTab("destinations")}
          >
            <div className="flex items-center justify-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Destinations</span>
            </div>
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="mt-[136px]">
        {isLoaded && userCoords ? (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={userCoords}
            zoom={13}
          >
            {/* User location marker */}
            <Marker
              position={userCoords}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#00A9FF",
                fillOpacity: 1,
                strokeColor: "white",
                strokeWeight: 2,
              }}
            />

            {/* Destination markers */}
            {nearbyPlaces.map((place) => (
              <Marker
                key={place.id}
                position={place.coordinates}
                onClick={() => handlePlaceClick(place)}
                icon={{
                  url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                }}
              />
            ))}
          </GoogleMap>
        ) : (
          <div className="h-[300px] bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">Loading map...</span>
          </div>
        )}
      </div>

      {/* Location Info */}
      <div className="p-4 bg-white">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-sm text-gray-600">
              Your Location: {userLocation}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={updateLocation}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>

        <h2 className="font-semibold mb-3">Nearest Places</h2>
        <div className="space-y-3">
          {nearbyPlaces.slice(0, 3).map((place) => (
            <div
              key={place.id}
              className="p-4 bg-gray-50 rounded-lg flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handlePlaceClick(place)}
            >
              <div>
                <h3 className="font-medium">{place.title}</h3>
                <p className="text-sm text-gray-500">
                  {place.distance?.toFixed(1)} km away
                </p>
              </div>
              <div className="flex items-center gap-2 text-blue-500">
                <Navigation2 className="h-4 w-4" />
                <span className="text-sm">Walk</span>
                <span className="text-sm text-gray-500">
                  {place.walkingTime}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NearbyPlaces;
