package com.travelplanner.trip.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "activities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "activity_id")
    private Long activityId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "itinerary_item_id", nullable = false)
    private ItineraryItem itineraryItem;

    @Column(name = "activity_name", length = 200)
    private String activityName;

    @Column(length = 50)
    private String category;

    @Column(name = "poi_id", length = 100)
    private String poiId;

    @Column(precision = 2, scale = 1)
    private BigDecimal rating;

    @Column(name = "price_level")
    private Integer priceLevel;

    // TODO : is this needed ?
    @Column(length = 500)
    private String website;

    @Column(length = 20)
    private String phone;
}