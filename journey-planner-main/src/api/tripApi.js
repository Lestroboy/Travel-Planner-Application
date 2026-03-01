// src/api/tripApi.js
import axiosClient from "./axiosClient";

/**
 * Trip API Service
 * All trip-related API calls to backend (port 5010)
 */

// ===========================
// CREATE TRIP
// ===========================
export const createTrip = async (tripData) => {
  // Transform frontend data to backend format
  const payload = {
    tripName: tripData.name,
    description: tripData.description || "",
    startDate: tripData.startDate,
    endDate: tripData.endDate,
    destinationCity: extractCity(tripData.destination),
    destinationCountry: extractCountry(tripData.destination),
    totalBudget: tripData.budget || 50000,
    currency: tripData.currency || "INR",
    isGroupTrip: tripData.isGroupTrip || false,
  };

  const response = await axiosClient.post("/trips", payload);
  
  // Transform backend response to frontend format
  return transformTripResponse(response.data);
};

// ===========================
// GET ALL TRIPS
// ===========================
export const getAllTrips = async (params = {}) => {
  const {
    page = 0,
    size = 100,
    sortBy = "createdAt",
    direction = "DESC"
  } = params;

  const response = await axiosClient.get("/trips", {
    params: { page, size, sortBy, direction }
  });

  // Response structure: { success: true, message: "...", data: Page<TripResponseDTO> }
  const pageData = response.data.data;
  
  return {
    trips: pageData.content.map(transformTripResponse),
    totalPages: pageData.totalPages,
    totalElements: pageData.totalElements,
    currentPage: pageData.number,
  };
};

// ===========================
// GET TRIP BY ID
// ===========================
export const getTripById = async (tripId) => {
  const response = await axiosClient.get(`/trips/${tripId}`);
  
  // Response structure: TripDetailDTO { trip: TripResponseDTO, itineraryItems: [...] }
  return transformTripDetailResponse(response.data);
};

// ===========================
// UPDATE TRIP
// ===========================
export const updateTrip = async (tripId, updates) => {
  // Transform frontend updates to backend format
  const payload = {};
  
  if (updates.name) payload.tripName = updates.name;
  if (updates.description !== undefined) payload.description = updates.description;
  if (updates.startDate) payload.startDate = updates.startDate;
  if (updates.endDate) payload.endDate = updates.endDate;
  if (updates.destination) {
    payload.destinationCity = extractCity(updates.destination);
    payload.destinationCountry = extractCountry(updates.destination);
  }
  if (updates.budget !== undefined) payload.totalBudget = updates.budget;
  if (updates.currency) payload.currency = updates.currency;
  if (updates.status) payload.tripStatus = updates.status.toUpperCase();

  const response = await axiosClient.put(`/trips/${tripId}`, payload);
  
  // Response structure: { success: true, message: "...", data: TripResponseDTO }
  return transformTripResponse(response.data.data);
};

// ===========================
// DELETE TRIP
// ===========================
export const deleteTrip = async (tripId) => {
  const response = await axiosClient.delete(`/trips/${tripId}`);
  return response.data; // { success: true, message: "Trip deleted successfully" }
};

// ===========================
// DUPLICATE TRIP
// ===========================
export const duplicateTrip = async (tripId) => {
  const response = await axiosClient.post(`/trips/${tripId}/duplicate`);
  
  // Response structure: { success: true, message: "...", data: TripResponseDTO }
  return transformTripResponse(response.data.data);
};

// ===========================
// GET TRIPS BY STATUS
// ===========================
export const getTripsByStatus = async (status, params = {}) => {
  const { page = 0, size = 100 } = params;

  const response = await axiosClient.get(`/trips/status/${status.toUpperCase()}`, {
    params: { page, size }
  });

  const pageData = response.data.data;
  
  return {
    trips: pageData.content.map(transformTripResponse),
    totalPages: pageData.totalPages,
    totalElements: pageData.totalElements,
    currentPage: pageData.number,
  };
};

// ===========================
// HELPER FUNCTIONS
// ===========================

/**
 * Transform backend TripResponseDTO to frontend trip object
 */
