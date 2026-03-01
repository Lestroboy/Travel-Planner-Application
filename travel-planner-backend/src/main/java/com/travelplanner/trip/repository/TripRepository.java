package com.travelplanner.trip.repository;


import com.travelplanner.trip.entity.Trip;
import com.travelplanner.trip.entity.TripStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {

    // Find trips by user
    Page<Trip> findByUserUserId(Long userId, Pageable pageable);

    // Find trips by user and status
    Page<Trip> findByUserUserIdAndTripStatus(Long userId, TripStatus status, Pageable pageable);

    // Find trips where user is collaborator or owner
    @Query("SELECT DISTINCT t FROM Trip t " +
            "LEFT JOIN t.tripCollaborator c " +  // ✅ CORRECT - matches your entity field name
            "WHERE t.user.userId = :userId OR c.user.userId = :userId")
    Page<Trip> findAllAccessibleTrips(@Param("userId") Long userId, Pageable pageable);

    // Find upcoming trips
    @Query("SELECT t FROM Trip t WHERE t.user.userId = :userId " +
            "AND t.startDate >= :today AND t.tripStatus IN ('PLANNING', 'CONFIRMED')")
    List<Trip> findUpcomingTrips(@Param("userId") Long userId, @Param("today") LocalDate today);

    // Find ongoing trips
    @Query("SELECT t FROM Trip t WHERE t.user.userId = :userId " +
            "AND t.startDate <= :today AND t.endDate >= :today " +
            "AND t.tripStatus = 'ONGOING'")
    List<Trip> findOngoingTrips(@Param("userId") Long userId, @Param("today") LocalDate today);
}