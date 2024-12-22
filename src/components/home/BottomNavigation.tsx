import { Home as HomeIcon, Search, MapPin, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type NavigationItem = {
  icon: typeof HomeIcon;
  label: string;
  path: string;
};

interface BottomNavigationProps {
  className?: string;
  onItemClick?: (label: string) => void;
}

const navigationItems: NavigationItem[] = [
  { icon: HomeIcon, label: "Home", path: "/" },
  { icon: Search, label: "Discover", path: "/discover" },
  { icon: MapPin, label: "Map", path: "/map" },
  { icon: User, label: "Profile", path: "/profile" },
];

const BottomNavigation = ({
  className = "",
  onItemClick = () => {},
}: BottomNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const getActiveItem = (pathname: string) => {
    if (pathname === "/") return "Home";
    const path = pathname.split("/")[1];
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  const activeItem = getActiveItem(location.pathname);

  const handleClick = (item: NavigationItem) => {
    if (item.label === "Profile" && !isAuthenticated) {
      navigate("/guest-profile");
    } else {
      onItemClick(item.label);
      navigate(item.path);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50">
      <div className="w-[390px] bg-white border-t border-gray-100">
        <div className="flex items-center justify-around py-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.label === activeItem;

            return (
              <button
                key={item.label}
                className="flex flex-col items-center gap-1 p-2 min-w-[64px]"
                onClick={() => handleClick(item)}
              >
                <Icon
                  className={cn(
                    "h-6 w-6",
                    isActive ? "text-[#00A9FF]" : "text-gray-400",
                  )}
                />
                <span
                  className={cn(
                    "text-[10px]",
                    isActive ? "text-[#00A9FF]" : "text-gray-400",
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
