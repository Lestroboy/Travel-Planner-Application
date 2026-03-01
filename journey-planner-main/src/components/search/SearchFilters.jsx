import { useState } from "react";
import { motion } from "framer-motion";
import { FiChevronDown, FiChevronUp, FiX } from "react-icons/fi";
import { airlines, hotelAmenities, activityCategories } from "../../utils/dummyData";
import { STOP_OPTIONS, STAR_RATINGS } from "../../utils/constants";
import { formatCurrency } from "../../utils/helpers";

const SearchFilters = ({ type, filters, onFilterChange, onReset }) => {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    stops: true,
    airlines: true,
    stars: true,
    amenities: true,
    categories: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePriceChange = (type, value) => {
    const newRange = [...filters.priceRange];
    if (type === "min") newRange[0] = parseInt(value);
    if (type === "max") newRange[1] = parseInt(value);
    onFilterChange({ priceRange: newRange });
  };

  const handleArrayFilter = (filterName, value) => {
    const currentValues = filters[filterName] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    onFilterChange({ [filterName]: newValues });
  };

  const FilterSection = ({ title, name, children }) => (
    <div className="border-b border-border pb-4">
      <button
        onClick={() => toggleSection(name)}
        className="flex items-center justify-between w-full py-2 text-sm font-medium"
      >
        {title}
        {expandedSections[name] ? (
          <FiChevronUp className="w-4 h-4" />
        ) : (
          <FiChevronDown className="w-4 h-4" />
        )}
      </button>
      <motion.div
        initial={false}
        animate={{ height: expandedSections[name] ? "auto" : 0, opacity: expandedSections[name] ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="pt-2">{children}</div>
      </motion.div>
    </div>
  );

  const Checkbox = ({ label, checked, onChange }) => (
    <label className="flex items-center gap-3 cursor-pointer py-1.5 hover:bg-muted/50 px-2 -mx-2 rounded-lg transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
      />
      <span className="text-sm">{label}</span>
    </label>
  );

  return (
    <div className="bg-card rounded-2xl p-5 sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-semibold text-lg">Filters</h3>
        <button
          onClick={onReset}
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          <FiX className="w-4 h-4" />
          Clear All
        </button>
      </div>

      {/* Price Range */}
      <FilterSection title="Price Range" name="price">
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground">Min</label>
              <input
                type="number"
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceChange("min", e.target.value)}
                className="input-field text-sm py-2"
                placeholder="₹0"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-muted-foreground">Max</label>
              <input
                type="number"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceChange("max", e.target.value)}
                className="input-field text-sm py-2"
                placeholder="₹200000"
              />
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="200000"
            step="1000"
            value={filters.priceRange[1]}
            onChange={(e) => handlePriceChange("max", e.target.value)}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatCurrency(filters.priceRange[0])}</span>
            <span>{formatCurrency(filters.priceRange[1])}</span>
          </div>
        </div>
      </FilterSection>

      {/* Flight-specific filters */}
      {type === "flights" && (
        <>
          <FilterSection title="Stops" name="stops">
            <div className="space-y-1">
              {STOP_OPTIONS.map((option) => (
                <Checkbox
                  key={option.value}
                  label={option.label}
                  checked={filters.stops?.includes(option.value)}
                  onChange={() => handleArrayFilter("stops", option.value)}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Airlines" name="airlines">
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {airlines.map((airline) => (
                <Checkbox
                  key={airline}
                  label={airline}
                  checked={filters.airlines?.includes(airline)}
                  onChange={() => handleArrayFilter("airlines", airline)}
                />
              ))}
            </div>
          </FilterSection>
        </>
      )}

      {/* Hotel-specific filters */}
      {type === "hotels" && (
        <>
          <FilterSection title="Star Rating" name="stars">
            <div className="space-y-1">
              {STAR_RATINGS.map((option) => (
                <Checkbox
                  key={option.value}
                  label={
                    <span className="flex items-center gap-1">
                      {option.label}
                      <span className="text-accent-yellow">★</span>
                    </span>
                  }
                  checked={filters.stars?.includes(option.value)}
                  onChange={() => handleArrayFilter("stars", option.value)}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Amenities" name="amenities">
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {hotelAmenities.map((amenity) => (
                <Checkbox
                  key={amenity}
                  label={amenity}
                  checked={filters.amenities?.includes(amenity)}
                  onChange={() => handleArrayFilter("amenities", amenity)}
                />
              ))}
            </div>
          </FilterSection>
        </>
      )}

      {/* Activity-specific filters */}
      {type === "activities" && (
        <FilterSection title="Categories" name="categories">
          <div className="flex flex-wrap gap-2">
            {activityCategories.map((category) => (
              <button
                key={category}
                onClick={() => handleArrayFilter("categories", category)}
                className={`chip ${
                  filters.categories?.includes(category) ? "chip-active" : ""
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </FilterSection>
      )}
    </div>
  );
};

export default SearchFilters;
