import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Star,
  Navigation2,
  Clock,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserInteractions } from "@/contexts/UserInteractionsContext";
import { transportOptions } from "../transport";

const TransportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addRating, getRating } = useUserInteractions();
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const option = transportOptions.find((o) => o.id === id);
  const userRating = getRating(option?.id || "");

  if (!option) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Transport option not found</p>
      </div>
    );
  }

  const handleRating = (rating: number) => {
    addRating(option.id, rating);
    setHoveredRating(null);
  };

  const handleBookNow = () => {
    window.open(
      `https://www.google.com/maps/search/${encodeURIComponent(`${option.title} ${option.types[0]} Tunisia`)}`,
      "_blank",
    );
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header Image */}
      <div className="relative h-[240px]">
        <img
          src={option.image}
          alt={option.title}
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
            <h1 className="text-2xl font-bold mb-2">{option.title}</h1>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{option.availability}</span>
            </div>
          </div>
          <span className="text-[#00A9FF] font-semibold">
            {option.priceRange}
          </span>
        </div>

        {/* Book Now Button */}
        <Button
          className="w-full bg-[#00A9FF] hover:bg-[#00A9FF]/90 text-white mb-4 py-6"
          onClick={handleBookNow}
        >
          <Navigation2 className="mr-2 h-5 w-5" />
          Find Now
        </Button>

        {/* Rating Section */}
        <div className="flex flex-col gap-3 mb-4">
          {/* General Rating */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Star
                  key={rating}
                  className={`w-5 h-5 ${rating <= option.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {option.rating}/5 • General Rating
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
              {userRating
                ? `${userRating}/5 • Your Rating`
                : "Rate this service"}
            </span>
          </div>
        </div>

        {/* Available Types */}
        <div className="flex flex-wrap gap-2 mb-4">
          {option.types.map((type) => (
            <span
              key={type}
              className="text-sm bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full"
            >
              {type}
            </span>
          ))}
        </div>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="w-full grid grid-cols-2 sticky top-0 bg-white z-40">
          <TabsTrigger value="info">Routes & Hours</TabsTrigger>
          <TabsTrigger value="safety">Safety Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="p-4 space-y-4">
          <p className="text-gray-600 text-sm leading-relaxed">
            {option.description}
          </p>

          {/* Operating Hours */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Operating Hours</h3>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{option.availability}</span>
            </div>
          </div>

          {/* Routes if available */}
          {option.routes && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Popular Routes</h3>
              <div className="space-y-3">
                {option.routes.map((route, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-3 rounded-lg space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <div className="font-medium">
                          {route.from} → {route.to}
                        </div>
                        <div className="text-sm text-gray-500">
                          {route.duration}
                        </div>
                      </div>
                      <div className="text-[#00A9FF] font-semibold">
                        {route.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="safety" className="p-4">
          <div className="space-y-3">
            {option.safetyTips.map((tip, index) => (
              <div key={index} className="flex items-start gap-2">
                <Info className="h-4 w-4 text-[#00A9FF] mt-0.5" />
                <p className="text-sm text-gray-600">{tip}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransportDetails;
