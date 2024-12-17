import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import DestinationList from "./discover/DestinationList";
import { destinationsList } from "@/data/destinations";
import { useLocation } from "react-router-dom";

const Discover = () => {
  const location = useLocation();
  const initialSearch = location.state?.searchQuery || "";
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [filteredDestinations, setFilteredDestinations] =
    useState(destinationsList);

  useEffect(() => {
    if (searchQuery) {
      const filtered = destinationsList.filter(
        (destination) =>
          destination.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          destination.location
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          destination.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
      setFilteredDestinations(filtered);
    } else {
      setFilteredDestinations(destinationsList);
    }
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm">
        <div className="px-6 pt-14 pb-4 space-y-6">
          <h1 className="text-4xl font-bold">Discover</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search destinations"
              className="w-full h-12 pl-10 bg-[#F5F5F5] border-none rounded-xl text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="px-6">
        <h2 className="text-2xl font-bold mb-4">
          {searchQuery ? "Search Results" : "Popular Destinations"}
        </h2>
        <DestinationList destinations={filteredDestinations} />
      </div>
    </div>
  );
};

export default Discover;
