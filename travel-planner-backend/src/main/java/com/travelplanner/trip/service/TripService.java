package com.travelplanner.trip.service;

import com.travelplanner.trip.dto.request.CreateTripRequest;
import com.travelplanner.trip.dto.request.UpdateTripRequest;
import com.travelplanner.trip.dto.response.TripDetailDTO;
import com.travelplanner.trip.dto.response.TripResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;  // ✅ Add this - Spring Data Pageable


public interface TripService {

    //CRUD
    TripResponseDTO createTrip(CreateTripRequest request);

    TripDetailDTO getTripById(Long tripId);

    void deleteTrip(Long tripId);

    Page<TripResponseDTO> getAllTrips(Pageable pageable);

    Page<TripResponseDTO> getTripsByStatus(String status, Pageable pageable);

    TripResponseDTO updateTrip(Long tripId, UpdateTripRequest request);

    TripResponseDTO duplicateTrip(Long tripId);

}