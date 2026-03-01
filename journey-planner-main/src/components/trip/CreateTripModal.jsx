import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiMapPin, FiCalendar, FiDollarSign, FiImage, FiCheck, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { useTrips } from "../../context/TripContext";
import toast from "react-hot-toast";

const CreateTripModal = ({ isOpen, onClose, onCreate, onSuccess }) => {
  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleSuccess = (trip) => {
    if (onCreate) onCreate(trip);
    if (onSuccess) onSuccess(trip);
  };

  if (!isOpen) return null;
  const { createTrip } = useTrips();
  const [step, setStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    destination: "",
    description: "",
    startDate: "",
    endDate: "",
    budget: 50000,
    currency: "INR",
    coverImage: "",
  });

  const destinations = [
    "Goa, India",
    "Dubai, UAE",
    "Bali, Indonesia",
    "Maldives",
    "Singapore",
    "Thailand",
    "Kerala, India",
    "Rajasthan, India",
    "Tokyo, Japan",
    "Paris, France",
  ];

  const coverImages = [
    "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
    "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800",
    "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800",
    "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800",
    "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800",
    "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800",
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsCreating(true);
    try {
      const newTrip = await createTrip({
        name: formData.name,
        destination: formData.destination,
        destinations: [formData.destination],
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: formData.budget,
        currency: formData.currency,
        coverImage: formData.coverImage || coverImages[0],
      });
      toast.success("Trip created successfully!");
      handleSuccess(newTrip);
    } catch (error) {
      toast.error("Failed to create trip");
    } finally {
      setIsCreating(false);
    }
  };

  const isStep1Valid = formData.name && formData.destination;
  const isStep2Valid = formData.startDate && formData.endDate && formData.budget > 0;
  const isStep3Valid = true; // Cover image is optional, we'll use default

  const stepTitles = ["Basic Info", "Dates & Budget", "Cover Image"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card rounded-2xl w-full max-w-lg shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-heading font-bold">Create New Trip</h2>
          <button
            type="button"
            onClick={handleClose}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    s === step
                      ? "bg-primary text-primary-foreground"
                      : s < step
                      ? "bg-accent-green text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s < step ? <FiCheck className="w-4 h-4" /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-12 h-0.5 ${s < step ? "bg-accent-green" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mb-6">
            Step {step}: {stepTitles[step - 1]}
          </p>

          <AnimatePresence mode="wait">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-1.5">Trip Name *</label>
                  <input
                    type="text"
                    placeholder="e.g., Summer Vacation 2026"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Destination *</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Where are you going?"
                      value={formData.destination}
                      onChange={(e) => handleChange("destination", e.target.value)}
                      className="input-field pl-10"
                      list="destinations"
                    />
                    <datalist id="destinations">
                      {destinations.map((d) => (
                        <option key={d} value={d} />
                      ))}
                    </datalist>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Description</label>
                  <textarea
                    placeholder="Brief description of your trip..."
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    rows={3}
                    className="input-field resize-none"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 2: Dates & Budget */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Start Date *</label>
                    <div className="relative">
                      <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleChange("startDate", e.target.value)}
                        className="input-field pl-10"
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">End Date *</label>
                    <div className="relative">
                      <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleChange("endDate", e.target.value)}
                        min={formData.startDate}
                        className="input-field pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Budget *</label>
                  <div className="relative">
                    <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="number"
                      placeholder="Total budget"
                      value={formData.budget}
                      onChange={(e) => handleChange("budget", parseInt(e.target.value) || 0)}
                      className="input-field pl-10 pr-20"
                      min={0}
                    />
                    <select
                      value={formData.currency}
                      onChange={(e) => handleChange("currency", e.target.value)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent border-none text-sm font-medium focus:outline-none"
                    >
                      <option value="INR">INR</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    💡 Pro tip: Set a realistic budget including flights, hotels, activities, and food.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 3: Cover Image */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-1.5">Cover Image URL (Optional)</label>
                  <div className="relative">
                    <FiImage className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="url"
                      placeholder="https://..."
                      value={formData.coverImage}
                      onChange={(e) => handleChange("coverImage", e.target.value)}
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Or choose from gallery</label>
                  <div className="grid grid-cols-4 gap-2">
                    {coverImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => handleChange("coverImage", img)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          formData.coverImage === img
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-transparent hover:border-muted-foreground/30"
                        }`}
                      >
                        <img src={img} alt={`Cover ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {formData.coverImage && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Preview</label>
                    <div className="aspect-video rounded-xl overflow-hidden">
                      <img
                        src={formData.coverImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`btn-ghost flex items-center gap-1.5 ${step === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <FiArrowLeft className="w-4 h-4" /> Back
            </button>

            {step < 3 ? (
              <button
                onClick={handleNext}
                disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)}
                className="btn-primary flex items-center gap-1.5"
              >
                Next <FiArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isCreating}
                className="btn-primary flex items-center gap-1.5"
              >
                {isCreating ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    <FiCheck className="w-4 h-4" /> Create Trip
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreateTripModal;
