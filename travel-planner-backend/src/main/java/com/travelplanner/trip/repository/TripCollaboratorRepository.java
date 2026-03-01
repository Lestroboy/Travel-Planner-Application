package com.travelplanner.trip.repository;

import com.travelplanner.trip.entity.CollaborationStatus;
import com.travelplanner.trip.entity.TripCollaborator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TripCollaboratorRepository extends JpaRepository<TripCollaborator, Long> {

    // Find all collaborators for a trip
    List<TripCollaborator> findByTripTripId(Long tripId);

    // Find collaborator by trip and user
    Optional<TripCollaborator> findByTripTripIdAndUserUserId(Long tripId, Long userId);

    // Check if user is collaborator
    Boolean existsByTripTripIdAndUserUserId(Long tripId, Long userId);

    // Find pending invitations for user
    List<TripCollaborator> findByUserUserIdAndStatus(Long userId, CollaborationStatus status);

    // Check if user has access to trip (owner or collaborator)
    @Query("SELECT CASE WHEN COUNT(tc) > 0 THEN true ELSE false END " +
            "FROM TripCollaborator tc " +
            "WHERE tc.trip.tripId = :tripId AND tc.user.userId = :userId " +
            "AND tc.status = 'ACCEPTED'")
    Boolean hasAccess(@Param("tripId") Long tripId, @Param("userId") Long userId);
}
