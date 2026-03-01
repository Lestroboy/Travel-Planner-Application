import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiStar, FiMapPin, FiClock, FiHeart, FiCheck } from "react-icons/fi";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { formatCurrency, calculateDiscount } from "../../utils/helpers";

const ActivityCard = ({ activity, onSelect }) => {
  const navigate = useNavigate();
  const discount = calculateDiscount(activity.originalPrice, activity.price);

  const categoryColors = {
    Adventure: "bg-accent-orange/10 text-accent-orange",
    Cultural: "bg-accent-purple/10 text-accent-purple",
    Nature: "bg-accent-green/10 text-accent-green",
    Wildlife: "bg-secondary/10 text-secondary",
    Food: "bg-primary/10 text-primary",
    Nightlife: "bg-accent-purple/10 text-accent-purple",
    Shopping: "bg-accent-yellow/10 text-accent-yellow",
    Wellness: "bg-accent-green/10 text-accent-green",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all cursor-pointer group"
      onClick={() => navigate(`/activities/${activity.id}`)}
    >
      {/* Image */}
      <div className="relative aspect-[4/3]">
        <LazyLoadImage
          src={activity.image}
          alt={activity.name}
          effect="blur"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
        <span
          className={`absolute bottom-3 left-3 text-xs font-semibold px-2 py-1 rounded-lg ${
            categoryColors[activity.category] || "bg-muted text-muted-foreground"
          }`}
        >
          {activity.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-heading font-semibold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
          {activity.name}
        </h3>

        <p className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
          <FiMapPin className="w-4 h-4" />
          {activity.location}
        </p>

        <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <FiClock className="w-4 h-4" />
            {activity.duration}
          </span>
          <span className="flex items-center gap-1">
            <FiStar className="w-4 h-4 fill-accent-yellow text-accent-yellow" />
            {activity.rating}
          </span>
        </div>

        {/* Includes */}
        <div className="flex flex-wrap gap-2 mb-4">
          {activity.includes.slice(0, 3).map((item) => (
            <span
              key={item}
              className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full"
            >
              <FiCheck className="w-3 h-3 text-accent-green" />
              {item}
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-end justify-between pt-3 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">{activity.reviews.toLocaleString()} reviews</p>
          </div>
          <div className="text-right">
            <div className="flex items-baseline gap-1">
              {discount > 0 && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatCurrency(activity.originalPrice)}
                </span>
              )}
              <span className="text-lg font-bold text-primary">
                {formatCurrency(activity.price)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">/person</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityCard;
