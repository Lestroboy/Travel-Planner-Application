import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiCalendar, FiUsers, FiMapPin } from "react-icons/fi";
import { MdFlight, MdHotel, MdLocalActivity, MdCardTravel } from "react-icons/md";
import { cities } from "../../utils/dummyData";

const SearchBar = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("flights");
  const [searchData, setSearchData] = useState({
    from: "",
    to: "",
    location: "",
    departDate: "",
    returnDate: "",
    checkIn: "",
    checkOut: "",
    passengers: 1,
    rooms: 1,
    guests: 2,
  });
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  const tabs = [
    { id: "flights", label: "Flights", icon: MdFlight },
    { id: "hotels", label: "Hotels", icon: MdHotel },
    { id: "activities", label: "Activities", icon: MdLocalActivity },
    { id: "packages", label: "Packages", icon: MdCardTravel },
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (activeTab === "flights") {
      if (searchData.from) params.set("from", searchData.from);
      if (searchData.to) params.set("to", searchData.to);
      if (searchData.departDate) params.set("date", searchData.departDate);
      navigate(`/flights/search?${params.toString()}`);
    } else if (activeTab === "hotels") {
      if (searchData.location) params.set("location", searchData.location);
      if (searchData.checkIn) params.set("checkIn", searchData.checkIn);
      navigate(`/hotels/search?${params.toString()}`);
    } else if (activeTab === "activities") {
      if (searchData.location) params.set("location", searchData.location);
      navigate(`/activities/search?${params.toString()}`);
    }
  };

  const filteredCities = (query) =>
    cities.filter((city) => city.toLowerCase().includes(query.toLowerCase())).slice(0, 5);

  return (
    <div className="bg-background rounded-2xl shadow-2xl p-4 md:p-6 w-full max-w-5xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Fields */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "flights" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* From */}
              <div className="relative">
                <label className="text-xs text-muted-foreground mb-1 block">From</label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Delhi"
                    value={searchData.from}
                    onChange={(e) => {
                      setSearchData({ ...searchData, from: e.target.value });
                      setShowFromSuggestions(true);
                    }}
                    onFocus={() => setShowFromSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
                    className="input-field pl-10"
                  />
                  {showFromSuggestions && searchData.from && (
                    <div className="absolute top-full left-0 right-0 bg-background border border-border rounded-xl mt-1 shadow-lg z-10 overflow-hidden">
                      {filteredCities(searchData.from).map((city) => (
                        <button
                          key={city}
                          onClick={() => {
                            setSearchData({ ...searchData, from: city });
                            setShowFromSuggestions(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-muted transition-colors"
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* To */}
              <div className="relative">
                <label className="text-xs text-muted-foreground mb-1 block">To</label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Mumbai"
                    value={searchData.to}
                    onChange={(e) => {
                      setSearchData({ ...searchData, to: e.target.value });
                      setShowToSuggestions(true);
                    }}
                    onFocus={() => setShowToSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
                    className="input-field pl-10"
                  />
                  {showToSuggestions && searchData.to && (
                    <div className="absolute top-full left-0 right-0 bg-background border border-border rounded-xl mt-1 shadow-lg z-10 overflow-hidden">
                      {filteredCities(searchData.to).map((city) => (
                        <button
                          key={city}
                          onClick={() => {
                            setSearchData({ ...searchData, to: city });
                            setShowToSuggestions(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-muted transition-colors"
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Departure</label>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="date"
                    value={searchData.departDate}
                    onChange={(e) => setSearchData({ ...searchData, departDate: e.target.value })}
                    className="input-field pl-10"
                  />
                </div>
              </div>

              {/* Passengers */}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Passengers</label>
                <div className="relative">
                  <FiUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <select
                    value={searchData.passengers}
                    onChange={(e) => setSearchData({ ...searchData, passengers: parseInt(e.target.value) })}
                    className="input-field pl-10 appearance-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "Passenger" : "Passengers"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "hotels" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Location</label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Where are you going?"
                    value={searchData.location}
                    onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Check-in</label>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="date"
                    value={searchData.checkIn}
                    onChange={(e) => setSearchData({ ...searchData, checkIn: e.target.value })}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Check-out</label>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="date"
                    value={searchData.checkOut}
                    onChange={(e) => setSearchData({ ...searchData, checkOut: e.target.value })}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Rooms & Guests</label>
                <div className="relative">
                  <FiUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <select
                    value={`${searchData.rooms}-${searchData.guests}`}
                    onChange={(e) => {
                      const [rooms, guests] = e.target.value.split("-").map(Number);
                      setSearchData({ ...searchData, rooms, guests });
                    }}
                    className="input-field pl-10 appearance-none cursor-pointer"
                  >
                    <option value="1-2">1 Room, 2 Guests</option>
                    <option value="1-3">1 Room, 3 Guests</option>
                    <option value="2-4">2 Rooms, 4 Guests</option>
                    <option value="3-6">3 Rooms, 6 Guests</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "activities" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs text-muted-foreground mb-1 block">Location</label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search activities, tours, experiences..."
                    value={searchData.location}
                    onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Date</label>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="date"
                    value={searchData.departDate}
                    onChange={(e) => setSearchData({ ...searchData, departDate: e.target.value })}
                    className="input-field pl-10"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "packages" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">From</label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Delhi"
                    value={searchData.from}
                    onChange={(e) => setSearchData({ ...searchData, from: e.target.value })}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Destination</label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Goa"
                    value={searchData.to}
                    onChange={(e) => setSearchData({ ...searchData, to: e.target.value })}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Travel Date</label>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="date"
                    value={searchData.departDate}
                    onChange={(e) => setSearchData({ ...searchData, departDate: e.target.value })}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Travelers</label>
                <div className="relative">
                  <FiUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <select
                    value={searchData.passengers}
                    onChange={(e) => setSearchData({ ...searchData, passengers: parseInt(e.target.value) })}
                    className="input-field pl-10 appearance-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "Traveler" : "Travelers"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Search Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleSearch}
          className="btn-primary flex items-center gap-2 px-8 shadow-button"
        >
          <FiSearch className="w-5 h-5" />
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
