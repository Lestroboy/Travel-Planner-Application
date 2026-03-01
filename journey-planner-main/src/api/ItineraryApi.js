// src/api/itineraryApi.js
import axiosClient from "./axiosClient";

/**
 * Itinerary Item API Service
 * All itinerary-related API calls to backend (port 5010)
 */

// ===========================
// CREATE GENERIC ITEM
// ===========================
export const createItineraryItem = async (tripId, itemData) => {
  const payload = {
    itemType: itemData.type.toUpperCase(), // flight, hotel, activity -> FLIGHT, ACCOMMODATION, ACTIVITY
    title: itemData.title,
    description: itemData.description || "",
    startDatetime: itemData.startDatetime,
    endDatetime: itemData.endDatetime,
    location: itemData.location,
    latitude: itemData.latitude,
    longitude: itemData.longitude,
    bookingReference: itemData.bookingReference,
    bookingStatus: itemData.bookingStatus?.toUpperCase() || "PENDING",
    cost: itemData.cost,
    currency: itemData.currency || "INR",
    notes: itemData.notes,
  };

  const response = await axiosClient.post(`/trips/${tripId}/items`, payload);
  return transformItineraryItemResponse(response.data.data);
};

// ===========================
// CREATE FLIGHT WITH DETAILS
// ===========================
export const createFlightItem = async (tripId, flightData) => {
  const payload = {
    itemDetails: {
      itemType: "FLIGHT",
      title: flightData.title || `${flightData.airline} - ${flightData.from} to ${flightData.to}`,
      description: flightData.description,
      startDatetime: flightData.departureTime,
      endDatetime: flightData.arrivalTime,
      location: flightData.from,
      bookingReference: flightData.bookingReference,
      bookingStatus: flightData.bookingStatus?.toUpperCase() || "CONFIRMED",
      cost: flightData.price || flightData.cost,
      currency: flightData.currency || "INR",
      notes: flightData.notes,
    },
    flightDetails: {
      flightNumber: flightData.flightNumber,
      airline: flightData.airline,
      departureAirport: flightData.fromCode || flightData.from,
      arrivalAirport: flightData.toCode || flightData.to,
      departureTime: flightData.departureTime,
      arrivalTime: flightData.arrivalTime,
      bookingClass: flightData.class || flightData.bookingClass || "Economy",
      seatNumber: flightData.seatNumber,
      pnrNumber: flightData.pnrNumber || flightData.bookingReference,
      externalBookingId: flightData.externalBookingId || flightData.id,
    },
  };

  const response = await axiosClient.post(`/trips/${tripId}/items/flights`, payload);
  return transformItineraryItemResponse(response.data.data);
};

// ===========================
// CREATE ACCOMMODATION WITH DETAILS
// ===========================
export const createAccommodationItem = async (tripId, hotelData) => {
  const payload = {
    itemDetails: {
      itemType: "ACCOMMODATION",
      title: hotelData.name,
      description: hotelData.description,
      startDatetime: hotelData.checkIn,
      endDatetime: hotelData.checkOut,
      location: hotelData.location,
      latitude: hotelData.latitude,
      longitude: hotelData.longitude,
      bookingReference: hotelData.bookingReference || hotelData.confirmationNumber,
      bookingStatus: hotelData.bookingStatus?.toUpperCase() || "CONFIRMED",
      cost: hotelData.price || hotelData.cost,
      currency: hotelData.currency || "INR",
      notes: hotelData.notes,
    },
    accommodationDetails: {
      hotelName: hotelData.name,
      address: hotelData.address || hotelData.location,
      checkIn: hotelData.checkIn,
      checkOut: hotelData.checkOut,
      roomType: hotelData.roomType || "Standard",
      confirmationNumber: hotelData.confirmationNumber || hotelData.bookingReference,
      externalBookingId: hotelData.externalBookingId || hotelData.id,
    },
  };

  const response = await axiosClient.post(`/trips/${tripId}/items/accommodations`, payload);
  return transformItineraryItemResponse(response.data.data);
};

// ===========================
// CREATE ACTIVITY WITH DETAILS
// ===========================
export const createActivityItem = async (tripId, activityData) => {
  const payload = {
    itemDetails: {
      itemType: "ACTIVITY",
      title: activityData.name || activityData.title,
      description: activityData.description,
      startDatetime: activityData.startTime || activityData.startDatetime,
      endDatetime: activityData.endTime || activityData.endDatetime,
      location: activityData.location,
      latitude: activityData.latitude,
      longitude: activityData.longitude,
      bookingReference: activityData.bookingReference,
      bookingStatus: activityData.bookingStatus?.toUpperCase() || "CONFIRMED",
      cost: activityData.price || activityData.cost,
      currency: activityData.currency || "INR",
      notes: activityData.notes,
    },
    activityDetails: {
      activityName: activityData.name || activityData.title,
      category: activityData.category,
      poiId: activityData.poiId || activityData.id,
      rating: activityData.rating,
      priceLevel: activityData.priceLevel || getPriceLevelFromCost(activityData.price),
      website: activityData.website,
      phone: activityData.phone,
    },
  };

  const response = await axiosClient.post(`/trips/${tripId}/items/activities`, payload);
  return transformItineraryItemResponse(response.data.data);
};

