import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Home, MapPin, Star, ChevronRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { flights, hotels, activities } from "../../utils/dummyData";
import { formatCurrency } from "../../utils/helpers";

const TripSuggestions = ({ trip }) => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("flights");

  // Extract destinations from trip
  const destinations = useMemo(() => {
    const dest = [];
    if (trip?.destination) dest.push(trip.destination.toLowerCase());
    if (trip?.destinations) {
      trip.destinations.forEach(d => dest.push(d.toLowerCase()));
    }
    return dest;
  }, [trip]);

  // Keyword matching function
  const matchesDestination = (location, toCity) => {
    if (!location && !toCity) return false;
    const searchText = `${location || ""} ${toCity || ""}`.toLowerCase();
    return destinations.some(dest => 
      searchText.includes(dest) || dest.includes(searchText.split(",")[0].trim())
    );
  };

  // Filter suggestions based on trip destination
  const suggestions = useMemo(() => {
    const matchedFlights = flights.filter(f => 
      matchesDestination(null, f.to) || matchesDestination(null, f.toCode)
    ).slice(0, 4);

    const matchedHotels = hotels.filter(h => 
      matchesDestination(h.location, null)
    ).slice(0, 4);

    const matchedActivities = activities.filter(a => 
      matchesDestination(a.location, null)
    ).slice(0, 4);

    return {
      flights: matchedFlights,
      hotels: matchedHotels,
      activities: matchedActivities,
    };
  }, [destinations]);

  const categories = [
    { id: "flights", label: "Flights", icon: Plane, count: suggestions.flights.length },
    { id: "hotels", label: "Hotels", icon: Home, count: suggestions.hotels.length },
    { id: "activities", label: "Activities", icon: MapPin, count: suggestions.activities.length },
  ];

  const totalSuggestions = suggestions.flights.length + suggestions.hotels.length + suggestions.activities.length;

  if (totalSuggestions === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No suggestions available</h3>
        <p className="text-muted-foreground">
          We couldn't find matching services for your destination. Try adding more specific locations.
        </p>
      </div>
    );
  }

  const handleViewDetails = (type, id) => {
    if (type === "flights") {
      navigate(`/flight/${id}`);
    } else if (type === "hotels") {
      navigate(`/hotel/${id}`);
    } else {
      navigate(`/activity/${id}`);
    }
  };

  const handleBookNow = (type, item) => {
    const params = new URLSearchParams();
    if (type === "flights") {
      params.set("from", item.from);
      params.set("to", item.to);
      navigate(`/flights?${params.toString()}`);
    } else if (type === "hotels") {
      params.set("location", item.location.split(",")[0]);
      navigate(`/hotels?${params.toString()}`);
    } else {
      params.set("location", item.location.split(",")[0]);
      navigate(`/activities?${params.toString()}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-heading font-semibold text-lg">Smart Suggestions</h3>
          <p className="text-sm text-muted-foreground">
            Based on your destination: {trip?.destinations?.join(", ") || trip?.destination}
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
              {cat.count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                  isActive ? "bg-primary-foreground/20" : "bg-background"
                }`}>
                  {cat.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Suggestions Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {activeCategory === "flights" && suggestions.flights.map((flight) => (
            <FlightSuggestionCard
              key={flight.id}
              flight={flight}
              onView={() => handleViewDetails("flights", flight.id)}
              onBook={() => handleBookNow("flights", flight)}
            />
          ))}

          {activeCategory === "hotels" && suggestions.hotels.map((hotel) => (
            <HotelSuggestionCard
              key={hotel.id}
              hotel={hotel}
              onView={() => handleViewDetails("hotels", hotel.id)}
              onBook={() => handleBookNow("hotels", hotel)}
            />
          ))}

          {activeCategory === "activities" && suggestions.activities.map((activity) => (
            <ActivitySuggestionCard
              key={activity.id}
              activity={activity}
              onView={() => handleViewDetails("activities", activity.id)}
              onBook={() => handleBookNow("activities", activity)}
            />
          ))}

          {suggestions[activeCategory].length === 0 && (
            <div className="col-span-full bg-muted/50 rounded-xl p-8 text-center">
              <p className="text-muted-foreground">
                No {activeCategory} found for your destination
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const FlightSuggestionCard = ({ flight, onView, onBook }) => (
  <div className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <img
          src={flight.airlineLogo}
          alt={flight.airline}
          className="w-10 h-10 object-contain"
          onError={(e) => e.target.src = "/placeholder.svg"}
        />
        <div>
          <p className="font-medium">{flight.airline}</p>
          <p className="text-xs text-muted-foreground">{flight.flightNumber}</p>
        </div>
      </div>
      <span className="badge bg-secondary/10 text-secondary">{flight.class}</span>
    </div>
    
    <div className="flex items-center gap-4 mb-3">
      <div className="text-center">
        <p className="font-semibold">{flight.departureTime}</p>
        <p className="text-xs text-muted-foreground">{flight.fromCode}</p>
      </div>
      <div className="flex-1 flex items-center gap-2">
        <div className="flex-1 h-px bg-border" />
        <Plane className="w-4 h-4 text-muted-foreground" />
        <div className="flex-1 h-px bg-border" />
      </div>
      <div className="text-center">
        <p className="font-semibold">{flight.arrivalTime}</p>
        <p className="text-xs text-muted-foreground">{flight.toCode}</p>
      </div>
    </div>

    <div className="flex items-center justify-between">
      <div>
        <span className="text-lg font-bold text-primary">{formatCurrency(flight.price)}</span>
        {flight.originalPrice > flight.price && (
          <span className="ml-2 text-sm text-muted-foreground line-through">
            {formatCurrency(flight.originalPrice)}
          </span>
        )}
      </div>
      <button
        onClick={onBook}
        className="btn-primary text-sm py-2 px-4 flex items-center gap-1"
      >
        Book <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const HotelSuggestionCard = ({ hotel, onView, onBook }) => (
  <div className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow">
    <div className="relative h-32">
      <img
        src={hotel.image}
        alt={hotel.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute top-2 right-2 badge bg-background/90 backdrop-blur-sm">
        <Star className="w-3 h-3 text-accent-orange fill-accent-orange mr-1" />
        {hotel.rating}
      </div>
    </div>
    <div className="p-4">
      <h4 className="font-medium mb-1 truncate">{hotel.name}</h4>
      <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
        <MapPin className="w-3 h-3" /> {hotel.location}
      </p>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-lg font-bold text-primary">{formatCurrency(hotel.price)}</span>
          <span className="text-xs text-muted-foreground">/night</span>
        </div>
        <button
          onClick={onBook}
          className="btn-primary text-sm py-2 px-4 flex items-center gap-1"
        >
          Book <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

const ActivitySuggestionCard = ({ activity, onView, onBook }) => (
  <div className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow">
    <div className="relative h-32">
      <img
        src={activity.image}
        alt={activity.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute top-2 left-2 badge bg-primary text-primary-foreground">
        {activity.category}
      </div>
      <div className="absolute top-2 right-2 badge bg-background/90 backdrop-blur-sm">
        <Star className="w-3 h-3 text-accent-orange fill-accent-orange mr-1" />
        {activity.rating}
      </div>
    </div>
    <div className="p-4">
      <h4 className="font-medium mb-1 truncate">{activity.name}</h4>
      <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
        <MapPin className="w-3 h-3" /> {activity.location}
      </p>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-lg font-bold text-primary">{formatCurrency(activity.price)}</span>
          <span className="text-xs text-muted-foreground">/{activity.duration}</span>
        </div>
        <button
          onClick={onBook}
          className="btn-primary text-sm py-2 px-4 flex items-center gap-1"
        >
          Book <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

export default TripSuggestions;
