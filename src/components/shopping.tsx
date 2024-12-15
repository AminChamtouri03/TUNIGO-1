import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ShoppingList from "./shopping/ShoppingList";

export const shoppingPlaces = [
  {
    id: "azur-city",
    title: "Azur City",
    description:
      "Modern shopping mall with international brands and entertainment facilities.",
    image: "https://dummyimage.com/600x400/cccccc/ffffff&text=Azur+City",
    images: [
      "https://dummyimage.com/600x400/cccccc/ffffff&text=Azur+City+1",
      "https://dummyimage.com/600x400/cccccc/ffffff&text=Azur+City+2",
      "https://dummyimage.com/600x400/cccccc/ffffff&text=Azur+City+3",
      "https://dummyimage.com/600x400/cccccc/ffffff&text=Azur+City+4",
    ],
    rating: 4.7,
    location: "Route de la Marsa, La Marsa",
    openHours: "10:00 AM - 10:00 PM",
    coordinates: { lat: 36.8892, lng: 10.3229 },
  },
  {
    id: "tunisia-mall",
    title: "Tunisia Mall",
    description:
      "Upscale shopping center featuring luxury brands and fine dining.",
    image: "https://dummyimage.com/600x400/cccccc/ffffff&text=Tunisia+Mall",
    images: [
      "https://dummyimage.com/600x400/cccccc/ffffff&text=Tunisia+Mall+1",
      "https://dummyimage.com/600x400/cccccc/ffffff&text=Tunisia+Mall+2",
      "https://dummyimage.com/600x400/cccccc/ffffff&text=Tunisia+Mall+3",
      "https://dummyimage.com/600x400/cccccc/ffffff&text=Tunisia+Mall+4",
    ],
    rating: 4.6,
    location: "Les Berges du Lac 2, Tunis",
    openHours: "10:00 AM - 10:00 PM",
    coordinates: { lat: 36.8432, lng: 10.2731 },
  },
  {
    id: "souk-el-attarine",
    title: "Souk El Attarine",
    description:
      "Traditional perfume and spice market in the heart of the Medina.",
    image: "https://dummyimage.com/600x400/cccccc/ffffff&text=Souk+El+Attarine",
    images: [
      "https://dummyimage.com/600x400/cccccc/ffffff&text=Souk+El+Attarine+1",
      "https://dummyimage.com/600x400/cccccc/ffffff&text=Souk+El+Attarine+2",
      "https://dummyimage.com/600x400/cccccc/ffffff&text=Souk+El+Attarine+3",
      "https://dummyimage.com/600x400/cccccc/ffffff&text=Souk+El+Attarine+4",
    ],
    rating: 4.8,
    location: "Medina of Tunis",
    openHours: "9:00 AM - 6:00 PM",
    coordinates: { lat: 36.7992, lng: 10.1706 },
  },
  {
    id: "souk-des-chechias",
    title: "Souk des Chéchias",
    description: "Historic market specializing in traditional Tunisian hats.",
    image:
      "https://dummyimage.com/600x400/cccccc/ffffff&text=Souk+des+Chechias",
    images: [
      "https://dummyimage.com/600x400/cccccc/ffffff&text=Souk+des+Chechias+1",
      "https://dummyimage.com/600x400/cccccc/ffffff&text=Souk+des+Chechias+2",
      "https://dummyimage.com/600x400/cccccc/ffffff&text=Souk+des+Chechias+3",
      "https://dummyimage.com/600x400/cccccc/ffffff&text=Souk+des+Chechias+4",
    ],
    rating: 4.5,
    location: "Medina of Tunis",
    openHours: "8:30 AM - 5:30 PM",
    coordinates: { lat: 36.7992, lng: 10.1706 },
  },
  {
    id: "souk-de-la-laine",
    title: "Souk de la Laine",
    description:
      "Traditional wool market with handcrafted textiles and carpets.",
    image: "https://dummyimage.com/600x400/cccccc/ffffff&text=Souk+de+la+Laine",
    images: [
      "https://dummyimage.com/600x400/cccccc/ffffff&text=Souk+de+la+Laine+1",
      "https://dummyimage.com/600x400/cccccc/ffffff&text=Souk+de+la+Laine+2",
      "https://dummyimage.com/600x400/cccccc/ffffff&text=Souk+de+la+Laine+3",
      "https://dummyimage.com/600x400/cccccc/ffffff&text=Souk+de+la+Laine+4",
    ],
    rating: 4.6,
    location: "Medina of Tunis",
    openHours: "9:00 AM - 6:00 PM",
    coordinates: { lat: 36.7992, lng: 10.1706 },
  },
  {
    id: "souk-el-berka",
    title: "Souk El Berka",
    description:
      "Historic gold and jewelry market with traditional craftsmanship.",
    image: "https://dummyimage.com/600x400/cccccc/ffffff&text=Souk+El+Berka",
    images: [
      "https://dummyimage.com/600x400/cccccc/ffffff&text=Souk+El+Berka+1",
      "https://dummyimage.com/600x400/cccccc/ffffff&text=Souk+El+Berka+2",
      "https://dummyimage.com/600x400/cccccc/ffffff&text=Souk+El+Berka+3",
      "https://dummyimage.com/600x400/cccccc/ffffff&text=Souk+El+Berka+4",
    ],
    rating: 4.7,
    location: "Medina of Tunis",
    openHours: "9:30 AM - 5:30 PM",
    coordinates: { lat: 36.7992, lng: 10.1706 },
  },
];

const Shopping = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPlaces, setFilteredPlaces] = useState(shoppingPlaces);

  useEffect(() => {
    if (searchQuery) {
      const filtered = shoppingPlaces.filter(
        (place) =>
          place.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          place.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredPlaces(filtered);
    } else {
      setFilteredPlaces(shoppingPlaces);
    }
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm">
        <div className="px-6 pt-14 pb-4 space-y-6">
          <h1 className="text-4xl font-bold">Shopping</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search shopping places"
              className="w-full h-12 pl-10 bg-[#F5F5F5] border-none rounded-xl text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="px-6">
        <h2 className="text-2xl font-bold mb-4">
          {searchQuery ? "Search Results" : "Shopping Places"}
        </h2>
        <ShoppingList places={filteredPlaces} />
      </div>
    </div>
  );
};

export default Shopping;
