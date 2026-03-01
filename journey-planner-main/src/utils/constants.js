export const ROUTES = {
  HOME: "/",
  FLIGHTS_SEARCH: "/flights/search",
  FLIGHT_DETAILS: "/flights/:id",
  HOTELS_SEARCH: "/hotels/search",
  HOTEL_DETAILS: "/hotels/:id",
  ACTIVITIES_SEARCH: "/activities/search",
  ACTIVITY_DETAILS: "/activities/:id",
  TRIPS: "/trips",
  TRIP_NEW: "/trips/new",
  TRIP_DETAILS: "/trips/:id",
  TRIP_EDIT: "/trips/:id/edit",
  TRIP_BUDGET: "/trips/:id/budget",
  RECOMMENDATIONS: "/recommendations",
  BOOKING_CONFIRMATION: "/booking/confirmation/:id",
  PROFILE: "/profile",
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  NOTIFICATIONS: "/notifications",
};

export const SEARCH_TABS = {
  FLIGHTS: "flights",
  HOTELS: "hotels",
  ACTIVITIES: "activities",
  PACKAGES: "packages",
};

export const TRIP_STATUS = {
  UPCOMING: "upcoming",
  ONGOING: "ongoing",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const EXPENSE_CATEGORIES = {
  FLIGHTS: "flights",
  HOTELS: "hotels",
  ACTIVITIES: "activities",
  FOOD: "food",
  TRANSPORT: "transport",
  SHOPPING: "shopping",
  OTHER: "other",
};

export const COLLABORATOR_ROLES = {
  OWNER: "owner",
  EDITOR: "editor",
  VIEWER: "viewer",
};

export const NOTIFICATION_TYPES = {
  FLIGHT: "flight",
  WEATHER: "weather",
  BUDGET: "budget",
  GROUP: "group",
  BOOKING: "booking",
};

export const SORT_OPTIONS = {
  PRICE_LOW: { value: "price_low", label: "Price: Low to High" },
  PRICE_HIGH: { value: "price_high", label: "Price: High to Low" },
  RATING: { value: "rating", label: "Rating" },
  DURATION: { value: "duration", label: "Duration" },
  DEPARTURE: { value: "departure", label: "Departure Time" },
};

export const PRICE_RANGES = {
  BUDGET: { min: 0, max: 5000, label: "Budget (Under ₹5,000)" },
  MID: { min: 5000, max: 15000, label: "Mid-Range (₹5,000 - ₹15,000)" },
  PREMIUM: { min: 15000, max: 50000, label: "Premium (₹15,000 - ₹50,000)" },
  LUXURY: { min: 50000, max: Infinity, label: "Luxury (Above ₹50,000)" },
};

export const STOP_OPTIONS = [
  { value: "0", label: "Non-stop" },
  { value: "1", label: "1 Stop" },
  { value: "2+", label: "2+ Stops" },
];

export const STAR_RATINGS = [
  { value: 5, label: "5 Star" },
  { value: 4, label: "4 Star & above" },
  { value: 3, label: "3 Star & above" },
  { value: 2, label: "2 Star & above" },
];

export const CATEGORY_COLORS = {
  flights: "#008CFF",
  hotels: "#FF385C",
  activities: "#00C853",
  food: "#FF6F00",
  transport: "#7C4DFF",
  shopping: "#FFD600",
  other: "#717171",
};

export const DEFAULT_CURRENCY = "INR";
export const DEFAULT_LANGUAGE = "en";
