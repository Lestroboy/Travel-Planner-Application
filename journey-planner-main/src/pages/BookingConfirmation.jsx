import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheck, FiDownload, FiHome, FiCalendar, FiMapPin, FiUser } from "react-icons/fi";
import { MdFlight, MdTrain, MdDirectionsCar, MdHotel } from "react-icons/md";
import confetti from "canvas-confetti";
import Header from "../components/common/Header";
import { formatCurrency } from "../utils/helpers";

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [booking, setBooking] = useState(null);

  const bookingId = searchParams.get("id");

  useEffect(() => {
    // Get booking from localStorage
    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    const found = bookings.find((b) => b.id === bookingId);
    setBooking(found);

    // Trigger confetti
    if (found) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FF385C", "#008CFF", "#FFD700"],
      });
    }
  }, [bookingId]);

  const getIcon = () => {
    if (!booking) return null;
    switch (booking.type) {
      case "flight":
        return <MdFlight className="w-8 h-8" />;
      case "train":
        return <MdTrain className="w-8 h-8" />;
      case "cab":
        return <MdDirectionsCar className="w-8 h-8" />;
      case "hotel":
        return <MdHotel className="w-8 h-8" />;
      default:
        return null;
    }
  };

  const getColor = () => {
    if (!booking) return "hsl(var(--primary))";
    switch (booking.type) {
      case "flight":
        return "hsl(var(--primary))";
      case "train":
        return "hsl(var(--secondary))";
      case "cab":
        return "hsl(var(--accent-orange))";
      case "hotel":
        return "hsl(var(--accent-purple))";
      default:
        return "hsl(var(--primary))";
    }
  };

  if (!booking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Booking not found</p>
          <button onClick={() => navigate("/")} className="btn-primary mt-4">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <Header />

      <div className="container-custom pt-24 pb-12 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Success Header */}
          <div
            className="text-center py-12 text-primary-foreground"
            style={{ background: getColor() }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <FiCheck className="w-10 h-10" />
            </motion.div>
            <h1 className="text-3xl font-heading font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-primary-foreground/80">
              Your {booking.type} booking has been successfully confirmed
            </p>
          </div>

          {/* Booking Details */}
          <div className="p-6 md:p-8">
            {/* Booking ID */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
              <div>
                <p className="text-sm text-muted-foreground">Booking ID</p>
                <p className="font-mono font-bold text-lg">{booking.id}</p>
              </div>
              <div
                className="p-3 rounded-full"
                style={{ background: getColor(), color: "white" }}
              >
                {getIcon()}
              </div>
            </div>

            {/* Trip Details */}
            {booking.itemDetails && (
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <FiMapPin className="w-5 h-5 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Route</p>
                    <p className="font-semibold">
                      {booking.itemDetails.from} → {booking.itemDetails.to}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FiCalendar className="w-5 h-5 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date & Time</p>
                    <p className="font-semibold">
                      {booking.itemDetails.departureTime} - {booking.itemDetails.arrivalTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FiUser className="w-5 h-5 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Passenger</p>
                    <p className="font-semibold">
                      {booking.passenger.firstName} {booking.passenger.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">{booking.passenger.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Price */}
            <div className="bg-muted rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Paid</span>
                <span className="text-2xl font-bold" style={{ color: getColor() }}>
                  {formatCurrency(booking.price)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  // Simulate download
                  alert("Ticket downloaded! (Demo)");
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-semibold transition-colors hover:bg-muted"
                style={{ borderColor: getColor(), color: getColor() }}
              >
                <FiDownload /> Download Ticket
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-primary-foreground transition-all hover:scale-[1.02]"
                style={{ background: getColor() }}
              >
                <FiHome /> Back to Home
              </button>
            </div>
          </div>

          {/* Footer Note */}
          <div className="bg-muted/50 p-4 text-center">
            <p className="text-sm text-muted-foreground">
              A confirmation email has been sent to {booking.passenger.email}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
