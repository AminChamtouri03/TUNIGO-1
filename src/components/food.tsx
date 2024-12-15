import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import FoodList from "./food/FoodList";

export const tunisianFoods = [
  {
    id: "brik",
    title: "Brik",
    description:
      "Crispy pastry filled with egg, tuna, cheese, or meat, a popular Tunisian appetizer.",
    image: "https://dummyimage.com/600x400/cccccc/ffffff&text=Brik",
    rating: 4.8,
    price: "5 DT",
    location: "Traditional Restaurants",
  },
  {
    id: "couscous",
    title: "Tunisian Couscous",
    description:
      "Traditional semolina dish served with vegetables, meat, and flavorful broth.",
    image: "https://dummyimage.com/600x400/cccccc/ffffff&text=Couscous",
    rating: 4.9,
    price: "15 DT",
    location: "Local Eateries",
  },
  {
    id: "fricasse",
    title: "Fricassé",
    description:
      "Tunisian sandwich filled with tuna, olives, eggs, and harissa.",
    image: "https://dummyimage.com/600x400/cccccc/ffffff&text=Fricasse",
    rating: 4.7,
    price: "7 DT",
    location: "Street Food",
  },
  {
    id: "mechouia",
    title: "Mechouia Salad",
    description: "Grilled vegetable salad with peppers, tomatoes, and garlic.",
    image: "https://dummyimage.com/600x400/cccccc/ffffff&text=Mechouia",
    rating: 4.6,
    price: "8 DT",
    location: "Restaurants",
  },
  {
    id: "lablabi",
    title: "Lablabi",
    description: "Chickpea soup served with bread, harissa, and spices.",
    image: "https://dummyimage.com/600x400/cccccc/ffffff&text=Lablabi",
    rating: 4.5,
    price: "6 DT",
    location: "Street Food",
  },
  {
    id: "tajine",
    title: "Tunisian Tajine",
    description: "Baked egg dish with meat, cheese, and vegetables.",
    image: "https://dummyimage.com/600x400/cccccc/ffffff&text=Tajine",
    rating: 4.7,
    price: "12 DT",
    location: "Traditional Restaurants",
  },
  {
    id: "kafteji",
    title: "Kafteji",
    description: "Mixed vegetable dish with eggs and fried potatoes.",
    image: "https://dummyimage.com/600x400/cccccc/ffffff&text=Kafteji",
    rating: 4.6,
    price: "8 DT",
    location: "Street Food",
  },
  {
    id: "bambalouni",
    title: "Bambalouni",
    description: "Sweet fried doughnut sprinkled with sugar.",
    image: "https://dummyimage.com/600x400/cccccc/ffffff&text=Bambalouni",
    rating: 4.8,
    price: "3 DT",
    location: "Street Vendors",
  },
  {
    id: "shakshuka",
    title: "Shakshuka",
    description: "Eggs poached in tomato sauce with peppers and spices.",
    image: "https://dummyimage.com/600x400/cccccc/ffffff&text=Shakshuka",
    rating: 4.7,
    price: "10 DT",
    location: "Cafes & Restaurants",
  },
];

const Food = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFoods, setFilteredFoods] = useState(tunisianFoods);

  useEffect(() => {
    if (searchQuery) {
      const filtered = tunisianFoods.filter(
        (food) =>
          food.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          food.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredFoods(filtered);
    } else {
      setFilteredFoods(tunisianFoods);
    }
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm">
        <div className="px-6 pt-14 pb-4 space-y-6">
          <h1 className="text-4xl font-bold">Tunisian Food</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search dishes"
              className="w-full h-12 pl-10 bg-[#F5F5F5] border-none rounded-xl text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="px-6">
        <h2 className="text-2xl font-bold mb-4">
          {searchQuery ? "Search Results" : "Traditional Dishes"}
        </h2>
        <FoodList foods={filteredFoods} />
      </div>
    </div>
  );
};

export default Food;
