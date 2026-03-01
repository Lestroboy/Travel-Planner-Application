import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FiGrid, FiList, FiFilter, FiX } from "react-icons/fi";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import SearchFilters from "../components/search/SearchFilters";
import FlightCard from "../components/search/FlightCard";
import HotelCard from "../components/search/HotelCard";
import ActivityCard from "../components/search/ActivityCard";
import Loader, { SkeletonList } from "../components/common/Loader";
import { useSearch } from "../context/SearchContext";
import { SORT_OPTIONS } from "../utils/constants";

const SearchResults = ({ type }) => {
  const [searchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [layout, setLayout] = useState("list");
  const {
    isLoading,
    filters,
    sortBy,
    searchFlights,
    searchHotels,
    searchActivities,
    applyFilters,
    getFilteredResults,
    setSortBy,
    resetFilters,
  } = useSearch();

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    if (type === "flights") searchFlights(params);
    else if (type === "hotels") searchHotels(params);
    else if (type === "activities") searchActivities(params);
  }, [type, searchParams]);

  const results = getFilteredResults();

  const titles = {
    flights: "Flight Results",
    hotels: "Hotel Results",
    activities: "Activity Results",
  };

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      <div className="pt-24 pb-12">
        <div className="container-custom">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold">{titles[type]}</h1>
              <p className="text-muted-foreground">
                {isLoading ? "Searching..." : `${results.length} results found`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="md:hidden btn-ghost flex items-center gap-2 border border-border"
              >
                <FiFilter className="w-4 h-4" /> Filters
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field py-2 pr-8 text-sm"
              >
                {Object.values(SORT_OPTIONS).map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {type !== "flights" && (
                <div className="hidden md:flex border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setLayout("grid")}
                    className={`p-2 ${layout === "grid" ? "bg-primary text-primary-foreground" : "bg-background"}`}
                  >
                    <FiGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setLayout("list")}
                    className={`p-2 ${layout === "list" ? "bg-primary text-primary-foreground" : "bg-background"}`}
                  >
                    <FiList className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-6">
            {/* Filters Sidebar */}
            <aside className="hidden md:block w-72 flex-shrink-0">
              <SearchFilters
                type={type}
                filters={filters}
                onFilterChange={applyFilters}
                onReset={resetFilters}
              />
            </aside>

            {/* Results */}
            <div className="flex-1">
              {isLoading ? (
                <SkeletonList count={5} />
              ) : results.length === 0 ? (
                <div className="bg-card rounded-2xl p-12 text-center">
                  <p className="text-xl font-medium mb-2">No results found</p>
                  <p className="text-muted-foreground">Try adjusting your filters</p>
                </div>
              ) : (
                <div className={
                  type === "flights" ? "space-y-4" :
                  layout === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" :
                  "space-y-4"
                }>
                  {results.map((item) => {
                    if (type === "flights") return <FlightCard key={item.id} flight={item} />;
                    if (type === "hotels") return <HotelCard key={item.id} hotel={item} layout={layout} />;
                    return <ActivityCard key={item.id} activity={item} />;
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-foreground/50 md:hidden">
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-background overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold">Filters</h3>
              <button onClick={() => setShowMobileFilters(false)}><FiX className="w-5 h-5" /></button>
            </div>
            <div className="p-4">
              <SearchFilters type={type} filters={filters} onFilterChange={applyFilters} onReset={resetFilters} />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export const FlightSearch = () => <SearchResults type="flights" />;
export const HotelSearch = () => <SearchResults type="hotels" />;
export const ActivitySearch = () => <SearchResults type="activities" />;

export default SearchResults;
