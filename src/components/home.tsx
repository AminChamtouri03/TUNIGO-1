import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MapPin, Map, Thermometer, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "./home/SearchBar";
import CategoryShortcuts from "./home/CategoryShortcuts";
import PopularDestinations from "./home/PopularDestinations";
import { useAuth } from "@/contexts/AuthContext";
import { getWikipediaInfo } from "@/lib/wikipedia";
import { destinationsList } from "@/data/destinations";

type CategoryType = "Hotel" | "Destination" | "Food" | "Shopping" | "Transport";

interface Coordinates {
  lat: number;
  lng: number;
}

const calculateDistance = (coords1: Coordinates, coords2: Coordinates) => {
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

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeCategory, setActiveCategory] = useState<CategoryType>("Hotel");
  const [heroImage, setHeroImage] = useState<string>("");
  const [temperature, setTemperature] = useState<number | null>(null);
  const [location, setLocation] = useState("Detecting location...");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userCoords, setUserCoords] = useState<Coordinates | null>(null);
  const [nearbyDestinations, setNearbyDestinations] =
    useState(destinationsList);

  const updateNearbyDestinations = useCallback((coords: Coordinates) => {
    const sortedDestinations = [...destinationsList].sort((a, b) => {
      const distanceA = calculateDistance(coords, a.coordinates);
      const distanceB = calculateDistance(coords, b.coordinates);
      return distanceA - distanceB;
    });

    const destinationsWithDistance = sortedDestinations.map((dest) => ({
      ...dest,
      distance: calculateDistance(coords, dest.coordinates),
    }));

    setNearbyDestinations(destinationsWithDistance);
  }, []);

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`,
      );
      const data = await response.json();
      setTemperature(Math.round(data.current.temp_c));
    } catch (error) {
      console.error("Error fetching weather:", error);
      setTemperature(25); // Fallback temperature
    }
  };

  const fetchLocationName = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
      );
      const data = await response.json();
      const city =
        data.address.city ||
        data.address.town ||
        data.address.suburb ||
        "Unknown Location";
      setLocation(city);
    } catch (error) {
      console.error("Error fetching location name:", error);
      setLocation("Location unavailable");
    }
  };

  const getLocation = useCallback(async () => {
    setIsRefreshing(true);
    setLocation("Detecting location...");

    // Default to Tunis coordinates
    const defaultCoords = { lat: 36.8065, lng: 10.1815 };

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
        updateNearbyDestinations(coords);

        await Promise.all([
          fetchWeather(lat, lng),
          fetchLocationName(lat, lng),
        ]);
      } catch (error) {
        console.error("Error getting location:", error);
        setLocation("Tunis");
        setUserCoords(defaultCoords);
        updateNearbyDestinations(defaultCoords);
        await fetchWeather(defaultCoords.lat, defaultCoords.lng);
      }
    } else {
      setLocation("Tunis");
      setUserCoords(defaultCoords);
      updateNearbyDestinations(defaultCoords);
      await fetchWeather(defaultCoords.lat, defaultCoords.lng);
    }

    setIsRefreshing(false);
  }, [updateNearbyDestinations]);

  useEffect(() => {
    const fetchHeroImage = async () => {
      if (nearbyDestinations.length > 0) {
        const info = await getWikipediaInfo(
          nearbyDestinations[0].wikipedia || {
            title: nearbyDestinations[0].title,
          },
        );
        if (info?.thumbnail) {
          setHeroImage(info.thumbnail);
        }
      }
    };

    fetchHeroImage();
    getLocation();
  }, [getLocation]);

  const handleSearch = (query: string) => {
    navigate("/discover", { state: { searchQuery: query } });
  };

  const handleCategoryClick = (category: CategoryType) => {
    setActiveCategory(category);
    navigate("/discover");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-[#00A9FF]" />
          <span className="text-sm">{location}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-gray-100 -ml-1"
            onClick={getLocation}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 text-gray-500 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
        {!isAuthenticated ? (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-[#00A9FF]">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button
                size="sm"
                className="bg-[#00A9FF] text-white hover:bg-[#00A9FF]/90"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-gray-600">
            <Thermometer className="h-5 w-5" />
            <span className="text-sm font-medium">{temperature}°C</span>
          </div>
        )}
      </div>

      {/* Hero Image */}
      <div className="relative">
        <img
          src={
            heroImage ||
            "https://dummyimage.com/600x400/cccccc/ffffff&text=Tunisia+Coast"
          }
          alt="Tunisia Coast"
          className="w-full h-[200px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
      </div>

      {/* Search Bar */}
      <div className="px-4 -mt-6 relative z-10">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Category Icons */}
      <CategoryShortcuts
        activeCategory={activeCategory}
        onCategoryClick={handleCategoryClick}
      />

      {/* Popular Destinations */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold px-4 mb-4">Nearby Destinations</h2>
        <PopularDestinations destinations={nearbyDestinations} />
      </div>

      {/* TUNIGO Footer */}
      <div className="mt-8 mb-24 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-[#00A9FF] flex items-center justify-center">
            <Map className="h-4 w-4 text-white" />
          </div>
          <span className="text-2xl font-bold">
            <span className="text-[#00A9FF]">TUNI</span>
            <span className="text-[#FF2D55]">GO</span>
          </span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          Your ultimate guide to discovering Tunisia's historical treasures and
          cultural wonders. We make it easy to explore, navigate, and experience
          the best of Tunisia's rich heritage.
        </p>
      </div>
    </div>
  );
};

export default Home;
