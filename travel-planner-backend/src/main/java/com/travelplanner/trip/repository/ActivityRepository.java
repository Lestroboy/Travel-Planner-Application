package com.travelplanner.trip.repository;

import com.travelplanner.trip.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {

    Optional<Activity> findByItineraryItemItemId(Long itemId);

    List<Activity> findByCategory(String category);
}