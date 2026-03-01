import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiRepeat } from "react-icons/fi";
import { railwayStations, trainClasses } from "../../utils/dummyData";

const TrainSearchForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    from: "NDLS",
    to: "MMCT",
    date: new Date().toISOString().split("T")[0],
    class: "all",
    quota: "general",
  });

  const handleSwap = () => {
    setFormData((prev) => ({
      ...prev,
      from: prev.to,
      to: prev.from,
    }));
  };

  const handleSearch = () => {
    const fromStation = railwayStations.find((s) => s.code === formData.from);
    const toStation = railwayStations.find((s) => s.code === formData.to);
    navigate(
      `/trains/search?from=${fromStation?.city || formData.from}&to=${toStation?.city || formData.to}&date=${formData.date}&class=${formData.class}`
    );
  };

  return (
    <div className="space-y-4">
      {/* Search Form */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* From Station */}
        <div className="md:col-span-3 relative">
          <label className="text-xs text-muted-foreground mb-1 block">From</label>
          <div className="bg-muted rounded-lg p-3 border border-border hover:border-secondary/50 transition-colors">
            <select
              value={formData.from}
              onChange={(e) => setFormData({ ...formData, from: e.target.value })}
              className="w-full bg-transparent text-lg font-semibold focus:outline-none cursor-pointer"
            >
              {railwayStations.map((station) => (
                <option key={station.code} value={station.code}>
                  {station.city}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              {railwayStations.find((s) => s.code === formData.from)?.name} -{" "}
              {formData.from}
            </p>
          </div>
        </div>

        {/* Swap Button */}
        <div className="md:col-span-1 flex items-center justify-center">
          <button
            onClick={handleSwap}
            className="p-2 rounded-full bg-secondary/10 hover:bg-secondary/20 text-secondary transition-colors mt-4"
          >
            <FiRepeat className="w-5 h-5" />
          </button>
        </div>

        {/* To Station */}
        <div className="md:col-span-3">
          <label className="text-xs text-muted-foreground mb-1 block">To</label>
          <div className="bg-muted rounded-lg p-3 border border-border hover:border-secondary/50 transition-colors">
            <select
              value={formData.to}
              onChange={(e) => setFormData({ ...formData, to: e.target.value })}
              className="w-full bg-transparent text-lg font-semibold focus:outline-none cursor-pointer"
            >
              {railwayStations.map((station) => (
                <option key={station.code} value={station.code}>
                  {station.city}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              {railwayStations.find((s) => s.code === formData.to)?.name} - {formData.to}
            </p>
          </div>
        </div>

        {/* Travel Date */}
        <div className="md:col-span-2">
          <label className="text-xs text-muted-foreground mb-1 block">
            Travel Date
          </label>
          <div className="bg-muted rounded-lg p-3 border border-border hover:border-secondary/50 transition-colors">
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full bg-transparent text-lg font-semibold focus:outline-none cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">
              {new Date(formData.date).toLocaleDateString("en-US", {
                weekday: "long",
              })}
            </p>
          </div>
        </div>

        {/* Class */}
        <div className="md:col-span-2">
          <label className="text-xs text-muted-foreground mb-1 block">Class</label>
          <div className="bg-muted rounded-lg p-3 border border-border hover:border-secondary/50 transition-colors">
            <select
              value={formData.class}
              onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              className="w-full bg-transparent text-lg font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">All Classes</option>
              <option value="1A">First AC (1A)</option>
              <option value="2A">Second AC (2A)</option>
              <option value="3A">Third AC (3A)</option>
              <option value="SL">Sleeper (SL)</option>
              <option value="EC">Executive Chair</option>
              <option value="CC">AC Chair Car</option>
            </select>
          </div>
        </div>

        {/* Quota */}
        <div className="md:col-span-1">
          <label className="text-xs text-muted-foreground mb-1 block">Quota</label>
          <div className="bg-muted rounded-lg p-3 border border-border hover:border-secondary/50 transition-colors">
            <select
              value={formData.quota}
              onChange={(e) => setFormData({ ...formData, quota: e.target.value })}
              className="w-full bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
            >
              <option value="general">General</option>
              <option value="ladies">Ladies</option>
              <option value="tatkal">Tatkal</option>
              <option value="senior">Senior Citizen</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search Button */}
      <div className="flex justify-center pt-4">
        <motion.button
          onClick={handleSearch}
          className="btn-secondary flex items-center gap-2 px-12 py-4 text-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Search Trains
          <FiArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default TrainSearchForm;
