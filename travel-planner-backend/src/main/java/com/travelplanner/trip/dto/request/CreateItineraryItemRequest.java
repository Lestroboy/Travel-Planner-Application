package com.travelplanner.trip.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateItineraryItemRequest {

    @NotNull(message = "Item type is required")
    private String itemType; // FLIGHT, ACCOMMODATION, ACTIVITY, TRANSPORT, NOTE

    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    private LocalDateTime startDatetime;
    private LocalDateTime endDatetime;
    private String location;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String bookingReference;
    private String bookingStatus;
    private BigDecimal cost;
    private String currency;
    private String notes;
}
