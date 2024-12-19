import { useNavigate } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const GuestProfile = () => {
  const navigate = useNavigate();

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
          <div className="w-8" />
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 pb-20">
        {/* Guest Profile Section */}
        <div className="flex flex-col items-center px-4 py-12 bg-gray-50">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
            <User className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="text-xl font-semibold text-center mb-2">
            Welcome to TUNIGO
          </h1>
          <p className="text-sm text-gray-500 text-center mb-6">
            Sign in to access your profile, save favorites, and more
          </p>
          <Button
            className="w-full max-w-sm bg-[#00A9FF] hover:bg-[#00A9FF]/90 text-white py-6"
            onClick={() => navigate("/login")}
          >
            Sign In
          </Button>
          <p className="mt-4 text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-[#00A9FF] hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>

        {/* Features Preview */}
        <div className="px-4 py-8 space-y-6">
          <h2 className="text-lg font-semibold mb-4">
            What you can do with an account:
          </h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="h-8 w-8 rounded-full bg-[#00A9FF]/10 flex items-center justify-center">
                <User className="h-4 w-4 text-[#00A9FF]" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Personalized Experience</h3>
                <p className="text-sm text-gray-600">
                  Get recommendations based on your preferences
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="h-8 w-8 rounded-full bg-[#00A9FF]/10 flex items-center justify-center">
                <User className="h-4 w-4 text-[#00A9FF]" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Save Favorites</h3>
                <p className="text-sm text-gray-600">
                  Keep track of places you want to visit
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="h-8 w-8 rounded-full bg-[#00A9FF]/10 flex items-center justify-center">
                <User className="h-4 w-4 text-[#00A9FF]" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Write Reviews</h3>
                <p className="text-sm text-gray-600">
                  Share your experiences with other travelers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestProfile;
