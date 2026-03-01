package com.travelplanner.trip.repository;

import com.travelplanner.trip.entity.Accommodation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccommodationRepository extends JpaRepository<Accommodation, Long> {

    Optional<Accommodation> findByItineraryItemItemId(Long itemId);

    Optional<Accommodation> findByConfirmationNumber(String confirmationNumber);
}