// ===========================
// GET ALL ITEMS FOR TRIP
// ===========================
export const getAllItineraryItems = async (tripId) => {
  const response = await axiosClient.get(`/trips/${tripId}/items`);
  
  // Response structure: { success: true, message: "...", data: [ItineraryItemDTO] }
  return response.data.data.map(transformItineraryItemResponse);
};

// ===========================
// GET ITEM BY ID
// ===========================
export const getItineraryItemById = async (tripId, itemId) => {
  const response = await axiosClient.get(`/trips/${tripId}/items/${itemId}`);
  return transformItineraryItemResponse(response.data.data);
};

// ===========================
// UPDATE ITEM
// ===========================
export const updateItineraryItem = async (tripId, itemId, updates) => {
  const payload = {
    title: updates.title,
    description: updates.description,
    startDatetime: updates.startDatetime,
    endDatetime: updates.endDatetime,
    location: updates.location,
    latitude: updates.latitude,
    longitude: updates.longitude,
    bookingReference: updates.bookingReference,
    bookingStatus: updates.bookingStatus?.toUpperCase(),
    cost: updates.cost,
    currency: updates.currency,
    notes: updates.notes,
  };

  const response = await axiosClient.put(`/trips/${tripId}/items/${itemId}`, payload);
  return transformItineraryItemResponse(response.data.data);
};

// ===========================
// DELETE ITEM
// ===========================
export const deleteItineraryItem = async (tripId, itemId) => {
  const response = await axiosClient.delete(`/trips/${tripId}/items/${itemId}`);
  return response.data; // { success: true, message: "Item deleted successfully" }
};

// ===========================
// GET ITEMS BY TYPE
// ===========================
export const getItineraryItemsByType = async (tripId, itemType) => {
  const response = await axiosClient.get(`/trips/${tripId}/items/type/${itemType.toUpperCase()}`);
  return response.data.data.map(transformItineraryItemResponse);
};

// ===========================
// GET ITEMS BY DATE RANGE
// ===========================
export const getItineraryItemsByDateRange = async (tripId, startDate, endDate) => {
  const response = await axiosClient.get(`/trips/${tripId}/items/date-range`, {
    params: { startDate, endDate }
  });
  return response.data.data.map(transformItineraryItemResponse);
};

// ===========================
// REORDER ITEMS
// ===========================
export const reorderItineraryItems = async (tripId, itemIds) => {
  const payload = { itemIds };
  const response = await axiosClient.put(`/trips/${tripId}/items/reorder`, payload);
  return response.data; // { success: true, message: "Items reordered successfully" }
};

// ===========================
// HELPER FUNCTIONS
// ===========================

/**
 * Transform backend ItineraryItemDTO to frontend format
 */
const transformItineraryItemResponse = (backendItem) => {
  // ItemType enum mapping: FLIGHT, ACCOMMODATION, ACTIVITY, TRANSPORT, NOTE
  const typeMap = {
    'FLIGHT': 'flight',
    'ACCOMMODATION': 'hotel',
    'ACTIVITY': 'activity',
    'TRANSPORT': 'transport',
    'NOTE': 'note',
  };
  
  // BookingStatus enum mapping: PENDING, CONFIRMED, CANCELLED
  const statusMap = {
    'PENDING': 'pending',
    'CONFIRMED': 'confirmed',
    'CANCELLED': 'cancelled',
  };

  return {
    id: backendItem.itemId,
    itemId: backendItem.itemId,
    tripId: backendItem.tripId,
    type: typeMap[backendItem.itemType] || 'other',
    title: backendItem.title,
    description: backendItem.description,
    startDatetime: backendItem.startDatetime,
    endDatetime: backendItem.endDatetime,
    time: backendItem.startDatetime?.split('T')[1]?.substring(0, 5), // Extract HH:MM
    startTime: backendItem.startDatetime?.split('T')[1]?.substring(0, 5),
    endTime: backendItem.endDatetime?.split('T')[1]?.substring(0, 5),
    date: backendItem.startDatetime?.split('T')[0], // Extract date
    location: backendItem.location,
    coordinates: backendItem.latitude && backendItem.longitude ? {
      lat: parseFloat(backendItem.latitude),
      lng: parseFloat(backendItem.longitude)
    } : null,
    bookingReference: backendItem.bookingReference,
    status: statusMap[backendItem.bookingStatus] || 'pending',
    cost: parseFloat(backendItem.cost) || 0,
    currency: backendItem.currency || 'INR',
    notes: backendItem.notes,
    sequenceOrder: backendItem.sequenceOrder,
    details: backendItem.details, // FlightDTO, AccommodationDTO, or ActivityDTO
  };
};

