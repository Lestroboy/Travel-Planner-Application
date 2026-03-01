import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUsers, FiDollarSign, FiMapPin, FiCalendar, FiArrowRight, FiTarget, FiHeart } from "react-icons/fi";
import { MdFlight, MdHotel, MdTrain, MdDirectionsCar } from "react-icons/md";
import { cities } from "../../utils/dummyData";

const TripPlannerSection = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [tripPlan, setTripPlan] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    travelers: 2,
    budget: 50000,
    preferences: [],
    travelStyle: "balanced",
  });

  const preferences = [
    { id: "adventure", label: "Adventure", icon: "🏔️" },
    { id: "relaxation", label: "Relaxation", icon: "🏖️" },
    { id: "culture", label: "Culture", icon: "🏛️" },
    { id: "food", label: "Food", icon: "🍜" },
    { id: "shopping", label: "Shopping", icon: "🛍️" },
    { id: "nature", label: "Nature", icon: "🌿" },
  ];

  const travelStyles = [
    { id: "budget", label: "Budget", desc: "Best value options" },
    { id: "balanced", label: "Balanced", desc: "Mix of comfort & value" },
    { id: "luxury", label: "Luxury", desc: "Premium experiences" },
  ];

  const togglePreference = (pref) => {
    setTripPlan((prev) => ({
      ...prev,
      preferences: prev.preferences.includes(pref)
        ? prev.preferences.filter((p) => p !== pref)
        : [...prev.preferences, pref],
    }));
  };

  const handlePlanTrip = () => {
    // Save trip plan to localStorage
    const newTrip = {
      id: `TRIP-${Date.now()}`,
      ...tripPlan,
      createdAt: new Date().toISOString(),
      status: "planning",
      bookings: [],
    };
    
    const existingTrips = JSON.parse(localStorage.getItem("tripPlans") || "[]");
    localStorage.setItem("tripPlans", JSON.stringify([newTrip, ...existingTrips]));
    
    // Navigate to search with filters
    navigate(
      `/flights/search?from=Delhi&to=${tripPlan.destination}&date=${tripPlan.startDate}&budget=${tripPlan.budget}&style=${tripPlan.travelStyle}`
    );
  };

  if (!showForm) {
    return (
      <section className="section-padding bg-muted/50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent-purple/10 rounded-3xl p-8 md:p-12"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <FiTarget className="w-6 h-6 text-primary" />
                  <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                    Trip Planner
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                  Plan Your Perfect Journey
                </h2>
                <p className="text-muted-foreground mb-6">
                  Tell us about your travel preferences and budget. We'll suggest the best flights, trains, hotels, and experiences tailored just for you.
                </p>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <MdFlight className="w-5 h-5 text-primary" />
                    <span>Flights</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MdTrain className="w-5 h-5 text-secondary" />
                    <span>Trains</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MdDirectionsCar className="w-5 h-5 text-accent-orange" />
                    <span>Cabs</span>
                  </div>
                  <div className="flex items-center gap-20 text-sm">
                    <MdHotel className="w-5 h-5 text-accent-purple" />
                    <span>Hotels</span>
                  </div>
                </div>

                <motion.button
                  onClick={() => setShowForm(true)}
                  className="btn-primary flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Planning <FiArrowRight />
                </motion.button>
              </div>

              <div className="flex-shrink-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card p-4 rounded-xl shadow-md">
                    <FiUsers className="w-8 h-8 text-primary mb-2" />
                    <p className="text-2xl font-bold">2M+</p>
                    <p className="text-xs text-muted-foreground">Happy Travelers</p>
                  </div>
                  <div className="bg-card p-4 rounded-xl shadow-md">
                    <FiMapPin className="w-8 h-8 text-secondary mb-2" />
                    <p className="text-2xl font-bold">500+</p>
                    <p className="text-xs text-muted-foreground">Destinations</p>
                  </div>
                  <div className="bg-card p-4 rounded-xl shadow-md">
                    <FiDollarSign className="w-8 h-8 text-accent-green mb-2" />
                    <p className="text-2xl font-bold">30%</p>
                    <p className="text-xs text-muted-foreground">Avg. Savings</p>
                  </div>
                  <div className="bg-card p-4 rounded-xl shadow-md">
                    <FiHeart className="w-8 h-8 text-primary mb-2" />
                    <p className="text-2xl font-bold">4.8★</p>
                    <p className="text-xs text-muted-foreground">User Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-muted/50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl p-6 md:p-8 shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold">Plan Your Trip</h2>
              <p className="text-muted-foreground">Fill in your preferences to get personalized recommendations</p>
            </div>
            <button
              onClick={() => setShowForm(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Destination */}
            <div>
              <label className="text-sm font-medium mb-2 block">Where do you want to go?</label>
              <select
                value={tripPlan.destination}
                onChange={(e) => setTripPlan({ ...tripPlan, destination: e.target.value })}
                className="input-field"
              >
                <option value="">Select Destination</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Dates */}
            <div>
              <label className="text-sm font-medium mb-2 block">Travel Dates</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={tripPlan.startDate}
                  onChange={(e) => setTripPlan({ ...tripPlan, startDate: e.target.value })}
                  className="input-field flex-1"
                  placeholder="Start"
                />
                <input
                  type="date"
                  value={tripPlan.endDate}
                  onChange={(e) => setTripPlan({ ...tripPlan, endDate: e.target.value })}
                  className="input-field flex-1"
                  min={tripPlan.startDate}
                />
              </div>
            </div>

            {/* Travelers */}
            <div>
              <label className="text-sm font-medium mb-2 block">Number of Travelers</label>
              <select
                value={tripPlan.travelers}
                onChange={(e) => setTripPlan({ ...tripPlan, travelers: parseInt(e.target.value) })}
                className="input-field"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>{num} Traveler{num > 1 ? "s" : ""}</option>
                ))}
              </select>
            </div>

            {/* Budget */}
            <div className="md:col-span-2 lg:col-span-3">
              <label className="text-sm font-medium mb-2 block">
                Total Budget: ₹{tripPlan.budget.toLocaleString()}
              </label>
              <input
                type="range"
                min="10000"
                max="500000"
                step="5000"
                value={tripPlan.budget}
                onChange={(e) => setTripPlan({ ...tripPlan, budget: parseInt(e.target.value) })}
                className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>₹10,000</span>
                <span>₹5,00,000</span>
              </div>
            </div>

            {/* Travel Style */}
            <div className="md:col-span-2 lg:col-span-3">
              <label className="text-sm font-medium mb-3 block">Travel Style</label>
              <div className="flex flex-wrap gap-3">
                {travelStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setTripPlan({ ...tripPlan, travelStyle: style.id })}
                    className={`px-6 py-3 rounded-xl border-2 transition-all ${
                      tripPlan.travelStyle === style.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="font-semibold">{style.label}</p>
                    <p className="text-xs text-muted-foreground">{style.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Preferences */}
            <div className="md:col-span-2 lg:col-span-3">
              <label className="text-sm font-medium mb-3 block">What interests you?</label>
              <div className="flex flex-wrap gap-3">
                {preferences.map((pref) => (
                  <button
                    key={pref.id}
                    onClick={() => togglePreference(pref.id)}
                    className={`px-4 py-2 rounded-full border-2 transition-all flex items-center gap-2 ${
                      tripPlan.preferences.includes(pref.id)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span>{pref.icon}</span>
                    <span>{pref.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-center mt-8">
            <motion.button
              onClick={handlePlanTrip}
              disabled={!tripPlan.destination || !tripPlan.startDate}
              className="btn-primary flex items-center gap-2 px-12 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Find Best Options <FiArrowRight />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TripPlannerSection;
