import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Star, Navigation2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserInteractions } from "@/contexts/UserInteractionsContext";
import { tunisianFoods } from "../food";

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addRating, getRating } = useUserInteractions();
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const food = tunisianFoods.find((f) => f.id === id);
  const userRating = getRating(food?.id || "");

  if (!food) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Food not found</p>
      </div>
    );
  }

  const handleRating = (rating: number) => {
    addRating(food.id, rating);
    setHoveredRating(null);
  };

  const handleVisitNow = () => {
    window.open(
      `https://www.google.com/maps/search/${encodeURIComponent(`${food.title} ${food.location} Tunisia`)}`,
      "_blank",
    );
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header Image */}
      <div className="relative h-[240px]">
        <img
          src={food.image}
          alt={food.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-[#F5F5F5] hover:bg-[#F5F5F5]/90"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">{food.title}</h1>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{food.location}</span>
            </div>
          </div>
          <span className="text-[#00A9FF] font-semibold">{food.price}</span>
        </div>

        {/* Find Now Button */}
        <Button
          className="w-full bg-[#00A9FF] hover:bg-[#00A9FF]/90 text-white mb-4 py-6"
          onClick={handleVisitNow}
        >
          <Navigation2 className="mr-2 h-5 w-5" />
          Find Places
        </Button>

        {/* Rating Section */}
        <div className="flex flex-col gap-3 mb-4">
          {/* General Rating */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Star
                  key={rating}
                  className={`w-5 h-5 ${rating <= food.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {food.rating}/5 • General Rating
            </span>
          </div>

          {/* User Rating */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  className="relative p-1"
                  onMouseEnter={() => setHoveredRating(rating)}
                  onMouseLeave={() => setHoveredRating(null)}
                  onClick={() => handleRating(rating)}
                >
                  <Star
                    className={`w-5 h-5 ${rating <= (hoveredRating || userRating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                </button>
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {userRating ? `${userRating}/5 • Your Rating` : "Rate this dish"}
            </span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="w-full grid grid-cols-2 sticky top-0 bg-white z-40">
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="p-4 space-y-4">
          <p className="text-gray-600 text-sm leading-relaxed">
            {food.description}
          </p>
        </TabsContent>

        <TabsContent value="ingredients" className="p-4">
          <p className="text-gray-600 text-sm leading-relaxed">
            Traditional ingredients and preparation method coming soon...
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FoodDetails;
