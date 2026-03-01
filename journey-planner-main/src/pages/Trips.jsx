import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPlus, FiCalendar, FiMapPin, FiUsers, FiMoreVertical, FiCopy, FiTrash2 } from "react-icons/fi";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import CreateTripModal from "../components/trip/CreateTripModal";
import { useTrips } from "../context/TripContext";
import { useAuth } from "../context/AuthContext";
import { formatDate, formatCurrency, getStatusColor, getBudgetStatus } from "../utils/helpers";
import toast from "react-hot-toast";

const Trips = () => {
  const navigate = useNavigate();
  const { trips, deleteTrip, duplicateTrip, createTrip } = useTrips();
  const { isAuthenticated } = useAuth();
  const [filter, setFilter] = useState("all");
  const [menuOpen, setMenuOpen] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateTrip = () => {
    if (!isAuthenticated) {
      toast.error("Please login to create a trip");
      navigate("/login");
      return;
    }
    setShowCreateModal(true);
  };

  const filterTabs = [
    { id: "all", label: "All Trips" },
    { id: "upcoming", label: "Upcoming" },
    { id: "ongoing", label: "Ongoing" },
    { id: "completed", label: "Completed" },
  ];

  const filteredTrips = filter === "all" ? trips : trips.filter((t) => t.status === filter);

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      <div className="pt-24 pb-12">
        <div className="container-custom">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-heading font-bold">My Trips</h1>
              <p className="text-muted-foreground">Plan and manage your adventures</p>
            </div>
            <button
              onClick={handleCreateTrip}
              className="btn-primary flex items-center gap-2"
            >
              <FiPlus className="w-5 h-5" /> Create Trip
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`chip whitespace-nowrap ${filter === tab.id ? "chip-active" : ""}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Trips Grid */}
          {filteredTrips.length === 0 ? (
            <div className="bg-card rounded-2xl p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <FiMapPin className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No trips yet</h3>
              <p className="text-muted-foreground mb-6">Start planning your first adventure!</p>
              <button onClick={handleCreateTrip} className="btn-primary">
                Create Your First Trip
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrips.map((trip, index) => {
                const budgetStatus = getBudgetStatus(trip.budget.spent, trip.budget.total);
                const budgetPercentage = (trip.budget.spent / trip.budget.total) * 100;

                return (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card-elevated cursor-pointer group"
                    onClick={() => navigate(`/trips/${trip.id}`)}
                  >
                    {/* Cover Image */}
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={trip.coverImage}
                        alt={trip.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className={`absolute top-3 left-3 badge ${getStatusColor(trip.status)}`}>
                        {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                      </span>
                      <div className="absolute top-3 right-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpen(menuOpen === trip.id ? null : trip.id);
                          }}
                          className="w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center"
                        >
                          <FiMoreVertical className="w-4 h-4" />
                        </button>
                        {menuOpen === trip.id && (
                          <div className="absolute right-0 top-10 bg-card rounded-xl shadow-xl py-2 min-w-40 z-10">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                duplicateTrip(trip.id);
                                setMenuOpen(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                            >
                              <FiCopy className="w-4 h-4" /> Duplicate
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteTrip(trip.id);
                                setMenuOpen(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-muted text-destructive flex items-center gap-2"
                            >
                              <FiTrash2 className="w-4 h-4" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-heading font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        {trip.name}
                      </h3>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <FiCalendar className="w-4 h-4" />
                          {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                        <FiMapPin className="w-4 h-4" />
                        {trip.destinations.join(", ")}
                      </div>

                      {/* Budget Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Budget</span>
                          <span className={budgetStatus.color}>
                            {formatCurrency(trip.budget.spent)} / {formatCurrency(trip.budget.total)}
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${budgetStatus.bg} transition-all`}
                            style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Collaborators */}
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {trip.collaborators.slice(0, 3).map((collab) => (
                            <img
                              key={collab.id}
                              src={collab.avatar}
                              alt={collab.name}
                              className="w-8 h-8 rounded-full border-2 border-background"
                            />
                          ))}
                          {trip.collaborators.length > 3 && (
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                              +{trip.collaborators.length - 3}
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {trip.collaborators.length} {trip.collaborators.length === 1 ? "member" : "members"}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Create Trip Modal */}
      {showCreateModal && (
        <CreateTripModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={(newTrip) => {
            setShowCreateModal(false);
            navigate(`/trips/${newTrip.id}`);
          }}
        />
      )}

      <Footer />
    </div>
  );
};

export default Trips;
