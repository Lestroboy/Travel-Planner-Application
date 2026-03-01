package com.travelplanner.trip.controller;

import com.travelplanner.trip.dto.request.*;
import com.travelplanner.trip.dto.response.ApiResponse;
import com.travelplanner.trip.dto.response.ItineraryItemDTO;
import com.travelplanner.trip.service.ItineraryItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/trips/{tripId}/items")  // ✅ CHANGED: Added /api prefix
@RequiredArgsConstructor
public class ItineraryItemController {

    private final ItineraryItemService itineraryItemService;

    @PostMapping
    public ResponseEntity<ApiResponse> createItem(
            @PathVariable Long tripId,
            @Valid @RequestBody CreateItineraryItemRequest request
    ) {
        ItineraryItemDTO item = itineraryItemService.createItem(tripId, request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Item created successfully", item));
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<ApiResponse> updateItem(
            @PathVariable Long tripId,
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateItineraryItemRequest request
    ) {
        ItineraryItemDTO item = itineraryItemService.updateItem(tripId, itemId, request);
        return ResponseEntity.ok(ApiResponse.success("Item updated successfully", item));
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<ApiResponse> deleteItem(
            @PathVariable Long tripId,
            @PathVariable Long itemId
    ) {
        itineraryItemService.deleteItem(tripId, itemId);
        return ResponseEntity.ok(ApiResponse.success("Item deleted successfully"));
    }

    @GetMapping("/{itemId}")
    public ResponseEntity<ApiResponse> getItemById(
            @PathVariable Long tripId,
            @PathVariable Long itemId
    ) {
        ItineraryItemDTO item = itineraryItemService.getItemById(tripId, itemId);
        return ResponseEntity.ok(ApiResponse.success("Item retrieved successfully", item));
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllItems(@PathVariable Long tripId) {
        List<ItineraryItemDTO> items = itineraryItemService.getAllItems(tripId);
        return ResponseEntity.ok(ApiResponse.success("Items retrieved successfully", items));
    }

    @GetMapping("/type/{itemType}")
    public ResponseEntity<ApiResponse> getItemsByType(
            @PathVariable Long tripId,
            @PathVariable String itemType
    ) {
        List<ItineraryItemDTO> items = itineraryItemService.getItemsByType(tripId, itemType);
        return ResponseEntity.ok(ApiResponse.success("Items retrieved successfully", items));
    }

    @GetMapping("/date-range")
    public ResponseEntity<ApiResponse> getItemsByDateRange(
            @PathVariable Long tripId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        List<ItineraryItemDTO> items = itineraryItemService.getItemsByDateRange(tripId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Items retrieved successfully", items));
    }

    @PutMapping("/reorder")
    public ResponseEntity<ApiResponse> reorderItems(
            @PathVariable Long tripId,
            @Valid @RequestBody ReorderItemsRequest request
    ) {
        itineraryItemService.reorderItems(tripId, request);
        return ResponseEntity.ok(ApiResponse.success("Items reordered successfully"));
    }

    // Specialized endpoints for creating items with details

    @PostMapping("/flights")
    public ResponseEntity<ApiResponse> createFlight(
            @PathVariable Long tripId,
            @Valid @RequestBody CreateFlightWithDetailsRequest request
    ) {
        ItineraryItemDTO item = itineraryItemService.createFlight(
                tripId,
                request.getItemDetails(),
                request.getFlightDetails()
        );
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Flight added successfully", item));
    }

    @PostMapping("/accommodations")
    public ResponseEntity<ApiResponse> createAccommodation(
            @PathVariable Long tripId,
            @Valid @RequestBody CreateAccommodationWithDetailsRequest request
    ) {
        ItineraryItemDTO item = itineraryItemService.createAccommodation(
                tripId,
                request.getItemDetails(),
                request.getAccommodationDetails()
        );
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Accommodation added successfully", item));
    }

    @PostMapping("/activities")
    public ResponseEntity<ApiResponse> createActivity(
            @PathVariable Long tripId,
            @Valid @RequestBody CreateActivityWithDetailsRequest request
    ) {
        ItineraryItemDTO item = itineraryItemService.createActivity(
                tripId,
                request.getItemDetails(),
                request.getActivityDetails()
        );
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Activity added successfully", item));
    }
}