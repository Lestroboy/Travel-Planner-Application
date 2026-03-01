package com.travelplanner.trip.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateFlightWithDetailsRequest {

    @Valid
    @NotNull(message = "Item details are required")
    private CreateItineraryItemRequest itemDetails;

    @Valid
    @NotNull(message = "Flight details are required")
    private CreateFlightRequest flightDetails;
}