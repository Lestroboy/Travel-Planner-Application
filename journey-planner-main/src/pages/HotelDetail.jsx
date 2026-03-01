import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FiArrowLeft, FiStar, FiMapPin, FiCalendar, FiUsers, FiHeart,
  FiShare2, FiWifi, FiCheck
} from "react-icons/fi";
import { MdPool, MdRestaurant, MdSpa, MdFitnessCenter, MdLocalParking } from "react-icons/md";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import BookingModal from "../components/booking/BookingModal";
import { hotels } from "../utils/dummyData";
import { formatCurrency, formatDate } from "../utils/helpers";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [hotel, setHotel] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 2,
    rooms: 1,
    roomType: "",
  });

  useEffect(() => {
    const foundHotel = hotels.find((h) => h.id === id);
    if (foundHotel) {
      setHotel(foundHotel);
      if (foundHotel.roomTypes?.length > 0) {
        setBookingData((prev) => ({ ...prev, roomType: foundHotel.roomTypes[0].type }));
      }
    }
  }, [id]);

  if (!hotel) {
    return (
      <div className="min-h-screen bg-muted">
        <Header />
        <div className="pt-24 pb-12">
          <div className="container-custom text-center py-20">
            <h2 className="text-2xl font-heading font-bold mb-4">Hotel not found</h2>
            <button onClick={() => navigate("/hotels/search")} className="btn-primary">
              Browse Hotels
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const amenityIcons = {
    WiFi: FiWifi,
    Pool: MdPool,
    Spa: MdSpa,
    Restaurant: MdRestaurant,
    Gym: MdFitnessCenter,
    Parking: MdLocalParking,
  };

  const calculateNights = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 1;
    const start = new Date(bookingData.checkIn);
    const end = new Date(bookingData.checkOut);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const getSelectedRoomPrice = () => {
    const room = hotel.roomTypes?.find((r) => r.type === bookingData.roomType);
    return room?.price || hotel.price;
  };

  const totalPrice = getSelectedRoomPrice() * calculateNights() * bookingData.rooms;

  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast.error("Please login to book");
      navigate("/login");
      return;
    }
    if (!bookingData.checkIn || !bookingData.checkOut) {
      toast.error("Please select check-in and check-out dates");
      return;
    }
    setShowBookingModal(true);
  };

  const reviews = [
    { id: 1, name: "Priya Sharma", rating: 5, date: "2024-02-15", comment: "Absolutely stunning property! The service was impeccable and the views were breathtaking.", avatar: "https://i.pravatar.cc/150?img=5" },
    { id: 2, name: "Rahul Verma", rating: 4, date: "2024-02-10", comment: "Great location and amenities. The pool area is fantastic. Would definitely recommend!", avatar: "https://i.pravatar.cc/150?img=8" },
    { id: 3, name: "Sneha Patel", rating: 5, date: "2024-01-28", comment: "Perfect for a weekend getaway. The spa treatments were rejuvenating.", avatar: "https://i.pravatar.cc/150?img=9" },
  ];

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

        {/* Image Gallery */}
        <div className="container-custom mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-[4/3] md:aspect-auto md:row-span-2"
            >
              <img
                src={hotel.images?.[selectedImage] || hotel.image}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="hidden md:grid grid-cols-2 gap-4">
              {(hotel.images || [hotel.image]).slice(1, 5).map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(idx + 1)}
                  className="aspect-[4/3] cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container-custom pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hotel Info */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {Array.from({ length: hotel.stars || 5 }).map((_, i) => (
                        <FiStar key={i} className="w-4 h-4 fill-accent-yellow text-accent-yellow" />
                      ))}
                    </div>
                    <h1 className="text-2xl md:text-3xl font-heading font-bold">{hotel.name}</h1>
                    <p className="flex items-center gap-2 text-muted-foreground mt-2">
                      <FiMapPin className="w-4 h-4" />
                      {hotel.location}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted">
                      <FiHeart className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted">
                      <FiShare2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 bg-accent-green/10 text-accent-green px-3 py-1 rounded-lg">
                    <FiStar className="w-4 h-4 fill-current" />
                    <span className="font-bold">{hotel.rating}</span>
                  </div>
                  <span className="text-muted-foreground">{hotel.reviews?.toLocaleString() || 0} reviews</span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h2 className="text-xl font-heading font-semibold mb-4">About this hotel</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {hotel.description || "Experience luxury and comfort at its finest. This property offers world-class amenities and exceptional service to make your stay memorable."}
                </p>
              </div>

              {/* Amenities */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h2 className="text-xl font-heading font-semibold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(hotel.amenities || []).map((amenity) => {
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

              {/* Room Types */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h2 className="text-xl font-heading font-semibold mb-4">Room Types</h2>
                <div className="space-y-4">
                  {(hotel.roomTypes || [{ type: "Standard Room", price: hotel.price, capacity: 2 }]).map((room) => (
                    <div
                      key={room.type}
                      onClick={() => setBookingData({ ...bookingData, roomType: room.type })}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        bookingData.roomType === room.type
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{room.type}</h3>
                          <p className="text-sm text-muted-foreground">
                            <FiUsers className="inline w-4 h-4 mr-1" />
                            Up to {room.capacity} guests
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-primary">{formatCurrency(room.price)}</p>
                          <p className="text-xs text-muted-foreground">per night</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h2 className="text-xl font-heading font-semibold mb-4">Guest Reviews</h2>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-4 rounded-xl bg-muted">
                      <div className="flex items-start gap-4">
                        <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{review.name}</h4>
                            <span className="text-sm text-muted-foreground">{formatDate(review.date)}</span>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <FiStar key={i} className="w-4 h-4 fill-accent-yellow text-accent-yellow" />
                            ))}
                          </div>
                          <p className="text-muted-foreground">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card rounded-2xl p-6 border border-border shadow-lg">
                <div className="flex items-baseline justify-between mb-6">
                  <div>
                    <span className="text-3xl font-bold text-primary">{formatCurrency(getSelectedRoomPrice())}</span>
                    <span className="text-muted-foreground"> / night</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Check-in</label>
                      <div className="relative">
                        <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="date"
                          value={bookingData.checkIn}
                          onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                          className="input-field pl-10"
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Check-out</label>
                      <div className="relative">
                        <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="date"
                          value={bookingData.checkOut}
                          onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                          className="input-field pl-10"
                          min={bookingData.checkIn || new Date().toISOString().split("T")[0]}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Guests</label>
                      <select
                        value={bookingData.guests}
                        onChange={(e) => setBookingData({ ...bookingData, guests: parseInt(e.target.value) })}
                        className="input-field"
                      >
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <option key={n} value={n}>{n} {n === 1 ? "Guest" : "Guests"}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Rooms</label>
                      <select
                        value={bookingData.rooms}
                        onChange={(e) => setBookingData({ ...bookingData, rooms: parseInt(e.target.value) })}
                        className="input-field"
                      >
                        {[1, 2, 3, 4].map((n) => (
                          <option key={n} value={n}>{n} {n === 1 ? "Room" : "Rooms"}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mb-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {formatCurrency(getSelectedRoomPrice())} x {calculateNights()} nights x {bookingData.rooms} rooms
                    </span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taxes & fees (18%)</span>
                    <span>{formatCurrency(totalPrice * 0.18)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(totalPrice * 1.18)}</span>
                  </div>
                </div>

                <button onClick={handleBookNow} className="btn-primary w-full py-3 text-lg">
                  Book Now
                </button>

                <p className="text-center text-sm text-muted-foreground mt-4">
                  Free cancellation up to 24 hours before check-in
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showBookingModal && (
        <BookingModal
          type="hotel"
          item={hotel}
          bookingData={{ ...bookingData, totalPrice: totalPrice * 1.18 }}
          onClose={() => setShowBookingModal(false)}
        />
      )}

      <Footer />
    </div>
  );
};

export default HotelDetail;
