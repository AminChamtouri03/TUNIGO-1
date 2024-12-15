import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Bell, Map } from "lucide-react";
import { Input } from "@/components/ui/input";
import CategoryShortcuts from "./home/CategoryShortcuts";
import PopularDestinations from "./home/PopularDestinations";
import { getWikipediaInfo } from "@/lib/wikipedia";

type CategoryType = "Hotel" | "Destination" | "Food" | "Shopping" | "Transport";

const Home = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<CategoryType>("Hotel");
  const [heroImage, setHeroImage] = useState<string>("");

  useEffect(() => {
    const fetchHeroImage = async () => {
      const info = await getWikipediaInfo({
        title: "Sidi_Bou_Said",
      });
      if (info?.thumbnail) {
        setHeroImage(info.thumbnail);
      }
    };

    fetchHeroImage();
  }, []);

  const handleSearch = (query: string) => {
    navigate("/discover");
  };

  const handleExplore = () => {
    navigate("/discover");
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
          <span className="text-sm">Centre Ville, Tunis</span>
        </div>
        <div className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-[#00A9FF] text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            2
          </span>
        </div>
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
        <div className="absolute bottom-0 left-0 right-0 text-white text-center pb-4">
          <h1 className="text-2xl font-bold">Where do you want to go?</h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-4">
        <div className="w-full bg-white rounded-lg shadow-sm flex items-center gap-2 border p-2">
          <Input
            type="text"
            placeholder="Explore now"
            className="flex-1 border-none bg-transparent focus-visible:ring-0"
          />
          <button
            onClick={handleExplore}
            className="bg-[#00A9FF] text-white px-6 py-2 rounded-lg"
          >
            Explore
          </button>
        </div>
      </div>

      {/* Category Icons */}
      <CategoryShortcuts
        activeCategory={activeCategory}
        onCategoryClick={handleCategoryClick}
      />

      {/* Popular Destinations */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold px-4 mb-4">
          Popular Destinations
        </h2>
        <PopularDestinations />
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
