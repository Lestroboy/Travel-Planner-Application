import { createContext, useContext, useReducer, useEffect } from "react";
import * as tripApi from "../api/tripApi";
import toast from "react-hot-toast";

const TripContext = createContext(null);

const initialState = {
  trips: [],
  currentTrip: null,
  isLoading: false,
  error: null,
};

const tripReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_TRIPS":
      return { ...state, trips: action.payload, isLoading: false };
    case "SET_CURRENT_TRIP":
      return { ...state, currentTrip: action.payload };
    case "ADD_TRIP":
      return { ...state, trips: [action.payload, ...state.trips], isLoading: false };
    case "UPDATE_TRIP":
      return {
        ...state,
        trips: state.trips.map((trip) =>
          trip.tripId === action.payload.tripId ? action.payload : trip
        ),
        currentTrip: state.currentTrip?.tripId === action.payload.tripId ? action.payload : state.currentTrip,
        isLoading: false,
      };
    case "DELETE_TRIP":
      return {
        ...state,
        trips: state.trips.filter((trip) => trip.tripId !== action.payload),
        currentTrip: state.currentTrip?.tripId === action.payload ? null : state.currentTrip,
        isLoading: false,
      };
    case "ADD_EXPENSE":
      const tripWithExpense = state.trips.find((t) => t.tripId === action.payload.tripId);
      if (!tripWithExpense) return state;
      const updatedTrip = {
        ...tripWithExpense,
        expenses: [...(tripWithExpense.expenses || []), action.payload.expense],
        budget: {
          ...tripWithExpense.budget,
          spent: tripWithExpense.budget.spent + action.payload.expense.amount,
        },
      };
      return {
        ...state,
        trips: state.trips.map((t) => (t.tripId === action.payload.tripId ? updatedTrip : t)),
        currentTrip: state.currentTrip?.tripId === action.payload.tripId ? updatedTrip : state.currentTrip,
      };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
};

export const TripProvider = ({ children }) => {
  const [state, dispatch] = useReducer(tripReducer, initialState);

  useEffect(() => {
    // Load trips from backend on mount
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const result = await tripApi.getAllTrips();
      dispatch({ type: "SET_TRIPS", payload: result.trips });
    } catch (error) {
      console.error("Failed to load trips:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
      // Fall back to empty array instead of showing error to user
      dispatch({ type: "SET_TRIPS", payload: [] });
    }
  };

  const createTrip = async (tripData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      
      const newTrip = await tripApi.createTrip(tripData);
      
      dispatch({ type: "ADD_TRIP", payload: newTrip });
      toast.success("Trip created successfully!");
      
      return newTrip;
    } catch (error) {
      console.error("Create trip error:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
      toast.error(error.response?.data?.message || "Failed to create trip");
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const updateTrip = async (tripId, updates) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      
      // Extract numeric ID if string ID is passed
      const numericId = typeof tripId === 'string' ? 
        parseInt(tripId.replace('TR', '')) : tripId;
      
      const updatedTrip = await tripApi.updateTrip(numericId, updates);
      
      dispatch({ type: "UPDATE_TRIP", payload: updatedTrip });
      toast.success("Trip updated successfully!");
      
      return updatedTrip;
    } catch (error) {
      console.error("Update trip error:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
      toast.error(error.response?.data?.message || "Failed to update trip");
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const deleteTrip = async (tripId) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      
      // Extract numeric ID if string ID is passed
      const numericId = typeof tripId === 'string' ? 
        parseInt(tripId.replace('TR', '')) : tripId;
      
      await tripApi.deleteTrip(numericId);
      
      dispatch({ type: "DELETE_TRIP", payload: numericId });
      toast.success("Trip deleted successfully!");
    } catch (error) {
      console.error("Delete trip error:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
      toast.error(error.response?.data?.message || "Failed to delete trip");
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const duplicateTrip = async (tripId) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      
      // Extract numeric ID if string ID is passed
      const numericId = typeof tripId === 'string' ? 
        parseInt(tripId.replace('TR', '')) : tripId;
      
      const newTrip = await tripApi.duplicateTrip(numericId);
      
      dispatch({ type: "ADD_TRIP", payload: newTrip });
      toast.success("Trip duplicated successfully!");
      
      return newTrip;
    } catch (error) {
      console.error("Duplicate trip error:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
      toast.error(error.response?.data?.message || "Failed to duplicate trip");
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // ⚠️ CRITICAL FIX #1: getTripById now only returns from local state
  const getTripById = (tripId) => {
    // Extract numeric ID if string ID is passed
    const numericId = typeof tripId === 'string' ? 
      parseInt(tripId.replace('TR', '')) : tripId;
    
    // Find in local state
    const localTrip = state.trips.find((t) => t.tripId === numericId);
    
    return localTrip || null;
  };

  // ⚠️ CRITICAL FIX #2: fetchTripById now properly fetches with console logs
  const fetchTripById = async (tripId) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      
      // Extract numeric ID if string ID is passed
      const numericId = typeof tripId === 'string' ? 
        parseInt(tripId.replace('TR', '')) : tripId;
      
      console.log('🔄 Fetching trip details for ID:', numericId);
      const trip = await tripApi.getTripById(numericId);
      
      console.log('✅ Trip fetched successfully:', trip);
      console.log('📋 Itinerary items count:', trip.itinerary?.length || 0);
      
      // Update or add to trips list
      const existingIndex = state.trips.findIndex(t => t.tripId === numericId);
      if (existingIndex >= 0) {
        dispatch({ type: "UPDATE_TRIP", payload: trip });
      } else {
        dispatch({ type: "ADD_TRIP", payload: trip });
      }
      
      dispatch({ type: "SET_CURRENT_TRIP", payload: trip });
      
      return trip;
    } catch (error) {
      console.error("❌ Fetch trip error:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
      toast.error(error.response?.data?.message || "Failed to load trip details");
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const setCurrentTrip = (trip) => {
    dispatch({ type: "SET_CURRENT_TRIP", payload: trip });
  };

  const addExpense = async (tripId, expense) => {
    // TODO: Implement with backend API when expenses endpoint is ready
    const newExpense = {
      id: Date.now(),
      ...expense,
      date: new Date().toISOString(),
    };
    
    dispatch({ type: "ADD_EXPENSE", payload: { tripId, expense: newExpense } });
    toast.success("Expense added!");
    
    return newExpense;
  };

  const addItineraryItem = async (tripId, dayIndex, item) => {
    // TODO: Implement with backend API
    // For now, just return a dummy item
    toast.info("Itinerary item feature coming soon!");
    return null;
  };

  const inviteCollaborator = async (tripId, email, role = "viewer") => {
    // TODO: Implement with backend API when collaborators endpoint is ready
    toast.info("Collaborator invite feature coming soon!");
    return null;
  };

  return (
    <TripContext.Provider
      value={{
        ...state,
        createTrip,
        updateTrip,
        deleteTrip,
        duplicateTrip,
        getTripById,
        fetchTripById, // ✅ Exposed for use in components
        setCurrentTrip,
        addExpense,
        addItineraryItem,
        inviteCollaborator,
        loadTrips, // Expose for manual refresh
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrips = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useTrips must be used within a TripProvider");
  }
  return context;
};

export default TripContext;