import { Routes, Route } from "react-router-dom";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { UserInteractionsProvider } from "./contexts/UserInteractionsContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Home from "./components/home";
import Discover from "./components/discover";
import Hotels from "./components/hotels";
import Food from "./components/food";
import Shopping from "./components/shopping";
import Transport from "./components/transport";
import Profile from "./components/profile/Profile";
import GuestProfile from "./components/profile/GuestProfile";
import Map from "./components/map/Map";
import Login from "./components/auth/Login";
import SignUp from "./components/auth/SignUp";
import ResetPassword from "./components/auth/ResetPassword";
import DestinationDetails from "./components/destination/DestinationDetails";
import HotelDetails from "./components/hotels/HotelDetails";
import FoodDetails from "./components/food/FoodDetails";
import ShoppingDetails from "./components/shopping/ShoppingDetails";
import TransportDetails from "./components/transport/TransportDetails";
import BottomNavigation from "./components/home/BottomNavigation";

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <FavoritesProvider>
      <UserInteractionsProvider>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="w-full h-screen max-w-[390px] bg-white relative shadow-xl overflow-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/food" element={<Food />} />
              <Route path="/shopping" element={<Shopping />} />
              <Route path="/transport" element={<Transport />} />
              <Route path="/map" element={<Map />} />
              <Route path="/destination/:id" element={<DestinationDetails />} />
              <Route path="/hotel/:id" element={<HotelDetails />} />
              <Route path="/food/:id" element={<FoodDetails />} />
              <Route path="/shopping/:id" element={<ShoppingDetails />} />
              <Route path="/transport/:id" element={<TransportDetails />} />
              <Route
                path="/profile"
                element={isAuthenticated ? <Profile /> : <GuestProfile />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
            <BottomNavigation />
          </div>
        </div>
      </UserInteractionsProvider>
    </FavoritesProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
