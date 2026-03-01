import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { TripProvider } from "./context/TripContext";
import { SearchProvider } from "./context/SearchContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { FlightSearch, HotelSearch, ActivitySearch } from "./pages/SearchResults";
import FlightDetail from "./pages/FlightDetail";
import HotelDetail from "./pages/HotelDetail";
import TrainSearch from "./pages/TrainSearch";
import CabSearch from "./pages/CabSearch";
import BookingPage from "./pages/BookingPage";
import BookingConfirmation from "./pages/BookingConfirmation";
import Trips from "./pages/Trips";
import Dashboard from "./pages/Dashboard";
import TripDetail from "./pages/TripDetail";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Auth route wrapper - redirects to dashboard if already logged in
const AuthRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Home />} />
    
    {/* Auth Routes - redirect to dashboard if already logged in */}
    <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
    <Route path="/signup" element={<AuthRoute><Signup /></AuthRoute>} />

    {/* Search Routes - Public (users can search without login) */}
    <Route path="/flights/search" element={<FlightSearch />} />
    <Route path="/flights/:id" element={<FlightDetail />} />
    <Route path="/hotels/search" element={<HotelSearch />} />
    <Route path="/hotels/:id" element={<HotelDetail />} />
    <Route path="/activities/search" element={<ActivitySearch />} />
    <Route path="/trains/search" element={<TrainSearch />} />
    <Route path="/cabs/search" element={<CabSearch />} />

    {/* Protected Routes - require authentication */}
    <Route
      path="/booking"
      element={
        <ProtectedRoute>
          <BookingPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/booking/confirmation"
      element={
        <ProtectedRoute>
          <BookingConfirmation />
        </ProtectedRoute>
      }
    />
    <Route
      path="/trips"
      element={
        <ProtectedRoute>
          <Trips />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/trips/:tripId"
      element={
        <ProtectedRoute>
          <TripDetail />
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

    {/* 404 Not Found */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <AuthProvider>
    <TripProvider>
      <SearchProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "hsl(var(--card))",
              color: "hsl(var(--foreground))",
              borderRadius: "12px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            },
          }}
        />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </SearchProvider>
    </TripProvider>
  </AuthProvider>
);

export default App;