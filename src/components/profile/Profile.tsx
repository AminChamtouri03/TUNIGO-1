import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  User,
  ArrowLeft,
  Camera,
  Trash2,
  LogOut,
  Edit2,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";

const DEFAULT_PROFILE_IMAGE =
  "https://dummyimage.com/200x200/cccccc/ffffff&text=User";

const Profile = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string>(
    DEFAULT_PROFILE_IMAGE,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    occupation: "",
    nationality: "",
    bio: "",
  });

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        age: profile.age?.toString() || "",
        occupation: profile.occupation || "",
        nationality: profile.nationality || "",
        bio: profile.bio || "",
      });
      if (profile.preferences && (profile.preferences as any).profileImage) {
        setProfileImage((profile.preferences as any).profileImage);
      }
    }
  }, [profile]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        setProfileImage(base64String);

        if (profile) {
          await updateProfile({
            preferences: {
              ...profile.preferences,
              profileImage: base64String,
            },
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = async () => {
    setProfileImage(DEFAULT_PROFILE_IMAGE);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (profile) {
      const { profileImage, ...restPreferences } = profile.preferences as any;
      await updateProfile({
        preferences: restPreferences,
      });
    }
  };

  const handleSave = async () => {
    if (profile) {
      await updateProfile({
        name: formData.name,
        age: formData.age ? parseInt(formData.age) : undefined,
        occupation: formData.occupation,
        nationality: formData.nationality,
        bio: formData.bio,
      });
      setIsEditing(false);
    }
  };

  const handleDisconnect = async () => {
    await logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profile || !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>Profile not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
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
      <div className="pt-16">
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
              {profileImage !== DEFAULT_PROFILE_IMAGE && (
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

          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-center">
              {profile.name}
            </h1>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <Save className="h-4 w-4 text-green-500" />
              ) : (
                <Edit2 className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>

        {/* Profile Information */}
        <div className="p-4 space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Age</label>
              <Input
                type="number"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Occupation</label>
              <Input
                value={formData.occupation}
                onChange={(e) =>
                  setFormData({ ...formData, occupation: e.target.value })
                }
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Nationality</label>
              <Input
                value={formData.nationality}
                onChange={(e) =>
                  setFormData({ ...formData, nationality: e.target.value })
                }
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Bio</label>
              <Textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                disabled={!isEditing}
                rows={4}
              />
            </div>
          </div>

          {isEditing && (
            <Button
              className="w-full bg-[#00A9FF] hover:bg-[#00A9FF]/90 text-white"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          )}

          <Button
            variant="destructive"
            className="w-full mt-8"
            onClick={handleDisconnect}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
