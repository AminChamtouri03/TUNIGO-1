import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { LocationPermission } from "@/components/ui/location-permission";

type Coordinates = {
  lat: number;
  lng: number;
};

type PermissionState = "prompt" | "granted" | "denied";

type LocationContextType = {
  coordinates: Coordinates | null;
  locationName: string;
  loading: boolean;
  error: string | null;
  permissionState: PermissionState;
  updateLocation: () => Promise<void>;
  requestPermission: () => Promise<void>;
};

const LocationContext = createContext<LocationContextType | undefined>(
  undefined,
);

const TUNIS_COORDINATES = { lat: 36.8065, lng: 10.1815 };
const LOCATION_CACHE_KEY = "lastKnownLocation";
const LOCATION_CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes
const PERMISSION_STATE_KEY = "locationPermissionState";

export function LocationProvider({ children }: { children: ReactNode }) {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [locationName, setLocationName] = useState("Detecting location...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionState, setPermissionState] =
    useState<PermissionState>("prompt");
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);

  const checkPermissionState = async () => {
    if (!("permissions" in navigator)) {
      setPermissionState("prompt");
      return;
    }

    try {
      const result = await navigator.permissions.query({ name: "geolocation" });
      setPermissionState(result.state as PermissionState);

      result.addEventListener("change", () => {
        setPermissionState(result.state as PermissionState);
      });
    } catch (error) {
      console.error("Error checking permission:", error);
      setPermissionState("prompt");
    }
  };

  const getCachedLocation = () => {
    try {
      const cached = localStorage.getItem(LOCATION_CACHE_KEY);
      if (cached) {
        const { coordinates: cachedCoords, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < LOCATION_CACHE_EXPIRY) {
          return cachedCoords;
        }
      }
    } catch (error) {
      console.error("Error reading cached location:", error);
    }
    return null;
  };

  const cacheLocation = (coords: Coordinates) => {
    try {
      localStorage.setItem(
        LOCATION_CACHE_KEY,
        JSON.stringify({
          coordinates: coords,
          timestamp: Date.now(),
        }),
      );
    } catch (error) {
      console.error("Error caching location:", error);
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
      return "Location unavailable";
    }
  };

  const requestPermission = async () => {
    setShowPermissionDialog(true);
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

      const coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      setCoordinates(coords);
      cacheLocation(coords);
      const name = await getLocationName(coords.lat, coords.lng);
      setLocationName(name);
      setShowPermissionDialog(false);
      await checkPermissionState();
    } catch (error) {
      console.error("Error requesting permission:", error);
      setError("Location access denied");
      setShowPermissionDialog(false);
      await checkPermissionState();
    }
  };

  const useDefaultLocation = async () => {
    setCoordinates(TUNIS_COORDINATES);
    setLocationName("Tunis");
    setError("Using default location");
    setShowPermissionDialog(false);
  };

  const updateLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      const cachedLocation = getCachedLocation();
      if (cachedLocation) {
        setCoordinates(cachedLocation);
        const name = await getLocationName(
          cachedLocation.lat,
          cachedLocation.lng,
        );
        setLocationName(name);
      }

      if (permissionState === "granted") {
        await requestPermission();
      } else if (permissionState === "prompt") {
        setShowPermissionDialog(true);
      } else {
        if (!coordinates) {
          await useDefaultLocation();
        }
      }
    } catch (error) {
      console.error("Location error:", error);
      if (!coordinates) {
        await useDefaultLocation();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkPermissionState();
    updateLocation();
  }, []);

  return (
    <LocationContext.Provider
      value={{
        coordinates,
        locationName,
        loading,
        error,
        permissionState,
        updateLocation,
        requestPermission,
      }}
    >
      {showPermissionDialog && (
        <LocationPermission
          onRequestPermission={requestPermission}
          onSkip={useDefaultLocation}
          permissionDenied={permissionState === "denied"}
        />
      )}
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}
