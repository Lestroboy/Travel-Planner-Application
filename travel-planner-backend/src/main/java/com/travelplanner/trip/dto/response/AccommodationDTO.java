package com.travelplanner.trip.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccommodationDTO {
    private Long accommodationId;
    private String hotelName;
    private String address;
    private LocalDateTime checkIn;
    private LocalDateTime checkOut;
    private String roomType;
    private String confirmationNumber;
    private String externalBookingId;
}
