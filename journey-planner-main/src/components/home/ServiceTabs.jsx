import { motion } from "framer-motion";
import { FiSend, FiMapPin, FiCalendar } from "react-icons/fi";
import { MdFlight, MdTrain, MdDirectionsCar, MdHotel } from "react-icons/md";

const services = [
  { id: "flights", label: "Flights", icon: MdFlight, color: "text-primary" },
  { id: "trains", label: "Trains", icon: MdTrain, color: "text-secondary" },
  { id: "cabs", label: "Cabs", icon: MdDirectionsCar, color: "text-accent-orange" },
  { id: "hotels", label: "Hotels", icon: MdHotel, color: "text-accent-purple" },
];

const ServiceTabs = ({ activeService, onServiceChange }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-6">
      {services.map((service) => {
        const Icon = service.icon;
        const isActive = activeService === service.id;

        return (
          <motion.button
            key={service.id}
            onClick={() => onServiceChange(service.id)}
            className={`flex flex-col items-center px-4 py-3 md:px-6 md:py-4 rounded-xl transition-all duration-300 min-w-[80px] md:min-w-[100px] ${
              isActive
                ? "bg-card shadow-lg"
                : "bg-card/50 hover:bg-card hover:shadow-md"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Icon
              className={`w-6 h-6 md:w-8 md:h-8 mb-1 ${
                isActive ? service.color : "text-muted-foreground"
              }`}
            />
            <span
              className={`text-xs md:text-sm font-medium ${
                isActive ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {service.label}
            </span>
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute -bottom-0.5 left-0 right-0 h-1 bg-primary rounded-full"
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default ServiceTabs;