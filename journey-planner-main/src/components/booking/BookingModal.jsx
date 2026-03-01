import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiUser, FiMail, FiPhone, FiCreditCard, FiLock, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";
import { formatCurrency } from "../../utils/helpers";
import { useTrips } from "../../context/TripContext";
import { useAuth } from "../../context/AuthContext";
import * as itineraryApi from "../../api/itineraryApi";

const BookingModal = ({ type, item, bookingData, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { trips, addExpense } = useTrips();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [travelerInfo, setTravelerInfo] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    gender: "male",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  const [selectedTripId, setSelectedTripId] = useState("");
  const [addToItinerary, setAddToItinerary] = useState(true);

  const totalAmount = bookingData.totalPrice || item.price;

  const handleTravelerSubmit = (e) => {
    e.preventDefault();
    if (!travelerInfo.name || !travelerInfo.email || !travelerInfo.phone) {
      toast.error("Please fill in all traveler details");
      return;
    }
    setStep(2);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!paymentInfo.cardNumber || !paymentInfo.expiry || !paymentInfo.cvv || !paymentInfo.name) {
      toast.error("Please fill in all payment details");
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate Razorpay payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate booking ID
      const bookingId = `BK${Date.now()}`;

      // Add to itinerary if trip selected and checkbox checked
      if (selectedTripId && addToItinerary) {
        try {
          // Convert booking data to itinerary item format
          const itineraryItemData = itineraryApi.convertBookingToItineraryItem(
            type,
            item,
            { ...bookingData, bookingId }
          );

          // Extract numeric trip ID
          const numericTripId = typeof selectedTripId === 'string' ? 
            parseInt(selectedTripId.replace('TR', '')) : selectedTripId;

          // Create itinerary item based on type
          let createdItem;
          switch (type) {
            case 'flight':
              createdItem = await itineraryApi.createFlightItem(numericTripId, itineraryItemData);
              break;
            case 'hotel':
              createdItem = await itineraryApi.createAccommodationItem(numericTripId, itineraryItemData);
              break;
            case 'activity':
              createdItem = await itineraryApi.createActivityItem(numericTripId, itineraryItemData);
              break;
            default:
              createdItem = await itineraryApi.createItineraryItem(numericTripId, itineraryItemData);
          }

          console.log('Added to itinerary:', createdItem);
          toast.success('Booking added to your trip!');
        } catch (error) {
          console.error('Failed to add to itinerary:', error);
          toast.error('Booking confirmed but failed to add to itinerary');
        }
      }

      // Add expense to selected trip if chosen
      if (selectedTripId) {
        const expenseCategory = type === "flight" ? "flights" : type === "hotel" ? "hotels" : "activities";
        await addExpense(selectedTripId, {
          category: expenseCategory,
          description: type === "flight" 
            ? `${item.airline} - ${item.from} to ${item.to}`
            : `${item.name} - ${item.location || ""}`,
          amount: totalAmount,
        });
      }

      setStep(3);
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleComplete = () => {
    toast.success("Booking confirmed!");
    onClose();
    navigate("/booking/confirmation", {
      state: {
        type,
        item,
        bookingData,
        travelerInfo,
        bookingId: `BK${Date.now()}`,
      },
    });
  };

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
          className="bg-card rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-xl font-heading font-bold">
                {step === 1 && "Traveler Details"}
                {step === 2 && "Payment"}
                {step === 3 && "Booking Confirmed!"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {step === 1 && "Enter traveler information"}
                {step === 2 && "Complete your payment securely"}
                {step === 3 && "Your booking is complete"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                      step >= s
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > s ? <FiCheck className="w-4 h-4" /> : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`w-16 md:w-24 h-1 mx-2 rounded ${
                        step > s ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Step 1: Traveler Details */}
            {step === 1 && (
              <form onSubmit={handleTravelerSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name (as per ID)</label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={travelerInfo.name}
                      onChange={(e) => setTravelerInfo({ ...travelerInfo, name: e.target.value })}
                      placeholder="Enter full name"
                      className="input-field pl-11"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      value={travelerInfo.email}
                      onChange={(e) => setTravelerInfo({ ...travelerInfo, email: e.target.value })}
                      placeholder="Enter email"
                      className="input-field pl-11"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <div className="relative">
                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="tel"
                      value={travelerInfo.phone}
                      onChange={(e) => setTravelerInfo({ ...travelerInfo, phone: e.target.value })}
                      placeholder="Enter phone number"
                      className="input-field pl-11"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Gender</label>
                  <div className="flex gap-4">
                    {["male", "female", "other"].map((g) => (
                      <label key={g} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          checked={travelerInfo.gender === g}
                          onChange={(e) => setTravelerInfo({ ...travelerInfo, gender: e.target.value })}
                          className="w-4 h-4"
                        />
                        <span className="capitalize">{g}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {trips.length > 0 && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">Add to Trip (Optional)</label>
                      <select
                        value={selectedTripId}
                        onChange={(e) => setSelectedTripId(e.target.value)}
                        className="input-field"
                      >
                        <option value="">Select a trip</option>
                        {trips.map((trip) => (
                          <option key={trip.id} value={trip.tripId}>
                            {trip.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedTripId && (
                      <label className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={addToItinerary}
                          onChange={(e) => setAddToItinerary(e.target.checked)}
                          className="w-5 h-5 rounded border-border text-primary mt-0.5"
                        />
                        <div>
                          <p className="font-medium">Add to itinerary</p>
                          <p className="text-sm text-muted-foreground">
                            This booking will be automatically added to your trip timeline
                          </p>
                        </div>
                      </label>
                    )}
                  </div>
                )}

                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between mb-4">
                    <span className="text-muted-foreground">Total Amount</span>
                    <span className="text-xl font-bold text-primary">{formatCurrency(totalAmount)}</span>
                  </div>
                  <button type="submit" className="btn-primary w-full py-3">
                    Continue to Payment
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Payment (Razorpay Mock) */}
            {step === 2 && (
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div className="bg-muted rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src="https://razorpay.com/favicon.png"
                      alt="Razorpay"
                      className="w-6 h-6"
                    />
                    <span className="font-semibold">Secure Payment via Razorpay</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your payment information is encrypted and secure.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Card Number</label>
                  <div className="relative">
                    <FiCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={paymentInfo.cardNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 16);
                        const formatted = value.replace(/(.{4})/g, "$1 ").trim();
                        setPaymentInfo({ ...paymentInfo, cardNumber: formatted });
                      }}
                      placeholder="1234 5678 9012 3456"
                      className="input-field pl-11"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Expiry Date</label>
                    <input
                      type="text"
                      value={paymentInfo.expiry}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, "").slice(0, 4);
                        if (value.length >= 2) {
                          value = value.slice(0, 2) + "/" + value.slice(2);
                        }
                        setPaymentInfo({ ...paymentInfo, expiry: value });
                      }}
                      placeholder="MM/YY"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CVV</label>
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="password"
                        value={paymentInfo.cvv}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value.slice(0, 3) })}
                        placeholder="***"
                        className="input-field pl-11"
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Name on Card</label>
                  <input
                    type="text"
                    value={paymentInfo.name}
                    onChange={(e) => setPaymentInfo({ ...paymentInfo, name: e.target.value })}
                    placeholder="Enter name on card"
                    className="input-field"
                  />
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between mb-4">
                    <span className="text-muted-foreground">Total Amount</span>
                    <span className="text-xl font-bold text-primary">{formatCurrency(totalAmount)}</span>
                  </div>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>Pay {formatCurrency(totalAmount)}</>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground"
                  >
                    ← Back to Traveler Details
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 rounded-full bg-accent-green/10 flex items-center justify-center mx-auto mb-6"
                >
                  <FiCheck className="w-10 h-10 text-accent-green" />
                </motion.div>
                <h3 className="text-2xl font-heading font-bold mb-2">Payment Successful!</h3>
                <p className="text-muted-foreground mb-6">
                  Your booking has been confirmed. A confirmation email has been sent to {travelerInfo.email}.
                </p>
                {selectedTripId && addToItinerary && (
                  <div className="bg-accent-green/10 text-accent-green rounded-xl p-4 mb-6">
                    <FiCheck className="w-5 h-5 mx-auto mb-2" />
                    <p className="text-sm font-medium">
                      ✓ Added to your trip itinerary
                    </p>
                  </div>
                )}
                <div className="bg-muted rounded-xl p-4 mb-6">
                  <p className="text-sm text-muted-foreground">Amount Paid</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(totalAmount)}</p>
                </div>
                <button onClick={handleComplete} className="btn-primary w-full py-3">
                  View Booking Details
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingModal;