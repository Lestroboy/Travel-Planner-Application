import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiStar, FiMapPin, FiHeart, FiWifi, FiDroplet } from "react-icons/fi";
import { MdPool, MdRestaurant, MdSpa, MdFitnessCenter } from "react-icons/md";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { formatCurrency, calculateDiscount } from "../../utils/helpers";

const HotelCard = ({ hotel, onSelect, layout = "grid" }) => {
  const navigate = useNavigate();
  const discount = calculateDiscount(hotel.originalPrice, hotel.price);
  const amenities = hotel.amenities || [];
  const reviews = hotel.reviews || 0;
  const rating = hotel.rating || 0;
  const stars = hotel.stars || 0;

  const amenityIcons = {
    WiFi: FiWifi,
    Pool: MdPool,
    Spa: MdSpa,
    Restaurant: MdRestaurant,
    Gym: MdFitnessCenter,
  };

  if (layout === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all cursor-pointer group flex"
        onClick={() => navigate(`/hotels/${hotel.id}`)}
      >
        {/* Image */}
        <div className="relative w-72 h-52 flex-shrink-0">
          <LazyLoadImage
            src={hotel.image}
            alt={hotel.name}
            effect="blur"
            className="w-full h-full object-cover"
          />
          <button
            onClick={(e) => e.stopPropagation()}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
          >
            <FiHeart className="w-5 h-5" />
          </button>
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-lg">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {Array.from({ length: stars }).map((_, i) => (
                  <FiStar key={i} className="w-3 h-3 fill-accent-yellow text-accent-yellow" />
                ))}
              </div>
              <h3 className="text-lg font-heading font-semibold group-hover:text-primary transition-colors">
                {hotel.name}
              </h3>
            </div>
            <div className="flex items-center gap-1 bg-accent-green/10 text-accent-green px-2 py-1 rounded-lg">
              <FiStar className="w-4 h-4 fill-current" />
              <span className="font-semibold">{rating}</span>
            </div>
          </div>

          <p className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
            <FiMapPin className="w-4 h-4" />
            {hotel.location}
          </p>

          <div className="flex items-center gap-3 mb-4">
            {amenities.slice(0, 5).map((amenity) => {
              const Icon = amenityIcons[amenity] || FiWifi;
              return (
                <div
                  key={amenity}
                  className="flex items-center gap-1 text-xs text-muted-foreground"
                  title={amenity}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden xl:inline">{amenity}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-auto flex items-end justify-between">
            <div>
              <p className="text-xs text-muted-foreground">{reviews.toLocaleString()} reviews</p>
            </div>
            <div className="text-right">
              <div className="flex items-baseline gap-2">
                {discount > 0 && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatCurrency(hotel.originalPrice)}
                  </span>
                )}
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(hotel.price)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">per night</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all cursor-pointer group"
      onClick={() => navigate(`/hotels/${hotel.id}`)}
    >
      {/* Image */}
      <div className="relative aspect-[4/3]">
        <LazyLoadImage
          src={hotel.image}
          alt={hotel.name}
          effect="blur"
          className="w-full h-full object-cover"
        />
        <button
          onClick={(e) => e.stopPropagation()}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
        >
          <FiHeart className="w-5 h-5" />
        </button>
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-lg">
            {discount}% OFF
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {Array.from({ length: stars }).map((_, i) => (
            <FiStar key={i} className="w-3 h-3 fill-accent-yellow text-accent-yellow" />
          ))}
        </div>

        <h3 className="font-heading font-semibold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
          {hotel.name}
        </h3>

        <p className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
          <FiMapPin className="w-4 h-4" />
          {hotel.location}
        </p>

        <div className="flex items-center gap-2 mb-4">
          {amenities.slice(0, 4).map((amenity) => {
            const Icon = amenityIcons[amenity] || FiWifi;
            return (
              <div
                key={amenity}
                className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center"
                title={amenity}
              >
                <Icon className="w-4 h-4 text-muted-foreground" />
              </div>
            );
          })}
          {amenities.length > 4 && (
            <span className="text-xs text-muted-foreground">+{amenities.length - 4}</span>
          )}
        </div>

        <div className="flex items-end justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1 bg-accent-green/10 text-accent-green px-2 py-0.5 rounded">
              <FiStar className="w-3 h-3 fill-current" />
              <span className="text-sm font-semibold">{rating}</span>
            </div>
            <span className="text-xs text-muted-foreground">({reviews})</span>
          </div>
          <div className="text-right">
            <div className="flex items-baseline gap-1">
              {discount > 0 && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatCurrency(hotel.originalPrice)}
                </span>
              )}
              <span className="text-lg font-bold text-primary">
                {formatCurrency(hotel.price)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">/night</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HotelCard;
