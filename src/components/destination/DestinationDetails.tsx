import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Heart,
  ArrowLeft,
  MapPin,
  Clock,
  Star,
  Navigation2,
  Upload,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useUserInteractions } from "@/contexts/UserInteractionsContext";
import { destinations } from "@/data/destinations";
import { getWikipediaInfo } from "@/lib/wikipedia";

interface WikiInfo {
  extract: string;
  thumbnail: string;
  url: string;
  additionalImages: string[];
}

const DestinationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addComment, removeComment, getUserComments, addRating, getRating } =
    useUserInteractions();
  const destination = id ? destinations[id] : null;
  const [wikiInfo, setWikiInfo] = useState<WikiInfo | null>(null);
  const [newComment, setNewComment] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [userImages, setUserImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const userRating = getRating(destination?.id || "");

  useEffect(() => {
    const fetchWikiInfo = async () => {
      if (destination?.wikipedia?.title || destination?.title) {
        const info = await getWikipediaInfo(
          destination.wikipedia || { title: destination.title },
        );
        if (info) {
          setWikiInfo(info);
        }
      }
    };

    fetchWikiInfo();
  }, [destination]);

  if (!destination) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Destination not found</p>
      </div>
    );
  }

  const defaultImages = [
    wikiInfo?.thumbnail || destination.image,
    ...(wikiInfo?.additionalImages || destination.additionalImages || []),
  ].filter(Boolean);

  const images = [...defaultImages, ...userImages];

  const userComments = getUserComments(destination.id);
  const allComments = [...(destination.reviews || []), ...userComments];

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(destination.id, newComment);
      setNewComment("");
    }
  };

  const handleRating = (rating: number) => {
    addRating(destination.id, rating);
    setHoveredRating(null);
  };

  const handleVisitNow = () => {
    const { lat, lng } = destination.coordinates;
    const query = encodeURIComponent(
      `${destination.title}, ${destination.location}`,
    );
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}&center=${lat},${lng}`,
      "_blank",
    );
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setUserImages((prev) => [...prev, base64String]);
        setSelectedImageIndex(images.length); // Select the newly added image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (index: number) => {
    const userImageIndex = index - defaultImages.length;
    if (userImageIndex >= 0) {
      setUserImages((prev) => prev.filter((_, i) => i !== userImageIndex));
      setSelectedImageIndex(0);
    }
  };

  const isUserImage = (index: number) => index >= defaultImages.length;

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header Image */}
      <div className="relative h-[240px]">
        <img
          src={images[selectedImageIndex]}
          alt={destination.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
            onClick={() => toggleFavorite(destination.id)}
          >
            <Heart
              className={`h-5 w-5 ${isFavorite(destination.id) ? "fill-[#FF2D55] text-[#FF2D55]" : "text-gray-700"}`}
            />
          </Button>
        </div>

        {/* Image Gallery Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
            {images.map((_, index) => (
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
        <h1 className="text-2xl font-bold mb-2">{destination.title}</h1>
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{destination.location}</span>
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
                  className={`w-5 h-5 ${rating <= destination.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {destination.rating}/5 • General Rating
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
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="p-4 space-y-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{destination.openHours}</span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            {wikiInfo?.extract || destination.description}
          </p>
          {wikiInfo?.url && (
            <a
              href={wikiInfo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-[#00A9FF] text-white py-2 rounded-lg mt-4"
            >
              Read more on Wikipedia
            </a>
          )}
        </TabsContent>

        <TabsContent value="gallery" className="p-4">
          <div className="flex justify-end mb-4">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Add Photo
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {images.map((image, index) => (
              <div
                key={index}
                className="group relative aspect-square rounded-lg overflow-hidden"
                onClick={() => setSelectedImageIndex(index)}
              >
                <img
                  src={image}
                  alt={`${destination.title} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {isUserImage(index) && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(index);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="comments" className="p-4 pb-24">
          <div className="flex gap-2 mb-4 sticky top-[49px] bg-white z-30 py-2">
            <Input
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAddComment}>Post</Button>
          </div>

          <div className="space-y-4">
            {allComments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{comment.user}</p>
                    <p className="text-sm text-gray-500">{comment.date}</p>
                  </div>
                  {comment.user === "You" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeComment(comment.id)}
                      className="text-red-500 hover:text-red-600 -mt-1 h-8"
                    >
                      Delete
                    </Button>
                  )}
                </div>
                <p className="text-sm text-gray-600">{comment.comment}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DestinationDetails;
