import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiUsers, FiStar, FiCheck, FiBriefcase } from "react-icons/fi";
import { MdDirectionsCar } from "react-icons/md";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { cabs, popularCabRoutes } from "../utils/dummyData";
import { formatCurrency } from "../utils/helpers";

const CabSearch = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("all");

  const from = searchParams.get("from") || "Delhi";
  const to = searchParams.get("to") || "Agra";
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0];
  const time = searchParams.get("time") || "09:00";

  // Get route distance
  const route = popularCabRoutes.find((r) => r.from === from && r.to === to);
  const distance = route?.distance || 200; // Default 200km

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setResults(cabs);
      setLoading(false);
    }, 1000);
  }, [from, to, date]);

  const calculatePrice = (cab) => {
    return cab.baseFare + cab.perKmRate * distance + cab.driverAllowance;
  };

  const handleBook = (cab) => {
    const price = calculatePrice(cab);
    navigate(`/booking?type=cab&id=${cab.id}&price=${price}&distance=${distance}&from=${from}&to=${to}`);
  };

  const filteredCabs =
    selectedType === "all" ? results : results.filter((c) => c.type === selectedType);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Search Header */}
      <div className="pt-20 pb-6" style={{ background: "hsl(var(--accent-orange))" }}>
        <div className="container-custom text-primary-foreground">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-4"
          >
            <FiArrowLeft /> Back
          </button>
          <div className="flex flex-wrap items-center gap-4">
            <MdDirectionsCar className="w-8 h-8" />
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold">
                {from} → {to}
              </h1>
              <p className="text-primary-foreground/80">
                {route ? `${route.distance} km • ${route.duration}` : `~${distance} km`} •{" "}
                {new Date(date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}{" "}
                at {time}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card shadow-sm sticky top-16 z-10">
        <div className="container-custom py-4">
          <div className="flex flex-wrap gap-3">
            {["all", "Sedan", "SUV", "Luxury", "Tempo Traveller"].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedType === type
                    ? "text-primary-foreground"
                    : "bg-muted hover:bg-accent-orange/10"
                }`}
                style={
                  selectedType === type
                    ? { background: "hsl(var(--accent-orange))" }
                    : {}
                }
              >
                {type === "all" ? "All Types" : type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container-custom py-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div
              className="animate-spin rounded-full h-12 w-12 border-b-2"
              style={{ borderColor: "hsl(var(--accent-orange))" }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCabs.map((cab, index) => (
              <motion.div
                key={cab.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl shadow-md overflow-hidden"
              >
                <div className="relative h-40 bg-muted">
                  <img
                    src={cab.image}
                    alt={cab.name}
                    className="w-full h-full object-cover"
                  />
                  <span
                    className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold text-primary-foreground rounded-full"
                    style={{ background: "hsl(var(--accent-orange))" }}
                  >
                    {cab.type}
                  </span>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-heading font-semibold text-lg">{cab.name}</h3>
                    <div className="flex items-center gap-1">
                      <FiStar className="w-4 h-4 fill-accent-yellow text-accent-yellow" />
                      <span className="text-sm font-medium">{cab.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <FiUsers className="w-4 h-4" /> {cab.capacity} seats
                    </span>
                    <span className="flex items-center gap-1">
                      <FiBriefcase className="w-4 h-4" /> {cab.luggage} bags
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {cab.features.slice(0, 4).map((feature) => (
                      <span
                        key={feature}
                        className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded"
                      >
                        <FiCheck className="w-3 h-3 text-accent-green" />
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div>
                      <p className="text-2xl font-bold" style={{ color: "hsl(var(--accent-orange))" }}>
                        {formatCurrency(calculatePrice(cab))}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ₹{cab.perKmRate}/km • Toll extra
                      </p>
                    </div>
                    <button
                      onClick={() => handleBook(cab)}
                      className="px-6 py-2 rounded-lg font-semibold text-primary-foreground transition-all hover:scale-105"
                      style={{ background: "hsl(var(--accent-orange))" }}
                    >
                      Book
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {filteredCabs.length === 0 && !loading && (
          <div className="text-center py-12">
            <MdDirectionsCar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No cabs available</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CabSearch;
