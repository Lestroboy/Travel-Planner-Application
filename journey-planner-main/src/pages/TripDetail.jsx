import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FiArrowLeft, FiCalendar, FiMapPin, FiUsers, FiEdit2, FiShare2, 
  FiPlus, FiTrash2, FiCopy, FiMap, FiStar
} from "react-icons/fi";
import { Sparkles } from "lucide-react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import ItineraryTimeline from "../components/trip/ItineraryTimeline";
import BudgetOverview from "../components/trip/BudgetOverview";
import CollaboratorsList from "../components/trip/CollaboratorsList";
import AvatarStack from "../components/trip/AvatarStack";
import BudgetRing from "../components/trip/BudgetRing";
import AddItemModal from "../components/trip/AddItemModal";
import TripSuggestions from "../components/trip/TripSuggestions";
import TripMapView from "../components/trip/TripMapView";
import { WeatherWidget, WeatherForecast } from "../components/trip/WeatherWidget";
import { useTrips } from "../context/TripContext";
import { formatDate, calculateDuration } from "../utils/helpers";

const TripDetail = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { 
    currentTrip,
    fetchTripById, // ⚠️ CRITICAL: Use fetchTripById instead of getTripById
    updateTrip, 
    deleteTrip, 
    duplicateTrip, 
    inviteCollaborator, 
    addItineraryItem,
    isLoading 
  } = useTrips();
  
  const [trip, setTrip] = useState(null);
  const [activeTab, setActiveTab] = useState("itinerary");
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // ⚠️ CRITICAL FIX #3: Properly fetch trip with itinerary on mount
  useEffect(() => {
    const loadTripData = async () => {
      try {
        console.log('🎯 Loading trip:', tripId);
        
        // Extract numeric ID
        const numericId = typeof tripId === 'string' ? 
          parseInt(tripId.replace('TR', '')) : parseInt(tripId);
        
        // Fetch fresh trip data with itinerary items
        const tripData = await fetchTripById(numericId);
        
        if (tripData) {
          console.log('✅ Trip loaded:', tripData.name);
          console.log('📋 Itinerary:', tripData.itinerary);
          setTrip(tripData);
        }
      } catch (error) {
        console.error('❌ Failed to load trip:', error);
      }
    };

    if (tripId) {
      loadTripData();
    }
  }, [tripId, fetchTripById]);

  // Update local trip when currentTrip changes (e.g., after adding item)
  useEffect(() => {
    if (currentTrip && currentTrip.tripId === trip?.tripId) {
      console.log('🔄 Updating trip from context:', currentTrip);
      setTrip(currentTrip);
    }
  }, [currentTrip]);

  if (isLoading && !trip) {
    return (
      <div className="min-h-screen bg-muted">
        <Header />
        <div className="pt-24 pb-12">
          <div className="container-custom">
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading trip details...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!trip && !isLoading) {
    return (
      <div className="min-h-screen bg-muted">
        <Header />
        <div className="pt-24 pb-12">
          <div className="container-custom">
            <div className="text-center py-20">
              <h2 className="text-2xl font-heading font-bold mb-4">Trip not found</h2>
              <p className="text-muted-foreground mb-6">The trip you're looking for doesn't exist.</p>
              <button onClick={() => navigate("/dashboard")} className="btn-primary">
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const statusColors = {
    planning: "bg-accent-purple/10 text-accent-purple",
    upcoming: "bg-secondary/10 text-secondary",
    active: "bg-accent-green/10 text-accent-green",
    ongoing: "bg-accent-green/10 text-accent-green",
    completed: "bg-muted text-muted-foreground",
  };

  const handleInvite = async (email, role) => {
    await inviteCollaborator(trip.id, email, role);
    // Refresh trip data
    const numericId = typeof trip.id === 'string' ? 
      parseInt(trip.id.replace('TR', '')) : trip.id;
    await fetchTripById(numericId);
  };

  const handleAddItem = (dayIndex) => {
    setSelectedDayIndex(dayIndex);
    setShowAddItemModal(true);
  };

  // ⚠️ CRITICAL FIX #4: Refresh trip data after modal closes
  const handleModalClose = async () => {
    setShowAddItemModal(false);
    
    // Refresh trip to get updated itinerary
    const numericId = typeof trip.id === 'string' ? 
      parseInt(trip.id.replace('TR', '')) : trip.tripId;
    
    console.log('🔄 Refreshing trip after modal close...');
    await fetchTripById(numericId);
  };

  const tabs = [
    { id: "itinerary", label: "Itinerary", icon: FiCalendar },
    { id: "suggestions", label: "Suggestions", icon: Sparkles },
    { id: "map", label: "Map", icon: FiMap },
    { id: "budget", label: "Budget", icon: FiStar },
    { id: "team", label: "Team", icon: FiUsers },
  ];

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      
      {/* Hero Header */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={trip.coverImage}
          alt={trip.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="absolute top-20 left-4 md:left-8 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Back to Dashboard</span>
        </button>

        {/* Weather Widget in Hero */}
        <div className="absolute top-20 right-4 md:right-8">
          <WeatherWidget trip={trip} />
        </div>

        {/* Trip Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className={`badge ${statusColors[trip.status]} mb-2`}>
                  {trip.status?.charAt(0).toUpperCase() + trip.status?.slice(1)}
                </span>
                <h1 className="text-2xl md:text-4xl font-heading font-bold text-white mb-2">
                  {trip.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
                  <span className="flex items-center gap-1.5">
                    <FiCalendar className="w-4 h-4" />
                    {formatDate(trip.startDate, "medium")} - {formatDate(trip.endDate, "medium")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FiMapPin className="w-4 h-4" />
                    {trip.destinations?.join(", ") || trip.destination}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FiUsers className="w-4 h-4" />
                    {trip.collaborators?.length || 1} travelers
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button className="btn-ghost bg-white/10 backdrop-blur-sm text-white hover:bg-white/20">
                  <FiShare2 className="w-4 h-4" />
                </button>
                <button className="btn-ghost bg-white/10 backdrop-blur-sm text-white hover:bg-white/20">
                  <FiEdit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="bg-card border-b border-border">
        <div className="container-custom">
          <div className="flex items-center justify-between py-4 gap-4 overflow-x-auto">
            <div className="flex items-center gap-6">
              {/* Budget Ring */}
              <div className="flex items-center gap-3">
                <BudgetRing
                  spent={trip.budget?.spent || 0}
                  total={trip.budget?.total || 1}
                  size={48}
                  strokeWidth={4}
                  showLabel={false}
                />
                <div>
                  <p className="text-xs text-muted-foreground">Budget Used</p>
                  <p className="font-semibold">
                    {Math.round(((trip.budget?.spent || 0) / (trip.budget?.total || 1)) * 100)}%
                  </p>
                </div>
              </div>

              {/* Duration */}
              <div className="hidden sm:block pl-6 border-l border-border">
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="font-semibold">{calculateDuration(trip.startDate, trip.endDate)}</p>
              </div>

              {/* Collaborators */}
              <div className="pl-6 border-l border-border">
                <p className="text-xs text-muted-foreground mb-1">Team</p>
                <AvatarStack collaborators={trip.collaborators || []} max={4} size="sm" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-8">
        {/* Tabs Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`chip whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.id ? "chip-active" : ""
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className={`lg:col-span-2 ${
            !["itinerary", "suggestions", "map"].includes(activeTab) ? "hidden lg:block" : ""
          }`}>
            {activeTab === "itinerary" && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-heading font-semibold">
                    Itinerary 
                    {trip.itinerary && trip.itinerary.length > 0 && (
                      <span className="ml-2 text-sm text-muted-foreground font-normal">
                        ({trip.itinerary.reduce((sum, day) => sum + (day.items?.length || 0), 0)} items)
                      </span>
                    )}
                  </h2>
                  <button className="btn-ghost text-sm flex items-center gap-1.5 text-primary">
                    <FiPlus className="w-4 h-4" /> Add Day
                  </button>
                </div>
                <ItineraryTimeline
                  itinerary={trip.itinerary || []}
                  tripId={trip.tripId}
                  onAddItem={handleAddItem}
                  destination={trip.destinations?.[0] || trip.destination}
                />
              </>
            )}

            {activeTab === "suggestions" && (
              <TripSuggestions trip={trip} />
            )}

            {activeTab === "map" && (
              <TripMapView trip={trip} itinerary={trip.itinerary || []} />
            )}

            {activeTab === "budget" && (
              <div className="lg:hidden">
                <BudgetOverview budget={trip.budget} currency={trip.budget?.currency || "INR"} />
              </div>
            )}

            {activeTab === "team" && (
              <div className="lg:hidden">
                <CollaboratorsList
                  collaborators={trip.collaborators || []}
                  onInvite={handleInvite}
                  isOwner={true}
                />
              </div>
            )}
          </div>

          {/* Right Column - Budget, Weather & Collaborators */}
          <div className="space-y-6">
            {/* Weather Forecast */}
            <div className={activeTab === "itinerary" || activeTab === "map" ? "" : "hidden lg:block"}>
              <WeatherForecast trip={trip} />
            </div>

            <div className={activeTab !== "budget" ? "hidden lg:block" : ""}>
              <BudgetOverview budget={trip.budget} currency={trip.budget?.currency || "INR"} />
            </div>
            
            <div className={activeTab !== "team" ? "hidden lg:block" : ""}>
              <CollaboratorsList
                collaborators={trip.collaborators || []}
                onInvite={handleInvite}
                isOwner={true}
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-2xl border border-border p-6 hidden lg:block">
              <h3 className="font-heading font-semibold text-lg mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => duplicateTrip(trip.tripId)}
                  className="w-full btn-ghost justify-start gap-2 text-left"
                >
                  <FiCopy className="w-4 h-4" /> Duplicate Trip
                </button>
                <button
                  onClick={async () => {
                    await deleteTrip(trip.tripId);
                    navigate("/dashboard");
                  }}
                  className="w-full btn-ghost justify-start gap-2 text-left text-destructive hover:bg-destructive/10"
                >
                  <FiTrash2 className="w-4 h-4" /> Delete Trip
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Item Modal - ⚠️ CRITICAL: Use handleModalClose */}
      <AddItemModal
        isOpen={showAddItemModal}
        onClose={handleModalClose}
        tripId={trip.tripId}
      />

      <Footer />
    </div>
  );
};

export default TripDetail;