const transformTripResponse = (backendTrip) => {
  // Handle TripStatus enum (PLANNING, UPCOMING, ONGOING, COMPLETED)
  const statusMap = {
    'PLANNING': 'planning',
    'UPCOMING': 'upcoming',
    'ONGOING': 'ongoing',
    'ACTIVE': 'ongoing',
    'COMPLETED': 'completed',
  };
  
  const status = backendTrip.tripStatus ? statusMap[backendTrip.tripStatus] || 'planning' : 'planning';
  
  return {
    id: `TR${backendTrip.tripId}`, // Frontend uses string IDs
    tripId: backendTrip.tripId, // Keep numeric ID for API calls
    name: backendTrip.tripName,
    description: backendTrip.description || "",
    destination: formatDestination(backendTrip.destinationCity, backendTrip.destinationCountry),
    destinations: [formatDestination(backendTrip.destinationCity, backendTrip.destinationCountry)],
    startDate: backendTrip.startDate,
    endDate: backendTrip.endDate,
    status: status,
    budget: {
      total: parseFloat(backendTrip.totalBudget) || 0,
      spent: 0, // TODO: Calculate from expenses when available
      currency: backendTrip.currency || "INR",
      categories: { flights: 0, hotels: 0, activities: 0, food: 0 },
    },
    currency: backendTrip.currency || "INR",
    isGroupTrip: backendTrip.isGroupTrip || false,
    coverImage: getDefaultCoverImage(backendTrip.destinationCity),
    collaborators: [
      {
        id: backendTrip.userId,
        name: "You",
        avatar: "https://i.pravatar.cc/150?img=1",
        role: "owner",
      }
    ],
    itinerary: [],
    expenses: [],
    createdAt: backendTrip.createdAt,
    updatedAt: backendTrip.updatedAt,
    itemCount: backendTrip.itemCount || 0,
    collaboratorCount: backendTrip.collaboratorCount || 1,
  };
};

/**
 * Transform backend TripDetailDTO to frontend trip detail object
 */
const transformTripDetailResponse = (backendTripDetail) => {
  const trip = transformTripResponse(backendTripDetail.trip);
  
  // Add itinerary items if available
  if (backendTripDetail.itineraryItems && backendTripDetail.itineraryItems.length > 0) {
    trip.itinerary = groupItineraryByDay(backendTripDetail.itineraryItems);
  }

  return trip;
};

/**
 * Group itinerary items by day
 */
const groupItineraryByDay = (items) => {
  const grouped = {};
  
  // ItemType enum mapping: FLIGHT, ACCOMMODATION, ACTIVITY, TRANSPORT, NOTE
  const typeMap = {
    'FLIGHT': 'flight',
    'ACCOMMODATION': 'hotel',
    'ACTIVITY': 'activity',
    'TRANSPORT': 'transport',
    'NOTE': 'note',
  };
  
  // BookingStatus enum mapping: PENDING, CONFIRMED, CANCELLED, COMPLETED
  const statusMap = {
    'PENDING': 'pending',
    'CONFIRMED': 'confirmed',
    'CANCELLED': 'cancelled',
    'COMPLETED': 'completed',
  };
  
  items.forEach(item => {
    const date = item.startDatetime?.split('T')[0] || 'unscheduled';
    
    if (!grouped[date]) {
      grouped[date] = {
        day: Object.keys(grouped).length + 1,
        date: date,
        items: []
      };
    }
    
    grouped[date].items.push({
      id: item.itemId,
      type: typeMap[item.itemType] || 'other',
      title: item.title,
      description: item.description,
      time: item.startDatetime?.split('T')[1]?.substring(0, 5), // Extract HH:MM
      startTime: item.startDatetime?.split('T')[1]?.substring(0, 5),
      endTime: item.endDatetime?.split('T')[1]?.substring(0, 5),
      location: item.location,
      coordinates: item.latitude && item.longitude ? {
        lat: parseFloat(item.latitude),
        lng: parseFloat(item.longitude)
      } : null,
      cost: parseFloat(item.cost) || 0,
      currency: item.currency || 'INR',
      bookingReference: item.bookingReference,
      status: statusMap[item.bookingStatus] || 'pending',
      notes: item.notes,
      sequenceOrder: item.sequenceOrder,
      details: item.details, // Flight/Accommodation/Activity details
    });
  });
  
  return Object.values(grouped);
};

/**
 * Extract city from destination string
 * Examples: "Goa, India" -> "Goa", "Dubai" -> "Dubai"
 */
const extractCity = (destination) => {
  if (!destination) return "";
  const parts = destination.split(",");
  return parts[0].trim();
};

/**
 * Extract country from destination string
 * Examples: "Goa, India" -> "India", "Dubai" -> "UAE"
 */
const extractCountry = (destination) => {
  if (!destination) return "";
  const parts = destination.split(",");
  
  if (parts.length > 1) {
    return parts[1].trim();
  }
  
  // Default countries for common destinations
  const defaults = {
    "dubai": "UAE",
    "singapore": "Singapore",
    "bali": "Indonesia",
    "maldives": "Maldives",
    "tokyo": "Japan",
    "paris": "France",
    "london": "UK",
    "rome": "Italy",
  };
  
  return defaults[destination.toLowerCase()] || "Unknown";
};

/**
 * Format city and country into destination string
 */
const formatDestination = (city, country) => {
  if (!city && !country) return "Unknown";
  if (!country || country === "Unknown") return city;
  return `${city}, ${country}`;
};

/**
 * Get default cover image based on destination
 */
const getDefaultCoverImage = (city) => {
  const images = {
    "goa": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
    "dubai": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
    "mumbai": "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800",
    "delhi": "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800",
    "bali": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
    "singapore": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800",
    "paris": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
    "tokyo": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
    "default": "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800",
  };
  
  const cityLower = city?.toLowerCase() || "";
  return images[cityLower] || images.default;
};

export default {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  duplicateTrip,
  getTripsByStatus,
};