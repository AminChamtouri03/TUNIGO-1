import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Star, Navigation2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserInteractions } from "@/contexts/UserInteractionsContext";
import { shoppingPlaces } from "../shopping";

const ShoppingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addRating, getRating } = useUserInteractions();
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const place = shoppingPlaces.find((p) => p.id === id);
  const userRating = getRating(place?.id || "");

  if (!place) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Shopping place not found</p>
      </div>
    );
  }

  const handleRating = (rating: number) => {
    addRating(place.id, rating);
    setHoveredRating(null);
  };

  const handleVisitNow = () => {
    window.open(
      `https://www.google.com/maps/search/${encodeURIComponent(`${place.title} ${place.location} Tunisia`)}`,
      "_blank",
    );
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header Image */}
      <div className="relative h-[240px]">
        <img
          src={place.images[selectedImageIndex]}
          alt={place.title}
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

        {/* Image Gallery Dots */}
        {place.images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
            {place.images.map((_, index) => (
              <button
                key={index}
                className={`w-1.5 h-1.5 rounded-full ${selectedImageIndex === index ? "bg-white" : "bg-white/50"}`}
                onClick={() => setSelectedImageIndex(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">{place.title}</h1>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{place.location}</span>
            </div>
          </div>
        </div>

        {/* Visit Now Button */}
        <Button
          className="w-full bg-[#00A9FF] hover:bg-[#00A9FF]/90 text-white mb-4 py-6"
          onClick={handleVisitNow}
        >
          <Navigation2 className="mr-2 h-5 w-5" />
          Visit Now
        </Button>

        {/* Rating Section */}
        <div className="flex flex-col gap-3 mb-4">
          {/* General Rating */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Star
                  key={rating}
                  className={`w-5 h-5 ${rating <= place.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {place.rating}/5 • General Rating
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
              {userRating ? `${userRating}/5 • Your Rating` : "Rate this place"}
            </span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="w-full grid grid-cols-3 sticky top-0 bg-white z-40">
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="hours">Hours</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="p-4 space-y-4">
          <p className="text-gray-600 text-sm leading-relaxed">
            {place.description}
          </p>
        </TabsContent>

        <TabsContent value="gallery" className="p-4">
          <div className="grid grid-cols-2 gap-2">
            {place.images.map((image, index) => (
              <div
                key={index}
                className="aspect-square rounded-lg overflow-hidden cursor-pointer"
                onClick={() => setSelectedImageIndex(index)}
              >
                <img
                  src={image}
                  alt={`${place.title} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="hours" className="p-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{place.openHours}</span>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShoppingDetails;
