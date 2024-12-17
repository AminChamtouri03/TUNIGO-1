import {
  MapPin,
  Flag,
  User,
  Briefcase,
  ArrowLeft,
  Camera,
  Trash2,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DestinationList from "../discover/DestinationList";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useAuth } from "@/contexts/AuthContext";
import { destinations } from "@/data/destinations";
import { useState, useRef } from "react";

interface ProfileProps {
  user?: {
    name: string;
    nationality: string;
    age: number;
    occupation: string;
    location: string;
  };
}

const DEFAULT_PROFILE_IMAGE =
  "https://dummyimage.com/200x200/cccccc/ffffff&text=User";

const Profile = ({
  user = {
    name: "Sarah Smith",
    nationality: "American",
    age: 28,
    occupation: "Travel Blogger",
    location: "Currently in Tunis",
  },
}: ProfileProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { favorites } = useFavorites();
  const favoriteDestinations = favorites
    .map((id) => destinations[id])
    .filter(Boolean);
  const [profileImage, setProfileImage] = useState<string>(
    DEFAULT_PROFILE_IMAGE,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfileImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(DEFAULT_PROFILE_IMAGE);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDisconnect = () => {
    logout();
    navigate("/login");
  };

  const isDefaultImage = profileImage === DEFAULT_PROFILE_IMAGE;

  return (
    <div className="min-h-screen bg-white">
      {/* Profile Bar */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 bg-white z-50 shadow-sm w-full max-w-[390px]">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium">Profile</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleDisconnect}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 pb-20">
        {/* Profile Picture */}
        <div className="flex flex-col items-center px-4 py-6 bg-gray-50">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-4 right-0 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-white shadow-md hover:bg-gray-100"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-4 w-4" />
              </Button>
              {!isDefaultImage && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white shadow-md hover:bg-gray-100"
                  onClick={handleRemoveImage}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
          </div>
          <h1 className="text-xl font-semibold text-center">{user.name}</h1>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="w-full grid grid-cols-2 sticky top-[64px] bg-white z-40">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-6 px-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Flag className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{user.nationality}</span>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{user.age} years old</span>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{user.occupation}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{user.location}</span>
              </div>
            </div>

            {/* Disconnect Button */}
            <Button
              variant="destructive"
              className="w-full mt-8"
              onClick={handleDisconnect}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Disconnect
            </Button>
          </TabsContent>

          <TabsContent value="favorites" className="mt-6 px-4">
            <DestinationList destinations={favoriteDestinations} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
