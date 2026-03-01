package com.travelplanner.trip.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateAccommodationWithDetailsRequest {

    @Valid
    @NotNull(message = "Item details are required")
    private CreateItineraryItemRequest itemDetails;

    @Valid
    @NotNull(message = "Accommodation details are required")
    private CreateAccommodationRequest accommodationDetails;
}