import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiClock, FiWifi, FiCoffee, FiMonitor } from "react-icons/fi";
import { MdLuggage, MdAirlineSeatReclineNormal } from "react-icons/md";
import { formatCurrency, formatTime, calculateDiscount } from "../../utils/helpers";

const FlightCard = ({ flight, onSelect }) => {
  const navigate = useNavigate();
  const discount = calculateDiscount(flight.originalPrice, flight.price);
  const amenities = flight.amenities || [];

  const amenityIcons = {
    Meal: FiCoffee,
    WiFi: FiWifi,
    Entertainment: FiMonitor,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-4 md:p-6 shadow-card hover:shadow-card-hover transition-all cursor-pointer group"
      onClick={() => navigate(`/flights/${flight.id}`)}
    >
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        {/* Airline Info */}
        <div className="flex items-center gap-3 md:w-40">
          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
            <img
              src={flight.airlineLogo}
              alt={flight.airline}
              className="w-10 h-10 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `<span class="text-sm font-medium">${flight.airline.slice(0, 2)}</span>`;
              }}
            />
          </div>
          <div>
            <p className="font-medium text-sm">{flight.airline}</p>
            <p className="text-xs text-muted-foreground">{flight.flightNumber}</p>
          </div>
        </div>

        {/* Flight Times */}
        <div className="flex-1 flex items-center gap-4">
          <div className="text-center">
            <p className="text-xl font-semibold">{formatTime(flight.departureTime)}</p>
            <p className="text-sm text-muted-foreground">{flight.fromCode}</p>
          </div>

          <div className="flex-1 flex flex-col items-center px-4">
            <p className="text-xs text-muted-foreground mb-1">{flight.duration}</p>
            <div className="w-full flex items-center">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <div className="flex-1 h-0.5 bg-border relative">
                {flight.stops > 0 && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-muted-foreground" />
                )}
              </div>
              <div className="w-2 h-2 rounded-full bg-primary" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {flight.stops === 0 ? "Non-stop" : `${flight.stops} Stop`}
            </p>
          </div>

          <div className="text-center">
            <p className="text-xl font-semibold">{formatTime(flight.arrivalTime)}</p>
            <p className="text-sm text-muted-foreground">{flight.toCode}</p>
          </div>
        </div>

        {/* Amenities */}
        <div className="hidden lg:flex items-center gap-2 w-32">
          {amenities.slice(0, 3).map((amenity) => {
            const Icon = amenityIcons[amenity] || FiCoffee;
            return (
              <div
                key={amenity}
                className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"
                title={amenity}
              >
                <Icon className="w-4 h-4 text-muted-foreground" />
              </div>
            );
          })}
        </div>

        {/* Price & CTA */}
        <div className="flex md:flex-col items-center md:items-end gap-3 md:gap-1 md:w-36 pt-4 md:pt-0 border-t md:border-t-0 border-border">
          <div className="flex items-baseline gap-2">
            {discount > 0 && (
              <span className="text-xs text-muted-foreground line-through">
                {formatCurrency(flight.originalPrice)}
              </span>
            )}
            <span className="text-xl font-bold text-primary">
              {formatCurrency(flight.price)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">per person</p>
          {flight.seatsLeft <= 10 && (
            <span className="badge badge-danger">
              Only {flight.seatsLeft} left!
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(flight);
            }}
            className="btn-primary text-sm py-2 px-4 mt-2 w-full md:w-auto opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Select
          </button>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <MdLuggage className="w-4 h-4" />
          {flight.baggage}
        </span>
        <span className="flex items-center gap-1">
          <MdAirlineSeatReclineNormal className="w-4 h-4" />
          {flight.class}
        </span>
        <span className="flex items-center gap-1">
          <FiClock className="w-4 h-4" />
          {flight.duration}
        </span>
      </div>
    </motion.div>
  );
};

export default FlightCard;
