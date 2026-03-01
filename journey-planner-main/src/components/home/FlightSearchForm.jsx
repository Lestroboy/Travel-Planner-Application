import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiCalendar, FiUsers, FiRepeat } from "react-icons/fi";
import { MdFlight } from "react-icons/md";
import { cities, specialFares } from "../../utils/dummyData";

const FlightSearchForm = () => {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState("oneWay");
  const [formData, setFormData] = useState({
    from: "Delhi",
    to: "Mumbai",
    departDate: new Date().toISOString().split("T")[0],
    returnDate: "",
    travelers: 1,
    class: "Economy",
    fareType: "regular",
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
      `/flights/search?from=${formData.from}&to=${formData.to}&date=${formData.departDate}&travelers=${formData.travelers}&class=${formData.class}`
    );
  };

  return (
    <div className="space-y-4">
      {/* Trip Type Selection */}
      <div className="flex items-center gap-4 mb-4">
        {[
          { id: "oneWay", label: "One Way" },
          { id: "roundTrip", label: "Round Trip" },
        ].map((type) => (
          <label key={type.id} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="tripType"
              value={type.id}
              checked={tripType === type.id}
              onChange={(e) => setTripType(e.target.value)}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm font-medium">{type.label}</span>
          </label>
        ))}
      </div>

      {/* Search Form */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* From */}
        <div className="md:col-span-3 relative">
          <label className="text-xs text-muted-foreground mb-1 block">From</label>
          <div className="bg-muted rounded-lg p-3 border border-border hover:border-primary/50 transition-colors">
            <select
              value={formData.from}
              onChange={(e) => setFormData({ ...formData, from: e.target.value })}
              className="w-full bg-transparent text-lg font-semibold focus:outline-none cursor-pointer"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              {formData.from}, Airport
            </p>
          </div>
        </div>

        {/* Swap Button */}
        <div className="md:col-span-1 flex items-center justify-center">
          <button
            onClick={handleSwap}
            className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors mt-4"
          >
            <FiRepeat className="w-5 h-5" />
          </button>
        </div>

        {/* To */}
        <div className="md:col-span-3">
          <label className="text-xs text-muted-foreground mb-1 block">To</label>
          <div className="bg-muted rounded-lg p-3 border border-border hover:border-primary/50 transition-colors">
            <select
              value={formData.to}
              onChange={(e) => setFormData({ ...formData, to: e.target.value })}
              className="w-full bg-transparent text-lg font-semibold focus:outline-none cursor-pointer"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">{formData.to}, Airport</p>
          </div>
        </div>

        {/* Departure Date */}
        <div className="md:col-span-2">
          <label className="text-xs text-muted-foreground mb-1 block">Departure</label>
          <div className="bg-muted rounded-lg p-3 border border-border hover:border-primary/50 transition-colors">
            <input
              type="date"
              value={formData.departDate}
              onChange={(e) => setFormData({ ...formData, departDate: e.target.value })}
              className="w-full bg-transparent text-lg font-semibold focus:outline-none cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">
              {new Date(formData.departDate).toLocaleDateString("en-US", {
                weekday: "long",
              })}
            </p>
          </div>
        </div>

        {/* Return Date */}
        <div className="md:col-span-2">
          <label className="text-xs text-muted-foreground mb-1 block">Return</label>
          <div
            className={`bg-muted rounded-lg p-3 border border-border hover:border-primary/50 transition-colors ${
              tripType === "oneWay" ? "opacity-50" : ""
            }`}
          >
            {tripType === "roundTrip" ? (
              <input
                type="date"
                value={formData.returnDate}
                onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                className="w-full bg-transparent text-lg font-semibold focus:outline-none cursor-pointer"
                min={formData.departDate}
              />
            ) : (
              <p className="text-sm text-muted-foreground py-2">
                Tap to add return date for bigger discounts
              </p>
            )}
          </div>
        </div>

        {/* Travelers & Class */}
        <div className="md:col-span-1">
          <label className="text-xs text-muted-foreground mb-1 block">
            Travellers & Class
          </label>
          <div className="bg-muted rounded-lg p-3 border border-border hover:border-primary/50 transition-colors">
            <select
              value={formData.travelers}
              onChange={(e) =>
                setFormData({ ...formData, travelers: parseInt(e.target.value) })
              }
              className="w-full bg-transparent text-lg font-semibold focus:outline-none cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            <select
              value={formData.class}
              onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              className="w-full bg-transparent text-xs text-muted-foreground focus:outline-none cursor-pointer"
            >
              <option value="Economy">Economy</option>
              <option value="Premium Economy">Premium Economy</option>
              <option value="Business">Business</option>
              <option value="First Class">First Class</option>
            </select>
          </div>
        </div>
      </div>

      {/* Special Fares */}
      <div className="flex flex-wrap items-center gap-2 pt-2">
        <span className="text-sm font-medium text-muted-foreground">SPECIAL FARES:</span>
        {specialFares.map((fare) => (
          <button
            key={fare.id}
            onClick={() => setFormData({ ...formData, fareType: fare.id })}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
              formData.fareType === fare.id
                ? "bg-primary/10 border-primary text-primary"
                : "bg-muted border-border hover:border-primary/50"
            }`}
          >
            {fare.name}
            {fare.id !== "regular" && (
              <span className="block text-xs text-muted-foreground">
                {fare.description}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search Button */}
      <div className="flex justify-center pt-4">
        <motion.button
          onClick={handleSearch}
          className="btn-primary flex items-center gap-2 px-12 py-4 text-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Search Flights
          <FiArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default FlightSearchForm;
