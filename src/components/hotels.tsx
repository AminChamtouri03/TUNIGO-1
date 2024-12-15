import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import HotelList from "./hotels/HotelList";
import { hotelsList } from "@/data/hotels";

const Hotels = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredHotels, setFilteredHotels] = useState(hotelsList);

  useEffect(() => {
    if (searchQuery) {
      const filtered = hotelsList.filter(
        (hotel) =>
          hotel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hotel.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hotel.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredHotels(filtered);
    } else {
      setFilteredHotels(hotelsList);
    }
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm">
        <div className="px-6 pt-14 pb-4 space-y-6">
          <h1 className="text-4xl font-bold">Hotels</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search hotels"
              className="w-full h-12 pl-10 bg-[#F5F5F5] border-none rounded-xl text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="px-6">
        <h2 className="text-2xl font-bold mb-4">
          {searchQuery ? "Search Results" : "Available Hotels"}
        </h2>
        <HotelList hotels={filteredHotels} />
      </div>
    </div>
  );
};

export default Hotels;
