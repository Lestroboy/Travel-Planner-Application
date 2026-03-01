import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPlus, FiMap, FiCalendar, FiDollarSign, FiGlobe, FiSearch, FiFilter } from "react-icons/fi";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import TripCard from "../components/trip/TripCard";
import StatsCard from "../components/dashboard/StatsCard";
import CreateTripModal from "../components/trip/CreateTripModal";
import { useTrips } from "../context/TripContext";
import { formatCurrency } from "../utils/helpers";

const Dashboard = () => {
  const navigate = useNavigate();
  const { trips, createTrip, deleteTrip, duplicateTrip } = useTrips();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filterTabs = [
    { id: "all", label: "All Trips" },
    { id: "planning", label: "Planning" },
    { id: "upcoming", label: "Upcoming" },
    { id: "ongoing", label: "In Progress" },
    { id: "completed", label: "Completed" },
  ];

  // Calculate stats
  const stats = useMemo(() => {
    const totalBudget = trips.reduce((sum, t) => sum + (t.budget?.total || 0), 0);
    const upcomingCount = trips.filter((t) => t.status === "upcoming" || t.status === "planning").length;
    const countries = [...new Set(trips.flatMap((t) => t.destinations || []))];
    return {
      total: trips.length,
      upcoming: upcomingCount,
      totalBudget,
      countries: countries.length,
    };
  }, [trips]);

  // Filter and sort trips
  const filteredTrips = useMemo(() => {
    let result = [...trips];

    // Apply status filter
    if (filter !== "all") {
      result = result.filter((t) => t.status === filter);
    }

    // Apply search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(searchLower) ||
          (t.destinations || []).some((d) => d.toLowerCase().includes(searchLower))
      );
    }

    // Apply sort
    result.sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.startDate) - new Date(a.startDate);
      }
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "budget") {
        return (b.budget?.total || 0) - (a.budget?.total || 0);
      }
      return 0;
    });

    return result;
  }, [trips, filter, search, sortBy]);

  const handleCreateTrip = async (tripData) => {
    const newTrip = await createTrip(tripData);
    if (newTrip) {
      navigate(`/trips/${newTrip.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      <div className="pt-24 pb-12">
        <div className="container-custom">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-heading font-bold">Trip Dashboard</h1>
              <p className="text-muted-foreground">Plan, organize, and track all your adventures</p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn-primary flex items-center gap-2 self-start lg:self-auto"
            >
              <FiPlus className="w-5 h-5" /> Create New Trip
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard
              icon={FiMap}
              label="Total Trips"
              value={stats.total}
              sublabel="All time"
              color="primary"
              index={0}
            />
            <StatsCard
              icon={FiCalendar}
              label="Upcoming"
              value={stats.upcoming}
              sublabel="Planned trips"
              color="secondary"
              index={1}
            />
            <StatsCard
              icon={FiDollarSign}
              label="Total Budget"
              value={formatCurrency(stats.totalBudget)}
              sublabel="Across all trips"
              color="green"
              index={2}
            />
            <StatsCard
              icon={FiGlobe}
              label="Destinations"
              value={stats.countries}
              sublabel="Places explored"
              color="orange"
              index={3}
            />
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search trips by name or destination..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-12 w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <FiFilter className="w-4 h-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field py-2 pl-3 pr-8 text-sm"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="budget">Sort by Budget</option>
              </select>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`chip whitespace-nowrap ${filter === tab.id ? "chip-active" : ""}`}
              >
                {tab.label}
                {tab.id !== "all" && (
                  <span className="ml-1.5 text-xs opacity-70">
                    ({trips.filter((t) => (tab.id === "ongoing" ? t.status === "ongoing" || t.status === "active" : t.status === tab.id)).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Trips Grid */}
          {filteredTrips.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl p-12 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <FiMap className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {search || filter !== "all" ? "No trips found" : "No trips yet"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {search || filter !== "all"
                  ? "Try adjusting your search or filter"
                  : "Start planning your first adventure!"}
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="btn-primary"
              >
                Create Your First Trip
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrips.map((trip, index) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  index={index}
                  onDelete={deleteTrip}
                  onDuplicate={duplicateTrip}
                  onEdit={(id) => navigate(`/trips/${id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />

      {/* Create Trip Modal */}
      <CreateTripModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateTrip}
      />
    </div>
  );
};

export default Dashboard;
