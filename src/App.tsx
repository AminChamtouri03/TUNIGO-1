import { Routes, Route, Navigate } from "react-router-dom";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { UserInteractionsProvider } from "./contexts/UserInteractionsContext";
import { AuthProvider } from "./contexts/AuthContext";
import { LocationProvider } from "./contexts/LocationContext";
import { AuthGuard } from "./components/ui/auth-guard";
import { Toaster } from "./components/ui/toaster";
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

function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <FavoritesProvider>
          <UserInteractionsProvider>
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
              <div className="w-full h-screen max-w-[390px] bg-white relative shadow-xl overflow-auto">
                <Routes>
                  {/* Public routes */}
                  <Route
                    path="/login"
                    element={
                      <AuthGuard requireAuth={false} redirectTo="/">
                        <Login />
                      </AuthGuard>
                    }
                  />
                  <Route
                    path="/signup"
                    element={
                      <AuthGuard requireAuth={false} redirectTo="/">
                        <SignUp />
                      </AuthGuard>
                    }
                  />
                  <Route
                    path="/reset-password"
                    element={
                      <AuthGuard requireAuth={false} redirectTo="/">
                        <ResetPassword />
                      </AuthGuard>
                    }
                  />

                  {/* Semi-protected routes (accessible to all but with different views) */}
                  <Route path="/" element={<Home />} />
                  <Route path="/discover" element={<Discover />} />
                  <Route path="/hotels" element={<Hotels />} />
                  <Route path="/food" element={<Food />} />
                  <Route path="/shopping" element={<Shopping />} />
                  <Route path="/transport" element={<Transport />} />
                  <Route path="/map" element={<Map />} />
                  <Route
                    path="/destination/:id"
                    element={<DestinationDetails />}
                  />
                  <Route path="/hotel/:id" element={<HotelDetails />} />
                  <Route path="/food/:id" element={<FoodDetails />} />
                  <Route path="/shopping/:id" element={<ShoppingDetails />} />
                  <Route path="/transport/:id" element={<TransportDetails />} />

                  {/* Protected routes */}
                  <Route
                    path="/profile"
                    element={
                      <AuthGuard>
                        <Profile />
                      </AuthGuard>
                    }
                  />
                  <Route path="/guest-profile" element={<GuestProfile />} />

                  {/* Catch all route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <BottomNavigation />
              </div>
            </div>
            <Toaster />
          </UserInteractionsProvider>
        </FavoritesProvider>
      </LocationProvider>
    </AuthProvider>
  );
}

export default App;
