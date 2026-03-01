package com.travelplanner.trip.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "accommodations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Accommodation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "accommodation_id")
    private Long accommodationId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "itinerary_item_id", nullable = false)
    private ItineraryItem itineraryItem;

    @Column(name = "hotel_name", length = 200)
    private String hotelName;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(name = "check_in")
    private LocalDateTime checkIn;

    @Column(name = "check_out")
    private LocalDateTime checkOut;

    @Column(name = "room_type", length = 100)
    private String roomType;

    @Column(name = "confirmation_number", length = 100)
    private String confirmationNumber;

    @Column(name = "external_booking_id", length = 100)
    private String externalBookingId;

}