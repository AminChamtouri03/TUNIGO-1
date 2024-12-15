import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onExplore?: () => void;
}

const SearchBar = ({
  placeholder = "Where do you want to go?",
  onSearch = () => {},
  onExplore = () => {},
}: SearchBarProps) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-0 -top-[120px] bg-gradient-to-b from-black/60 to-transparent z-10 pointer-events-none" />
      <h1 className="absolute top-0 left-0 right-0 -translate-y-16 text-2xl font-semibold text-white text-center z-20">
        Where do you want to go?
      </h1>
      <div className="relative flex items-center gap-2 w-full bg-white rounded-lg p-2 shadow-sm z-30">
        <div className="flex-1 flex items-center gap-2">
          <Search className="h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Explore now"
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <Button
          className="bg-[#00A9FF] hover:bg-[#00A9FF]/90 text-white px-6"
          onClick={onExplore}
        >
          Explore
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
