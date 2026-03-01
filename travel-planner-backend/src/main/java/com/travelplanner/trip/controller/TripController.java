package com.travelplanner.trip.controller;

import com.travelplanner.trip.dto.request.CreateTripRequest;
import com.travelplanner.trip.dto.request.UpdateTripRequest;
import com.travelplanner.trip.dto.response.ApiResponse;
import com.travelplanner.trip.dto.response.TripDetailDTO;
import com.travelplanner.trip.dto.response.TripResponseDTO;
import com.travelplanner.trip.service.TripService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trips")  // ✅ CHANGED: Added /api prefix
public class TripController {

    private TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @PostMapping
    public ResponseEntity<TripResponseDTO> createTrip(@Valid @RequestBody CreateTripRequest request) {
        TripResponseDTO trip = tripService.createTrip(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(trip);
    }

    @PutMapping("/{tripId}")
    public ResponseEntity<ApiResponse> updateTrip(
            @PathVariable Long tripId,
            @Valid @RequestBody UpdateTripRequest request
    ) {
        TripResponseDTO trip = tripService.updateTrip(tripId, request);
        return ResponseEntity.ok(ApiResponse.success("Trip updated successfully", trip));
    }

    @GetMapping("/{tripId}")
    public ResponseEntity<TripDetailDTO> getTripById(@PathVariable Long tripId) {
        TripDetailDTO tripDetails = tripService.getTripById(tripId);
        return ResponseEntity.status(HttpStatus.OK).body(tripDetails);
    }

    @DeleteMapping("/{tripId}")
    public ResponseEntity<ApiResponse> deleteTrip(@PathVariable Long tripId) {
        tripService.deleteTrip(tripId);
        return ResponseEntity.ok(ApiResponse.success("Trip deleted successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllTrips(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction
    ) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        Page<TripResponseDTO> trips = tripService.getAllTrips(pageable);
        return ResponseEntity.ok(ApiResponse.success("Trips retrieved successfully", trips));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse> getTripsByStatus(
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<TripResponseDTO> trips = tripService.getTripsByStatus(status, pageable);
        return ResponseEntity.ok(ApiResponse.success("Trips retrieved successfully", trips));
    }

    @PostMapping("/{tripId}/duplicate")
    public ResponseEntity<ApiResponse> duplicateTrip(@PathVariable Long tripId) {
        TripResponseDTO trip = tripService.duplicateTrip(tripId);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Trip duplicated successfully", trip));
    }
}