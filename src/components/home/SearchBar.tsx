import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

const SearchBar = ({
  placeholder = "Where do you want to go?",
  onSearch = () => {},
}: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg flex items-center gap-2 border p-2">
      <div className="flex-1 flex items-center gap-2">
        <Search className="h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Explore now"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1 border-none bg-transparent focus-visible:ring-0"
        />
      </div>
      <Button
        onClick={handleSearch}
        className="bg-[#00A9FF] text-white px-6 hover:bg-[#00A9FF]/90"
      >
        Explore
      </Button>
    </div>
  );
};

export default SearchBar;
