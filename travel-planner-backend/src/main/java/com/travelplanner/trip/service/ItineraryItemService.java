package com.travelplanner.trip.service;


import com.travelplanner.trip.dto.request.*;
import com.travelplanner.trip.dto.response.ItineraryItemDTO;

import java.time.LocalDate;
import java.util.List;

public interface ItineraryItemService {
    // Basic CRUD
    ItineraryItemDTO createItem(Long tripId, CreateItineraryItemRequest request);
    ItineraryItemDTO updateItem(Long tripId, Long itemId, UpdateItineraryItemRequest request);
    void deleteItem(Long tripId, Long itemId);
    ItineraryItemDTO getItemById(Long tripId, Long itemId);
    List<ItineraryItemDTO> getAllItems(Long tripId);

    // Type-specific operations
    ItineraryItemDTO createFlight(Long tripId, CreateItineraryItemRequest itemRequest, CreateFlightRequest flightRequest);
    ItineraryItemDTO createAccommodation(Long tripId, CreateItineraryItemRequest itemRequest, CreateAccommodationRequest accommodationRequest);
    ItineraryItemDTO createActivity(Long tripId, CreateItineraryItemRequest itemRequest, CreateActivityRequest activityRequest);

    // Filtering and ordering
    List<ItineraryItemDTO> getItemsByType(Long tripId, String itemType);
    List<ItineraryItemDTO> getItemsByDateRange(Long tripId, LocalDate startDate, LocalDate endDate);
    void reorderItems(Long tripId, ReorderItemsRequest request);
}
