package com.travelplanner.trip.repository;

import com.travelplanner.trip.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {

    Optional<Flight> findByItineraryItemItemId(Long itemId);

    Optional<Flight> findByPnrNumber(String pnrNumber);

}