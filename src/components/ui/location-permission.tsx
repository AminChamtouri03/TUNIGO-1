import { MapPin, Settings } from "lucide-react";
import { Button } from "./button";

interface LocationPermissionProps {
  onRequestPermission: () => void;
  onSkip: () => void;
  permissionDenied?: boolean;
}

export function LocationPermission({
  onRequestPermission,
  onSkip,
  permissionDenied = false,
}: LocationPermissionProps) {
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header with icons */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex gap-8 mx-auto">
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 flex items-center justify-center">
              <img src="/hotel-icon.png" alt="Hotel" className="w-5 h-5" />
            </div>
            <span className="text-xs">Hotel</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 flex items-center justify-center">
              <img
                src="/destination-icon.png"
                alt="Destination"
                className="w-5 h-5"
              />
            </div>
            <span className="text-xs">Destination</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 flex items-center justify-center">
              <img src="/food-icon.png" alt="Food" className="w-5 h-5" />
            </div>
            <span className="text-xs">Food</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 flex items-center justify-center">
              <img
                src="/shopping-icon.png"
                alt="Shopping"
                className="w-5 h-5"
              />
            </div>
            <span className="text-xs">Shopping</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 flex items-center justify-center">
              <img
                src="/transport-icon.png"
                alt="Transport"
                className="w-5 h-5"
              />
            </div>
            <span className="text-xs">Transport</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 -mt-8">
        <h2 className="text-xl font-semibold mb-2">
          {permissionDenied ? "Location Access Denied" : "Nearby Destinations"}
        </h2>
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
          <MapPin className="h-6 w-6 text-[#00A9FF]" />
        </div>
        <p className="text-center text-gray-600 mb-8 max-w-[280px]">
          {permissionDenied
            ? "Please enable location access in your browser settings to see nearby places and get directions."
            : "Please enable location access in your browser settings to see nearby places and get directions."}
        </p>

        {permissionDenied ? (
          <div className="w-full space-y-3 max-w-[280px]">
            <Button
              className="w-full bg-[#00A9FF] hover:bg-[#00A9FF]/90 h-12"
              onClick={onRequestPermission}
            >
              <Settings className="mr-2 h-4 w-4" />
              Open Settings
            </Button>
            <Button variant="outline" className="w-full h-12" onClick={onSkip}>
              Continue Without Location
            </Button>
          </div>
        ) : (
          <div className="w-full space-y-3 max-w-[280px]">
            <Button
              className="w-full bg-[#00A9FF] hover:bg-[#00A9FF]/90 h-12"
              onClick={onRequestPermission}
            >
              Allow Location Access
            </Button>
            <Button variant="outline" className="w-full h-12" onClick={onSkip}>
              Not Now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
