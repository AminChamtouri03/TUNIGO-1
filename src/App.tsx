import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { UserInteractionsProvider } from "./contexts/UserInteractionsContext";
import Home from "./components/home";
import Discover from "./components/discover";
import Hotels from "./components/hotels";
import Food from "./components/food";
import Shopping from "./components/shopping";
import Transport from "./components/transport";
import Profile from "./components/profile/Profile";
import Map from "./components/map/Map";
import DestinationDetails from "./components/destination/DestinationDetails";
import HotelDetails from "./components/hotels/HotelDetails";
import FoodDetails from "./components/food/FoodDetails";
import ShoppingDetails from "./components/shopping/ShoppingDetails";
import TransportDetails from "./components/transport/TransportDetails";
import BottomNavigation from "./components/home/BottomNavigation";
import routes from "tempo-routes";

function App() {
  return (
    <FavoritesProvider>
      <UserInteractionsProvider>
        <div className="flex justify-center min-h-screen bg-gray-100">
          <div className="w-full max-w-[390px] bg-white relative shadow-xl">
            <Suspense fallback={<p>Loading...</p>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/food" element={<Food />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/hotels" element={<Hotels />} />
                <Route path="/shopping" element={<Shopping />} />
                <Route path="/transport" element={<Transport />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/map" element={<Map />} />
                <Route
                  path="/destination/:id"
                  element={<DestinationDetails />}
                />
                <Route path="/hotel/:id" element={<HotelDetails />} />
                <Route path="/food/:id" element={<FoodDetails />} />
                <Route path="/shopping/:id" element={<ShoppingDetails />} />
                <Route path="/transport/:id" element={<TransportDetails />} />
              </Routes>
            </Suspense>
            {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
            <BottomNavigation />
          </div>
        </div>
      </UserInteractionsProvider>
    </FavoritesProvider>
  );
}

export default App;
