import { motion } from "framer-motion";
import { Plane, Home, MapPin, Truck, Coffee, MoreHorizontal, Plus, Clock } from "lucide-react";
import { formatCurrency, formatDate, formatTime } from "../../utils/helpers";
import { DayWeather } from "./WeatherWidget";

const ItineraryTimeline = ({ itinerary = [], onAddItem, tripId, destination }) => {
  const typeIcons = {
    flight: Plane,
    hotel: Home,
    activity: MapPin,
    transport: Truck,
    food: Coffee,
    other: MoreHorizontal,
  };

  const typeColors = {
    flight: "bg-secondary/10 text-secondary border-secondary",
    hotel: "bg-accent-purple/10 text-accent-purple border-accent-purple",
    activity: "bg-accent-green/10 text-accent-green border-accent-green",
    transport: "bg-accent-orange/10 text-accent-orange border-accent-orange",
    food: "bg-primary/10 text-primary border-primary",
    other: "bg-muted text-muted-foreground border-muted-foreground",
  };

  const statusBadges = {
    confirmed: "bg-accent-green/10 text-accent-green",
    pending: "bg-accent-orange/10 text-accent-orange",
    cancelled: "bg-destructive/10 text-destructive",
  };

  if (!itinerary || itinerary.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-8 text-center border border-border">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No itinerary items yet</h3>
        <p className="text-muted-foreground mb-4">Start planning your adventure by adding activities</p>
        <button
          onClick={() => onAddItem?.(0)}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add First Item
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {itinerary.map((day, dayIndex) => (
        <motion.div
          key={day.day || dayIndex}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: dayIndex * 0.1 }}
          className="relative"
        >
          {/* Day Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex flex-col items-center justify-center">
                <span className="text-xs font-medium">Day</span>
                <span className="text-lg font-bold leading-none">{day.day || dayIndex + 1}</span>
              </div>
              <div>
                <h4 className="font-semibold">{formatDate(day.date, "full")}</h4>
                <p className="text-sm text-muted-foreground">
                  {day.items?.length || 0} {(day.items?.length || 0) === 1 ? "activity" : "activities"}
                </p>
              </div>
            </div>
            {/* Day Weather */}
            {day.date && (
              <DayWeather date={day.date} destination={destination} />
            )}
          </div>

          {/* Timeline Items */}
          <div className="ml-6 pl-6 border-l-2 border-border space-y-4">
            {(day.items || []).map((item, itemIndex) => {
              const IconComponent = typeIcons[item.type] || typeIcons.other;
              const colorClasses = typeColors[item.type] || typeColors.other;

              return (
                <motion.div
                  key={item.id || itemIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: dayIndex * 0.1 + itemIndex * 0.05 }}
                  className="relative group"
                >
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[31px] w-4 h-4 rounded-full border-2 bg-background ${colorClasses.split(" ")[2]}`} />

                  {/* Item Card */}
                  <div className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg ${colorClasses.split(" ").slice(0, 2).join(" ")} flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="font-medium truncate">{item.title}</h5>
                          {item.status && (
                            <span className={`badge text-xs ${statusBadges[item.status] || statusBadges.pending}`}>
                              {item.status}
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-sm text-muted-foreground mt-1">{item.description || item.details}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          {(item.time || item.startTime) && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {formatTime(item.time || item.startTime)}
                              {item.endTime && ` - ${formatTime(item.endTime)}`}
                            </span>
                          )}
                          {item.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {item.location}
                            </span>
                          )}
                          {item.cost > 0 && (
                            <span className="font-medium text-foreground">
                              {formatCurrency(item.cost)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Add Item Button */}
            <button
              onClick={() => onAddItem?.(dayIndex)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-2"
            >
              <Plus className="w-4 h-4" /> Add activity
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ItineraryTimeline;
