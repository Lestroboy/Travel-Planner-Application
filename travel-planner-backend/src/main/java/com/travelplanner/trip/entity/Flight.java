package com.travelplanner.trip.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long flightId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private ItineraryItem itineraryItem;

    @Column(name = "flight_number", length = 20)
    private String flightNumber;

    @Column(length = 100)
    private String airLine;

    @Column(name = "departure_airport", length = 10)
    private String departedAirport;

    @Column(name = "arrival_airport", length = 10)
    private String arrivalAirport;

    @Column(name = "departure_time")
    private LocalDateTime departureTime;

    @Column(name = "arrival_time")
    private LocalDateTime arrivalTime;

    @Column(name = "booking_class", length = 20)
    private String bookingClass;

    @Column(name = "seat_number", length = 10)
    private String seatNumber;

    @Column(name = "PRN_number", length = 50)
    private String pnrNumber;

    @Column(name = "external_booking_id", length = 100)
    private String externalBookingId;

}
