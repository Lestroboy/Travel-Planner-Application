import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiRepeat, FiMapPin, FiClock } from "react-icons/fi";
import { cities, popularCabRoutes } from "../../utils/dummyData";

const CabSearchForm = () => {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState("oneWay");
  const [formData, setFormData] = useState({
    from: "Delhi",
    to: "Agra",
    pickupDate: new Date().toISOString().split("T")[0],
    pickupTime: "09:00",
    returnDate: "",
  });

  const handleSwap = () => {
    setFormData((prev) => ({
      ...prev,
      from: prev.to,
      to: prev.from,
    }));
  };

  const handleSearch = () => {
    navigate(
      `/cabs/search?from=${formData.from}&to=${formData.to}&date=${formData.pickupDate}&time=${formData.pickupTime}&type=${tripType}`
    );
  };

  // Find estimated distance
  const route = popularCabRoutes.find(
    (r) => r.from === formData.from && r.to === formData.to
  );

  return (
    <div className="space-y-4">
      {/* Trip Type Selection */}
      <div className="flex items-center gap-4 mb-4">
        {[
          { id: "oneWay", label: "One Way" },
          { id: "roundTrip", label: "Round Trip" },
          { id: "hourly", label: "Hourly Rental" },
        ].map((type) => (
          <label key={type.id} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="cabTripType"
              value={type.id}
              checked={tripType === type.id}
              onChange={(e) => setTripType(e.target.value)}
              className="w-4 h-4 accent-accent-orange"
            />
            <span className="text-sm font-medium">{type.label}</span>
          </label>
        ))}
      </div>

      {/* Search Form */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* From City */}
        <div className="md:col-span-3 relative">
          <label className="text-xs text-muted-foreground mb-1 block">
            Pickup City
          </label>
          <div className="bg-muted rounded-lg p-3 border border-border hover:border-accent-orange/50 transition-colors">
            <div className="flex items-center gap-2">
              <FiMapPin className="text-accent-orange" />
              <select
                value={formData.from}
                onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                className="w-full bg-transparent text-lg font-semibold focus:outline-none cursor-pointer"
              >
                {cities.slice(0, 20).map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-muted-foreground ml-6">
              Enter pickup location
            </p>
          </div>
        </div>

        {/* Swap Button */}
        {tripType !== "hourly" && (
          <div className="md:col-span-1 flex items-center justify-center">
            <button
              onClick={handleSwap}
              className="p-2 rounded-full bg-accent-orange/10 hover:bg-accent-orange/20 text-accent-orange transition-colors mt-4"
            >
              <FiRepeat className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* To City */}
        {tripType !== "hourly" ? (
          <div className="md:col-span-3">
            <label className="text-xs text-muted-foreground mb-1 block">
              Drop City
            </label>
            <div className="bg-muted rounded-lg p-3 border border-border hover:border-accent-orange/50 transition-colors">
              <div className="flex items-center gap-2">
                <FiMapPin className="text-accent-orange" />
                <select
                  value={formData.to}
                  onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                  className="w-full bg-transparent text-lg font-semibold focus:outline-none cursor-pointer"
                >
                  {cities.slice(0, 20).map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              {route && (
                <p className="text-xs text-muted-foreground ml-6">
                  ~{route.distance} km • {route.duration}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="md:col-span-4">
            <label className="text-xs text-muted-foreground mb-1 block">
              Rental Package
            </label>
            <div className="bg-muted rounded-lg p-3 border border-border hover:border-accent-orange/50 transition-colors">
              <select className="w-full bg-transparent text-lg font-semibold focus:outline-none cursor-pointer">
                <option>4 hrs, 40 km</option>
                <option>8 hrs, 80 km</option>
                <option>12 hrs, 120 km</option>
              </select>
              <p className="text-xs text-muted-foreground">Select hours & km</p>
            </div>
          </div>
        )}

        {/* Pickup Date */}
        <div className="md:col-span-2">
          <label className="text-xs text-muted-foreground mb-1 block">
            Pickup Date
          </label>
          <div className="bg-muted rounded-lg p-3 border border-border hover:border-accent-orange/50 transition-colors">
            <input
              type="date"
              value={formData.pickupDate}
              onChange={(e) =>
                setFormData({ ...formData, pickupDate: e.target.value })
              }
              className="w-full bg-transparent text-lg font-semibold focus:outline-none cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">
              {new Date(formData.pickupDate).toLocaleDateString("en-US", {
                weekday: "long",
              })}
            </p>
          </div>
        </div>

        {/* Pickup Time */}
        <div className="md:col-span-2">
          <label className="text-xs text-muted-foreground mb-1 block">
            Pickup Time
          </label>
          <div className="bg-muted rounded-lg p-3 border border-border hover:border-accent-orange/50 transition-colors">
            <div className="flex items-center gap-2">
              <FiClock className="text-accent-orange" />
              <input
                type="time"
                value={formData.pickupTime}
                onChange={(e) =>
                  setFormData({ ...formData, pickupTime: e.target.value })
                }
                className="w-full bg-transparent text-lg font-semibold focus:outline-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Return Date (for Round Trip) */}
        {tripType === "roundTrip" && (
          <div className="md:col-span-2">
            <label className="text-xs text-muted-foreground mb-1 block">
              Return Date
            </label>
            <div className="bg-muted rounded-lg p-3 border border-border hover:border-accent-orange/50 transition-colors">
              <input
                type="date"
                value={formData.returnDate}
                onChange={(e) =>
                  setFormData({ ...formData, returnDate: e.target.value })
                }
                className="w-full bg-transparent text-lg font-semibold focus:outline-none cursor-pointer"
                min={formData.pickupDate}
              />
            </div>
          </div>
        )}
      </div>

      {/* Popular Routes */}
      <div className="flex flex-wrap items-center gap-2 pt-2">
        <span className="text-sm font-medium text-muted-foreground">
          POPULAR ROUTES:
        </span>
        {popularCabRoutes.slice(0, 4).map((route) => (
          <button
            key={`${route.from}-${route.to}`}
            onClick={() =>
              setFormData({ ...formData, from: route.from, to: route.to })
            }
            className="px-3 py-1.5 rounded-lg text-sm bg-muted border border-border hover:border-accent-orange/50 transition-colors"
          >
            {route.from} → {route.to}
          </button>
        ))}
      </div>

      {/* Search Button */}
      <div className="flex justify-center pt-4">
        <motion.button
          onClick={handleSearch}
          className="flex items-center gap-2 px-12 py-4 text-lg font-semibold text-primary-foreground rounded-xl transition-all duration-300 hover:scale-105"
          style={{ background: "hsl(var(--accent-orange))" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Search Cabs
          <FiArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default CabSearchForm;
