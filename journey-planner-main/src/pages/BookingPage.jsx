import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiCreditCard, FiCheck } from "react-icons/fi";
import { MdFlight, MdTrain, MdDirectionsCar, MdHotel } from "react-icons/md";
import Header from "../components/common/Header";
import { formatCurrency } from "../utils/helpers";
import { flights, trains, cabs, hotels } from "../utils/dummyData";

const BookingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const bookingType = searchParams.get("type") || "flight";
  const itemId = searchParams.get("id");
  const price = parseInt(searchParams.get("price") || "0");

  // Get item details
  const getItemDetails = () => {
    switch (bookingType) {
      case "flight":
        return flights.find((f) => f.id === itemId);
      case "train":
        return trains.find((t) => t.id === itemId);
      case "cab":
        return cabs.find((c) => c.id === itemId);
      case "hotel":
        return hotels.find((h) => h.id === itemId);
      default:
        return null;
    }
  };

  const item = getItemDetails();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    passengers: [{ name: "", age: "", gender: "male" }],
  });

  const [errors, setErrors] = useState({});

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    else if (formData.phone.length < 10) newErrors.phone = "Invalid phone number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handlePayment = () => {
    setLoading(true);
    // Simulate payment
    setTimeout(() => {
      // Save booking to localStorage
      const booking = {
        id: `BK-${Date.now()}`,
        type: bookingType,
        itemId,
        itemDetails: item,
        price,
        passenger: formData,
        status: "confirmed",
        bookedAt: new Date().toISOString(),
      };

      const existingBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
      localStorage.setItem("bookings", JSON.stringify([booking, ...existingBookings]));

      navigate(`/booking/confirmation?id=${booking.id}`);
    }, 2000);
  };

  const getIcon = () => {
    switch (bookingType) {
      case "flight":
        return <MdFlight className="w-6 h-6" />;
      case "train":
        return <MdTrain className="w-6 h-6" />;
      case "cab":
        return <MdDirectionsCar className="w-6 h-6" />;
      case "hotel":
        return <MdHotel className="w-6 h-6" />;
      default:
        return null;
    }
  };

  const getColor = () => {
    switch (bookingType) {
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

  return (
    <div className="min-h-screen bg-muted">
      <Header />

      <div className="container-custom pt-24 pb-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <FiArrowLeft /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      step >= s
                        ? "text-primary-foreground"
                        : "bg-muted-foreground/20 text-muted-foreground"
                    }`}
                    style={step >= s ? { background: getColor() } : {}}
                  >
                    {step > s ? <FiCheck /> : s}
                  </div>
                  {s < 2 && (
                    <div
                      className={`w-20 h-1 ${
                        step > s ? "bg-current" : "bg-muted-foreground/20"
                      }`}
                      style={step > s ? { background: getColor() } : {}}
                    />
                  )}
                </div>
              ))}
            </div>

            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card rounded-2xl shadow-lg p-6 md:p-8"
            >
              {step === 1 && (
                <>
                  <h2 className="text-2xl font-heading font-bold mb-6">
                    Traveler Details
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">First Name</label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) =>
                            setFormData({ ...formData, firstName: e.target.value })
                          }
                          className={`input-field pl-10 ${errors.firstName ? "border-primary" : ""}`}
                          placeholder="John"
                        />
                      </div>
                      {errors.firstName && (
                        <p className="text-primary text-xs mt-1">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Last Name</label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) =>
                            setFormData({ ...formData, lastName: e.target.value })
                          }
                          className={`input-field pl-10 ${errors.lastName ? "border-primary" : ""}`}
                          placeholder="Doe"
                        />
                      </div>
                      {errors.lastName && (
                        <p className="text-primary text-xs mt-1">{errors.lastName}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Email</label>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className={`input-field pl-10 ${errors.email ? "border-primary" : ""}`}
                          placeholder="john@email.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-primary text-xs mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Phone</label>
                      <div className="relative">
                        <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className={`input-field pl-10 ${errors.phone ? "border-primary" : ""}`}
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-primary text-xs mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-full mt-8 py-4 rounded-xl font-semibold text-primary-foreground transition-all hover:scale-[1.02]"
                    style={{ background: getColor() }}
                  >
                    Continue to Payment
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="text-2xl font-heading font-bold mb-6">Payment</h2>

                  <div className="bg-muted rounded-xl p-4 mb-6">
                    <p className="text-sm text-muted-foreground mb-2">
                      This is a simulated payment. No real transaction will occur.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Card Number</label>
                      <div className="relative">
                        <FiCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="text"
                          className="input-field pl-10"
                          placeholder="4242 4242 4242 4242"
                          maxLength={19}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Expiry</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">CVV</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="123"
                          maxLength={3}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 py-4 rounded-xl font-semibold border border-border hover:bg-muted transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePayment}
                      disabled={loading}
                      className="flex-1 py-4 rounded-xl font-semibold text-primary-foreground transition-all hover:scale-[1.02] disabled:opacity-70"
                      style={{ background: getColor() }}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        `Pay ${formatCurrency(price)}`
                      )}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl shadow-lg p-6 sticky top-24">
              <div
                className="flex items-center gap-3 mb-4 pb-4 border-b border-border"
                style={{ color: getColor() }}
              >
                {getIcon()}
                <h3 className="font-heading font-semibold capitalize">{bookingType} Booking</h3>
              </div>

              {item && (
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {bookingType === "flight" && item.airline}
                      {bookingType === "train" && item.name}
                      {bookingType === "cab" && item.name}
                      {bookingType === "hotel" && item.name}
                    </span>
                  </div>

                  {(bookingType === "flight" || bookingType === "train") && (
                    <div className="text-sm">
                      <p className="font-medium">
                        {item.from} → {item.to}
                      </p>
                      <p className="text-muted-foreground">
                        {item.departureTime} - {item.arrivalTime}
                      </p>
                    </div>
                  )}

                  {bookingType === "cab" && (
                    <div className="text-sm">
                      <p className="font-medium">{searchParams.get("from")} → {searchParams.get("to")}</p>
                      <p className="text-muted-foreground">{searchParams.get("distance")} km</p>
                    </div>
                  )}
                </div>
              )}

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Base Fare</span>
                  <span>{formatCurrency(price * 0.85)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Taxes & Fees</span>
                  <span>{formatCurrency(price * 0.15)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                  <span>Total</span>
                  <span style={{ color: getColor() }}>{formatCurrency(price)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
