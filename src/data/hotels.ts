export const hotels = {
  "dar-el-jeld": {
    id: "dar-el-jeld",
    title: "Dar El Jeld Hotel & Spa",
    image: "https://dummyimage.com/600x400/cccccc/ffffff&text=Dar+El+Jeld+1",
    location: "Medina, Tunis",
    description:
      "Luxury hotel in a restored Ottoman mansion with traditional architecture.",
    coordinates: { lat: 36.7992, lng: 10.1706 },
    rating: 4.8,
    prices: {
      standard: 350,
      deluxe: 500,
      suite: 750,
    },
    amenities: ["Spa", "Restaurant", "WiFi", "Room Service"],
    reviews: [
      {
        id: "1",
        user: "John Smith",
        comment: "Exceptional service and beautiful architecture!",
        date: "2 days ago",
      },
    ],
  },
  "royal-victoria": {
    id: "royal-victoria",
    title: "Hotel Royal Victoria",
    image: "https://dummyimage.com/600x400/cccccc/ffffff&text=Royal+Victoria",
    location: "Downtown, Tunis",
    description: "Historic hotel with colonial charm and modern amenities.",
    coordinates: { lat: 36.8002, lng: 10.1716 },
    rating: 4.5,
    prices: {
      standard: 200,
      deluxe: 300,
      suite: 450,
    },
    amenities: ["Restaurant", "Bar", "WiFi", "Parking"],
    reviews: [
      {
        id: "1",
        user: "Emma Wilson",
        comment: "Great location and friendly staff!",
        date: "1 week ago",
      },
    ],
  },
  "novotel-tunis": {
    id: "novotel-tunis",
    title: "Novotel Tunis Lac",
    image: "https://dummyimage.com/600x400/cccccc/ffffff&text=Novotel+Tunis",
    location: "Les Berges du Lac, Tunis",
    description: "Modern business hotel overlooking Lake Tunis.",
    coordinates: { lat: 36.8322, lng: 10.2291 },
    rating: 4.3,
    prices: {
      standard: 180,
      deluxe: 280,
      suite: 400,
    },
    amenities: ["Pool", "Gym", "Restaurant", "Business Center"],
    reviews: [
      {
        id: "1",
        user: "David Chen",
        comment: "Perfect for business travelers!",
        date: "3 days ago",
      },
    ],
  },
  "movenpick-lac": {
    id: "movenpick-lac",
    title: "Movenpick Hotel Du Lac Tunis",
    image: "https://dummyimage.com/600x400/cccccc/ffffff&text=Movenpick+Hotel",
    location: "Les Berges du Lac, Tunis",
    description:
      "Luxury lakeside hotel with stunning views and premium amenities.",
    coordinates: { lat: 36.8342, lng: 10.2311 },
    rating: 4.7,
    prices: {
      standard: 320,
      deluxe: 450,
      suite: 650,
    },
    amenities: ["Spa", "Pool", "Multiple Restaurants", "Fitness Center"],
    reviews: [
      {
        id: "1",
        user: "Sarah Johnson",
        comment: "Breathtaking lake views and excellent service!",
        date: "5 days ago",
      },
    ],
  },
  "le-corail": {
    id: "le-corail",
    title: "Le Corail Suites Hotel",
    image: "https://dummyimage.com/600x400/cccccc/ffffff&text=Le+Corail",
    location: "Les Berges du Lac, Tunis",
    description: "All-suite hotel offering comfortable extended stays.",
    coordinates: { lat: 36.8312, lng: 10.2281 },
    rating: 4.2,
    prices: {
      standard: 150,
      deluxe: 220,
      suite: 300,
    },
    amenities: ["Kitchenette", "WiFi", "Parking", "Business Center"],
    reviews: [
      {
        id: "1",
        user: "Michael Brown",
        comment: "Great for long-term stays!",
        date: "1 week ago",
      },
    ],
  },
  "belvedere-fourati": {
    id: "belvedere-fourati",
    title: "Hotel Belvedere Fourati",
    image:
      "https://dummyimage.com/600x400/cccccc/ffffff&text=Belvedere+Fourati",
    location: "Belvedere, Tunis",
    description: "Charming hotel in the heart of the Belvedere district.",
    coordinates: { lat: 36.8102, lng: 10.1796 },
    rating: 4.0,
    prices: {
      standard: 130,
      deluxe: 200,
      suite: 280,
    },
    amenities: ["Restaurant", "WiFi", "Room Service", "Meeting Rooms"],
    reviews: [
      {
        id: "1",
        user: "Lisa Anderson",
        comment: "Convenient location and helpful staff.",
        date: "4 days ago",
      },
    ],
  },
};

export const hotelsList = Object.values(hotels);
