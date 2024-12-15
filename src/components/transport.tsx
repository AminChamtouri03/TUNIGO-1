import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import TransportList from "./transport/TransportList";

export const transportOptions = [
  {
    id: "collective-taxi",
    title: "Collective Taxi",
    description:
      "Shared taxi service connecting different areas of the city at fixed routes and affordable prices.",
    image: "https://dummyimage.com/600x400/cccccc/ffffff&text=Collective+Taxi",
    rating: 4.4,
    types: ["Fixed Routes", "Shared Rides"],
    priceRange: "1-3 DT",
    availability: "6:00 AM - 8:00 PM",
    safetyTips: [
      "Wait at designated stops only",
      "Confirm price before boarding",
      "Share ride with other passengers",
    ],
    routes: [
      {
        from: "Centre Ville",
        to: "La Marsa",
        price: "2 DT",
        duration: "30 mins",
      },
      {
        from: "Bab Saadoun",
        to: "Ariana",
        price: "1.5 DT",
        duration: "20 mins",
      },
      {
        from: "Place Barcelone",
        to: "Le Kram",
        price: "2 DT",
        duration: "25 mins",
      },
    ],
  },
  {
    id: "taxi",
    title: "Taxi Services",
    description:
      "Traditional yellow taxis and ride-hailing apps available throughout the city.",
    image: "https://dummyimage.com/600x400/cccccc/ffffff&text=Taxi+Services",
    rating: 4.5,
    types: ["Yellow Taxi", "Bolt", "InDriver"],
    priceRange: "2-20 DT",
    availability: "24/7",
    safetyTips: [
      "Use official yellow taxis or verified ride-hailing apps",
      "Ensure meter is running in yellow taxis",
      "Share ride details with trusted contacts",
    ],
  },
  {
    id: "bus",
    title: "Public Bus Network",
    description:
      "Extensive bus network connecting major areas of Tunis and suburbs.",
    image: "https://dummyimage.com/600x400/cccccc/ffffff&text=Bus+Network",
    rating: 4.0,
    types: ["City Bus", "Regional Bus"],
    priceRange: "0.5-2 DT",
    availability: "5:00 AM - 10:00 PM",
    safetyTips: [
      "Keep valuables secure",
      "Travel in groups during off-peak hours",
      "Have exact change ready",
    ],
  },
  {
    id: "metro",
    title: "Metro Light Rail",
    description:
      "Modern light rail system serving Tunis and surrounding areas.",
    image: "https://dummyimage.com/600x400/cccccc/ffffff&text=Metro",
    rating: 4.3,
    types: ["TGM", "Metro Lines 1-6"],
    priceRange: "0.5-1.5 DT",
    availability: "5:30 AM - 10:30 PM",
    safetyTips: [
      "Mind the gap when boarding",
      "Hold onto handrails",
      "Keep your ticket until exit",
    ],
  },
  {
    id: "train",
    title: "SNCFT Trains",
    description: "Inter-city train services connecting major Tunisian cities.",
    image: "https://dummyimage.com/600x400/cccccc/ffffff&text=Trains",
    rating: 4.2,
    types: ["Regional", "Long Distance", "Express"],
    priceRange: "5-40 DT",
    availability: "6:00 AM - 10:00 PM",
    safetyTips: [
      "Book tickets in advance",
      "Keep luggage in designated areas",
      "Verify train schedule before travel",
    ],
  },
];

const Transport = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(transportOptions);

  useEffect(() => {
    if (searchQuery) {
      const filtered = transportOptions.filter(
        (option) =>
          option.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          option.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(transportOptions);
    }
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm">
        <div className="px-6 pt-14 pb-4 space-y-6">
          <h1 className="text-4xl font-bold">Transport</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search transport options"
              className="w-full h-12 pl-10 bg-[#F5F5F5] border-none rounded-xl text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="px-6">
        <h2 className="text-2xl font-bold mb-4">
          {searchQuery ? "Search Results" : "Available Options"}
        </h2>
        <TransportList options={filteredOptions} />
      </div>
    </div>
  );
};

export default Transport;
