import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const NearbyPlaces = () => {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<string>(
    "Detecting location...",
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const updateLocation = useCallback(async () => {
    setIsRefreshing(true);
    setUserLocation("Detecting location...");

    setTimeout(() => {
      setUserLocation("Tunis");
      setIsRefreshing(false);
    }, 1000);
  }, []);

  useEffect(() => {
    updateLocation();
  }, [updateLocation]);

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
      </div>

      {/* Location Info */}
      <div className="mt-[64px] p-4 bg-white">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-500" />
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
      </div>
    </div>
  );
};

export default NearbyPlaces;
