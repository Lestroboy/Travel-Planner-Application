import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiClock, FiStar, FiMapPin, FiUsers, FiCheck } from "react-icons/fi";
import { MdTrain } from "react-icons/md";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { trains, railwayStations } from "../utils/dummyData";
import { formatCurrency } from "../utils/helpers";

const TrainSearch = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("all");

  const from = searchParams.get("from") || "Delhi";
  const to = searchParams.get("to") || "Mumbai";
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      let filtered = trains.filter((train) => {
        const matchFrom = train.from.toLowerCase().includes(from.toLowerCase());
        const matchTo = train.to.toLowerCase().includes(to.toLowerCase());
        return matchFrom || matchTo || true; // Show all for demo
      });
      setResults(filtered);
      setLoading(false);
    }, 1000);
  }, [from, to, date]);

  const handleBook = (train, trainClass) => {
    navigate(`/booking?type=train&id=${train.id}&class=${trainClass.type}&price=${trainClass.price}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Search Header */}
      <div className="bg-secondary text-secondary-foreground pt-20 pb-6">
        <div className="container-custom">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-secondary-foreground/80 hover:text-secondary-foreground mb-4"
          >
            <FiArrowLeft /> Back
          </button>
          <div className="flex flex-wrap items-center gap-4">
            <MdTrain className="w-8 h-8" />
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold">
                {from} → {to}
              </h1>
              <p className="text-secondary-foreground/80">
                {new Date(date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card shadow-sm sticky top-16 z-10">
        <div className="container-custom py-4">
          <div className="flex flex-wrap gap-3">
            {["all", "1A", "2A", "3A", "SL", "CC", "EC"].map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedClass === cls
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-muted hover:bg-secondary/10"
                }`}
              >
                {cls === "all" ? "All Classes" : cls}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container-custom py-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary" />
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((train, index) => (
              <motion.div
                key={train.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl shadow-md p-4 md:p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Train Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-heading font-semibold text-lg">{train.name}</h3>
                      <span className="text-sm text-muted-foreground">#{train.trainNumber}</span>
                      <div className="flex items-center gap-1 text-sm">
                        <FiStar className="w-4 h-4 fill-accent-yellow text-accent-yellow" />
                        <span>{train.rating}</span>
                      </div>
                    </div>

                    {/* Route */}
                    <div className="flex items-center gap-4 mb-3">
                      <div>
                        <p className="text-xl font-bold">{train.departureTime}</p>
                        <p className="text-sm text-muted-foreground">{train.fromCode}</p>
                      </div>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1 border-t-2 border-dashed border-border" />
                        <div className="text-center">
                          <FiClock className="w-4 h-4 mx-auto text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">{train.duration}</p>
                        </div>
                        <div className="flex-1 border-t-2 border-dashed border-border" />
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">{train.arrivalTime}</p>
                        <p className="text-sm text-muted-foreground">{train.toCode}</p>
                      </div>
                    </div>

                    {/* Days */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {train.daysOfWeek.map((day) => (
                        <span
                          key={day}
                          className="px-2 py-0.5 bg-secondary/10 text-secondary text-xs rounded"
                        >
                          {day}
                        </span>
                      ))}
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2">
                      {train.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="flex items-center gap-1 text-xs text-muted-foreground"
                        >
                          <FiCheck className="w-3 h-3 text-accent-green" />
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Classes & Prices */}
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {train.classes
                      .filter((c) => selectedClass === "all" || c.type === selectedClass)
                      .map((cls) => (
                        <button
                          key={cls.type}
                          onClick={() => handleBook(train, cls)}
                          className="flex flex-col items-center p-3 rounded-lg border-2 border-border hover:border-secondary transition-colors min-w-[100px]"
                        >
                          <span className="text-xs text-muted-foreground">{cls.name}</span>
                          <span className="font-bold text-secondary">
                            {formatCurrency(cls.price)}
                          </span>
                          <span
                            className={`text-xs ${
                              cls.available < 10 ? "text-primary" : "text-accent-green"
                            }`}
                          >
                            {cls.available} seats
                          </span>
                        </button>
                      ))}
                  </div>
                </div>
              </motion.div>
            ))}

            {results.length === 0 && (
              <div className="text-center py-12">
                <MdTrain className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No trains found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default TrainSearch;
