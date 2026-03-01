package com.travelplanner.trip.repository;

import com.travelplanner.trip.entity.ItemType;
import com.travelplanner.trip.entity.ItineraryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ItineraryItemRepository extends JpaRepository<ItineraryItem, Long> {

    // Find all items for a trip, ordered by sequence
    List<ItineraryItem> findByTripTripIdOrderBySequenceOrderAsc(Long tripId);

    // Find items by type
    List<ItineraryItem> findByTripTripIdAndItemType(Long tripId, ItemType itemType);

    // Find items within date range
    @Query("SELECT i FROM ItineraryItem i " +
            "WHERE i.trip.tripId = :tripId " +
            "AND i.startDatetime >= :startDate " +
            "AND i.endDatetime <= :endDate " +
            "ORDER BY i.startDatetime ASC")
    List<ItineraryItem> findItemsInDateRange(
            @Param("tripId") Long tripId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    // Get maximum sequence order for a trip
    @Query("SELECT COALESCE(MAX(i.sequenceOrder), 0) FROM ItineraryItem i WHERE i.trip.tripId = :tripId")
    Integer findMaxSequenceOrder(@Param("tripId") Long tripId);
}
