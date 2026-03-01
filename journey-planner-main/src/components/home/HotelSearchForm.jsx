import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiUsers } from "react-icons/fi";
import { cities } from "../../utils/dummyData";

const HotelSearchForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    location: "Goa",
    checkIn: new Date().toISOString().split("T")[0],
    checkOut: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
    rooms: 1,
    guests: 2,
  });

  const handleSearch = () => {
    navigate(
      `/hotels/search?location=${formData.location}&checkIn=${formData.checkIn}&checkOut=${formData.checkOut}&rooms=${formData.rooms}&guests=${formData.guests}`
    );
  };

  // Calculate nights
  const nights = Math.ceil(
    (new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <div className="space-y-4">
      {/* Search Form */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Location */}
        <div className="md:col-span-4">
          <label className="text-xs text-muted-foreground mb-1 block">
            City, Property Name or Location
          </label>
          <div className="bg-muted rounded-lg p-3 border border-border hover:border-accent-purple/50 transition-colors">
            <select
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full bg-transparent text-lg font-semibold focus:outline-none cursor-pointer"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">India</p>
          </div>
        </div>

        {/* Check-in */}
        <div className="md:col-span-2">
          <label className="text-xs text-muted-foreground mb-1 block">Check-In</label>
          <div className="bg-muted rounded-lg p-3 border border-border hover:border-accent-purple/50 transition-colors">
            <input
              type="date"
              value={formData.checkIn}
              onChange={(e) =>
                setFormData({ ...formData, checkIn: e.target.value })
              }
              className="w-full bg-transparent text-lg font-semibold focus:outline-none cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">
              {new Date(formData.checkIn).toLocaleDateString("en-US", {
                weekday: "long",
              })}
            </p>
          </div>
        </div>

        {/* Check-out */}
        <div className="md:col-span-2">
          <label className="text-xs text-muted-foreground mb-1 block">
            Check-Out
          </label>
          <div className="bg-muted rounded-lg p-3 border border-border hover:border-accent-purple/50 transition-colors">
            <input
              type="date"
              value={formData.checkOut}
              onChange={(e) =>
                setFormData({ ...formData, checkOut: e.target.value })
              }
              className="w-full bg-transparent text-lg font-semibold focus:outline-none cursor-pointer"
              min={formData.checkIn}
            />
            <p className="text-xs text-muted-foreground">
              {nights} Night{nights > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Rooms */}
        <div className="md:col-span-2">
          <label className="text-xs text-muted-foreground mb-1 block">
            Rooms & Guests
          </label>
          <div className="bg-muted rounded-lg p-3 border border-border hover:border-accent-purple/50 transition-colors">
            <div className="flex items-center gap-2">
              <FiUsers className="text-accent-purple" />
              <div className="flex gap-2">
                <select
                  value={formData.rooms}
                  onChange={(e) =>
                    setFormData({ ...formData, rooms: parseInt(e.target.value) })
                  }
                  className="bg-transparent font-semibold focus:outline-none cursor-pointer"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num} Room{num > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <select
              value={formData.guests}
              onChange={(e) =>
                setFormData({ ...formData, guests: parseInt(e.target.value) })
              }
              className="w-full bg-transparent text-xs text-muted-foreground focus:outline-none cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  {num} Guest{num > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Price Range */}
        <div className="md:col-span-2">
          <label className="text-xs text-muted-foreground mb-1 block">
            Price Per Night
          </label>
          <div className="bg-muted rounded-lg p-3 border border-border hover:border-accent-purple/50 transition-colors">
            <select className="w-full bg-transparent text-lg font-semibold focus:outline-none cursor-pointer">
              <option>₹0 - ₹5,000</option>
              <option>₹5,000 - ₹10,000</option>
              <option>₹10,000 - ₹25,000</option>
              <option>₹25,000+</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search Button */}
      <div className="flex justify-center pt-4">
        <motion.button
          onClick={handleSearch}
          className="flex items-center gap-2 px-12 py-4 text-lg font-semibold text-primary-foreground rounded-xl transition-all duration-300 hover:scale-105"
          style={{ background: "hsl(var(--accent-purple))" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Search Hotels
          <FiArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default HotelSearchForm;
