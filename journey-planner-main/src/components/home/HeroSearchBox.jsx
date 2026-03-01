import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ServiceTabs from "./ServiceTabs";
import FlightSearchForm from "./FlightSearchForm";
import TrainSearchForm from "./TrainSearchForm";
import CabSearchForm from "./CabSearchForm";
import HotelSearchForm from "./HotelSearchForm";

const HeroSearchBox = () => {
  const [activeService, setActiveService] = useState("flights");

  const renderSearchForm = () => {
    switch (activeService) {
      case "flights":
        return <FlightSearchForm />;
      case "trains":
        return <TrainSearchForm />;
      case "cabssss":
        return <CabSearchForm />;
      case "hotels":
        return <HotelSearchForm />;
      default:
        return <FlightSearchForm />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-card rounded-2xl shadow-2xl p-4 md:p-6 max-w-6xl mx-auto"
    >
      {/* Wrap ServiceTabs to remove bottom border */}
      <div className="[&>*]:border-b-0">
        <ServiceTabs activeService={activeService} onServiceChange={setActiveService} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeService}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderSearchForm()}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default HeroSearchBox;