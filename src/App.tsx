import { Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
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

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

function App() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/reset-password";

  return (
    <AuthProvider>
      <FavoritesProvider>
        <UserInteractionsProvider>
          <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="w-full h-screen max-w-[390px] bg-white relative shadow-xl overflow-auto">
              <Suspense fallback={<p>Loading...</p>}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/reset-password" element={<ResetPassword />} />

                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Home />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/discover"
                    element={
                      <ProtectedRoute>
                        <Discover />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/hotels"
                    element={
                      <ProtectedRoute>
                        <Hotels />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/food"
                    element={
                      <ProtectedRoute>
                        <Food />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/shopping"
                    element={
                      <ProtectedRoute>
                        <Shopping />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/transport"
                    element={
                      <ProtectedRoute>
                        <Transport />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/map"
                    element={
                      <ProtectedRoute>
                        <Map />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/destination/:id"
                    element={
                      <ProtectedRoute>
                        <DestinationDetails />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/hotel/:id"
                    element={
                      <ProtectedRoute>
                        <HotelDetails />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/food/:id"
                    element={
                      <ProtectedRoute>
                        <FoodDetails />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/shopping/:id"
                    element={
                      <ProtectedRoute>
                        <ShoppingDetails />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/transport/:id"
                    element={
                      <ProtectedRoute>
                        <TransportDetails />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Suspense>
              {!isAuthPage && <BottomNavigation />}
            </div>
          </div>
        </UserInteractionsProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
