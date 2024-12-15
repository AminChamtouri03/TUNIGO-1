import { MapPin } from "lucide-react";
import Logo from "./Logo";

interface HeaderProps {
  location?: string;
}

const Header = ({ location = "Centre Ville, Tunis" }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-gray-700">
          <MapPin className="h-4 w-4 text-[#00A9FF]" />
          <span className="text-sm">{location}</span>
        </div>
        <div className="scale-75">
          <Logo />
        </div>
      </div>
    </header>
  );
};

export default Header;
