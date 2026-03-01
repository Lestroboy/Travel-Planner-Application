import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { X, Plane, Home, Car, Coffee, Activity, TrainFront } from "lucide-react";

const AddItemModal = ({ isOpen, onClose, tripId }) => {
  const navigate = useNavigate();

  const itemTypes = [
    {
      id: "flights",
      name: "Flights",
      icon: Plane,
      description: "Search and book flights",
      color: "bg-secondary/10 text-secondary",
      route: "/flights/search",
    },
    {
      id: "hotels",
      name: "Hotels",
      icon: Home,
      description: "Find and book accommodations",
      color: "bg-accent-purple/10 text-accent-purple",
      route: "/hotels/search",
    },
    {
      id: "trains",
      name: "Trains",
      icon: TrainFront,
      description: "Book train tickets",
      color: "bg-accent-green/10 text-accent-green",
      route: "/trains/search",
    },
    {
      id: "cabs",
      name: "Cabs",
      icon: Car,
      description: "Book cabs and transfers",
      color: "bg-accent-orange/10 text-accent-orange",
      route: "/cabs/search",
    },
    {
      id: "activities",
      name: "Activities",
      icon: Activity,
      description: "Explore tours and activities",
      color: "bg-primary/10 text-primary",
      route: "/activities/search",
    },
    {
      id: "food",
      name: "Restaurants",
      icon: Coffee,
      description: "Find dining options",
      color: "bg-accent-yellow/10 text-accent-yellow",
      route: "#",
    },
  ];

  const handleItemClick = (item) => {
    onClose();
    if (item.route !== "#") {
      navigate(`${item.route}?tripId=${tripId}`);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card rounded-2xl w-full max-w-md shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-xl font-heading font-bold">Add to Itinerary</h2>
              <p className="text-sm text-muted-foreground">Choose what you want to add</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Item Grid */}
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              {itemTypes.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleItemClick(item)}
                  className="p-4 rounded-xl border border-border hover:border-primary hover:shadow-md transition-all text-left group"
                >
                  <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-1">{item.name}</h3>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddItemModal;
