import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FiArrowLeft, FiClock, FiUsers, FiCheck, FiWifi, FiCoffee, FiMonitor
} from "react-icons/fi";
import { MdLuggage, MdAirlineSeatReclineNormal, MdFlightTakeoff, MdFlightLand } from "react-icons/md";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import BookingModal from "../components/booking/BookingModal";
import { flights } from "../utils/dummyData";
import { formatCurrency, formatTime } from "../utils/helpers";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const FlightDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [flight, setFlight] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    passengers: 1,
    class: "Economy",
    addBaggage: false,
    addMeal: false,
    addInsurance: false,
  });

  useEffect(() => {
    const foundFlight = flights.find((f) => f.id === id);
    if (foundFlight) {
      setFlight(foundFlight);
      setBookingData((prev) => ({ ...prev, class: foundFlight.class }));
    }
  }, [id]);

  if (!flight) {
    return (
      <div className="min-h-screen bg-muted">
        <Header />
        <div className="pt-24 pb-12">
          <div className="container-custom text-center py-20">
            <h2 className="text-2xl font-heading font-bold mb-4">Flight not found</h2>
            <button onClick={() => navigate("/flights/search")} className="btn-primary">
              Browse Flights
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const amenityIcons = {
    Meal: FiCoffee,
    WiFi: FiWifi,
    Entertainment: FiMonitor,
  };

  const addons = [
    { id: "addBaggage", name: "Extra Baggage (15kg)", price: 1500 },
    { id: "addMeal", name: "Premium Meal", price: 500 },
    { id: "addInsurance", name: "Travel Insurance", price: 299 },
  ];

  const calculateTotal = () => {
    let total = flight.price * bookingData.passengers;
    if (bookingData.addBaggage) total += 1500 * bookingData.passengers;
    if (bookingData.addMeal) total += 500 * bookingData.passengers;
    if (bookingData.addInsurance) total += 299 * bookingData.passengers;
    return total;
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast.error("Please login to book");
      navigate("/login");
      return;
    }
    setShowBookingModal(true);
  };

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      
      <div className="pt-20">
        {/* Back Button */}
        <div className="container-custom py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
            Back to results
          </button>
        </div>

        {/* Flight Header */}
        <div className="container-custom mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-6 border border-border"
          >
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              {/* Airline Info */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center overflow-hidden">
                  <img
                    src={flight.airlineLogo}
                    alt={flight.airline}
                    className="w-14 h-14 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `<span class="text-lg font-bold">${flight.airline.slice(0, 2)}</span>`;
                    }}
                  />
                </div>
                <div>
                  <h2 className="text-xl font-heading font-bold">{flight.airline}</h2>
                  <p className="text-muted-foreground">{flight.flightNumber}</p>
                </div>
              </div>

              {/* Flight Route */}
              <div className="flex-1 flex items-center gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold">{formatTime(flight.departureTime)}</p>
                  <p className="text-lg font-medium">{flight.fromCode}</p>
                  <p className="text-sm text-muted-foreground">{flight.from}</p>
                </div>

                <div className="flex-1 flex flex-col items-center">
                  <p className="text-sm text-muted-foreground mb-2">{flight.duration}</p>
                  <div className="w-full flex items-center">
                    <MdFlightTakeoff className="w-6 h-6 text-primary" />
                    <div className="flex-1 h-0.5 bg-border mx-2 relative">
                      {flight.stops > 0 && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent-orange" />
                      )}
                    </div>
                    <MdFlightLand className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {flight.stops === 0 ? "Non-stop" : `${flight.stops} Stop`}
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-3xl font-bold">{formatTime(flight.arrivalTime)}</p>
                  <p className="text-lg font-medium">{flight.toCode}</p>
                  <p className="text-sm text-muted-foreground">{flight.to}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="container-custom pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Flight Details */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h2 className="text-xl font-heading font-semibold mb-4">Flight Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-muted">
                    <MdLuggage className="w-6 h-6 text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">Baggage</p>
                    <p className="font-semibold">{flight.baggage}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted">
                    <MdAirlineSeatReclineNormal className="w-6 h-6 text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">Class</p>
                    <p className="font-semibold">{flight.class}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted">
                    <FiClock className="w-6 h-6 text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-semibold">{flight.duration}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted">
                    <FiUsers className="w-6 h-6 text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">Seats Left</p>
                    <p className="font-semibold text-accent-orange">{flight.seatsLeft}</p>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h2 className="text-xl font-heading font-semibold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(flight.amenities || []).map((amenity) => {
                    const Icon = amenityIcons[amenity] || FiCheck;
                    return (
                      <div key={amenity} className="flex items-center gap-3 p-3 rounded-xl bg-muted">
                        <Icon className="w-5 h-5 text-primary" />
                        <span>{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Add-ons */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h2 className="text-xl font-heading font-semibold mb-4">Add-ons</h2>
                <div className="space-y-3">
                  {addons.map((addon) => (
                    <label
                      key={addon.id}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        bookingData[addon.id]
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={bookingData[addon.id]}
                          onChange={(e) => setBookingData({ ...bookingData, [addon.id]: e.target.checked })}
                          className="w-5 h-5 rounded border-border text-primary"
                        />
                        <span className="font-medium">{addon.name}</span>
                      </div>
                      <span className="font-semibold text-primary">+{formatCurrency(addon.price)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Important Info */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h2 className="text-xl font-heading font-semibold mb-4">Important Information</h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <FiCheck className="w-5 h-5 text-accent-green flex-shrink-0 mt-0.5" />
                    Check-in opens 48 hours before departure
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheck className="w-5 h-5 text-accent-green flex-shrink-0 mt-0.5" />
                    Arrive at the airport at least 2 hours before domestic flights
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheck className="w-5 h-5 text-accent-green flex-shrink-0 mt-0.5" />
                    Carry a valid photo ID for verification
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheck className="w-5 h-5 text-accent-green flex-shrink-0 mt-0.5" />
                    Free cancellation available up to 24 hours before departure
                  </li>
                </ul>
              </div>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card rounded-2xl p-6 border border-border shadow-lg">
                <div className="flex items-baseline justify-between mb-6">
                  <div>
                    <span className="text-3xl font-bold text-primary">{formatCurrency(flight.price)}</span>
                    <span className="text-muted-foreground"> / person</span>
                  </div>
                  {flight.originalPrice > flight.price && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatCurrency(flight.originalPrice)}
                    </span>
                  )}
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Number of Passengers</label>
                    <select
                      value={bookingData.passengers}
                      onChange={(e) => setBookingData({ ...bookingData, passengers: parseInt(e.target.value) })}
                      className="input-field"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                        <option key={n} value={n}>{n} {n === 1 ? "Passenger" : "Passengers"}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mb-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Base fare ({bookingData.passengers} x {formatCurrency(flight.price)})
                    </span>
                    <span>{formatCurrency(flight.price * bookingData.passengers)}</span>
                  </div>
                  {bookingData.addBaggage && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Extra Baggage</span>
                      <span>{formatCurrency(1500 * bookingData.passengers)}</span>
                    </div>
                  )}
                  {bookingData.addMeal && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Premium Meal</span>
                      <span>{formatCurrency(500 * bookingData.passengers)}</span>
                    </div>
                  )}
                  {bookingData.addInsurance && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Travel Insurance</span>
                      <span>{formatCurrency(299 * bookingData.passengers)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(calculateTotal())}</span>
                  </div>
                </div>

                <button onClick={handleBookNow} className="btn-primary w-full py-3 text-lg">
                  Book Now
                </button>

                {flight.seatsLeft <= 10 && (
                  <p className="text-center text-sm text-accent-orange mt-4">
                    ⚡ Only {flight.seatsLeft} seats left at this price!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showBookingModal && (
        <BookingModal
          type="flight"
          item={flight}
          bookingData={{ ...bookingData, totalPrice: calculateTotal() }}
          onClose={() => setShowBookingModal(false)}
        />
      )}

      <Footer />
    </div>
  );
};

export default FlightDetail;