/**
 * Convert booking data from search results to itinerary item format
 */
export const convertBookingToItineraryItem = (bookingType, item, bookingData) => {
  switch (bookingType) {
    case 'flight':
      return {
        type: 'flight',
        title: `${item.airline} - ${item.from} to ${item.to}`,
        description: `Flight ${item.flightNumber} - ${item.class}`,
        startDatetime: combineDateTimeString(bookingData.departDate || item.date, item.departureTime),
        endDatetime: combineDateTimeString(bookingData.departDate || item.date, item.arrivalTime),
        location: item.from,
        cost: bookingData.totalPrice || item.price,
        currency: 'INR',
        bookingStatus: 'CONFIRMED',
        // Flight specific
        flightNumber: item.flightNumber,
        airline: item.airline,
        from: item.from,
        to: item.to,
        fromCode: item.fromCode,
        toCode: item.toCode,
        departureTime: combineDateTimeString(bookingData.departDate || item.date, item.departureTime),
        arrivalTime: combineDateTimeString(bookingData.departDate || item.date, item.arrivalTime),
        class: item.class,
        bookingReference: bookingData.bookingId,
      };

    case 'hotel':
      return {
        type: 'hotel',
        name: item.name,
        description: item.description,
        startDatetime: `${bookingData.checkIn}T15:00:00`, // Check-in time
        endDatetime: `${bookingData.checkOut}T11:00:00`, // Check-out time
        location: item.location,
        latitude: item.latitude,
        longitude: item.longitude,
        cost: bookingData.totalPrice,
        currency: 'INR',
        bookingStatus: 'CONFIRMED',
        // Hotel specific
        checkIn: `${bookingData.checkIn}T15:00:00`,
        checkOut: `${bookingData.checkOut}T11:00:00`,
        roomType: bookingData.roomType || 'Standard',
        confirmationNumber: bookingData.bookingId,
        address: item.address || item.location,
      };

    case 'activity':
      return {
        type: 'activity',
        name: item.name,
        title: item.name,
        description: item.description,
        startDatetime: bookingData.date ? `${bookingData.date}T10:00:00` : null,
        endDatetime: bookingData.date ? `${bookingData.date}T${addHours('10:00', item.duration)}:00` : null,
        location: item.location,
        latitude: item.latitude,
        longitude: item.longitude,
        cost: bookingData.totalPrice || item.price,
        currency: 'INR',
        bookingStatus: 'CONFIRMED',
        // Activity specific
        category: item.category,
        rating: item.rating,
        bookingReference: bookingData.bookingId,
      };

    default:
      return null;
  }
};

/**
 * Helper: Combine date and time strings into ISO datetime
 * Example: ("2026-06-15", "14:30") -> "2026-06-15T14:30:00"
 */
const combineDateTimeString = (date, time) => {
  if (!date || !time) return null;
  
  // Ensure time is in HH:MM format
  const timeFormatted = time.includes(':') ? time : `${time}:00`;
  
  return `${date}T${timeFormatted}:00`;
};

/**
 * Helper: Add hours to a time string
 * Example: ("10:00", "2h 30m") -> "12:30"
 */
const addHours = (time, duration) => {
  if (!duration) return time;
  
  const [hours, minutes] = time.split(':').map(Number);
  const durationMatch = duration.match(/(\d+)h?\s*(\d+)?m?/);
  
  if (!durationMatch) return time;
  
  const durationHours = parseInt(durationMatch[1]) || 0;
  const durationMinutes = parseInt(durationMatch[2]) || 0;
  
  const totalMinutes = (hours * 60 + minutes) + (durationHours * 60 + durationMinutes);
  const newHours = Math.floor(totalMinutes / 60);
  const newMinutes = totalMinutes % 60;
  
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
};

/**
 * Helper: Get price level from cost
 */
const getPriceLevelFromCost = (cost) => {
  if (!cost) return 1;
  if (cost < 500) return 1;
  if (cost < 1500) return 2;
  if (cost < 5000) return 3;
  return 4;
};

export default {
  createItineraryItem,
  createFlightItem,
  createAccommodationItem,
  createActivityItem,
  getAllItineraryItems,
  getItineraryItemById,
  updateItineraryItem,
  deleteItineraryItem,
  getItineraryItemsByType,
  getItineraryItemsByDateRange,
  reorderItineraryItems,
  convertBookingToItineraryItem,
};