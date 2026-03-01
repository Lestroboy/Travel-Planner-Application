import { createContext, useContext, useReducer } from "react";
import { flights, hotels, activities } from "../utils/dummyData";
import { simulateApiCall, filterByPriceRange, sortItems } from "../utils/helpers";

const SearchContext = createContext(null);

const initialState = {
  searchType: "flights",
  searchParams: {
    from: "",
    to: "",
    departDate: "",
    returnDate: "",
    passengers: 1,
    class: "Economy",
    rooms: 1,
    guests: 2,
  },
  results: [],
  filters: {
    priceRange: [0, 200000],
    stops: [],
    airlines: [],
    stars: [],
    amenities: [],
    categories: [],
    duration: [],
  },
  sortBy: "price_low",
  isLoading: false,
  error: null,
};

const searchReducer = (state, action) => {
  switch (action.type) {
    case "SET_SEARCH_TYPE":
      return { ...state, searchType: action.payload };
    case "SET_SEARCH_PARAMS":
      return { ...state, searchParams: { ...state.searchParams, ...action.payload } };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_RESULTS":
      return { ...state, results: action.payload, isLoading: false };
    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case "RESET_FILTERS":
      return { ...state, filters: initialState.filters };
    case "SET_SORT":
      return { ...state, sortBy: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
};

export const SearchProvider = ({ children }) => {
  const [state, dispatch] = useReducer(searchReducer, initialState);

  const setSearchType = (type) => {
    dispatch({ type: "SET_SEARCH_TYPE", payload: type });
  };

  const setSearchParams = (params) => {
    dispatch({ type: "SET_SEARCH_PARAMS", payload: params });
  };

  const searchFlights = async (params) => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_SEARCH_PARAMS", payload: params });

    // Simulate API call with filtering
    let results = await simulateApiCall(flights, 1000);
    
    // Filter by route if specified
    if (params.from) {
      results = results.filter((f) => 
        f.from.toLowerCase().includes(params.from.toLowerCase()) ||
        f.fromCode.toLowerCase() === params.from.toLowerCase()
      );
    }
    if (params.to) {
      results = results.filter((f) => 
        f.to.toLowerCase().includes(params.to.toLowerCase()) ||
        f.toCode.toLowerCase() === params.to.toLowerCase()
      );
    }

    dispatch({ type: "SET_RESULTS", payload: results });
    return results;
  };

  const searchHotels = async (params) => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_SEARCH_PARAMS", payload: params });

    let results = await simulateApiCall(hotels, 1000);
    
    if (params.location) {
      results = results.filter((h) =>
        h.location.toLowerCase().includes(params.location.toLowerCase())
      );
    }

    dispatch({ type: "SET_RESULTS", payload: results });
    return results;
  };

  const searchActivities = async (params) => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_SEARCH_PARAMS", payload: params });

    let results = await simulateApiCall(activities, 1000);
    
    if (params.location) {
      results = results.filter((a) =>
        a.location.toLowerCase().includes(params.location.toLowerCase())
      );
    }

    dispatch({ type: "SET_RESULTS", payload: results });
    return results;
  };

  const applyFilters = (filters) => {
    dispatch({ type: "SET_FILTERS", payload: filters });
  };

  const getFilteredResults = () => {
    let filtered = [...state.results];
    const { priceRange, stops, airlines, stars, amenities, categories } = state.filters;

    // Apply price filter
    if (priceRange[0] > 0 || priceRange[1] < 200000) {
      filtered = filterByPriceRange(filtered, priceRange[0], priceRange[1]);
    }

    // Apply stops filter (flights)
    if (stops.length > 0 && state.searchType === "flights") {
      filtered = filtered.filter((f) => stops.includes(String(f.stops)));
    }

    // Apply airline filter
    if (airlines.length > 0 && state.searchType === "flights") {
      filtered = filtered.filter((f) => airlines.includes(f.airline));
    }

    // Apply star rating filter (hotels)
    if (stars.length > 0 && state.searchType === "hotels") {
      const minStar = Math.min(...stars);
      filtered = filtered.filter((h) => h.stars >= minStar);
    }

    // Apply amenities filter (hotels)
    if (amenities.length > 0 && state.searchType === "hotels") {
      filtered = filtered.filter((h) =>
        amenities.some((a) => h.amenities.includes(a))
      );
    }

    // Apply category filter (activities)
    if (categories.length > 0 && state.searchType === "activities") {
      filtered = filtered.filter((a) => categories.includes(a.category));
    }

    // Apply sorting
    switch (state.sortBy) {
      case "price_low":
        filtered = sortItems(filtered, "price", "asc");
        break;
      case "price_high":
        filtered = sortItems(filtered, "price", "desc");
        break;
      case "rating":
        filtered = sortItems(filtered, "rating", "desc");
        break;
      default:
        break;
    }

    return filtered;
  };

  const setSortBy = (sortOption) => {
    dispatch({ type: "SET_SORT", payload: sortOption });
  };

  const resetFilters = () => {
    dispatch({ type: "RESET_FILTERS" });
  };

  const getItemById = (type, id) => {
    const data = type === "flights" ? flights : type === "hotels" ? hotels : activities;
    return data.find((item) => item.id === id);
  };

  return (
    <SearchContext.Provider
      value={{
        ...state,
        setSearchType,
        setSearchParams,
        searchFlights,
        searchHotels,
        searchActivities,
        applyFilters,
        getFilteredResults,
        setSortBy,
        resetFilters,
        getItemById,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

export default SearchContext;
