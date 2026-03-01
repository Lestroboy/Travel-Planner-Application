import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCalendar, FiMapPin, FiMoreVertical, FiCopy, FiTrash2, FiEdit2 } from "react-icons/fi";
import { formatDate, formatCurrency } from "../../utils/helpers";
import BudgetRing from "./BudgetRing";
import AvatarStack from "./AvatarStack";
import { useState } from "react";

const TripCard = ({ trip, onDelete, onDuplicate, onEdit, index = 0 }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const statusColors = {
    planning: "bg-accent-purple/10 text-accent-purple",
    upcoming: "bg-secondary/10 text-secondary",
    active: "bg-accent-green/10 text-accent-green",
    ongoing: "bg-accent-green/10 text-accent-green",
    completed: "bg-muted text-muted-foreground",
  };

  const statusLabels = {
    planning: "Planning",
    upcoming: "Upcoming",
    active: "In Progress",
    ongoing: "In Progress",
    completed: "Completed",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card-elevated cursor-pointer group"
      onClick={() => navigate(`/trips/${trip.id}`)}
    >
      {/* Cover Image */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={trip.coverImage}
          alt={trip.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Status Badge */}
        <span className={`absolute top-3 left-3 badge ${statusColors[trip.status] || statusColors.upcoming}`}>
          {statusLabels[trip.status] || trip.status}
        </span>

        {/* Menu Button */}
        <div className="absolute top-3 right-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
          >
            <FiMoreVertical className="w-4 h-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-10 bg-card rounded-xl shadow-xl py-2 min-w-40 z-10 border border-border">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(trip.id);
                  setMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
              >
                <FiEdit2 className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate?.(trip.id);
                  setMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
              >
                <FiCopy className="w-4 h-4" /> Duplicate
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(trip.id);
                  setMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-muted text-destructive flex items-center gap-2"
              >
                <FiTrash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          )}
        </div>

        {/* Budget Ring */}
        <div className="absolute bottom-3 right-3">
          <BudgetRing
            spent={trip.budget?.spent || 0}
            total={trip.budget?.total || 1}
            size={56}
            strokeWidth={4}
            showLabel={false}
          />
        </div>

        {/* Trip Name Overlay */}
        <div className="absolute bottom-3 left-3 right-16">
          <h3 className="font-heading font-semibold text-lg text-white truncate">
            {trip.name}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <FiCalendar className="w-4 h-4" />
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </span>
        </div>

        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
          <FiMapPin className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{trip.destinations?.join(", ") || trip.destination}</span>
        </div>

        {/* Budget Info */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Budget</span>
            <span className="font-medium">
              {formatCurrency(trip.budget?.spent || 0)} / {formatCurrency(trip.budget?.total || 0)}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${
                (trip.budget?.spent / trip.budget?.total) >= 0.9
                  ? "bg-destructive"
                  : (trip.budget?.spent / trip.budget?.total) >= 0.7
                  ? "bg-accent-orange"
                  : "bg-accent-green"
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((trip.budget?.spent / trip.budget?.total) * 100, 100)}%` }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            />
          </div>
        </div>

        {/* Collaborators */}
        <div className="flex items-center justify-between">
          <AvatarStack collaborators={trip.collaborators || []} max={3} size="md" />
          <span className="text-xs text-muted-foreground">
            {trip.collaborators?.length || 1} {(trip.collaborators?.length || 1) === 1 ? "member" : "members"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default TripCard;
