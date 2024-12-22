// src/contexts/LocationContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type Coordinates = {
  lat: number;
  lng: number;
};

type LocationContextType = {
  coordinates: Coordinates;
  locationName: string;
  loading: boolean;
  error: string | null;
  updateLocation: () => Promise<void>;
};

const LocationContext = createContext<LocationContextType | undefined>(
  undefined,
);

const TUNIS_COORDINATES = { lat: 36.8065, lng: 10.1815 };

export function LocationProvider({ children }: { children: ReactNode }) {
  const [coordinates, setCoordinates] =
    useState<Coordinates>(TUNIS_COORDINATES);
  const [locationName, setLocationName] = useState("Tunis");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLocationName = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      );
      const data = await response.json();
      return (
        data.address.city || data.address.town || data.address.suburb || "Tunis"
      );
    } catch (error) {
      console.error("Error getting location name:", error);
      return "Tunis";
    }
  };

  const updateLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      if ("geolocation" in navigator) {
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
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
        const name = await getLocationName(coords.lat, coords.lng);
        setLocationName(name);
      }
    } catch (error) {
      console.error("Location error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateLocation();
  }, []);

  return (
    <LocationContext.Provider
      value={{
        coordinates,
        locationName,
        loading,
        error,
        updateLocation,
      }}
    >
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
