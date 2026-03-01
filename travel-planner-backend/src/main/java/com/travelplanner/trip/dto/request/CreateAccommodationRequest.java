package com.travelplanner.trip.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateAccommodationRequest {
    private String hotelName;
    private String address;
    private LocalDateTime checkIn;
    private LocalDateTime checkOut;
    private String roomType;
    private String confirmationNumber;
    private String externalBookingId;
}
